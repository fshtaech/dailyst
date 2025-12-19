export interface InputAction {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
