//status - 400
//message - eg: INVALID_INPUT
//error :{ message : "The user already exist"}

export class CustomError extends Error {
  status: number;
  message: string;
  error: Record<string, any>;

  constructor(status: number, message: string, error: Record<string, any>) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
