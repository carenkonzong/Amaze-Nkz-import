const required = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  APP_NAME: required("VITE_APP_NAME"),
  COMPANY_NAME: required("VITE_COMPANY_NAME"),

  API_URL: required("VITE_API_URL"),
} as const;
