// Performance utilities for monitoring and optimization
export const performance = {
  // Measure execution time
  time: (() => {
    const timers = new Map();
    
    return {
      start(label = 'default') {
        timers.set(label, {
          start: window.performance.now(),
          end: null,
          duration: null
        });
      },

      end(label = 'default') {
        const timer = timers.get(label);
        if (!timer) {
          console.warn(`Timer "${label}" not found`);
          return null;
        }

        timer.end = window.performance.now();
        timer.duration = timer.end - timer.start;
        
        console.log(`⏱️ ${label}: ${timer.duration.toFixed(2)}ms`);
        return timer.duration;
      },

      get(label = 'default') {
        const timer = timers.get(label);
        if (!timer) return null;
        
        if (timer.end === null) {
          timer.end = window.performance.now();
          timer.duration = timer.end - timer.start;
        }
        
        return timer.duration;
      },

      clear(label) {
        if (label) {
          timers.delete(label);
        } else {
          timers.clear();
        }
      },

      getAll() {
        const results = {};
        for (const [label, timer] of timers) {
          results[label] = timer.duration || (window.performance.now() - timer.start);
        }
        return results;
      }
    };
  })(),

  // Memory usage monitoring
  memory: {
    getUsage() {
      if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        return {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
          usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100) // %
        };
      }
      return null;
    },

    monitor(interval = 5000, callback) {
      if (!this.getUsage()) {
        console.warn('Memory monitoring not available');
        return null;
      }

      const intervalId = setInterval(() => {
        const usage = this.getUsage();
        callback(usage);
      }, interval);

      return intervalId;
    },

    stopMonitoring(intervalId) {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  },

  // FPS monitoring
  fps: (() => {
    let frames = 0;
    let startTime = 0;
    let currentFPS = 0;
    let isMonitoring = false;
    let callbacks = [];

    const tick = () => {
      frames++;
      const now = window.performance.now();
      
      if (now >= startTime + 1000) {
        currentFPS = Math.round((frames * 1000) / (now - startTime));
        callbacks.forEach(callback => callback(currentFPS));
        
        frames = 0;
        startTime = now;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(tick);
      }
    };

    return {
      start(callback) {
        if (callback && typeof callback === 'function') {
          callbacks.push(callback);
        }
        
        if (!isMonitoring) {
          isMonitoring = true;
          startTime = window.performance.now();
          frames = 0;
          requestAnimationFrame(tick);
        }
      },

      stop(callback) {
        if (callback) {
          const index = callbacks.indexOf(callback);
          if (index > -1) {
            callbacks.splice(index, 1);
          }
        }
        
        if (callbacks.length === 0) {
          isMonitoring = false;
        }
      },

      getCurrent() {
        return currentFPS;
      }
    };
  })(),

  // Navigation timing
  navigation: {
    getMetrics() {
      if (!window.performance || !window.performance.timing) {
        return null;
      }

      const timing = window.performance.timing;
      const navigation = window.performance.navigation;
      
      return {
        // Page load times
        domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
        connect: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        processing: timing.domComplete - timing.domLoading,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        load: timing.loadEventEnd - timing.loadEventStart,
        
        // Total times
        totalTime: timing.loadEventEnd - timing.navigationStart,
        
        // Navigation info
        type: navigation.type,
        redirectCount: navigation.redirectCount
      };
    },

    getReadableMetrics() {
      const metrics = this.getMetrics();
      if (!metrics) return null;

      const types = {
        0: 'Navigate',
        1: 'Reload',
        2: 'Back/Forward',
        255: 'Unknown'
      };

      return {
        ...metrics,
        typeText: types[metrics.type] || 'Unknown',
        summary: `Total: ${metrics.totalTime}ms, DOM: ${metrics.processing}ms`
      };
    }
  },

  // Resource timing
  resources: {
    getMetrics() {
      if (!window.performance || !window.performance.getEntriesByType) {
        return [];
      }

      return window.performance.getEntriesByType('resource').map(entry => ({
        name: entry.name,
        type: this.getResourceType(entry.name),
        size: entry.transferSize || 0,
        duration: Math.round(entry.duration),
        startTime: Math.round(entry.startTime),
        endTime: Math.round(entry.startTime + entry.duration)
      }));
    },

    getResourceType(url) {
      const extension = url.split('.').pop().toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
      if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) return 'script';
      if (['css', 'scss', 'sass', 'less'].includes(extension)) return 'stylesheet';
      if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension)) return 'font';
      if (['html', 'htm'].includes(extension)) return 'document';
      if (['json', 'xml'].includes(extension)) return 'xhr';
      
      return 'other';
    },

    getSummary() {
      const metrics = this.getMetrics();
      const summary = {
        total: metrics.length,
        totalSize: 0,
        totalDuration: 0,
        byType: {}
      };

      metrics.forEach(resource => {
        summary.totalSize += resource.size;
        summary.totalDuration += resource.duration;
        
        if (!summary.byType[resource.type]) {
          summary.byType[resource.type] = {
            count: 0,
            size: 0,
            duration: 0
          };
        }
        
        summary.byType[resource.type].count++;
        summary.byType[resource.type].size += resource.size;
        summary.byType[resource.type].duration += resource.duration;
      });

      return summary;
    }
  },

  // Core Web Vitals
  vitals: {
    getLCP() {
      return new Promise((resolve) => {
        if (!window.PerformanceObserver) {
          resolve(null);
          return;
        }

        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(Math.round(lastEntry.startTime));
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(null), 10000);
      });
    },

    getFID() {
      return new Promise((resolve) => {
        if (!window.PerformanceObserver) {
          resolve(null);
          return;
        }

        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstEntry = entries[0];
          resolve(Math.round(firstEntry.processingStart - firstEntry.startTime));
        });

        observer.observe({ entryTypes: ['first-input'] });
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(null), 10000);
      });
    },

    getCLS() {
      return new Promise((resolve) => {
        if (!window.PerformanceObserver) {
          resolve(null);
          return;
        }

        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];

        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              const firstSessionEntry = sessionEntries[0];
              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

              if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && 
                  entry.startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += entry.value;
                sessionEntries.push(entry);
              } else {
                sessionValue = entry.value;
                sessionEntries = [entry];
              }

              if (sessionValue > clsValue) {
                clsValue = sessionValue;
              }
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // Return current CLS after page is loaded
        window.addEventListener('load', () => {
          setTimeout(() => resolve(Math.round(clsValue * 1000) / 1000), 100);
        });
      });
    },

    async getAll() {
      const [lcp, fid, cls] = await Promise.all([
        this.getLCP(),
        this.getFID(),
        this.getCLS()
      ]);

      return {
        lcp: lcp ? `${lcp}ms` : 'N/A',
        fid: fid ? `${fid}ms` : 'N/A',
        cls: cls !== null ? cls.toString() : 'N/A'
      };
    }
  }
};

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization
export const memoize = (func, keyGenerator) => {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
};

