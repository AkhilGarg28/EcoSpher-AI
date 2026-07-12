class Logger {
  static info(message) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  static error(message, stack = "") {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message} ${stack}`);
  }

  static warn(message) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }
}

export default Logger;
