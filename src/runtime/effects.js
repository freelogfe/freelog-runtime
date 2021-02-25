/**
 * @author Kuitos
 * @since 2019-02-19
 */
var firstMountLogLabel = '[qiankun] first app mounted';

if (process.env.NODE_ENV === 'development') {
    console.time(firstMountLogLabel);
}

export function runDefaultMountEffects(defaultAppLink) {
    console.warn('[qiankun] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead');
    setDefaultMountApp(defaultAppLink);
}
export function runAfterFirstMounted(effect) {
    // can not use addEventListener once option for ie support
    window.addEventListener('single-spa:first-mount', function listener() {
        if (process.env.NODE_ENV === 'development') {
            console.timeEnd(firstMountLogLabel);
        }

        effect();
        window.removeEventListener('single-spa:first-mount', listener);
    });
}