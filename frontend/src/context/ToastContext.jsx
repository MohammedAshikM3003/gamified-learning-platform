import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const TOAST_TIMEOUT_MS = 4000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      removeToast(id);
    }, TOAST_TIMEOUT_MS);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
