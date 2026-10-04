// Reveal the selected destination in the longer unified sidebar, without
// scrolling the article or changing keyboard focus.
let observer: MutationObserver | undefined;
function revealSelection() {
  for (const area of document.querySelectorAll<HTMLElement>('[data-sidebar-scroll-area]')) {
    const selected = area.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!selected || !area.clientHeight) continue;
    const viewport = area.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.top < viewport.top || item.bottom > viewport.bottom) {
      area.scrollTop += item.top - viewport.top - (area.clientHeight - item.height) / 2;
    }
  }
}
function init() {
  observer?.disconnect();
  requestAnimationFrame(revealSelection);
  const drawer = document.querySelector('[data-mobile-sidebar]');
  if (drawer) {
    observer = new MutationObserver(() => requestAnimationFrame(revealSelection));
    observer.observe(drawer, { attributes: true, attributeFilter: ['hidden'] });
  }
}
init();
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => observer?.disconnect());
