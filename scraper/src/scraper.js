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

              // Enhanced filtering for regulatory/legal pages
              if (this.isInvalidAlbumUrl(href)) {
                return;
              }

              // Enhanced title extraction
              let albumTitle = this.extractAlbumTitle($link, $);
              
              // Validate album title
              if (this.isInvalidAlbumTitle(albumTitle, href)) {
                return;
              }
              
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
      
      // Final validation to ensure all albums are valid
      const validAlbums = uniqueAlbums.filter(album => {
        if (this.isInvalidAlbumUrl(album.url) || this.isInvalidAlbumTitle(album.title, album.url)) {
          this.logger.debug(`Filtered out invalid album: "${album.title}" -> ${album.url}`);
          return false;
        }
        return true;
      });
      
      // Sort by priority (links with images first, then by title quality)
      validAlbums.sort((a, b) => {
        if (a.hasImage && !b.hasImage) return -1;
        if (!a.hasImage && b.hasImage) return 1;
        if (a.title && !b.title) return -1;
        if (!a.title && b.title) return 1;
        return b.title.length - a.title.length; // Prefer longer, more descriptive titles
      });

      const filteredCount = uniqueAlbums.length - validAlbums.length;
      this.logger.info(`Found ${validAlbums.length} valid albums from ${url} (filtered out ${filteredCount} from ${uniqueAlbums.length} total)`);
      
      if (filteredCount > 0) {
        this.logger.info(`Filtered albums breakdown:`);
        uniqueAlbums.forEach((album, index) => {
          const isValid = !this.isInvalidAlbumUrl(album.url) && !this.isInvalidAlbumTitle(album.title, album.url);
          if (!isValid) {
            const urlReason = this.isInvalidAlbumUrl(album.url) ? 'invalid URL' : '';
            const titleReason = this.isInvalidAlbumTitle(album.title, album.url) ? 'invalid title' : '';
            const reason = [urlReason, titleReason].filter(r => r).join(', ');
            this.logger.info(`  Filtered: "${album.title}" -> ${album.url} (${reason})`);
          }
        });
      }
      
      validAlbums.forEach((album, index) => {
        this.logger.info(`Album ${index + 1}: "${album.title}" -> ${album.folderName}`);
      });
      
      return validAlbums;

    } catch (error) {
      this.logger.error(`Failed to extract album links from ${url}: ${error.message}`);
      return [];
    }
  }

  async extractAlbumLinksFromMultiPageCategory(baseUrl, options = {}) {
    try {
      this.logger.info(`Starting multi-page album extraction from: ${baseUrl}`);
      
      if (!CONFIG.scraping.pagination.enabled) {
        this.logger.info('Pagination disabled, falling back to single page extraction');
        return await this.extractAlbumLinksFromPage(baseUrl, options);
      }

      const allAlbumLinks = [];
      let currentPage = 1;
      let hasNextPage = true;
      const maxPages = CONFIG.scraping.pagination.maxPagesPerCategory;

      // First, try to detect if the URL already has pagination parameters
      const urlObj = new URL(baseUrl);
      const existingPage = urlObj.searchParams.get('page') || urlObj.searchParams.get('p');
      if (existingPage) {
        currentPage = parseInt(existingPage) || 1;
        this.logger.info(`Detected existing page parameter: ${currentPage}`);
      }

      while (hasNextPage && currentPage <= maxPages) {
        try {
          // Construct the URL for the current page
          const pageUrl = this.buildPageUrl(baseUrl, currentPage);
          
          this.logger.info(`Processing page ${currentPage}: ${pageUrl}`);

          // Extract albums from current page
          const pageAlbums = await this.extractAlbumLinksFromPage(pageUrl, {
            ...options,
            referrer: baseUrl
          });

          if (pageAlbums.length === 0) {
            this.logger.info(`No albums found on page ${currentPage}, stopping pagination`);
            break;
          }

          // Add page albums to collection
          allAlbumLinks.push(...pageAlbums);
          this.logger.info(`Found ${pageAlbums.length} albums on page ${currentPage} (total: ${allAlbumLinks.length})`);

          // Check if there's a next page by trying to detect pagination elements
          hasNextPage = await this.hasNextPage(pageUrl, currentPage);
          
          if (hasNextPage) {
            currentPage++;
            // Add delay between page requests
            const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenPages);
            this.logger.info(`Waiting ${delay}ms before next page...`);
            await this.sleep(delay);
          } else {
            this.logger.info(`No more pages detected after page ${currentPage - 1}`);
          }

        } catch (error) {
          this.logger.error(`Failed to process page ${currentPage}: ${error.message}`);
          // Continue to next page on error, but limit consecutive failures
          currentPage++;
          if (currentPage > 3 && allAlbumLinks.length === 0) {
            // If we've tried 3+ pages and found nothing, stop
            this.logger.warn('Multiple page failures with no albums found, stopping pagination');
            break;
          }
        }
      }

      // Remove duplicates based on URL
      const uniqueAlbums = this.deduplicateAlbums(allAlbumLinks);
      
      this.logger.info(`Multi-page extraction complete: ${uniqueAlbums.length} unique albums from ${currentPage - 1} pages`);
      return uniqueAlbums;

    } catch (error) {
      this.logger.error(`Failed to extract albums from multi-page category ${baseUrl}: ${error.message}`);
      // Fallback to single page extraction
      this.logger.info('Falling back to single page extraction');
      return await this.extractAlbumLinksFromPage(baseUrl, options);
    }
  }

  buildPageUrl(baseUrl, pageNumber) {
    try {
      const urlObj = new URL(baseUrl);
      
      // Remove existing page parameters
      urlObj.searchParams.delete('page');
      urlObj.searchParams.delete('p');
      
      // Add page parameter
      urlObj.searchParams.set('page', pageNumber.toString());
      
      return urlObj.toString();
    } catch (error) {
      this.logger.error(`Failed to build page URL: ${error.message}`);
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${pageNumber}`;
    }
  }

  async hasNextPage(currentPageUrl, currentPageNumber) {
    try {
      // For Yupoo-style pagination, we can try to access the next page directly
      // and see if it returns content
      const nextPageUrl = this.buildPageUrl(currentPageUrl, currentPageNumber + 1);
      
      this.logger.debug(`Checking if next page exists: ${nextPageUrl}`);
      
      // Make a quick request to see if the next page has content
      const response = await this.makeRequest(nextPageUrl);
      const $ = cheerio.load(response.data);
      
      // Look for album links on the page
      const albumCount = $('a[href*="/albums/"]').length;
      const hasAlbumContent = albumCount > 0;
      
      // Also check for explicit pagination indicators
      const hasNextButton = $('.next, .pagination-next, a[href*="page=' + (currentPageNumber + 1) + '"]').length > 0;
      const hasPageNumbers = $('.pagination, .page-numbers, .pager').length > 0;
      
      this.logger.debug(`Next page check - Albums: ${albumCount}, Next button: ${hasNextButton}, Pagination: ${hasPageNumbers}`);
      
      return hasAlbumContent || hasNextButton;
      
    } catch (error) {
      this.logger.debug(`Error checking next page: ${error.message}`);
      // If we can't check, assume there might be more pages (up to max limit)
      return currentPageNumber < 5; // Conservative fallback
    }
  }

  extractAlbumTitle($link, $) {
    // Try multiple strategies to get the best album title
    let title = '';
    
    // 1. Try title attribute (most reliable)
    title = $link.attr('title');
    if (title && this.isValidTitleExtraction(title)) {
      return this.cleanAndNormalizeTitle(title);
    }
    
    // 2. Try link text content
    title = $link.text().trim();
    if (title && this.isValidTitleExtraction(title)) {
      return this.cleanAndNormalizeTitle(title);
    }
    
    // 3. Try image alt text
    const imgAlt = $link.find('img').attr('alt');
    if (imgAlt && this.isValidTitleExtraction(imgAlt)) {
      return this.cleanAndNormalizeTitle(imgAlt);
    }
    
    // 4. Try nested spans or divs with jersey-related content
    const nestedText = $link.find('span, div').filter((i, el) => {
      const text = $(el).text().trim();
      return text.length > 3 && this.looksLikeSportsTitle(text);
    }).first().text().trim();
    
    if (nestedText && this.isValidTitleExtraction(nestedText)) {
      return this.cleanAndNormalizeTitle(nestedText);
    }
    
    // 5. Try parent element text/title
    const $parent = $link.parent();
    const parentTitle = $parent.attr('title') || $parent.find('.title, .name, .caption, h1, h2, h3, h4').first().text().trim();
    if (parentTitle && this.isValidTitleExtraction(parentTitle)) {
      return this.cleanAndNormalizeTitle(parentTitle);
    }
    
    // 6. Try sibling elements for title
    const siblingTitle = $link.siblings('.title, .name, .caption, h1, h2, h3, h4').first().text().trim();
    if (siblingTitle && this.isValidTitleExtraction(siblingTitle)) {
      return this.cleanAndNormalizeTitle(siblingTitle);
    }
    
    // 7. Try data attributes
    const dataTitle = $link.attr('data-title') || $link.attr('data-name') || $link.attr('data-caption');
    if (dataTitle && this.isValidTitleExtraction(dataTitle)) {
      return this.cleanAndNormalizeTitle(dataTitle);
    }
    
    // 8. Extract from URL as last resort
    const href = $link.attr('href');
    if (href) {
      return this.extractTitleFromUrl(href);
    }
    
    // 9. Generic fallback
    return `Album_${Date.now()}`;
  }

  isValidTitleExtraction(title) {
    if (!title || typeof title !== 'string') return false;
    
    const cleaned = title.trim();
    
    // Check minimum length
    if (cleaned.length < 3) return false;
    
    // Check maximum length (avoid very long descriptions)
    if (cleaned.length > 100) return false;
    
    // Skip titles that are just URLs or have URL fragments
    if (cleaned.includes('http') || cleaned.includes('www.') || 
        cleaned.includes('uid=') || cleaned.includes('referrer')) {
      return false;
    }
    
    // Skip generic texts
    const genericTexts = ['click here', 'view more', 'see all', 'more info', 'details'];
    const lowerTitle = cleaned.toLowerCase();
    for (const generic of genericTexts) {
      if (lowerTitle.includes(generic)) return false;
    }
    
    return true;
  }

  looksLikeSportsTitle(text) {
    const sportsKeywords = [
      'jersey', 'kit', 'shirt', 'shorts', 'authentic', 'player',
      'home', 'away', 'third', 'gk', 'goalkeeper', 'training',
      'jacket', 'tracksuit', 'hoodie', 'polo'
    ];
    
    const lowerText = text.toLowerCase();
    return sportsKeywords.some(keyword => lowerText.includes(keyword));
  }

  cleanAndNormalizeTitle(title) {
    return title
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/^\W+|\W+$/g, '') // Remove leading/trailing non-word characters
      .toUpperCase(); // Standardize to uppercase for sports jerseys
  }

  extractTitleFromUrl(href) {
    // For Yupoo URLs, extract album ID and create meaningful name
    if (href.includes('yupoo.com/albums/')) {
      const albumIdMatch = href.match(/\/albums\/(\d+)/);
      if (albumIdMatch) {
        const albumId = albumIdMatch[1];
        // Try to get store name from subdomain
        const domainMatch = href.match(/https?:\/\/([^.]+)\./);
        const storeName = domainMatch ? domainMatch[1] : 'store';
        
        // Check for category hints in URL params
        const categoryMatch = href.match(/referrercate=(\d+)/);
        const categoryHint = categoryMatch ? `cat${categoryMatch[1]}` : 'album';
        
        return `${storeName.toUpperCase()}_${categoryHint}_${albumId}`;
      }
    }
    
    // For other URLs, clean and extract meaningful parts
    const urlWithoutQuery = href.split('?')[0];
    const urlParts = urlWithoutQuery.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    
    if (lastPart && lastPart.length > 3) {
      return lastPart
        .replace(/[_-]/g, ' ')
        .replace(/\.(html?|php|asp)$/i, '')
        .trim()
        .toUpperCase();
    }
    
    return `UNKNOWN_ALBUM_${Date.now()}`;
  }

  sanitizeAlbumTitle(title) {
    if (!title) return 'unknown_album';
    
    // Check if title contains URL parameters (malformed extraction)
    if (/\d+uid\d+issubcate/.test(title.toLowerCase())) {
      return `malformed_${Date.now()}`;
    }
    
    // Since cleanAndNormalizeTitle already handles most cleanup, 
    // we just need to convert to filesystem-safe format
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/-+/g, '_') // Replace hyphens with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 60); // Slightly longer limit for better readability
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

  isInvalidAlbumUrl(url) {
    const urlLower = url.toLowerCase();
    
    // Chinese regulatory and legal sites
    if (urlLower.includes('beian.gov.cn') || 
        urlLower.includes('miit.gov.cn') ||
        urlLower.includes('mps.gov.cn')) {
      return true;
    }
    
    // Common legal/privacy/regulatory pages
    const invalidPages = [
      'privacy', 'policy', 'terms', 'legal', 'disclaimer',
      'copyright', 'dmca', 'contact', 'about', 'help',
      'support', 'faq', 'register', 'login', 'signup',
      'admin', 'account', 'profile', 'settings'
    ];
    
    for (const invalidPage of invalidPages) {
      if (urlLower.includes(`/${invalidPage}`) || urlLower.includes(`${invalidPage}.`)) {
        return true;
      }
    }
    
    return false;
  }

  isInvalidAlbumTitle(title, url = '') {
    if (!title || typeof title !== 'string') return true;
    
    const titleLower = title.toLowerCase().trim();
    const urlLower = url.toLowerCase();
    
    // Chinese regulatory text patterns
    const chineseRegulatory = [
      '浙公网安备', '33010502006611', 'icp', '备案号',
      '网安备', '公网安备', '互联网', '信息服务'
    ];
    
    for (const pattern of chineseRegulatory) {
      if (titleLower.includes(pattern)) {
        return true;
      }
    }
    
    // Generic invalid titles
    const invalidTitles = [
      'privacy policy', 'terms of service', 'copyright',
      'legal notice', 'disclaimer', 'contact us',
      'about us', 'help', 'faq', 'support'
    ];
    
    for (const invalid of invalidTitles) {
      if (titleLower.includes(invalid)) {
        return true;
      }
    }
    
    // Check for pure numeric titles (likely IDs)
    if (/^\d+$/.test(titleLower)) {
      return true;
    }
    
    // Check if title is too short or generic
    if (titleLower.length < 3 || 
        titleLower === 'image' || titleLower === 'photo' ||
        titleLower === 'picture' || titleLower === 'img') {
      return true;
    }
    
    return false;
  }

  async findEmptyAlbumFolders(categorySlug) {
    try {
      const categoryDir = path.join(CONFIG.paths.downloads, categorySlug);
      
      // Check if category directory exists
      if (!(await fs.pathExists(categoryDir))) {
        this.logger.info(`Category directory does not exist: ${categoryDir}`);
        return [];
      }

      const emptyFolders = [];
      const entries = await fs.readdir(categoryDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const albumPath = path.join(categoryDir, entry.name);
          
          try {
            // Check if folder is empty or contains only non-image files
            const albumContents = await fs.readdir(albumPath);
            const imageFiles = albumContents.filter(file => {
              const ext = path.extname(file).toLowerCase();
              return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
            });

            if (imageFiles.length === 0) {
              emptyFolders.push({
                folderName: entry.name,
                path: albumPath,
                hasFiles: albumContents.length > 0,
                files: albumContents
              });
            }
          } catch (error) {
            this.logger.warn(`Error reading album folder ${entry.name}: ${error.message}`);
          }
        }
      }

      return emptyFolders;
    } catch (error) {
      this.logger.error(`Error finding empty album folders: ${error.message}`);
      return [];
    }
  }

  async cleanupEmptyFolders(categorySlug) {
    try {
      const emptyFolders = await this.findEmptyAlbumFolders(categorySlug);
      
      if (emptyFolders.length === 0) {
        this.logger.info('No empty folders found to cleanup');
        return 0;
      }

      let cleanedCount = 0;
      for (const folder of emptyFolders) {
        try {
          await fs.remove(folder.path);
          this.logger.info(`Cleaned up empty folder: ${folder.folderName}`);
          cleanedCount++;
        } catch (error) {
          this.logger.error(`Failed to cleanup folder ${folder.folderName}: ${error.message}`);
        }
      }

      return cleanedCount;
    } catch (error) {
      this.logger.error(`Error during cleanup: ${error.message}`);
      return 0;
    }
  }

  async validateProductGallery(images, albumData) {
    try {
      this.logger.debug(`Starting validation for album "${albumData.title}" with ${images.length} images`);
      
      // Quick validation checks
      if (!images || images.length === 0) {
        this.logger.debug('Validation failed: No images found');
        return { isValid: false, reason: 'No images found' };
      }

      // Relax minimum image requirement - even single images can be valid products
      if (images.length < 1) {
        this.logger.debug('Validation failed: No images provided');
        return { isValid: false, reason: 'No images provided' };
      }

      // Check for sports-related patterns in album title - be more lenient
      const title = (albumData.title || '').toLowerCase();
      const sportsPatterns = [
        'jersey', 'kit', 'shirt', 'shorts', 'authentic', 'player', 'football', 'soccer',
        'home', 'away', 'third', 'gk', 'goalkeeper', 'training', 'retro', 'vintage',
        'jacket', 'tracksuit', 'hoodie', 'polo', 'real madrid', 'barcelona', 
        'manchester', 'liverpool', 'juventus', 'milan', 'inter', 'ajax', 'psv', 
        'feyenoord', 'arsenal', 'chelsea', 'national', 'brasil', 'argentina', 
        'england', 'spain', 'italy', 'germany', 'france', 'nike', 'adidas', 'puma'
      ];

      const titleHasSportsTerms = sportsPatterns.some(pattern => title.includes(pattern));
      this.logger.debug(`Title "${title}" has sports terms: ${titleHasSportsTerms}`);
      
      // Check image characteristics
      let highQualityImages = 0;
      let suspiciousImages = 0;
      let validProductImages = 0;
      const imageUrls = images.map(img => img.src.toLowerCase());

      for (const image of images) {
        const imageUrl = (image.src || '').toLowerCase();
        
        // Count high-quality images (likely product photos)
        if (this.isHighQualityProductImage(image, imageUrl)) {
          highQualityImages++;
        }
        
        // Count suspicious images (icons, backgrounds, etc.)
        if (this.isSuspiciousImage(imageUrl)) {
          suspiciousImages++;
          this.logger.debug(`Found suspicious image: ${imageUrl}`);
        } else {
          validProductImages++;
        }
      }

      // Calculate quality ratios
      const highQualityRatio = highQualityImages / images.length;
      const suspiciousRatio = suspiciousImages / images.length;
      const validProductRatio = validProductImages / images.length;

      this.logger.debug(`Image analysis - Total: ${images.length}, High quality: ${highQualityImages} (${Math.round(highQualityRatio * 100)}%), Suspicious: ${suspiciousImages} (${Math.round(suspiciousRatio * 100)}%), Valid: ${validProductImages}`);

      // More lenient validation logic
      
      // Only reject if almost all images are suspicious
      if (suspiciousRatio > 0.8) {
        this.logger.debug(`Validation failed: Too many suspicious images (${Math.round(suspiciousRatio * 100)}%)`);
        return { isValid: false, reason: `Too many suspicious images (${Math.round(suspiciousRatio * 100)}%)` };
      }

      // If album has sports terms in title, be more lenient with image quality
      if (titleHasSportsTerms) {
        this.logger.debug('Album has sports terms - applying lenient validation');
        if (validProductImages > 0) {
          this.logger.debug('Validation passed: Has sports terms and at least one valid image');
          return { 
            isValid: true, 
            reason: `Valid sports album: ${validProductImages} valid images, title contains sports terms`,
            stats: {
              totalImages: images.length,
              highQualityImages,
              suspiciousImages,
              validProductImages,
              uniqueImages: new Set(imageUrls).size,
              hasSportsTerms: titleHasSportsTerms,
              validationMode: 'lenient (sports terms)'
            }
          };
        }
      }

      // For albums without obvious sports terms, require better image quality
      if (!titleHasSportsTerms && highQualityRatio < 0.2 && validProductRatio < 0.5) {
        this.logger.debug(`Validation failed: No sports terms and low quality ratio (HQ: ${Math.round(highQualityRatio * 100)}%, Valid: ${Math.round(validProductRatio * 100)}%)`);
        return { isValid: false, reason: `Low quality non-sports content (HQ: ${Math.round(highQualityRatio * 100)}%, Valid: ${Math.round(validProductRatio * 100)}%)` };
      }

      // Check for duplicate URLs but be more lenient
      const uniqueUrls = new Set(imageUrls);
      const duplicateRatio = 1 - (uniqueUrls.size / images.length);
      if (duplicateRatio > 0.9) {  // Only reject if extremely high duplicate ratio
        this.logger.debug(`Validation failed: Too many duplicate images (${Math.round(duplicateRatio * 100)}%)`);
        return { isValid: false, reason: `Too many duplicate images (${Math.round(duplicateRatio * 100)}%)` };
      }

      // Default to valid if we reach here
      const reason = titleHasSportsTerms 
        ? `Valid sports gallery: ${highQualityImages} HQ, ${validProductImages} valid of ${images.length} total`
        : `Valid gallery: ${highQualityImages} HQ, ${validProductImages} valid of ${images.length} total`;
      
      this.logger.debug(`Validation passed: ${reason}`);
      
      return { 
        isValid: true, 
        reason: reason,
        stats: {
          totalImages: images.length,
          highQualityImages,
          suspiciousImages,
          validProductImages,
          uniqueImages: uniqueUrls.size,
          hasSportsTerms: titleHasSportsTerms,
          validationMode: titleHasSportsTerms ? 'lenient (sports)' : 'standard'
        }
      };

    } catch (error) {
      this.logger.error(`Error validating product gallery: ${error.message}`);
      this.logger.debug(`Validation error details: ${error.stack}`);
      return { isValid: true, reason: 'Validation error - allowing through' }; // Fail open
    }
  }

  isHighQualityProductImage(image, imageUrl) {
    // Check for high-resolution indicators
    const hasQualityIndicators = imageUrl.includes('_o') || // Yupoo original size
                               imageUrl.includes('large') ||
                               imageUrl.includes('high') ||
                               imageUrl.includes('master');
    
    // Check dimensions if available
    const width = parseInt(image.width) || 0;
    const height = parseInt(image.height) || 0;
    const hasGoodDimensions = (width > 200 && height > 200);

    // Check for product photo patterns
    const hasProductPatterns = imageUrl.includes('photo') ||
                              imageUrl.includes('product') ||
                              imageUrl.includes('item');

    return hasQualityIndicators || hasGoodDimensions || hasProductPatterns;
  }

  isSuspiciousImage(imageUrl) {
    const suspiciousPatterns = [
      'icon', 'logo', 'button', 'arrow', 'bg', 'background',
      'header', 'footer', 'nav', 'menu', 'placeholder',
      'spinner', 'loading', 'error', 'blank', 'empty',
      'policeicon', 'beian', 'gov.cn', // Chinese regulatory icons
      'website/4.', 'imgs/', 'static/' // Common Yupoo UI elements
    ];

    return suspiciousPatterns.some(pattern => imageUrl.includes(pattern));
  }

  isInvalidProductImage(src, $img) {
    const srcLower = src.toLowerCase();
    
    // Check dimensions - skip very small images (likely UI elements)
    const width = parseInt($img.attr('width')) || 0;
    const height = parseInt($img.attr('height')) || 0;
    
    // Be more lenient with size restrictions - only skip really tiny images
    if (width > 0 && height > 0 && (width < 50 || height < 50)) {
      this.logger.debug(`Skipping tiny image: ${width}x${height} - ${src}`);
      return true;
    }

    // Enhanced list of UI/system images to skip
    const invalidPatterns = [
      // UI icons and elements
      'icon', 'logo', 'button', 'arrow', 'bg', 'background',
      'header', 'footer', 'nav', 'menu', 'placeholder',
      'spinner', 'loading', 'error', 'blank', 'empty',
      'avatar', 'profile', 'user', 'account',
      
      // Chinese regulatory and system icons
      'policeicon', 'beian', 'gov.cn', 'miit.gov.cn', 'mps.gov.cn',
      'icp', '备案', '公网安备', '网安备',
      
      // Common Yupoo/website UI elements
      'website/', 'imgs/', 'static/', 'assets/', 'ui/',
      'sprite', 'toolbar', 'controls', 'play', 'pause',
      'share', 'social', 'facebook', 'twitter', 'wechat',
      
      // File system patterns that indicate UI
      '/4.29.1/', '/website/', '/common/', '/shared/',
      'policeIcon.png', 'icon.png', 'logo.png',
      
      // Very specific known UI files
      's.yupoo.com/website/', 'yupoo.com/website/',
      
      // Generic UI indicators
      'close', 'next', 'prev', 'zoom', 'fullscreen',
      'download', 'save', 'print', 'email',
      
      // Ad and tracking images
      'ad', 'ads', 'banner', 'promo', 'tracking',
      'analytics', 'pixel', 'beacon',
      
      // Thumbnail indicators that might not be full images
      'thumb_', '_thumb', 'thumbnail_', '_thumbnail',
      'preview_', '_preview', 'small_', '_small'
    ];

    // Check if URL contains any invalid patterns
    for (const pattern of invalidPatterns) {
      if (srcLower.includes(pattern.toLowerCase())) {
        this.logger.debug(`Skipping invalid image (${pattern}): ${src}`);
        return true;
      }
    }

    // Check file extension for non-image files
    const invalidExtensions = ['.gif', '.svg', '.ico', '.bmp'];
    for (const ext of invalidExtensions) {
      if (srcLower.endsWith(ext)) {
        this.logger.debug(`Skipping non-photo format (${ext}): ${src}`);
        return true;
      }
    }

    // Check for very specific filename patterns that indicate UI
    const filenamePatterns = [
      /icon\d*\.png$/i,
      /logo\d*\.(png|jpg)$/i,
      /button\d*\.png$/i,
      /\d+x\d+\.(png|jpg)$/i, // Likely dimension-named UI files
      /^(bg|background)\d*\./i,
      /police.*icon/i,
      /website.*icon/i
    ];

    for (const pattern of filenamePatterns) {
      if (pattern.test(srcLower)) {
        this.logger.debug(`Skipping UI file pattern: ${src}`);
        return true;
      }
    }

    // Check image class names for UI indicators
    const imgClass = ($img.attr('class') || '').toLowerCase();
    const uiClasses = ['icon', 'logo', 'button', 'ui', 'system', 'nav', 'header', 'footer'];
    for (const uiClass of uiClasses) {
      if (imgClass.includes(uiClass)) {
        this.logger.debug(`Skipping UI class image (${uiClass}): ${src}`);
        return true;
      }
    }

    // Check alt text for UI indicators
    const altText = ($img.attr('alt') || '').toLowerCase();
    const uiAltTexts = ['icon', 'logo', 'button', 'menu', 'nav', 'police', 'beian'];
    for (const uiAlt of uiAltTexts) {
      if (altText.includes(uiAlt)) {
        this.logger.debug(`Skipping UI alt text image (${uiAlt}): ${src}`);
        return true;
      }
    }

    return false; // Image appears to be valid
  }

  getHighQualityImageUrl(src) {
    // Convert Yupoo URLs to highest quality versions
    if (src.includes('photo.yupoo.com')) {
      // Handle multiple image formats and sizes
      let highQualitySrc = src
        // Try orig first (highest quality)
        .replace(/(\/small|\/medium|\/square|\/thumbnail|\/thumb)\.(jpg|jpeg|png|webp)$/i, '/orig.$2')
        .replace(/(\/mwebp)\.(jpg|jpeg|png|webp)$/i, '/orig.$2');
      
      // If no change, try raw (second highest)  
      if (highQualitySrc === src) {
        highQualitySrc = src
          .replace(/(\/small|\/medium|\/square|\/thumbnail|\/thumb)\.(jpg|jpeg|png|webp)$/i, '/raw.$2')
          .replace(/(\/mwebp)\.(jpg|jpeg|png|webp)$/i, '/raw.$2');
      }
      
      // If still no change, try max
      if (highQualitySrc === src) {
        highQualitySrc = src
          .replace(/(\/small|\/medium|\/square|\/thumbnail|\/thumb)\.(jpg|jpeg|png|webp)$/i, '/max.$2')
          .replace(/(\/mwebp)\.(jpg|jpeg|png|webp)$/i, '/max.$2');
      }
      
      // If still no change, try large
      if (highQualitySrc === src) {
        highQualitySrc = src
          .replace(/(\/small|\/medium|\/square|\/thumbnail|\/thumb)\.(jpg|jpeg|png|webp)$/i, '/large.$2')
          .replace(/(\/mwebp)\.(jpg|jpeg|png|webp)$/i, '/large.$2');
      }
      
      this.logger.debug(`Quality conversion: ${src} -> ${highQualitySrc}`);
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
          (url.includes('x.yupoo.com') && !url.includes('/albums/')) ||
          url.endsWith('/albums/') ||
          url.endsWith('/albums/?uid=1') ||
          // Filter out malformed URLs with query params as filenames
          /\d+uid\d+issubcate/.test(url)
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

      // For Yupoo albums, try direct image extraction first, then fallback to viewer approach
      if (url.includes('yupoo.com/albums/')) {
        this.logger.info('Yupoo album detected, trying direct image extraction first');
        const directImages = await this.extractDirectImages(url, options);
        
        if (directImages.length > 0) {
          this.logger.info(`Direct extraction successful: found ${directImages.length} images`);
          return directImages;
        } else {
          this.logger.warn('Direct extraction found no images, trying viewer approach as fallback');
          // Continue to viewer approach below
        }
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
        // Yupoo-specific selectors (prioritized first)
        '.showalbum__children img',
        '.album__children img', 
        '.image__children img',
        '.showalbum__children .image__wrap img',
        '.viewer__imgwrap img',
        '#album img',
        '.photo img',
        
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
      let totalChecked = 0;
      let totalFiltered = 0;
      
      this.logger.info(`Starting direct image extraction with ${imageSelectors.length} selectors`);
      
      for (const selector of imageSelectors) {
        const matchedElements = $(selector);
        this.logger.debug(`Selector "${selector}" matched ${matchedElements.length} elements`);
        
        if (matchedElements.length === 0) continue;
        $(selector).each((index, element) => {
          const $img = $(element);
          let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || $img.attr('data-lazy');
          
          totalChecked++;
          
          if (!src) {
            this.logger.debug(`No src found for image element in selector "${selector}"`);
            return;
          }
          
          // Convert relative URLs to absolute
          if (src.startsWith('//')) {
            src = 'https:' + src;
          } else if (src.startsWith('/')) {
            try {
              const urlObj = new URL(url);
              src = urlObj.origin + src;
            } catch (error) {
              this.logger.debug(`Failed to build absolute URL for: ${src}`);
              return;
            }
          } else if (!src.startsWith('http')) {
            // Try to handle relative URLs without leading slash
            try {
              const absoluteUrl = new URL(src, url);
              src = absoluteUrl.href;
            } catch (error) {
              this.logger.debug(`Skipping invalid URL: ${src}`);
              return;
            }
          }

          // Enhanced validation and filtering
          if (src.startsWith('http')) {
            // Skip invalid images using comprehensive filtering
            if (this.isInvalidProductImage(src, $img)) {
              totalFiltered++;
              this.logger.debug(`Filtered out invalid image: ${src}`);
              return;
            }

            // Convert to highest quality version (works with proper referrer)
            const finalSrc = this.getHighQualityImageUrl(src);
            
            const imageKey = this.getImageBaseKey(finalSrc);
            
            // Extract dimensions from image attributes
            const width = parseInt($img.attr('width')) || null;
            const height = parseInt($img.attr('height')) || null;
            
            // Only add if we haven't seen this image or if this is a higher quality version
            if (!foundImages.has(imageKey) || (!url.includes('yupoo.com') && this.isHigherQuality(finalSrc, foundImages.get(imageKey).src))) {
              const imageInfo = {
                src: finalSrc,
                originalSrc: src,
                alt: $img.attr('alt') || '',
                title: $img.attr('title') || '',
                class: $img.attr('class') || '',
                width: width,
                height: height,
                selector: selector,
                quality: this.getImageQuality(finalSrc)
              };
              
              foundImages.set(imageKey, imageInfo);
              this.logger.debug(`Added image: ${finalSrc} (${width}x${height}) from selector "${selector}"`);
            } else {
              this.logger.debug(`Duplicate or lower quality image skipped: ${finalSrc}`);
            }
          }
        });
      }

      // Convert Map to Array
      images.push(...Array.from(foundImages.values()));
      
      this.logger.info(`Image extraction summary: ${images.length} unique images found from ${totalChecked} total checked (${totalFiltered} filtered out)`);
      
      // Log details of found images for debugging
      if (images.length > 0) {
        this.logger.info(`First 3 images found:`);
        images.slice(0, 3).forEach((img, i) => {
          this.logger.info(`  ${i + 1}. ${img.src} (${img.width}x${img.height}, quality: ${img.quality}, selector: ${img.selector})`);
        });
      } else {
        this.logger.warn(`No images found despite checking ${totalChecked} elements. This might indicate:`)
        this.logger.warn(`  - Page structure has changed`)
        this.logger.warn(`  - Images are loaded dynamically with JavaScript`)
        this.logger.warn(`  - All images were filtered out as invalid`)
      }

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

      this.logger.info(`Direct extraction complete: ${images.length} potential images from ${url}`);
      return images;

    } catch (error) {
      this.logger.error(`Failed to extract direct images from ${url}: ${error.message}`);
      return [];
    }
  }

  async processAlbumImages(albumData, albumIndex, categorySlug, targetUrl, options = {}) {
    let albumDir = null;
    let folderCreated = false;
    const { isRetry = false } = options;
    
    try {
      this.logger.info(`Processing album ${albumIndex + 1}: "${albumData.title}"`);
      this.logger.info(`Album URL: ${albumData.url}`);

      // Extract images from this specific album BEFORE creating folder
      const images = await this.extractImagesFromPage(albumData.url, {
        referrer: targetUrl
      });

      if (images.length === 0) {
        this.logger.warn(`No images found in album: ${albumData.title}`);
        return { processed: 0, successful: 0 };
      }

      // Validate that this looks like a product gallery BEFORE creating folder
      const validationResult = await this.validateProductGallery(images, albumData);
      if (!validationResult.isValid) {
        this.logger.warn(`Album "${albumData.title}" failed content validation: ${validationResult.reason}`);
        this.logger.debug(`Validation details: ${JSON.stringify(validationResult.stats || {})}`);
        return { processed: 0, successful: 0 };
      }

      this.logger.info(`Found ${images.length} valid images in album: "${albumData.title}"`);
      this.logger.info(`Validation passed: ${validationResult.reason}`);
      
      // Debug: Log first few image URLs
      if (images.length > 0) {
        this.logger.info(`First 3 images to download:`);
        images.slice(0, 3).forEach((img, i) => {
          this.logger.info(`  ${i + 1}. ${img.src}`);
        });
      }
      
      // Only NOW create the album folder since we know we have valid content
      albumDir = path.join(CONFIG.paths.downloads, categorySlug, albumData.folderName);
      await fs.ensureDir(albumDir);
      folderCreated = true;
      
      this.logger.info(`Created album folder: ${albumData.folderName}`);

      let processedCount = 0;
      let successCount = 0;

      this.logger.info(`Starting download loop for ${images.length} images...`);

      for (const [imageIndex, imageData] of images.entries()) {
        const itemId = `${categorySlug}_${albumData.folderName}_img${imageIndex}`;
        
        // Skip if already processed (but not during retry operations)
        if (!isRetry && this.progressTracker.isItemProcessed(categorySlug, itemId)) {
          this.logger.debug(`Skipping already processed item: ${itemId}`);
          continue;
        }
        
        // During retry, log that we're reprocessing this item
        if (isRetry) {
          this.logger.debug(`Retrying item: ${itemId}`);
          // Clear any previous failed status for this item during retry
          this.progressTracker.clearItemStatus(categorySlug, itemId);
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
      
      // Clean up empty folder if it was created but no images were successfully downloaded
      if (folderCreated && albumDir) {
        try {
          // Check if the folder is empty or contains only non-image files
          const contents = await fs.readdir(albumDir);
          const imageFiles = contents.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
          });
          
          if (imageFiles.length === 0) {
            await fs.remove(albumDir);
            this.logger.info(`Cleaned up empty folder after error: ${albumData.folderName}`);
          }
        } catch (cleanupError) {
          this.logger.warn(`Failed to cleanup empty folder: ${cleanupError.message}`);
        }
      }
      
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

      // Extract album links from all category pages (multi-page support)
      const albumLinks = await this.extractAlbumLinksFromMultiPageCategory(categoryUrl, {
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

      // Extract album links from all category pages (multi-page support)
      console.log('🔍 Discovering albums across all pages...');
      const albumLinks = await this.extractAlbumLinksFromMultiPageCategory(categoryUrl, {
        referrer: categoryUrl
      });

      if (albumLinks.length === 0) {
        console.log('❌ No albums found in this category.');
        return { processed: 0, successful: 0 };
      }

      // Filter out non-album URLs (navigation links, etc.) with detailed logging
      const validAlbums = [];
      const filteredAlbums = [];
      
      for (const album of albumLinks) {
        const url = album.url;
        const title = album.title || '';
        
        // Detailed validation with logging
        const validationChecks = {
          hasAlbumsPath: url.includes('/albums/'),
          hasUidParam: url.includes('uid=1'),
          hasSubCateParam: url.includes('isSubCate=false'),
          notBeianGov: !url.includes('beian.gov.cn'),
          notUndefinedDomain: !url.includes('undefined.x.yupoo.com'),
          notRootYupoo: !url.startsWith('https://x.yupoo.com'),
          notGallery: !url.includes('gallery'),
          notTab: !url.includes('?tab='),
          notMalformedTitle: !(/\d+uid\d+issubcate/.test(title.toLowerCase()))
        };
        
        const isValid = Object.values(validationChecks).every(check => check);
        
        if (isValid) {
          validAlbums.push(album);
        } else {
          const failedChecks = Object.entries(validationChecks)
            .filter(([key, passed]) => !passed)
            .map(([key, passed]) => key);
          
          filteredAlbums.push({
            title: album.title,
            url: album.url,
            failedChecks: failedChecks
          });
        }
      }

      console.log(`✅ Found ${validAlbums.length} valid albums to process (filtered from ${albumLinks.length} total)`);
      
      if (filteredAlbums.length > 0) {
        console.log(`\n⚠️  Filtered out ${filteredAlbums.length} albums:`);
        filteredAlbums.forEach((filtered, idx) => {
          console.log(`${idx + 1}. "${filtered.title}" - Failed: ${filtered.failedChecks.join(', ')}`);
          if (idx < 3) console.log(`   URL: ${filtered.url}`); // Show URL for first few
        });
        console.log('');
      }
      
      // Display valid albums
      validAlbums.forEach((album, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${album.title} -> ${album.folderName}`);
      });
      console.log('');

      // Initialize category progress
      this.progressTracker.startCategory(categorySlug, 0);

      let totalProcessed = 0;
      let totalSuccessful = 0;

      // Process each valid album with enhanced error recovery
      let failedAlbums = [];
      let consecutiveFailures = 0;
      const maxConsecutiveFailures = 5;
      
      for (const [albumIndex, albumData] of validAlbums.entries()) {
        let albumResult = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        console.log(`\n📸 Processing album ${albumIndex + 1}/${validAlbums.length}: "${albumData.title}"`);
        console.log(`🔗 URL: ${albumData.url}`);
        
        while (attempts < maxAttempts && !albumResult) {
          attempts++;
          
          try {
            if (attempts > 1) {
              console.log(`🔄 Retry attempt ${attempts}/${maxAttempts} for "${albumData.title}"`);
            }
            
            albumResult = await this.processAlbumImages(albumData, albumIndex, categorySlug, categoryUrl);
            
            if (albumResult.successful > 0) {
              consecutiveFailures = 0;
              totalProcessed += albumResult.processed;
              totalSuccessful += albumResult.successful;
              console.log(`✅ Album complete: ${albumResult.successful}/${albumResult.processed} images`);
            } else if (albumResult.processed === 0) {
              throw new Error('No images found or processed');
            }

          } catch (error) {
            this.logger.error(`Attempt ${attempts} failed for album "${albumData.title}": ${error.message}`);
            
            if (attempts < maxAttempts) {
              const retryDelay = Math.min(5000 * attempts, 15000); // Exponential backoff: 5s, 10s, 15s
              console.log(`⏳ Waiting ${retryDelay/1000}s before retry...`);
              await this.sleep(retryDelay);
            } else {
              consecutiveFailures++;
              failedAlbums.push({
                index: albumIndex,
                title: albumData.title,
                url: albumData.url,
                error: error.message
              });
              
              console.log(`❌ Failed to process album "${albumData.title}" after ${maxAttempts} attempts: ${error.message}`);
              
              // If we have too many consecutive failures, it might be a systemic issue
              if (consecutiveFailures >= maxConsecutiveFailures) {
                console.log(`\n⚠️  ${consecutiveFailures} consecutive failures detected. This might indicate a systemic issue.`);
                console.log('🤔 Suggestions:');
                console.log('   - Check your internet connection');
                console.log('   - Verify the website is accessible');
                console.log('   - Check if your IP has been rate-limited');
                console.log('   - Wait a few minutes and try resuming');
                
                // Ask if user wants to continue or abort
                console.log('\n📊 Current progress:');
                console.log(`   Processed: ${albumIndex + 1}/${validAlbums.length} albums`);
                console.log(`   Success rate: ${totalSuccessful > 0 ? Math.round((totalSuccessful / totalProcessed) * 100) : 0}%`);
                console.log('\nContinuing with remaining albums...\n');
                
                // Add extra delay before continuing
                await this.sleep(30000); // 30 second pause
                consecutiveFailures = 0; // Reset counter
              }
            }
          }
        }

        // Progress update and delay between albums
        if (albumIndex < validAlbums.length - 1) {
          const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenCategories);
          console.log(`⏳ Waiting ${Math.round(delay/1000)}s before next album...`);
          await this.sleep(delay);
        }

        // Periodic progress report
        if ((albumIndex + 1) % 10 === 0) {
          const processed = albumIndex + 1;
          const remaining = validAlbums.length - processed;
          const successRate = totalProcessed > 0 ? Math.round((totalSuccessful / totalProcessed) * 100) : 0;
          
          console.log(`\n📊 Progress checkpoint: ${processed}/${validAlbums.length} albums processed`);
          console.log(`   Success rate: ${successRate}% (${totalSuccessful}/${totalProcessed} images)`);
          console.log(`   Failed albums: ${failedAlbums.length}`);
          console.log(`   Remaining: ${remaining} albums\n`);
        }
      }
      
      // Final report on failed albums
      if (failedAlbums.length > 0) {
        console.log(`\n⚠️  ${failedAlbums.length} albums failed to process:`);
        failedAlbums.forEach((failed, idx) => {
          console.log(`${idx + 1}. "${failed.title}" - ${failed.error}`);
        });
        console.log('\n💡 You can retry failed albums individually using:');
        failedAlbums.slice(0, 3).forEach(failed => {
          console.log(`   node src/scraper.js ${categorySlug} --album "${failed.url}"`);
        });
        if (failedAlbums.length > 3) {
          console.log(`   ... and ${failedAlbums.length - 3} more`);
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

  async retryEmptyAlbums(categorySlug, categoryUrl) {
    try {
      console.log(`\n🔄 Retrying empty albums for category: ${categorySlug}`);
      console.log(`📂 Category URL: ${categoryUrl}`);
      console.log('');

      // Find empty album folders
      const emptyFolders = await this.findEmptyAlbumFolders(categorySlug);
      
      if (emptyFolders.length === 0) {
        console.log('✅ No empty album folders found. All albums appear to have been processed successfully!');
        return { processed: 0, successful: 0, retried: 0 };
      }

      console.log(`🔍 Found ${emptyFolders.length} empty album folders to retry:`);
      emptyFolders.forEach((folder, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${folder.folderName}${folder.hasFiles ? ' (has non-image files)' : ' (completely empty)'}`);
      });
      console.log('');

      // Try to load the original album list to get URLs
      const albumListPath = path.join(CONFIG.paths.metadata, `${categorySlug}_albums.json`);
      let savedAlbums = [];
      
      try {
        savedAlbums = await fs.readJson(albumListPath);
        console.log(`📋 Loaded ${savedAlbums.length} albums from saved list`);
      } catch (error) {
        console.log(`⚠️  No saved album list found. Will need to rediscover albums from category URL.`);
        
        // If no saved list, discover albums from the category URL
        const albumLinks = await this.extractAlbumLinksFromMultiPageCategory(categoryUrl, {
          referrer: categoryUrl
        });
        
        savedAlbums = albumLinks;
        console.log(`🔍 Discovered ${savedAlbums.length} albums from category`);
      }

      // Match empty folders with album data
      const albumsToRetry = [];
      for (const emptyFolder of emptyFolders) {
        const matchedAlbum = savedAlbums.find(album => 
          album.folderName === emptyFolder.folderName ||
          this.sanitizeAlbumTitle(album.title) === emptyFolder.folderName
        );
        
        if (matchedAlbum) {
          albumsToRetry.push({
            ...matchedAlbum,
            emptyFolderPath: emptyFolder.path,
            hadFiles: emptyFolder.hasFiles
          });
        } else {
          console.log(`⚠️  Could not find matching album data for folder: ${emptyFolder.folderName}`);
        }
      }

      if (albumsToRetry.length === 0) {
        console.log('❌ No matching album data found for empty folders. Cannot retry.');
        return { processed: 0, successful: 0, retried: 0 };
      }

      console.log(`🚀 Retrying ${albumsToRetry.length} empty albums...`);
      console.log('');

      // Clean up empty folders first
      console.log('🧹 Cleaning up empty folders...');
      const cleanedCount = await this.cleanupEmptyFolders(categorySlug);
      console.log(`✅ Cleaned up ${cleanedCount} empty folders`);
      console.log('');

      // Initialize progress tracking
      this.progressTracker.startCategory(`${categorySlug}_retry`, 0);

      let totalProcessed = 0;
      let totalSuccessful = 0;
      let retriedCount = 0;

      // Process each empty album
      for (const [albumIndex, albumData] of albumsToRetry.entries()) {
        console.log(`\n📸 Retrying album ${albumIndex + 1}/${albumsToRetry.length}: "${albumData.title}"`);
        console.log(`🔗 URL: ${albumData.url}`);
        console.log(`📁 Folder: ${albumData.folderName}`);
        
        try {
          const result = await this.processAlbumImages(albumData, albumIndex, categorySlug, categoryUrl, { isRetry: true });
          
          totalProcessed += result.processed;
          totalSuccessful += result.successful;
          retriedCount++;
          
          if (result.successful > 0) {
            console.log(`✅ Retry successful: ${result.successful}/${result.processed} images`);
          } else {
            console.log(`⚠️  Retry resulted in no images: ${result.processed} attempted`);
          }

        } catch (error) {
          this.logger.error(`Failed to retry album "${albumData.title}": ${error.message}`);
          console.log(`❌ Retry failed: ${error.message}`);
        }

        // Add delay between retries
        if (albumIndex < albumsToRetry.length - 1) {
          const delay = this.getRandomDelay(CONFIG.scraping.delays.betweenCategories);
          console.log(`⏳ Waiting ${Math.round(delay/1000)}s before next retry...`);
          await this.sleep(delay);
        }
      }

      // Mark as complete and finalize
      this.progressTracker.completeCategory(`${categorySlug}_retry`);
      const summary = await this.progressTracker.finalize();
      
      console.log('\n🎉 Empty Album Retry Complete!');
      console.log(`📂 Category: ${categorySlug}`);
      console.log(`🔄 Albums retried: ${retriedCount}`);
      console.log(`📸 Total images processed: ${totalProcessed}`);
      console.log(`✅ Successful: ${totalSuccessful}`);
      console.log(`📊 Success Rate: ${summary.successRate}`);
      console.log(`💾 Files saved to: scraper/downloads/${categorySlug}/`);

      return { processed: totalProcessed, successful: totalSuccessful, retried: retriedCount };

    } catch (error) {
      this.logger.error(`Failed to retry empty albums: ${error.message}`);
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
  node scraper.js --list                                List all categories
  node scraper.js --progress                            Show current progress
  node scraper.js [category] [category_url]             Discover albums (Step 1)
  node scraper.js [category] --album [album_url]        Scrape individual album (Step 2)
  node scraper.js [category] --bulk [category_url]      Bulk process all albums (One-Step)
  node scraper.js [category] --retry-empty [category_url] Retry only empty album folders

💡 Workflows:

  Two-Step Workflow (Manual):
  1. node scraper.js caf "https://wavesoccer.x.yupoo.com/categories/4667651"
  2. node scraper.js caf --album "https://wavesoccer.x.yupoo.com/albums/200353962?uid=1"
  
  One-Step Workflow (Bulk):
  node scraper.js afc --bulk "https://wavesoccer.x.yupoo.com/categories/334305"
  
  Retry Failed Albums:
  node scraper.js national_retro --retry-empty "https://wavesoccer.x.yupoo.com/categories/334393"

🎯 Benefits:
  - Two-Step: Respectful to servers, manual control
  - Bulk: Efficient processing of entire categories
  - Retry: Only processes albums that resulted in empty folders
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
        } else if (secondArg === '--retry-empty' && thirdArg) {
          // Handle retry empty albums mode
          await scraper.initialize();
          await scraper.retryEmptyAlbums(command, thirdArg);
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