// Lazy loading utility
export const lazyLoad = (importFunc) => {
  let componentPromise;
  
  return () => {
    if (!componentPromise) {
      componentPromise = importFunc();
    }
    return componentPromise;
  };
};

// Image optimization
export const imageUtils = {
  preload(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  preloadMultiple(sources) {
    return Promise.all(sources.map(src => this.preload(src)));
  },

  getOptimizedSrc(src, width, height, format = 'webp') {
    if (!src) return src;
    
    // Add query parameters for image optimization
    const url = new URL(src);
    if (width) url.searchParams.set('w', width);
    if (height) url.searchParams.set('h', height);
    if (format) url.searchParams.set('format', format);
    
    return url.toString();
  },

  createSrcSet(src, widths = [640, 768, 1024, 1280, 1920]) {
    if (!src) return '';
    
    return widths
      .map(width => `${this.getOptimizedSrc(src, width)} ${width}w`)
      .join(', ');
  }
};

// Bundle analyzer helper
export const bundleUtils = {
  analyzeDynamicImports() {
    if (typeof window !== 'undefined' && window.__webpack_require__) {
      const chunks = Object.keys(window.__webpack_require__.cache || {});
      console.log('Loaded chunks:', chunks.length);
      return chunks;
    }
    return [];
  },

  getLoadedModules() {
    if (typeof window !== 'undefined' && window.__webpack_require__) {
      const modules = window.__webpack_require__.cache || {};
      return Object.keys(modules).map(id => ({
        id,
        loaded: modules[id].loaded
      }));
    }
    return [];
  }
};

// Export all utilities
export default {
  performance,
  debounce,
  throttle,
  memoize,
  lazyLoad,
  imageUtils,
  bundleUtils
};