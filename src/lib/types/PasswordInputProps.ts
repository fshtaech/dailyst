import { type InputProps } from "./InputProps";
import type { PasswordInputAction } from "./PasswordInputAction";

export interface PasswordInputProps extends InputProps {
  action?: PasswordInputAction;
  visible: boolean;
}
