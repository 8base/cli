export class HttpError extends Error {
  public statusCode: number;
  public response: Response;
  constructor(message: string, statusCode: number, response: Response) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
  }
}
