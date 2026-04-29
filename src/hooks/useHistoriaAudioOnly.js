// Hook para el toggle 'Solo audio' en Historia
window.useHistoriaAudioOnly = function() {
    const [historiaAudioOnly, setHistoriaAudioOnly] = React.useState(false);
    return { historiaAudioOnly, setHistoriaAudioOnly };
};
