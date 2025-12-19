import { type InputProps } from "../lib/types/InputProps";

export const Input = ({
  id,
  label,
  type,
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
      <div className="flex items-center border-2 bg-secondary-50 focus-within:border-accent-400">
        <input
          id={id}
          name={name}
          type={type}
          className="flex-1 p-2 rounded-none focus:outline-0"
          onChange={action?.onChange}
          onBlur={action?.onBlur}
          onClick={action?.onClick}
          onFocus={action?.onFocus}
        />
      </div>
      {!validity?.isValid && (
        <span className="text-sm text-red-600">{validity!.errorMessage}</span>
      )}
    </div>
  );
};
