import { MotionValue } from 'framer-motion';

function onMount(opacity: MotionValue<number>) {
    opacity.set(1);
}

function onHide({
    opacity,
    unmount,
}: {
    unmount: () => void;
    opacity: MotionValue<number>;
}) {
    const cleanup = opacity.on('change', (value) => {
        if (value <= 0) {
            cleanup();
            unmount();
        }
    });

    opacity.set(0);
}

export { onMount, onHide };
