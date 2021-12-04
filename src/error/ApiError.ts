export class ApiError extends Error {
  private readonly _status: number;
  private readonly _message: string;
  private readonly _response: any;

  constructor(status: number, message: string, response?: any) {
    super(message);
    this._status = status;
    this._message = message;
    this._response = response;
  }

  get status(): number {
    return this._status;
  }

  get message(): string {
    return this._message;
  }

  get response(): any {
    return this._response;
  }
}
