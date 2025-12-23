/**
 * Production-safe logging utility
 * In production, logs are disabled to improve performance
 * In development, all logs work normally
 * Uses React Native's global __DEV__ variable (automatically set by bundler)
 */

const logger = {
  log: (...args) => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Always log errors in dev mode
    // In production, you might want to send to crash reporting service
    // Example: Crashlytics.recordError(new Error(args.join(' ')));
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(...args);
    }
  },
  info: (...args) => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.info(...args);
    }
  },
};

export default logger;

