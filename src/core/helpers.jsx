const mullerClamp = window.mullerClamp || ((n, min, max) => Math.max(min, Math.min(max, n)));
window.mullerClamp = mullerClamp;
