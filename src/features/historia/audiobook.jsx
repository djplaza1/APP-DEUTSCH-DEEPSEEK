// MODO AUDIOLIBRO (guion TTS encadenado) — control desde React
(function() {
    let isPlaying = false;
    let currentIdx = 0;
    let guionCache = null;
    let timeoutId = null;
    function sanitizeAudiobookText(text) {
        return String(text || '')
            .replace(/\[R\]/gi, '')
            .replace(/\bN[üu]tzlich\b\.?/gi, '')
            .replace(/\b[ÚU]TIL\b\.?/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    function dispatchPlaying(playing) {
        window.dispatchEvent(new CustomEvent('mullerAudiobookState', { detail: { playing } }));
    }

    function getCurrentGuion() {
        const live = window.__MULLER_ACTIVE_GUION__;
        if (Array.isArray(live) && live.length > 0) return live;
        const scripts = JSON.parse(localStorage.getItem('mullerScripts') || '[]');
        if (scripts.length > 0) {
            const last = scripts[scripts.length - 1];
            try { return JSON.parse(last.data); } catch (e) {}
        }
        return window.__DEFAULT_GUION__ || [];
    }

    function stopAudioBook() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        window.speechSynthesis.cancel();
        isPlaying = false;
        dispatchPlaying(false);
    }

    function playScene(index) {
        if (!guionCache || index >= guionCache.length) {
            stopAudioBook();
            if (window.__mullerToast) window.__mullerToast('Audiolibro finalizado.', 'info');
            return;
        }
        const scene = guionCache[index];
        const utterance = new SpeechSynthesisUtterance(sanitizeAudiobookText(scene.text));
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.__mullerApplyPreferredDeVoice(utterance);
        utterance.onend = () => {
            timeoutId = setTimeout(() => {
                playScene(index + 1);
            }, 800);
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        currentIdx = index;
    }

    function startAudioBook() {
        guionCache = getCurrentGuion();
        if (!guionCache || guionCache.length === 0) {
            if (window.__mullerToast) window.__mullerToast('No hay ningún guion cargado.', 'error');
            return;
        }
        stopAudioBook();
        isPlaying = true;
        dispatchPlaying(true);
        playScene(0);
    }

    function toggleAudioBook() {
        if (isPlaying) stopAudioBook();
        else startAudioBook();
    }

    window.__mullerAudiobook = {
        toggle: toggleAudioBook,
        start: startAudioBook,
        stop: stopAudioBook,
        get playing() { return isPlaying; },
        get currentIndex() { return currentIdx; }
    };
})();