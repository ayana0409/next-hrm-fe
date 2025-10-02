import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;
  constructor(message?: any) {
    super();
    this.type = message;
  }
}

export class InvalidUsernamePasswordError extends AuthError {
  static type = "Username/Password không hợp lệ.";
}
