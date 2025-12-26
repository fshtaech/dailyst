import { type InputProps } from "../lib/types/InputProps";

export const Input = ({
  id,
  label,
  type,
  autocomplete,
  name,
  action,
  validity,
}: InputProps) => {
  return (
    <div className="group relative flex flex-col">
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autocomplete}
        className="border-2 p-2 rounded-md bg-accent-50 focus:border-accent-300 focus:outline-0"
        onChange={action?.onChange}
        onBlur={action?.onBlur}
        onClick={action?.onClick}
        onFocus={action?.onFocus}
      />
      {validity && !validity.isValid && (
        <span key={id + " errormsg"} className="text-sm text-red-600">
          {validity.verifying ? "Checking..." : validity.errorMessage}
        </span>
      )}
    </div>
  );
};
