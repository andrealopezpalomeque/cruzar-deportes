#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CONFIG } from './config.js';
import logger from './utils/logger.js';
import { ImageProcessor } from './imageProcessor.js';
import { ProgressTracker } from './utils/progressTracker.js';

class SportsScraper {
  constructor() {
    this.logger = logger;
    this.imageProcessor = new ImageProcessor(logger);
    this.progressTracker = new ProgressTracker(logger);
    this.categories = {};
    this.currentSession = null;
  }

  async initialize() {
    try {
      this.logger.info('Initializing Sports Scraper...');

      // Initialize components
      await this.progressTracker.initialize();
      await this.loadCategories();
      await this.imageProcessor.cleanupTempFiles();

      this.logger.info('Sports Scraper initialized successfully');
      return true;
    } catch (error) {
      this.logger.error(`Failed to initialize scraper: ${error.message}`);
      throw error;
    }
  }

  async loadCategories() {
    try {
      if (await fs.pathExists(CONFIG.paths.categories)) {
        const categoriesArray = await fs.readJson(CONFIG.paths.categories);
        
        // Convert array format to object format for easier lookup
        this.categories = {};
        categoriesArray.forEach(cat => {
          const slug = this.sanitizeSlug(cat.label_en_guess || cat.label_core);
          this.categories[slug] = {
            id: cat.category_id,
            name: cat.label_en_guess || cat.label_core,
            name_es: cat.label_es_guess,
            emoji: cat.label_emoji,
            path: cat.path,
            raw_label: cat.label_raw
          };
        });
        
        this.logger.info(`Loaded ${Object.keys(this.categories).length} categories`);
      } else {
        this.logger.warn('No categories.json file found. Creating empty categories structure.');
        this.categories = {};
        await this.createSampleCategories();
      }
    } catch (error) {
      this.logger.error(`Failed to load categories: ${error.message}`);
      throw error;
    }
  }

  sanitizeSlug(text) {
    if (!text) return 'unknown';
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/-+/g, '_') // Replace hyphens with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  }

  async createSampleCategories() {
    const sampleCategories = [
      {
        "category_id": 334393,
        "path": "/categories/334393",
        "label_raw": "🇪🇸 LALIGA EA SPORTS - HYPERMOTION",
        "label_emoji": "🇪🇸",
        "label_core": "LALIGA EA SPORTS - HYPERMOTION",
        "label_en_guess": "LALIGA EA SPORTS - HYPERMOTION",
        "label_es_guess": null
      }
    ];

    await fs.writeJson(CONFIG.paths.categories, sampleCategories, { spaces: 2 });
    this.logger.info('Created sample categories.json file');
  }

