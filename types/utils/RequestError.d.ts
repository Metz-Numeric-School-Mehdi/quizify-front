type RequestError = {
  error?: string | number;
  message: string;
  errors: string | Record<string, string>[];
};

export default RequestError;
