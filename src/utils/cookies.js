export function parseCookies(req) {
    if (!req?.headers?.cookie) return {};
    return Object.fromEntries(
      req.headers.cookie
        .split(';')
        .map(cookie => cookie.trim().split('='))
    );
  }
  