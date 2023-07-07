const circleAnimation = {
    hidden: {
        x: -100,
        opacity: 0,
    },
    visible: (custom: any) => ({
        x: 0,
        opacity: 1,
        transition: { delay: custom * 0.2 },
    }),
}

export default circleAnimation
