<template>
    <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Animated check">
        <circle class="circle" cx="80" cy="80" r="60" />
        <path class="check" d="M65 85 L80 100 L105 65" />
    </svg>
</template>

<style scoped>
.circle {
    fill: #10b981;
    transform-origin: 80px 80px;
    animation: pop 0.5s cubic-bezier(.2, .8, .2, 1.2) both;
}

.check {
    fill: none;
    stroke: #fff;
    stroke-width: 7;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 70;
    stroke-dashoffset: 70;
    animation: draw 0.7s cubic-bezier(.4, 1, .4, 1) 0.3s forwards;
}

@keyframes pop {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    60% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
}
</style>