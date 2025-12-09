import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from '../config.js';

export class ProgressTracker {
  constructor(logger) {
    this.logger = logger;
    this.progress = {
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      categories: {},
      totalProcessed: 0,
      totalFailed: 0,
      totalSuccess: 0
    };
    this.failed = [];
    this.progressFile = path.join(CONFIG.paths.metadata, CONFIG.progress.progressFile);
    this.failedFile = path.join(CONFIG.paths.metadata, CONFIG.progress.failedFile);
  }

  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}`;
  }

  async initialize() {
    // Ensure metadata directory exists
    await fs.ensureDir(CONFIG.paths.metadata);

    // Load existing progress if resume is enabled
    if (CONFIG.progress.resumeFromLast) {
      await this.loadProgress();
    }

    this.logger.info(`Progress tracker initialized - Session ID: ${this.progress.sessionId}`);
  }

  async loadProgress() {
    try {
      if (await fs.pathExists(this.progressFile)) {
        const savedProgress = await fs.readJson(this.progressFile);
        // Merge with current progress, keeping session ID
        this.progress = {
          ...savedProgress,
          sessionId: this.progress.sessionId,
          resumedFrom: savedProgress.sessionId,
          resumeTime: new Date().toISOString()
        };
        this.logger.info(`Resumed from previous session: ${savedProgress.sessionId}`);
      }

      if (await fs.pathExists(this.failedFile)) {
        this.failed = await fs.readJson(this.failedFile);
        this.logger.info(`Loaded ${this.failed.length} failed items from previous session`);
      }
    } catch (error) {
      this.logger.error(`Failed to load progress: ${error.message}`);
    }
  }

  async saveProgress() {
    try {
      await fs.writeJson(this.progressFile, this.progress, { spaces: 2 });
      if (this.failed.length > 0) {
        await fs.writeJson(this.failedFile, this.failed, { spaces: 2 });
      }
    } catch (error) {
      this.logger.error(`Failed to save progress: ${error.message}`);
    }
  }

  startCategory(categoryId, totalItems = 0) {
    if (!this.progress.categories[categoryId]) {
      this.progress.categories[categoryId] = {
        startTime: new Date().toISOString(),
        totalItems,
        processed: 0,
        successful: 0,
        failed: 0,
        status: 'in_progress',
        items: {}
      };
    } else {
      // Resuming category
      this.progress.categories[categoryId].resumeTime = new Date().toISOString();
      this.progress.categories[categoryId].status = 'in_progress';
    }
    
    this.logger.logCategoryStart(categoryId);
    return this.progress.categories[categoryId];
  }

  completeCategory(categoryId) {
    if (this.progress.categories[categoryId]) {
      this.progress.categories[categoryId].endTime = new Date().toISOString();
      this.progress.categories[categoryId].status = 'completed';
      
      const stats = this.progress.categories[categoryId];
      this.logger.logCategoryComplete(categoryId, {
        processed: stats.processed,
        successful: stats.successful,
        failed: stats.failed
      });
    }
  }

  markItemProcessed(categoryId, itemId, success = true, metadata = {}) {
    const category = this.progress.categories[categoryId];
    if (!category) return;

    category.processed++;
    this.progress.totalProcessed++;

    if (success) {
      category.successful++;
      this.progress.totalSuccess++;
      category.items[itemId] = {
        status: 'success',
        timestamp: new Date().toISOString(),
        ...metadata
      };
    } else {
      category.failed++;
      this.progress.totalFailed++;
      category.items[itemId] = {
        status: 'failed',
        timestamp: new Date().toISOString(),
        error: metadata.error || 'Unknown error',
        ...metadata
      };

      // Add to failed list for retry later
      this.failed.push({
        categoryId,
        itemId,
        timestamp: new Date().toISOString(),
        error: metadata.error || 'Unknown error',
        metadata
      });
    }

    // Auto-save progress periodically
    if (category.processed % CONFIG.progress.saveInterval === 0) {
      this.saveProgress();
    }

    // Log progress
    this.logger.logProgress(category.processed, category.totalItems, categoryId);
  }

  isItemProcessed(categoryId, itemId) {
    const category = this.progress.categories[categoryId];
    if (!category) return false;
    
    const item = category.items[itemId];
    return item && item.status === 'success';
  }

  getItemsToRetry() {
    return this.failed.filter(item => {
      // Only retry items that failed less than maxRetries times
      const itemFailures = this.failed.filter(f => 
        f.categoryId === item.categoryId && f.itemId === item.itemId
      );
      return itemFailures.length < CONFIG.scraping.maxRetries;
    });
  }

  clearFailedItem(categoryId, itemId) {
    this.failed = this.failed.filter(item => 
      !(item.categoryId === categoryId && item.itemId === itemId)
    );
  }

  getProgressSummary() {
    const summary = {
      sessionId: this.progress.sessionId,
      startTime: this.progress.startTime,
      totalCategories: Object.keys(this.progress.categories).length,
      completedCategories: Object.values(this.progress.categories).filter(c => c.status === 'completed').length,
      totalProcessed: this.progress.totalProcessed,
      totalSuccess: this.progress.totalSuccess,
      totalFailed: this.progress.totalFailed,
      successRate: this.progress.totalProcessed > 0 ? 
        ((this.progress.totalSuccess / this.progress.totalProcessed) * 100).toFixed(2) + '%' : '0%'
    };

    // Category breakdown
    summary.categories = Object.entries(this.progress.categories).map(([id, category]) => ({
      id,
      status: category.status,
      processed: category.processed,
      successful: category.successful,
      failed: category.failed,
      totalItems: category.totalItems,
      progress: category.totalItems > 0 ? 
        ((category.processed / category.totalItems) * 100).toFixed(2) + '%' : '0%'
    }));

    return summary;
  }

  async generateReport() {
    const summary = this.getProgressSummary();
    const reportPath = path.join(CONFIG.paths.logs, `report-${this.progress.sessionId}.json`);
    
    try {
      await fs.writeJson(reportPath, summary, { spaces: 2 });
      this.logger.info(`Progress report saved: ${reportPath}`);
      return reportPath;
    } catch (error) {
      this.logger.error(`Failed to generate report: ${error.message}`);
      throw error;
    }
  }

  async finalize() {
    this.progress.endTime = new Date().toISOString();
    this.progress.duration = new Date(this.progress.endTime) - new Date(this.progress.startTime);
    
    await this.saveProgress();
    await this.generateReport();
    
    const summary = this.getProgressSummary();
    this.logger.info('=== SCRAPING SESSION COMPLETED ===', summary);
    
    return summary;
  }
}

export default ProgressTracker;