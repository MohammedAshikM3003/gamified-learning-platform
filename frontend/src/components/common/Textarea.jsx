export const Textarea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  required = false,
}) => (
  <div className="form-field">
    {label ? (
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
    ) : null}
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);
