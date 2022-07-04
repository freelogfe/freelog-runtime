/**
 * @author Kuitos
 * @since 2019-02-19
 */

const firstMountLogLabel = '[freelog] first app mounted';
if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}

export function runAfterFirstMounted(effect: () => void) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount', function listener() {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();

    window.removeEventListener('single-spa:first-mount', listener);
  });
}
