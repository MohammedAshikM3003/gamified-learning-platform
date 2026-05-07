const buildUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Request failed");
    error.statusCode = data?.error?.statusCode || response.status;
    error.details = data?.error?.details || [];
    throw error;
  }

  return data;
};
