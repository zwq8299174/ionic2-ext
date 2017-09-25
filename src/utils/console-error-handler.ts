import { ErrorHandler } from '@angular/core';

export class ConsoleErrorHandler extends ErrorHandler {
  constructor() {
    super(false);
  }

  handleError(err: any): void {
    super.handleError(err);
  }
}