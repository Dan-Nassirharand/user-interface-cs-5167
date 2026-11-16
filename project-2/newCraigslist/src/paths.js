// The app is served from a sub-path on GitHub Pages (see vite.config.js), and from "/" in development.
// Routes inside the app are written without that prefix, e.g. "/location".
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// "/location?x=1" -> "/user-interface-cs-5167/project-2/location?x=1"
export function withBase(path) {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

// Public files such as "static/logo.png" or "mock/listing-1.svg".
export function asset(path) {
  return withBase(path);
}

// Converts a browser URL into an app URL whose pathname has the prefix removed.
export function toAppUrl(href) {
  const url = new URL(href, window.location.href);
  if (base && (url.pathname === base || url.pathname.startsWith(`${base}/`))) {
    url.pathname = url.pathname.slice(base.length) || '/';
  }
  return url;
}

// True when a browser URL belongs to this app (always true in development).
export function isAppUrl(href) {
  const url = new URL(href, window.location.href);
  return !base || url.pathname === base || url.pathname.startsWith(`${base}/`);
}
