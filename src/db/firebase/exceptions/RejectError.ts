import { FirebaseError } from "firebase/app";

export class RejectError extends FirebaseError {
  constructor(code: string, msg: string) {
    super(code, msg);
  }
}
