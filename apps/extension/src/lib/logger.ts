export const logger = {
  log: (message: string) => {
    console.log(`[Extension]: ${message}`);
  },
  error: (message: string) => {
    console.error(`[Extension Error]: ${message}`);
  },
};
