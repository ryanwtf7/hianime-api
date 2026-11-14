export class AppError extends Error {
  statusCode: number;
  details: unknown;

  constructor(message: string, statusCode: number = 500, details: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
export class NotFoundError extends AppError {
  constructor(message: string = 'resource not found', details: unknown = null) {
    super(message, 404, details);
  }
}

export class validationError extends AppError {
  constructor(message: string = 'validaion failed', details: unknown = null) {
    super(message, 400, details);
  }
}
