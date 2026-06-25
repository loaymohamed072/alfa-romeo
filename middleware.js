// Edge Middleware: Markdown content negotiation for AI agents.
// When a client sends "Accept: text/markdown", serve the .md variant of the
// page instead of HTML (Cloudflare Agent Readiness "Content" check).
// Falls through to normal static serving for every other request.

export const config = {
  matcher: ['/', '/pricing.html'],
};

const MAP = {
  '/': '/index.md',
  '/pricing.html': '/pricing.md',
};

export default function middleware(request) {
  try {
    const accept = (request.headers.get('accept') || '').toLowerCase();
    const url = new URL(request.url);
    const dest = MAP[url.pathname];
    if (dest && accept.includes('text/markdown')) {
      return new Response(null, {
        headers: { 'x-middleware-rewrite': new URL(dest, request.url).toString() },
      });
    }
  } catch (e) {
    // On any error, fall through to normal serving.
  }
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
