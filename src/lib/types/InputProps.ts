import { type InputAction } from "./InputAction";
import { type Validity } from "./Validity";

export interface InputProps {
  id: string;
  type: string;
  autocomplete: string;
  name: string;
  label?: string;
  action?: InputAction;
  validity?: Validity;
}
