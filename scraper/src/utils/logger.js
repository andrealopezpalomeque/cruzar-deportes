import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';
import { CONFIG } from '../config.js';

class Logger {
  constructor() {
    this.logger = null;
    this.initialize();
  }

  async initialize() {
    // Ensure logs directory exists
    await fs.ensureDir(CONFIG.paths.logs);

    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    );

    this.logger = winston.createLogger({
      level: CONFIG.logging.level,
      format: logFormat,
      transports: [
        // Console output
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),

        // Main log file
        new winston.transports.File({
          filename: path.join(CONFIG.paths.logs, 'scraper.log'),
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          format: logFormat
        }),

        // Error log file
        new winston.transports.File({
          filename: path.join(CONFIG.paths.logs, 'errors.log'),
          level: 'error',
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 3,
          format: logFormat
        }),

        // Daily rotating file
        new winston.transports.File({
          filename: path.join(CONFIG.paths.logs, `scraper-${this.getDateString()}.log`),
          format: logFormat
        })
      ],
      // Handle uncaught exceptions and unhandled rejections
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(CONFIG.paths.logs, 'exceptions.log')
        })
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join(CONFIG.paths.logs, 'rejections.log')
        })
      ]
    });

    this.logger.info('Logger initialized successfully');
  }

  getDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  info(message, meta = {}) {
    if (this.logger) {
      this.logger.info(message, meta);
    } else {
      console.log(`[INFO] ${message}`, meta);
    }
  }

  error(message, meta = {}) {
    if (this.logger) {
      this.logger.error(message, meta);
    } else {
      console.error(`[ERROR] ${message}`, meta);
    }
  }

  warn(message, meta = {}) {
    if (this.logger) {
      this.logger.warn(message, meta);
    } else {
      console.warn(`[WARN] ${message}`, meta);
    }
  }

  debug(message, meta = {}) {
    if (this.logger) {
      this.logger.debug(message, meta);
    } else {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }

  logScrapingSession(sessionInfo) {
    this.info('=== SCRAPING SESSION STARTED ===', sessionInfo);
  }

  logCategoryStart(category) {
    this.info(`Starting category: ${category}`, { category });
  }

  logCategoryComplete(category, stats) {
    this.info(`Completed category: ${category}`, { category, ...stats });
  }

  logDownloadSuccess(filename, url) {
    this.info(`Downloaded: ${filename}`, { filename, url });
  }

  logDownloadFailed(filename, url, error) {
    this.error(`Download failed: ${filename}`, { 
      filename, 
      url, 
      error: error.message,
      stack: error.stack 
    });
  }

  logProgress(current, total, category) {
    const percentage = ((current / total) * 100).toFixed(1);
    this.info(`Progress: ${current}/${total} (${percentage}%) - ${category}`);
  }

  async createSessionLog(sessionId) {
    const sessionLogPath = path.join(CONFIG.paths.logs, `session-${sessionId}.log`);
    
    // Create session-specific logger
    const sessionLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: sessionLogPath
        })
      ]
    });

    return sessionLogger;
  }

  async cleanOldLogs(daysToKeep = 30) {
    try {
      const files = await fs.readdir(CONFIG.paths.logs);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds

      for (const file of files) {
        const filePath = path.join(CONFIG.paths.logs, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.remove(filePath);
          this.info(`Cleaned old log file: ${file}`);
        }
      }
    } catch (error) {
      this.error(`Failed to clean old logs: ${error.message}`);
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
export { Logger };