export const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) => (
  <div className="form-field">
    {label ? (
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
    ) : null}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
    />
  </div>
);
