import * as Sentry from "@sentry/react";

let sentryEnabled = false;

function isConfiguredSentryDsn(raw) {
  if (!raw || typeof raw !== "string") return false;
  const dsn = raw.trim();
  if (!dsn || dsn === "your_sentry_dsn_here") return false;
  try {
    const u = new URL(dsn);
    return u.protocol === "https:" && u.username.length > 0;
  } catch {
    return false;
  }
}

export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim() ?? "";
  if (!isConfiguredSentryDsn(dsn)) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2,
  });
  sentryEnabled = true;
}

export function captureError(error, context) {
  if (!sentryEnabled) return;
  Sentry.captureException(error, { extra: context });
}
