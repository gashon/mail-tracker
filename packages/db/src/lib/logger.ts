type LogLevel = 'info' | 'error' | 'warn' | 'debug';

export const getLogger = (context: string) => {
  const log = (level: LogLevel, message: string, ...args: any[]) => {
    console[level](`[${context}] ${message}`, ...args);
  };

  return {
    info: (message: string, ...args: any[]) => log('info', message, ...args),
    error: (message: string, ...args: any[]) => log('error', message, ...args),
    warn: (message: string, ...args: any[]) => log('warn', message, ...args),
    debug: (message: string, ...args: any[]) => log('debug', message, ...args),
  };
};
