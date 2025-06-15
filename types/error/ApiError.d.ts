export type ApiError = {
  [key: string]: any;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  trace?: string;
};
