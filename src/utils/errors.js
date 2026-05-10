import { captureError } from "./monitoring";

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  // Auto-report server errors (500) and network errors to Sentry
  const status = error?.response?.status;
  const hasResponse = !!error?.response;

  if (status >= 500 || !hasResponse) {
    captureError(error);
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.title) {
    return error.response.data.title;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
}
