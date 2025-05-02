import type Request from "~/types/utils/request";
import type { RequestError } from "~/types/utils/request";

const baseURL = "http://localhost:8000/api";

/**
 * Fetches data from the JBPC API Lambda
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @param token - The token to use for authentication
 * @returns The response from the API or an error
 */
const fetchAPI = async <T>({
  method,
  endpoint,
  params,
  query,
  token,
  headers,
  formDatas,
}: Request): Promise<T | RequestError> => {
  if (!baseURL) {
    throw new Error("Incorrect API");
  }

  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const newHeaders = new Headers();
  const newFormData = new FormData();

  newHeaders.append("Content-Type", "application/json");

  if (headers && headers.length > 0) {
    headers.forEach((header) => {
      newHeaders.append(header.key, header.value);
    });
  }

  if (formDatas && formDatas.length > 0) {
    formDatas.forEach((formData) => {
      newFormData.append(formData.key, formData.value);
    });
  }

  const { state } = authStore();

  if (state.token) {
    newHeaders.append("Authorization", token ? `Bearer ${token}` : "");
  }

  const body = JSON.stringify(params) ?? undefined;

  await nextTick();

  const { data, error } = await useFetch(endpoint, {
    baseURL,
    method,
    body,
    headers: newHeaders,
    query,
  });

  if (error.value && (error.value.statusCode || 500) >= 400) {
    return {
      error: error.value?.data.error,
      message: error.value?.data.message,
      errors: error.value.data.errors,
    } as RequestError;
  }

  return (await data.value) as T;
};

export default fetchAPI;
