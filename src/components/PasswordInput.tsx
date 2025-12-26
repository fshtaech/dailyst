import type { PasswordInputProps } from "../lib/types/PasswordInputProps";

export const PasswordInput = ({
  id,
  label,
  type,
  name,
  action,
  validity,
  visible,
}: Omit<PasswordInputProps, "autocomplete">) => {
  return (
    <div className="group relative flex flex-col">
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}
      <div className="flex relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : type}
          autoComplete="new-password"
          className="flex-1 p-2 rounded-md border-2 bg-secondary-50 focus:border-accent-300 focus:outline-0"
          onChange={action?.onChange}
          onBlur={action?.onBlur}
          onClick={action?.onClick}
          onFocus={action?.onFocus}
        />
        <button
          type="button"
          className="absolute top-[11px] right-0 flex items-center cursor-pointer mr-2"
          onClick={action?.onButtonClick}
        >
          <i className={`di di-eye${visible ? "-close" : ""}`}></i>
        </button>
      </div>
      {validity && !validity.isValid && (
        <span className="text-sm text-red-600">{validity!.errorMessage}</span>
      )}
    </div>
  );
};
