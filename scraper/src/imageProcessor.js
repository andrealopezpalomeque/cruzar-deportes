import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from './config.js';
import mime from 'mime-types';

export class ImageProcessor {
  constructor(logger) {
    this.logger = logger;
  }

  getRandomUserAgent() {
    const agents = CONFIG.request.userAgents;
    return agents[Math.floor(Math.random() * agents.length)];
  }

  async downloadImage(imageUrl, outputPath, options = {}) {
    const { referrer, retries = CONFIG.scraping.maxRetries } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.info(`Downloading image: ${imageUrl} (attempt ${attempt}/${retries})`);

        const headers = {
          ...CONFIG.request.imageHeaders,
          'User-Agent': this.getRandomUserAgent(),
          'Referer': referrer || imageUrl,
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site'
        };

        const response = await axios({
          method: 'GET',
          url: imageUrl,
          responseType: 'stream',
          timeout: CONFIG.scraping.timeout,
          headers,
          maxRedirects: 5,
          validateStatus: (status) => status < 400
        });

        // Validate content type
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error(`Invalid content type: ${contentType}`);
        }

        // Ensure output directory exists
        await fs.ensureDir(path.dirname(outputPath));

        // Create write stream
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
          writer.on('finish', async () => {
            try {
              // Validate downloaded file
              const isValid = await this.validateImage(outputPath);
              if (isValid) {
                this.logger.info(`Successfully downloaded: ${path.basename(outputPath)}`);
                resolve(outputPath);
              } else {
                await fs.remove(outputPath);
                reject(new Error('Downloaded file is not a valid image'));
              }
            } catch (error) {
              reject(error);
            }
          });
          writer.on('error', reject);
        });

      } catch (error) {
        this.logger.warn(`Download attempt ${attempt} failed: ${error.message}`);
        
        if (attempt === retries) {
          throw new Error(`Failed to download after ${retries} attempts: ${error.message}`);
        }

        // Wait before retry with exponential backoff
        const delay = CONFIG.scraping.delays.onError * attempt;
        await this.sleep(delay);
      }
    }
  }

  async validateImage(imagePath) {
    try {
      const stats = await fs.stat(imagePath);
      
      // Check file size
      if (stats.size < CONFIG.images.minFileSize || stats.size > CONFIG.images.maxFileSize) {
        this.logger.warn(`Image size invalid: ${stats.size} bytes`);
        return false;
      }

      // Try to read image metadata with sharp
      const metadata = await sharp(imagePath).metadata();
      
      // Check format
      if (!CONFIG.images.allowedFormats.includes(metadata.format)) {
        this.logger.warn(`Unsupported image format: ${metadata.format}`);
        return false;
      }

      // Check dimensions
      if (!metadata.width || !metadata.height || metadata.width < 50 || metadata.height < 50) {
        this.logger.warn(`Image dimensions invalid: ${metadata.width}x${metadata.height}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Image validation failed: ${error.message}`);
      return false;
    }
  }

  async processImage(inputPath, outputPath, options = {}) {
    try {
      this.logger.info(`Processing image: ${path.basename(inputPath)}`);

      let sharpInstance = sharp(inputPath);

      // Resize if needed
      if (options.resize !== false) {
        sharpInstance = sharpInstance.resize(
          CONFIG.images.resize.maxWidth,
          CONFIG.images.resize.maxHeight,
          {
            fit: CONFIG.images.resize.fit,
            withoutEnlargement: CONFIG.images.resize.withoutEnlargement
          }
        );
      }

      // Set quality for JPEG
      const outputFormat = path.extname(outputPath).slice(1).toLowerCase();
      if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality: CONFIG.images.quality });
      } else if (outputFormat === 'png') {
        sharpInstance = sharpInstance.png({ quality: CONFIG.images.quality });
      } else if (outputFormat === 'webp') {
        sharpInstance = sharpInstance.webp({ quality: CONFIG.images.quality });
      }

      // Save processed image
      await sharpInstance.toFile(outputPath);
      
      this.logger.info(`Image processed successfully: ${path.basename(outputPath)}`);
      return outputPath;

    } catch (error) {
      this.logger.error(`Image processing failed: ${error.message}`);
      throw error;
    }
  }

  generateFilename(category, team, product, variant, originalUrl) {
    const timestamp = Date.now();
    const extension = this.getImageExtension(originalUrl);
    
    const sanitize = (str) => {
      return str
        .toLowerCase()
        .replace(CONFIG.naming.sanitizeChars, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
    };

    const filename = CONFIG.naming.pattern
      .replace('{category}', sanitize(category))
      .replace('{team}', sanitize(team))
      .replace('{product}', sanitize(product))
      .replace('{variant}', sanitize(variant))
      .replace('{timestamp}', timestamp);

    const finalFilename = `${filename}.${extension}`;
    
    // Ensure filename isn't too long
    if (finalFilename.length > CONFIG.naming.maxLength) {
      const trimmed = filename.substring(0, CONFIG.naming.maxLength - extension.length - 1);
      return `${trimmed}.${extension}`;
    }

    return finalFilename;
  }

  getImageExtension(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      let extension = path.extname(pathname).slice(1).toLowerCase();
      
      // If no extension in URL, try to detect from MIME type or default to jpg
      if (!extension) {
        const contentType = mime.lookup(url);
        if (contentType) {
          extension = mime.extension(contentType);
        }
      }
      
      // Default to jpg if still no extension
      if (!extension || !CONFIG.images.allowedFormats.includes(extension)) {
        extension = 'jpg';
      }

      return extension;
    } catch {
      return 'jpg';
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanupTempFiles() {
    try {
      await fs.ensureDir(CONFIG.paths.temp);
      const files = await fs.readdir(CONFIG.paths.temp);
      for (const file of files) {
        await fs.remove(path.join(CONFIG.paths.temp, file));
      }
      this.logger.info('Temporary files cleaned up');
    } catch (error) {
      this.logger.error(`Failed to clean temp files: ${error.message}`);
    }
  }
}

export default ImageProcessor;