  getRandomDelay(baseDelay) {
    const variation = CONFIG.scraping.delays.randomVariation;
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    return baseDelay + (variation * randomFactor);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRandomUserAgent() {
    const agents = CONFIG.request.userAgents;
    return agents[Math.floor(Math.random() * agents.length)];
  }

  async makeRequest(url, options = {}) {
    const { method = 'GET', headers = {}, retries = CONFIG.scraping.maxRetries } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const requestHeaders = {
          ...CONFIG.request.defaultHeaders,
          'User-Agent': this.getRandomUserAgent(),
          ...headers
        };

        this.logger.debug(`Making ${method} request to: ${url} (attempt ${attempt}/${retries})`);

        const response = await axios({
          method,
          url,
          headers: requestHeaders,
          timeout: CONFIG.scraping.timeout,
          maxRedirects: 5,
          validateStatus: (status) => status < 400
        });

        // Add delay after successful request
        const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenRequests);
        await this.sleep(delay);

        return response;
      } catch (error) {
        this.logger.warn(`Request attempt ${attempt} failed: ${error.message}`);

        if (attempt === retries) {
          throw new Error(`Failed request after ${retries} attempts: ${error.message}`);
        }

        // Wait before retry with exponential backoff
        const delay = CONFIG.scraping.delays.onError * attempt;
        await this.sleep(delay);
      }
    }
  }

  async extractAlbumLinksFromPage(url, options = {}) {
    try {
      this.logger.info(`Extracting album links from: ${url}`);

      const response = await this.makeRequest(url);
      const $ = cheerio.load(response.data);
      const albumLinks = [];

      // Define various album link selectors with enhanced title extraction
      const albumSelectors = [
        // Common album/gallery link patterns
        'a[href*="album"]',
        'a[href*="gallery"]',
        'a[href*="photos"]',
        'a[href*="images"]',
        'a[href*="collection"]',
        
        // Generic link patterns that might lead to albums
        '.album-link',
        '.gallery-link',
        '.photo-album a',
        '.image-gallery a',
        '.album-thumbnail a',
        '.gallery-item a',
        '.photo-item a',
        '.album-item a',
        '.album-card a',
        
        // Links containing images (likely album previews)
        'a:has(img)',
        
        // Links with specific text patterns
        'a[title*="album"]',
        'a[title*="gallery"]',
        'a[title*="photos"]',
        'a[alt*="album"]',
        'a[alt*="gallery"]',
        
        // Card/item based layouts
        '.card a',
        '.item a',
        '.post a',
        '.entry a',
        
        // Common content management system patterns
        '.content-item a',
        '.media-item a',
        '.portfolio-item a'
      ];

      const foundLinks = new Set();

      for (const selector of albumSelectors) {
        $(selector).each((index, element) => {
          const $link = $(element);
          let href = $link.attr('href');
          
          if (href) {
            // Convert relative URLs to absolute
            if (href.startsWith('//')) {
              href = 'https:' + href;
            } else if (href.startsWith('/')) {
              const urlObj = new URL(url);
              href = urlObj.origin + href;
            } else if (!href.startsWith('http')) {
              const urlObj = new URL(url);
              href = urlObj.origin + '/' + href;
            }

            // Basic validation and filtering
            if (href.startsWith('http') && !foundLinks.has(href) && href !== url) {
              // Skip common non-album links
              if (href.includes('mailto:') || href.includes('tel:') || 
                  href.includes('javascript:') || href.includes('#') ||
                  href.includes('.pdf') || href.includes('.doc')) {
                return;
              }

              // Enhanced title extraction
              let albumTitle = this.extractAlbumTitle($link, $);
              
              foundLinks.add(href);
              albumLinks.push({
                url: href,
                title: albumTitle,
                originalTitle: $link.attr('title') || $link.text().trim() || '',
                alt: $link.find('img').attr('alt') || '',
                selector: selector,
                hasImage: $link.find('img').length > 0,
                folderName: this.sanitizeAlbumTitle(albumTitle)
              });
            }
          }
        });
      }

      // Remove duplicates and sort by priority
      const uniqueAlbums = this.deduplicateAlbums(albumLinks);
      
      // Sort by priority (links with images first, then by title quality)
      uniqueAlbums.sort((a, b) => {
        if (a.hasImage && !b.hasImage) return -1;
        if (!a.hasImage && b.hasImage) return 1;
        if (a.title && !b.title) return -1;
        if (!a.title && b.title) return 1;
        return b.title.length - a.title.length; // Prefer longer, more descriptive titles
      });

      this.logger.info(`Found ${uniqueAlbums.length} unique albums from ${url}`);
      uniqueAlbums.forEach((album, index) => {
        this.logger.info(`Album ${index + 1}: "${album.title}" -> ${album.folderName}`);
      });
      
      return uniqueAlbums;

    } catch (error) {
      this.logger.error(`Failed to extract album links from ${url}: ${error.message}`);
      return [];
    }
  }

  extractAlbumTitle($link, $) {
    // Try multiple strategies to get the best album title
    
    // 1. Try title attribute
    let title = $link.attr('title');
    if (title && title.trim().length > 3) {
      return title.trim();
    }
    
    // 2. Try link text content
    title = $link.text().trim();
    if (title && title.length > 3 && title.length < 100) {
      return title;
    }
    
    // 3. Try image alt text
    const imgAlt = $link.find('img').attr('alt');
    if (imgAlt && imgAlt.trim().length > 3) {
      return imgAlt.trim();
    }
    
    // 4. Try parent element text/title
    const $parent = $link.parent();
    const parentTitle = $parent.attr('title') || $parent.find('.title, .name, .caption, h1, h2, h3, h4').first().text().trim();
    if (parentTitle && parentTitle.length > 3 && parentTitle.length < 100) {
      return parentTitle;
    }
    
    // 5. Try sibling elements for title
    const siblingTitle = $link.siblings('.title, .name, .caption, h1, h2, h3, h4').first().text().trim();
    if (siblingTitle && siblingTitle.length > 3) {
      return siblingTitle;
    }
    
    // 6. Try data attributes
    const dataTitle = $link.attr('data-title') || $link.attr('data-name') || $link.attr('data-caption');
    if (dataTitle && dataTitle.trim().length > 3) {
      return dataTitle.trim();
    }
    
    // 7. Extract from URL as last resort
    const urlParts = $link.attr('href').split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart.length > 3) {
      return lastPart.replace(/[_-]/g, ' ').replace(/\.(html?|php|asp)$/i, '').trim();
    }
    
    // 8. Generic fallback
    return `Album_${Date.now()}`;
  }

  sanitizeAlbumTitle(title) {
    if (!title) return 'unknown_album';
    
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/-+/g, '_') // Replace hyphens with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 50); // Limit length
  }

  deduplicateAlbums(albumLinks) {
    const seen = new Map();
    const unique = [];
    
    for (const album of albumLinks) {
      const key = album.url;
      if (!seen.has(key)) {
        seen.set(key, true);
        unique.push(album);
      }
    }
    
    return unique;
  }

  getHighQualityImageUrl(src) {
    // Convert Yupoo URLs to highest quality versions
    if (src.includes('photo.yupoo.com')) {
      // Replace size indicators with largest available - try orig first (highest quality)
      let highQualitySrc = src
        .replace('/small.jpg', '/orig.jpg')      // Try orig first (highest quality)
        .replace('/medium.jpg', '/orig.jpg')
        .replace('/square.jpg', '/orig.jpg')
        .replace('/thumbnail.jpg', '/orig.jpg')
        .replace('/thumb.jpg', '/orig.jpg');
      
      // If no change, try raw (second highest)
      if (highQualitySrc === src) {
        highQualitySrc = src
          .replace('/small.jpg', '/raw.jpg')
          .replace('/medium.jpg', '/raw.jpg')
          .replace('/square.jpg', '/raw.jpg')
          .replace('/thumbnail.jpg', '/raw.jpg')
          .replace('/thumb.jpg', '/raw.jpg');
      }
      
      // If still no change, try max
      if (highQualitySrc === src) {
        highQualitySrc = src
          .replace('/small.jpg', '/max.jpg')
          .replace('/medium.jpg', '/max.jpg')
          .replace('/square.jpg', '/max.jpg')
          .replace('/thumbnail.jpg', '/max.jpg')
          .replace('/thumb.jpg', '/max.jpg');
      }
      
      // If still no change, try large
      if (highQualitySrc === src) {
        highQualitySrc = src
          .replace('/small.jpg', '/large.jpg')
          .replace('/medium.jpg', '/large.jpg')
          .replace('/square.jpg', '/large.jpg')
          .replace('/thumbnail.jpg', '/large.jpg')
          .replace('/thumb.jpg', '/large.jpg');
      }
      
      return highQualitySrc;
    }
    
    // For other image hosts, return as-is for now
    return src;
  }

  getImageBaseKey(src) {
    // Extract the base image identifier to detect duplicates
    if (src.includes('photo.yupoo.com')) {
      // Extract the image ID from URLs like: https://photo.yupoo.com/wavesoccer/daf5bf89/raw.jpg
      const match = src.match(/\/([a-f0-9]+)\/(raw|large|mwebp|medium|small|square|thumbnail)\.(jpg|jpeg|png|webp)/);
      if (match) {
        return match[1]; // Return just the image ID
      }
    }
    
    // For other URLs, use the full URL without query params
    return src.split('?')[0];
  }

  isHigherQuality(newSrc, existingSrc) {
    const newQuality = this.getImageQuality(newSrc);
    const existingQuality = this.getImageQuality(existingSrc);
    return newQuality > existingQuality;
  }

  getImageQuality(src) {
    // Assign quality scores based on URL patterns
    if (src.includes('/orig.')) return 110;     // Original quality (highest)
    if (src.includes('/raw.')) return 100;      // Raw quality 
    if (src.includes('/max.')) return 95;       // Max size
    if (src.includes('/mwebp.')) return 90;     // High quality WebP
    if (src.includes('/large.')) return 80;     // Large size
    if (src.includes('/medium.')) return 60;    // Medium size
    if (src.includes('/small.')) return 30;     // Small size
    if (src.includes('/square.')) return 20;    // Square thumbnail
    if (src.includes('/thumb.')) return 15;     // Thumbnail
    if (src.includes('/thumbnail.')) return 10; // Tiny thumbnail
    return 50; // Default for unknown
  }

  async extractImageViewerUrls(albumUrl, options = {}) {
    try {
      this.logger.info(`Extracting image viewer URLs from album: ${albumUrl}`);

      const response = await this.makeRequest(albumUrl);
      const $ = cheerio.load(response.data);
      const viewerUrls = [];

      // Look for image viewer links - these are the clickable thumbnails that lead to full images
      const viewerSelectors = [
        '.viewer__imgwrap a',
        '.showalbum__children a',
        '.album__children a', 
        '.image__children a',
        '.showalbum__children .image__wrap a',
        'a[href*="/photos/"]',
        'a[href*="view"]',
        'a[href*="albums"]',
        '.photo-item a',
        '.img-wrap a',
        '.thumb a',
        '.thumbnail a',
        'a[href*="?uid="]',
        // More generic patterns
        'a:has(img)',
        '.image-container a'
      ];

      // Also look for any clickable images that might be thumbnails
      $('a').each((index, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        const hasImage = $link.find('img').length > 0;
        
        if (href && hasImage) {
          this.logger.debug(`Found link with image: ${href}`);
        }
      });

      const foundUrls = new Set();

      for (const selector of viewerSelectors) {
        $(selector).each((index, element) => {
          const $link = $(element);
          let href = $link.attr('href');
          
          if (href) {
            // Convert relative URLs to absolute
            if (href.startsWith('//')) {
              href = 'https:' + href;
            } else if (href.startsWith('/')) {
              const urlObj = new URL(albumUrl);
              href = urlObj.origin + href;
            } else if (!href.startsWith('http')) {
              const urlObj = new URL(albumUrl);
              href = new URL(href, albumUrl).href;
            }

            // Filter for image viewer URLs
            if (href.startsWith('http') && !foundUrls.has(href) && href !== albumUrl) {
              // Look for URLs that seem to be individual image viewers
              // For Yupoo, check for album URLs with different parameters or photo-specific URLs
              const isImageViewer = (
                href.includes('/photos/') || 
                href.includes('view') || 
                href.includes('image') || 
                href.includes('photo') ||
                (href.includes('/albums/') && href !== albumUrl) || // Different album URL
                href.includes('?uid=') || // Yupoo photo viewer pattern
                $link.find('img').length > 0 // Has thumbnail image
              );
              
              if (isImageViewer) {
                this.logger.debug(`Adding viewer URL: ${href}`);
                foundUrls.add(href);
                viewerUrls.push({
                  url: href,
                  thumbnail: $link.find('img').attr('src') || '',
                  alt: $link.find('img').attr('alt') || $link.attr('title') || '',
                  index: viewerUrls.length
                });
              }
            }
          }
        });
      }

      // Clean up the URLs - remove navigation and non-image URLs
      const cleanedUrls = viewerUrls.filter(viewer => {
        const url = viewer.url;
        // Remove obvious non-image URLs
        const isInvalid = (
          url.includes('/download') ||
          url.includes('tab=') ||
          url.includes('beian.gov.cn') ||
          url.includes('x.yupoo.com') && !url.includes('/albums/') ||
          url.endsWith('/albums/') ||
          url.endsWith('/albums/?uid=1')
        );
        return !isInvalid;
      });
      
      // Replace the array with the cleaned URLs
      viewerUrls.length = 0;
      viewerUrls.push(...cleanedUrls);
      
      // If we still don't have good viewer URLs, look for thumbnail images and construct proper viewer URLs
      if (viewerUrls.length === 0) {
        this.logger.info('No direct viewer URLs found, looking for thumbnail patterns and constructing viewer URLs...');
        
        // Look for thumbnail images and try to extract image IDs to construct proper viewer URLs
        $('img').each((index, element) => {
          const $img = $(element);
          const src = $img.attr('src');
          
          if (src && src.includes('photo.yupoo.com')) {
            // Extract image ID from Yupoo thumbnail URL
            // Format: https://photo.yupoo.com/wavesoccer/91b18ebb/small.jpg
            const match = src.match(/photo\.yupoo\.com\/[^/]+\/([a-f0-9]+)\/(small|medium|square|thumbnail|raw|large)\.(jpg|jpeg|png|webp)/);
            if (match) {
              const imageId = match[1];
              // Construct individual photo viewer URL 
              // Format: https://wavesoccer.x.yupoo.com/photos/91b18ebb?uid=1
              const albumUrlObj = new URL(albumUrl);
              const userDomain = albumUrlObj.hostname;
              const viewerUrl = `https://${userDomain}/photos/${imageId}?uid=1`;
              
              if (!foundUrls.has(viewerUrl)) {
                foundUrls.add(viewerUrl);
                viewerUrls.push({
                  url: viewerUrl,
                  thumbnail: src,
                  alt: $img.attr('alt') || '',
                  index: viewerUrls.length,
                  imageId: imageId,
                  constructed: true
                });
                this.logger.debug(`Constructed photo viewer URL: ${viewerUrl} from thumbnail: ${src}`);
              }
            }
          }
        });
      }
      
      this.logger.info(`Found ${viewerUrls.length} image viewer URLs`);
      if (viewerUrls.length > 0) {
        viewerUrls.slice(0, 3).forEach((viewer, i) => {
          this.logger.info(`  ${i + 1}. ${viewer.url}`);
        });
        if (viewerUrls.length > 3) {
          this.logger.info(`  ... and ${viewerUrls.length - 3} more`);
        }
      }
      
      return viewerUrls;

    } catch (error) {
      this.logger.error(`Failed to extract image viewer URLs from ${albumUrl}: ${error.message}`);
      return [];
    }
  }

  async extractFullSizeImageFromViewer(viewerUrl, options = {}) {
    try {
      this.logger.debug(`Extracting full-size image from viewer: ${viewerUrl}`);

      const response = await this.makeRequest(viewerUrl);
      const $ = cheerio.load(response.data);
      
      // Look for the full-size image in the viewer page
      const fullSizeSelectors = [
        '.image-viewer img',
        '.photo-viewer img', 
        '.viewer__img img',
        '.showalbum__pic img',
        '.main-image img',
        '.full-image img',
        'img[src*="raw"]',
        'img[src*="large"]',
        '.image-container img',
        '#viewer img',
        '.photo-display img',
        // Yupoo specific selectors
        '.showalbum__children img',
        '.image__wrap img',
        '.viewer__imgwrap img',
        '#album img',
        '.photo img'
      ];

      for (const selector of fullSizeSelectors) {
        const $img = $(selector);
        if ($img.length > 0) {
          let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original');
          
          if (src) {
            // Convert relative URLs to absolute
            if (src.startsWith('//')) {
              src = 'https:' + src;
            } else if (src.startsWith('/')) {
              const urlObj = new URL(viewerUrl);
              src = urlObj.origin + src;
            }

            // Skip very small images and obvious UI elements
            const width = parseInt($img.attr('width')) || 0;
            const height = parseInt($img.attr('height')) || 0;
            
            if (width > 0 && height > 0 && (width < 200 || height < 200)) {
              continue; // Skip small images
            }
            
            // Skip obvious UI/icon images
            if (src.includes('icon') || src.includes('logo') || src.includes('button') ||
                src.includes('arrow') || src.includes('bg') || src.includes('background') ||
                src.includes('policeIcon') || src.includes('website/')) {
              continue;
            }

            // Convert to highest quality if it's a Yupoo URL
            const highQualitySrc = this.getHighQualityImageUrl(src);
            
            return {
              src: highQualitySrc,
              originalSrc: src,
              viewerUrl: viewerUrl,
              alt: $img.attr('alt') || '',
              title: $img.attr('title') || '',
              width: width || null,
              height: height || null,
              selector: selector
            };
          }
        }
      }

      this.logger.warn(`No full-size image found in viewer: ${viewerUrl}`);
      return null;

    } catch (error) {
      this.logger.error(`Failed to extract image from viewer ${viewerUrl}: ${error.message}`);
      return null;
    }
  }

  async extractImagesFromPage(url, options = {}) {
    try {
      this.logger.info(`Extracting images from: ${url}`);

      // For Yupoo albums, skip image viewer URLs and go directly to image extraction
      // as the constructed viewer URLs often return 404
      if (url.includes('yupoo.com/albums/')) {
        this.logger.info('Yupoo album detected, using direct image extraction method');
        return await this.extractDirectImages(url, options);
      }

      // First, try to extract image viewer URLs (for other album pages)
      const viewerUrls = await this.extractImageViewerUrls(url, options);
      
      if (viewerUrls.length > 0) {
        this.logger.info(`Found album with ${viewerUrls.length} image viewers, extracting full-size images...`);
        
        const images = [];
        
        for (const [index, viewerData] of viewerUrls.entries()) {
          try {
            this.logger.info(`Processing image viewer ${index + 1}/${viewerUrls.length}: ${viewerData.url}`);
            
            const fullSizeImage = await this.extractFullSizeImageFromViewer(viewerData.url, options);
            
            if (fullSizeImage) {
              images.push({
                ...fullSizeImage,
                viewerIndex: index,
                thumbnailSrc: viewerData.thumbnail
              });
              this.logger.info(`✅ Extracted full-size image ${index + 1}: ${fullSizeImage.src}`);
            } else {
              this.logger.warn(`❌ No image found in viewer ${index + 1}: ${viewerData.url}`);
            }
            
            // Add delay between viewer requests
            if (index < viewerUrls.length - 1) {
              const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenRequests);
              await this.sleep(delay);
            }
            
          } catch (error) {
            this.logger.error(`Failed to process viewer ${index + 1}: ${error.message}`);
          }
        }
        
        this.logger.info(`Successfully extracted ${images.length}/${viewerUrls.length} full-size images`);
        return images;
      }
      
      // Fallback: Direct image extraction (for non-album pages)
      this.logger.info('No image viewers found, falling back to direct image extraction');
      return await this.extractDirectImages(url, options);

    } catch (error) {
      this.logger.error(`Failed to extract images from ${url}: ${error.message}`);
      return [];
    }
  }

  async extractDirectImages(url, options = {}) {
    try {
      this.logger.info('Extracting images directly from page content');
      
      const response = await this.makeRequest(url);
      const $ = cheerio.load(response.data);
      const images = [];

      // Define various image selectors for different types of galleries
      const imageSelectors = [
        // General image selectors
        'img[src*="jpg"], img[src*="jpeg"], img[src*="png"], img[src*="webp"]',
        'img[data-src*="jpg"], img[data-src*="jpeg"], img[data-src*="png"], img[data-src*="webp"]',
        
        // Common gallery selectors
        '.gallery img',
        '.gallery-item img',
        '.photo-gallery img',
        '.image-gallery img',
        '.album img',
        '.slideshow img',
        '.carousel img',
        
        // Product/sports specific selectors
        'img[src*="jersey"]',
        'img[src*="shirt"]', 
        'img[src*="kit"]',
        'img[src*="uniform"]',
        'img[alt*="jersey"]',
        'img[alt*="shirt"]',
        'img[alt*="kit"]',
        '.product-image img',
        '[data-testid*="product"] img',
        'img[src*="product"]',
        
        // Generic high-quality image selectors
        'img[width], img[height]', // Images with dimensions
        'figure img',
        'picture img',
        'a[href*="jpg"] img, a[href*="jpeg"] img, a[href*="png"] img',
        
        // Lazy loading selectors
        'img[data-lazy], img[data-original], img[data-src]',
        'img.lazy, img.lazyload'
      ];

      // Extract images using multiple selectors
      const foundImages = new Map(); // Use Map to track different sizes of same image
      
      for (const selector of imageSelectors) {
        $(selector).each((index, element) => {
          const $img = $(element);
          let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || $img.attr('data-lazy');
          
          if (src) {
            // Convert relative URLs to absolute
            if (src.startsWith('//')) {
              src = 'https:' + src;
            } else if (src.startsWith('/')) {
              const urlObj = new URL(url);
              src = urlObj.origin + src;
            }

            // Basic validation and filtering
            if (src.startsWith('http')) {
              // Skip very small images (likely icons/buttons)
              const width = parseInt($img.attr('width')) || 0;
              const height = parseInt($img.attr('height')) || 0;
              
              if (width > 0 && height > 0 && (width < 100 || height < 100)) {
                return; // Skip small images
              }

              // Skip common non-content images
              if (src.includes('icon') || src.includes('logo') || src.includes('button') || 
                  src.includes('arrow') || src.includes('bg') || src.includes('background')) {
                return;
              }

              // Convert to highest quality version (works with proper referrer)
              const finalSrc = this.getHighQualityImageUrl(src);
              
              const imageKey = this.getImageBaseKey(finalSrc);
              
              // Only add if we haven't seen this image or if this is a higher quality version
              if (!foundImages.has(imageKey) || (!url.includes('yupoo.com') && this.isHigherQuality(finalSrc, foundImages.get(imageKey).src))) {
                foundImages.set(imageKey, {
                  src: finalSrc,
                  originalSrc: src,
                  alt: $img.attr('alt') || '',
                  title: $img.attr('title') || '',
                  class: $img.attr('class') || '',
                  width: width || null,
                  height: height || null,
                  selector: selector,
                  quality: this.getImageQuality(finalSrc)
                });
              }
            }
          }
        });
      }

      // Convert Map to Array
      images.push(...Array.from(foundImages.values()));

      // Also check for images in links
      $('a[href*="jpg"], a[href*="jpeg"], a[href*="png"], a[href*="webp"]').each((index, element) => {
        const $link = $(element);
        let href = $link.attr('href');
        
        if (href) {
          if (href.startsWith('//')) {
            href = 'https:' + href;
          } else if (href.startsWith('/')) {
            const urlObj = new URL(url);
            href = urlObj.origin + href;
          }
          
          if (href.startsWith('http') && !foundImages.has(href)) {
            images.push({
              src: href,
              alt: $link.attr('title') || $link.text() || '',
              title: $link.attr('title') || '',
              class: 'linked-image',
              selector: 'link'
            });
          }
        }
      });

      // Sort by quality (highest quality first)
      images.sort((a, b) => {
        // First sort by quality score
        if (a.quality !== b.quality) {
          return b.quality - a.quality;
        }
        // Then by estimated size
        const aSize = (a.width || 0) * (a.height || 0);
        const bSize = (b.width || 0) * (b.height || 0);
        return bSize - aSize;
      });

      this.logger.info(`Found ${images.length} potential images from ${url}`);
      return images;

    } catch (error) {
      this.logger.error(`Failed to extract direct images from ${url}: ${error.message}`);
      return [];
    }
  }

  async processAlbumImages(albumData, albumIndex, categorySlug, targetUrl) {
    try {
      this.logger.info(`Processing album ${albumIndex + 1}: "${albumData.title}"`);
      this.logger.info(`Album URL: ${albumData.url}`);

      // Create album-specific folder
      const albumDir = path.join(CONFIG.paths.downloads, categorySlug, albumData.folderName);
      await fs.ensureDir(albumDir);
      
      this.logger.info(`Created album folder: ${albumData.folderName}`);

      // Extract images from this specific album
      const images = await this.extractImagesFromPage(albumData.url, {
        referrer: targetUrl
      });

      if (images.length === 0) {
        this.logger.warn(`No images found in album: ${albumData.title}`);
        return { processed: 0, successful: 0 };
      }

      this.logger.info(`Found ${images.length} images in album: "${albumData.title}"`);

      let processedCount = 0;
      let successCount = 0;

      for (const [imageIndex, imageData] of images.entries()) {
        const itemId = `${categorySlug}_${albumData.folderName}_img${imageIndex}`;
        
        // Skip if already processed
        if (this.progressTracker.isItemProcessed(categorySlug, itemId)) {
          this.logger.debug(`Skipping already processed item: ${itemId}`);
          continue;
        }

        try {
          const filename = this.imageProcessor.generateFilename(
            albumData.folderName, // use album folder name
            'photo', // type
            'img', // product type
            imageIndex.toString(), // image number within album
            imageData.src
          );

          const outputPath = path.join(albumDir, filename);

          // Download and process image
          await this.imageProcessor.downloadImage(imageData.src, outputPath, {
            referrer: albumData.url
          });

          // Mark as successful
          this.progressTracker.markItemProcessed(categorySlug, itemId, true, {
            filename,
            originalUrl: imageData.src,
            alt: imageData.alt,
            downloadPath: outputPath,
            sourceUrl: targetUrl,
            albumUrl: albumData.url,
            albumTitle: albumData.title,
            albumFolder: albumData.folderName,
            albumIndex: albumIndex,
            imageIndex: imageIndex,
            imageInfo: {
              width: imageData.width,
              height: imageData.height,
              selector: imageData.selector
            }
          });

          successCount++;
          this.logger.logDownloadSuccess(filename, imageData.src);

        } catch (error) {
          // Mark as failed
          this.progressTracker.markItemProcessed(categorySlug, itemId, false, {
            error: error.message,
            originalUrl: imageData.src,
            sourceUrl: targetUrl,
            albumUrl: albumData.url,
            albumTitle: albumData.title
          });

          this.logger.logDownloadFailed(`${albumData.folderName}_img${imageIndex}`, imageData.src, error);
        }

        processedCount++;

        // Add delay between downloads
        const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenRequests);
        await this.sleep(delay);
      }

      this.logger.info(`Completed album "${albumData.title}": ${successCount}/${processedCount} images`);
      return { processed: processedCount, successful: successCount };

    } catch (error) {
      this.logger.error(`Failed to process album "${albumData.title}": ${error.message}`);
      return { processed: 0, successful: 0 };
    }
  }

  async processCategoryFromUrl(categorySlug, categoryData, targetUrl) {
    try {
      this.logger.info(`Processing category: ${categorySlug} from URL: ${targetUrl}`);

      const categoryDir = path.join(CONFIG.paths.downloads, categorySlug);
      await fs.ensureDir(categoryDir);

      // First, try to find album links on the main page
      const albumLinks = await this.extractAlbumLinksFromPage(targetUrl, {
        referrer: targetUrl
      });

      let totalProcessed = 0;
      let totalSuccessful = 0;

      if (albumLinks.length > 0) {
        this.logger.info(`Found ${albumLinks.length} albums to process`);
        
        // Process each album
        for (const [albumIndex, albumData] of albumLinks.entries()) {
          try {
            this.logger.info(`Processing album ${albumIndex + 1}/${albumLinks.length}: "${albumData.title}"`);
            this.logger.info(`Album folder: ${albumData.folderName}`);
            
            const result = await this.processAlbumImages(albumData, albumIndex, categorySlug, targetUrl);
            totalProcessed += result.processed;
            totalSuccessful += result.successful;

            // Add delay between albums
            if (albumIndex < albumLinks.length - 1) {
              const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenCategories);
              this.logger.info(`Waiting ${delay}ms before next album...`);
              await this.sleep(delay);
            }

          } catch (error) {
            this.logger.error(`Failed to process album "${albumData.title}": ${error.message}`);
          }
        }
      } else {
        // No album links found, treat the page as a direct image gallery
        this.logger.info('No album links found, treating as direct image gallery');
        
        const images = await this.extractImagesFromPage(targetUrl, {
          referrer: targetUrl
        });

        if (images.length === 0) {
          this.logger.warn(`No images found at URL: ${targetUrl}`);
          return { processed: 0, successful: 0 };
        }

        this.logger.info(`Found ${images.length} images to process from ${targetUrl}`);

        // Process each image
        for (const [index, imageData] of images.entries()) {
          const itemId = `${categorySlug}_direct_${index}`;
          
          // Skip if already processed
          if (this.progressTracker.isItemProcessed(categorySlug, itemId)) {
            this.logger.debug(`Skipping already processed item: ${itemId}`);
            continue;
          }

          try {
            const filename = this.imageProcessor.generateFilename(
              categorySlug,
              'direct', // direct gallery
              'image', // product type
              index.toString(), // image index
              imageData.src
            );

            const outputPath = path.join(categoryDir, filename);

            // Download and process image
            await this.imageProcessor.downloadImage(imageData.src, outputPath, {
              referrer: targetUrl
            });

            // Mark as successful
            this.progressTracker.markItemProcessed(categorySlug, itemId, true, {
              filename,
              originalUrl: imageData.src,
              alt: imageData.alt,
              downloadPath: outputPath,
              sourceUrl: targetUrl,
              imageInfo: {
                width: imageData.width,
                height: imageData.height,
                selector: imageData.selector
              }
            });

            totalSuccessful++;
            this.logger.logDownloadSuccess(filename, imageData.src);

          } catch (error) {
            // Mark as failed
            this.progressTracker.markItemProcessed(categorySlug, itemId, false, {
              error: error.message,
              originalUrl: imageData.src,
              sourceUrl: targetUrl
            });

            this.logger.logDownloadFailed(`${categorySlug}_direct_${index}`, imageData.src, error);
          }

          totalProcessed++;

          // Add delay between downloads
          const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenRequests);
          await this.sleep(delay);
        }
      }

      return { processed: totalProcessed, successful: totalSuccessful };

    } catch (error) {
      this.logger.error(`Failed to process category ${categorySlug}: ${error.message}`);
      throw error;
    }
  }

  async processCategory(categorySlug, targetUrl) {
    try {
      const category = this.categories[categorySlug];
      if (!category) {
        throw new Error(`Category not found: ${categorySlug}`);
      }

      if (!targetUrl) {
        throw new Error('Target URL is required for scraping');
      }

      this.logger.info(`Starting category processing: ${categorySlug} from URL: ${targetUrl}`);

      // Initialize category progress (we'll update total after discovering images)
      this.progressTracker.startCategory(categorySlug, 0);

      // Process the category from the provided URL
      const result = await this.processCategoryFromUrl(categorySlug, category, targetUrl);

      // Update progress with actual totals
      const categoryProgress = this.progressTracker.progress.categories[categorySlug];
      if (categoryProgress) {
        categoryProgress.totalItems = result.processed;
      }

      // Mark category as complete
      this.progressTracker.completeCategory(categorySlug);

      this.logger.info(`Category ${categorySlug} completed: ${result.successful}/${result.processed} successful`);
      return { categoryId: categorySlug, processed: result.processed, successful: result.successful };

    } catch (error) {
      this.logger.error(`Failed to process category ${categorySlug}: ${error.message}`);
      throw error;
    }
  }

  async listCategories() {
    console.log('\n=== Available Categories ===');
    const sortedCategories = Object.entries(this.categories).sort(([a], [b]) => a.localeCompare(b));
    
    for (const [categorySlug, category] of sortedCategories) {
      const emoji = category.emoji ? `${category.emoji} ` : '';
      const nameEs = category.name_es ? ` (${category.name_es})` : '';
      console.log(`${categorySlug}: ${emoji}${category.name}${nameEs}`);
    }
    console.log(`\nTotal: ${Object.keys(this.categories).length} categories\n`);
  }

  async showProgress() {
    const summary = this.progressTracker.getProgressSummary();
    console.log('\n=== Progress Summary ===');
    console.log(`Session ID: ${summary.sessionId}`);
    console.log(`Total Processed: ${summary.totalProcessed}`);
    console.log(`Success Rate: ${summary.successRate}`);
    console.log(`Categories: ${summary.completedCategories}/${summary.totalCategories} completed`);
    
    if (summary.categories.length > 0) {
      console.log('\n--- Category Breakdown ---');
      for (const cat of summary.categories) {
        console.log(`${cat.id}: ${cat.progress} (${cat.successful}/${cat.processed} successful)`);
      }
    }
    console.log('');
  }

  async discoverAlbums(categorySlug, categoryUrl) {
    try {
      console.log(`\n🔍 Discovering albums in category: ${categorySlug}`);
      console.log(`📂 Category URL: ${categoryUrl}`);
      console.log('');

      // Extract album links from the category page
      const albumLinks = await this.extractAlbumLinksFromPage(categoryUrl, {
        referrer: categoryUrl
      });

      if (albumLinks.length === 0) {
        console.log('❌ No albums found in this category.');
        return [];
      }

      console.log(`✅ Found ${albumLinks.length} albums:\n`);
      
      // Display albums in a numbered list
      albumLinks.forEach((album, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${album.title}`);
        console.log(`    📁 Folder: ${album.folderName}`);
        console.log(`    🔗 URL: ${album.url}`);
        console.log('');
      });

      // Save album list for later reference
      const albumListPath = path.join(CONFIG.paths.metadata, `${categorySlug}_albums.json`);
      await fs.writeJson(albumListPath, albumLinks, { spaces: 2 });
      
      console.log(`💾 Album list saved to: ${albumListPath}`);
      console.log('');
      console.log('📋 Next steps:');
      console.log('1. Choose an album from the list above');
      console.log('2. Use the album URL to scrape individual albums:');
      console.log(`   node src/scraper.js ${categorySlug} --album "[album_url]"`);
      console.log('3. Or process all albums at once:');
      console.log(`   node src/scraper.js ${categorySlug} --bulk "${categoryUrl}"`);
      console.log('');
      console.log('💡 Example:');
      if (albumLinks.length > 0) {
        console.log(`   node src/scraper.js ${categorySlug} --album "${albumLinks[0].url}"`);
      }
      
      return albumLinks;

    } catch (error) {
      this.logger.error(`Failed to discover albums: ${error.message}`);
      throw error;
    }
  }

  async processBulkCategory(categorySlug, categoryUrl) {
    try {
      console.log(`\n🚀 Bulk processing category: ${categorySlug}`);
      console.log(`📂 Category URL: ${categoryUrl}`);
      console.log('');

      // Extract album links from the category page
      const albumLinks = await this.extractAlbumLinksFromPage(categoryUrl, {
        referrer: categoryUrl
      });

      if (albumLinks.length === 0) {
        console.log('❌ No albums found in this category.');
        return { processed: 0, successful: 0 };
      }

      // Filter out non-album URLs (navigation links, etc.)
      const validAlbums = albumLinks.filter(album => {
        const url = album.url;
        const isValid = url.includes('/albums/') && 
                       url.includes('uid=1') && 
                       url.includes('isSubCate=false') &&
                       !url.includes('beian.gov.cn') &&
                       !url.includes('undefined.x.yupoo.com') &&
                       !url.startsWith('https://x.yupoo.com') &&
                       !url.includes('gallery') &&
                       !url.includes('?tab=');
        
        return isValid;
      });

      console.log(`✅ Found ${validAlbums.length} valid albums to process (filtered from ${albumLinks.length} total):\n`);
      
      // Display valid albums
      validAlbums.forEach((album, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${album.title} -> ${album.folderName}`);
      });
      console.log('');

      // Initialize category progress
      this.progressTracker.startCategory(categorySlug, 0);

      let totalProcessed = 0;
      let totalSuccessful = 0;

      // Process each valid album
      for (const [albumIndex, albumData] of validAlbums.entries()) {
        try {
          console.log(`\n📸 Processing album ${albumIndex + 1}/${validAlbums.length}: "${albumData.title}"`);
          console.log(`🔗 URL: ${albumData.url}`);
          
          const result = await this.processAlbumImages(albumData, albumIndex, categorySlug, categoryUrl);
          totalProcessed += result.processed;
          totalSuccessful += result.successful;

          console.log(`✅ Album complete: ${result.successful}/${result.processed} images`);

          // Add delay between albums
          if (albumIndex < validAlbums.length - 1) {
            const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenCategories);
            console.log(`⏳ Waiting ${Math.round(delay/1000)}s before next album...`);
            await this.sleep(delay);
          }

        } catch (error) {
          console.log(`❌ Failed to process album "${albumData.title}": ${error.message}`);
          this.logger.error(`Failed to process album "${albumData.title}": ${error.message}`);
        }
      }

      // Update progress with actual totals
      const categoryProgress = this.progressTracker.progress.categories[categorySlug];
      if (categoryProgress) {
        categoryProgress.totalItems = totalProcessed;
      }

      // Mark category as complete
      this.progressTracker.completeCategory(categorySlug);

      // Finalize session
      const summary = await this.progressTracker.finalize();
      
      console.log(`\n🎉 Bulk Processing Complete!`);
      console.log(`📂 Category: ${categorySlug}`);
      console.log(`📚 Albums processed: ${validAlbums.length}`);
      console.log(`📸 Total images: ${totalProcessed}`);
      console.log(`✅ Successful: ${totalSuccessful}`);
      console.log(`📊 Success Rate: ${summary.successRate}`);
      console.log(`💾 Files saved to: scraper/downloads/${categorySlug}/`);

      return { processed: totalProcessed, successful: totalSuccessful, albums: validAlbums.length };

    } catch (error) {
      this.logger.error(`Failed to process bulk category: ${error.message}`);
      throw error;
    }
  }

  async scrapeIndividualAlbum(categorySlug, albumUrl) {
    try {
      console.log(`\n🎯 Scraping individual album...`);
      console.log(`📂 Category: ${categorySlug}`);
      console.log(`🔗 Album URL: ${albumUrl}`);
      console.log('');

      // Validate category exists
      const category = this.categories[categorySlug];
      if (!category) {
        throw new Error(`Category not found: ${categorySlug}`);
      }

      // Try to load saved album list to get album title
      const albumListPath = path.join(CONFIG.paths.metadata, `${categorySlug}_albums.json`);
      let albumData = null;
      
      try {
        const savedAlbums = await fs.readJson(albumListPath);
        albumData = savedAlbums.find(album => album.url === albumUrl);
      } catch {
        // Album list not found, we'll extract title from the album page itself
      }

      // If we don't have album data, create it by extracting from the URL/page
      if (!albumData) {
        console.log('ℹ️  Album not found in saved list, extracting title from page...');
        
        // Extract title from the album page itself
        const response = await this.makeRequest(albumUrl);
        const $ = cheerio.load(response.data);
        
        // Try to extract album title from the page
        let albumTitle = $('title').text().trim() || 
                        $('h1').first().text().trim() || 
                        $('h2').first().text().trim() || 
                        $('.album-title, .gallery-title, .title').first().text().trim() ||
                        'Unknown_Album';
        
        albumData = {
          url: albumUrl,
          title: albumTitle,
          folderName: this.sanitizeAlbumTitle(albumTitle)
        };
      }

      console.log(`📖 Album: "${albumData.title}"`);
      console.log(`📁 Folder: ${albumData.folderName}`);
      console.log('');

      // Initialize progress tracking for this album
      this.progressTracker.startCategory(`${categorySlug}_${albumData.folderName}`, 0);

      // Process the individual album
      const result = await this.processAlbumImages(albumData, 0, categorySlug, albumUrl);

      // Mark as complete
      this.progressTracker.completeCategory(`${categorySlug}_${albumData.folderName}`);

      // Finalize session
      const summary = await this.progressTracker.finalize();
      
      console.log('\n🎉 Album Scraping Complete!');
      console.log(`📖 Album: "${albumData.title}"`);
      console.log(`📁 Folder: ${albumData.folderName}`);
      console.log(`📸 Processed: ${result.processed} images`);
      console.log(`✅ Successful: ${result.successful} images`);
      console.log(`📊 Success Rate: ${summary.successRate}`);
      console.log(`💾 Files saved to: scraper/downloads/${categorySlug}/${albumData.folderName}/`);
      
      return result;

    } catch (error) {
      this.logger.error(`Failed to scrape individual album: ${error.message}`);
      throw error;
    }
  }

  async run(categorySlug = null, targetUrl = null) {
    try {
      await this.initialize();

      // If no category specified, show available options
      if (!categorySlug) {
        await this.listCategories();
        console.log('\n📋 Usage:');
        console.log('1. Discover albums: node scraper.js [category_slug] [category_url]');
        console.log('2. Scrape album:    node scraper.js [category_slug] --album [album_url]');
        console.log('');
        console.log('💡 Examples:');
        console.log('   node scraper.js caf "https://wavesoccer.x.yupoo.com/categories/4667651"');
        console.log('   node scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353962?uid=1"');
        return;
      }

      // Validate category exists
      if (!this.categories[categorySlug]) {
        this.logger.error(`Category not found: ${categorySlug}`);
        console.log('\nAvailable categories:');
        await this.listCategories();
        return;
      }

      // Check if this is album scraping mode
      if (targetUrl === '--album') {
        console.log('❌ Error: Album URL is required after --album flag');
        console.log('Usage: node scraper.js [category_slug] --album [album_url]');
        console.log('Example: node scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353962?uid=1"');
        return;
      }

      // Check if this is bulk processing mode
      if (targetUrl === '--bulk') {
        console.log('❌ Error: Category URL is required after --bulk flag');
        console.log('Usage: node scraper.js [category_slug] --bulk [category_url]');
        console.log('Example: node scraper.js afc --bulk "https://wavesoccer.x.yupoo.com/categories/334305"');
        return;
      }

      // Validate URL is provided
      if (!targetUrl) {
        console.log('❌ Error: URL is required');
        console.log('\n📋 Usage:');
        console.log('1. Discover albums: node scraper.js [category_slug] [category_url]');
        console.log('2. Scrape album:    node scraper.js [category_slug] --album [album_url]');
        return;
      }

      // Validate URL format
      try {
        new URL(targetUrl);
      } catch {
        this.logger.error('Invalid URL format');
        console.log('Please provide a valid URL starting with http:// or https://');
        return;
      }

      // Start logging session
      this.logger.logScrapingSession({
        categorySlug,
        targetUrl,
        timestamp: new Date().toISOString(),
        sessionId: this.progressTracker.progress.sessionId
      });

      // Determine mode: album discovery or individual album scraping
      const result = await this.discoverAlbums(categorySlug, targetUrl);
      
    } catch (error) {
      this.logger.error(`Operation failed: ${error.message}`);
      throw error;
    }
  }
}

