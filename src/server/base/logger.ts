import winston from 'winston';

export interface LoggerConfig {
  enabled: boolean;
  level: string;
}

const defaultConfig: LoggerConfig = {
  enabled: true,
  level: 'info',
};

const logger = winston.createLogger({
  level: defaultConfig.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  silent: !defaultConfig.enabled,
});

let currentConfig = { ...defaultConfig };

export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };

  logger.level = currentConfig.level;
  logger.silent = !currentConfig.enabled;
}

export function getLoggerConfig(): LoggerConfig {
  return { ...currentConfig };
}

export function enableLogging(): void {
  configureLogger({ enabled: true });
}

export function disableLogging(): void {
  configureLogger({ enabled: false });
}

export function setLogLevel(level: string): void {
  configureLogger({ level });
}

export function createServiceLogger(namespace: string) {
  return {
    info: (message: string, meta?: Record<string, unknown>) => {
      logger.info(`[${namespace}] ${message}`, meta);
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      logger.warn(`[${namespace}] ${message}`, meta);
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      logger.error(`[${namespace}] ${message}`, meta);
    },
    debug: (message: string, meta?: Record<string, unknown>) => {
      logger.debug(`[${namespace}] ${message}`, meta);
    },
  };
}

export default logger;
