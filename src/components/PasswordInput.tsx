import type { PasswordInputProps } from "../lib/types/PasswordInputProps";

export const PasswordInput = ({
  id,
  label,
  type,
  name,
  action,
  validity,
  visible,
}: PasswordInputProps) => {
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
          type={visible ? "text" : type}
          className="flex-1 p-2 rounded-none focus:outline-0"
          onChange={action?.onChange}
          onBlur={action?.onBlur}
          onClick={action?.onClick}
          onFocus={action?.onFocus}
        />
        <button
          type="button"
          className="flex items-center cursor-pointer mr-2"
          onClick={action?.onButtonClick}
        >
          <i className={`di di-eye${visible ? "-close" : ""}`}></i>
        </button>
      </div>
      {!validity?.isValid && (
        <span className="text-sm text-red-600">{validity!.errorMessage}</span>
      )}
    </div>
  );
};
