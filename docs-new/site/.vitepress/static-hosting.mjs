// VitePress keeps directory URLs even with cleanUrls=false. Some object stores
// return the root index.html instead of the requested directory's index.html.
export function directoryFallbackScript(pages, base = '/') {
  const directories = pages
    .filter((page) => page.endsWith('/index.md'))
    .map((page) => base + page.slice(0, -'index.md'.length))
  const paths = JSON.stringify(directories).replace(/</g, '\\u003c')
  return `(() => {
  let pathname;
  try { pathname = decodeURIComponent(location.pathname); } catch { return; }
  if (!${paths}.includes(pathname)) return;
  location.replace(location.pathname + 'index.html' + location.search + location.hash);
})();`
}
