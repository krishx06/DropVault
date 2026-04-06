/**
 * Simple structured logger.
 * Can be replaced with winston/pino later without changing call sites.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

function formatMessage(level: LogLevel, message: string, meta?: object): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

export const logger = {
  info(message: string, meta?: object): void {
    console.log(formatMessage('INFO', message, meta));
  },

  warn(message: string, meta?: object): void {
    console.warn(formatMessage('WARN', message, meta));
  },

  error(message: string, meta?: object): void {
    console.error(formatMessage('ERROR', message, meta));
  },

  debug(message: string, meta?: object): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('DEBUG', message, meta));
    }
  },
};