// CLI handling
async function main() {
  const scraper = new SportsScraper();
  
  const args = process.argv.slice(2);
  const command = args[0];
  const secondArg = args[1];
  const thirdArg = args[2];

  try {
    switch (command) {
      case '--list':
      case '-l':
        await scraper.initialize();
        await scraper.listCategories();
        break;
        
      case '--progress':
      case '-p':
        await scraper.initialize();
        await scraper.showProgress();
        break;
        
      case '--help':
      case '-h':
        console.log(`
🏈 Sports Scraper - Multiple Workflows

📋 Commands:
  node scraper.js --list                             List all categories
  node scraper.js --progress                         Show current progress
  node scraper.js [category] [category_url]          Discover albums (Step 1)
  node scraper.js [category] --album [album_url]     Scrape individual album (Step 2)
  node scraper.js [category] --bulk [category_url]   Bulk process all albums (One-Step)

💡 Workflows:

  Two-Step Workflow (Manual):
  1. node scraper.js caf "https://wavesoccer.x.yupoo.com/categories/4667651"
  2. node scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353962?uid=1"
  
  One-Step Workflow (Bulk):
  node scraper.js afc --bulk "https://wavesoccer.x.yupoo.com/categories/334305"

🎯 Benefits:
  - Two-Step: Respectful to servers, manual control
  - Bulk: Efficient processing of entire categories
  - Organized folder structure by album titles
  - High-quality image downloads

📁 Output Structure:
  scraper/downloads/[category]/[album_title]/images
        `);
        break;
        
      default:
        // Handle album scraping mode
        if (secondArg === '--album' && thirdArg) {
          await scraper.initialize();
          await scraper.scrapeIndividualAlbum(command, thirdArg);
        } else if (secondArg === '--bulk' && thirdArg) {
          // Handle bulk processing mode
          await scraper.initialize();
          await scraper.processBulkCategory(command, thirdArg);
        } else {
          // Handle normal discovery mode
          await scraper.run(command, secondArg);
        }
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SportsScraper;