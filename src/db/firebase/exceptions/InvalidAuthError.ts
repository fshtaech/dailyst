import { RejectError } from "./RejectError";

export class InvalidAuthError extends RejectError {
  constructor(code: string, message: string) {
    super(code, message);
  }
}
