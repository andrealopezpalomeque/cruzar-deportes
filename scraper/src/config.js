import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export const CONFIG = {
  // Paths
  paths: {
    root: projectRoot,
    data: path.join(projectRoot, 'data'),
    downloads: path.join(projectRoot, 'downloads'),
    logs: path.join(projectRoot, 'logs'),
    temp: path.join(projectRoot, 'downloads', 'temp'),
    metadata: path.join(projectRoot, 'data', 'scraped_metadata'),
    categories: path.join(projectRoot, 'data', 'categories.json')
  },

  // Scraping behavior
  scraping: {
    delays: {
      betweenRequests: 2000,      // 2 seconds minimum
      betweenCategories: 5000,    // 5 seconds between categories
      betweenPages: 3000,         // 3 seconds between pagination requests
      onError: 10000,             // 10 seconds on error
      randomVariation: 1000       // ±1 second random variation
    },
    maxRetries: 3,
    concurrency: 1,               // One request at a time
    timeout: 30000,               // 30 seconds timeout
    respectRobotsTxt: true,
    pagination: {
      enabled: true,              // Enable multi-page category scraping
      maxPagesPerCategory: 50,    // Maximum pages to scrape per category
      pageDetectionTimeout: 5000, // Timeout for detecting next page
      autoDetectPages: true,      // Auto-detect page count vs manual iteration
      pagePatterns: [             // URL patterns for detecting pages
        '?page=',
        '&page=',
        '/page/',
        '?p=',
        '&p='
      ]
    }
  },

  // Request headers and anti-detection
  request: {
    userAgents: [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
    ],
    defaultHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    },
    imageHeaders: {
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  },

  // Image processing
  images: {
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    minFileSize: 1024, // 1KB
    quality: 90,
    resize: {
      maxWidth: 2000,
      maxHeight: 2000,
      fit: 'inside',
      withoutEnlargement: true
    }
  },

  // File naming
  naming: {
    pattern: '{category}_{team}_{product}_{variant}_{timestamp}',
    sanitizeChars: /[^a-zA-Z0-9_-]/g,
    maxLength: 100
  },

  // Logging
  logging: {
    level: 'info',
    format: 'combined',
    maxFiles: 30,
    maxSize: '10m',
    datePattern: 'YYYY-MM-DD'
  },

  // Categories to process (will be loaded from categories.json)
  categories: {},

  // Progress tracking
  progress: {
    saveInterval: 10, // Save progress every 10 items
    resumeFromLast: true,
    progressFile: 'download_progress.json',
    failedFile: 'failed_downloads.json'
  }
};

export default CONFIG;