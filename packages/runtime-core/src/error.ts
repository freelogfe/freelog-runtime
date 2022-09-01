export class QiankunError extends Error {
  constructor(message: string) {
    super(`[freelog]: ${message}`);
  }
}
