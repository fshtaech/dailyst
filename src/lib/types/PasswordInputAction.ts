import type { InputAction } from "./InputAction";

export interface PasswordInputAction extends InputAction {
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
