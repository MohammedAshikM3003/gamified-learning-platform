export const Button = ({
  children,
  type = "button",
  isLoading = false,
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? <span className="btn-spinner" /> : <span>{children}</span>}
    </button>
  );
};
