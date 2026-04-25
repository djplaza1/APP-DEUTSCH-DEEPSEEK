        const mullerRequestMicPermission = async ({ autoPrompt = true, showToast = false } = {}) => {
            if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
                if (showToast && window.__mullerToast) window.__mullerToast('Este navegador no permite pedir micrófono.', 'error');
                return false;
            }
            try {
                const p = navigator.permissions && navigator.permissions.query ? await navigator.permissions.query({ name: 'microphone' }) : null;
                if (p && p.state === 'granted') return true;
                if (p && p.state === 'denied') {
                    if (showToast && window.__mullerToast) window.__mullerToast('Micrófono bloqueado en el navegador. Habilítalo en ajustes del sitio.', 'error');
                    return false;
                }
                if (!autoPrompt) return false;
            } catch (e) {}
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (stream && stream.getTracks) stream.getTracks().forEach((t) => t.stop());
                return true;
            } catch (err) {
                if (showToast && window.__mullerToast) window.__mullerToast('No se concedió permiso de micrófono.', 'error');
                return false;
            }
        };
        const mullerEnsureMicPermission = async ({ autoPrompt = true, showToast = false } = {}) => mullerRequestMicPermission({ autoPrompt, showToast });
        window.mullerRequestMicPermission = mullerRequestMicPermission;
        window.mullerEnsureMicPermission = mullerEnsureMicPermission;

        const germanWordDistanceOk = (a, b) => {
            if (a === b) return true;
            const d = levenshteinDistance(a, b);
            const L = Math.max(a.length, b.length, 1);
            if (L <= 2) return d <= 0;
            if (L <= 5) return d <= 1;
            if (L <= 10) return d <= 2;
            return d <= Math.min(3, Math.floor(L * 0.25));
        };

        /** Empareja palabras del modelo con las reconocidas en orden (tolera palabras de más al inicio). */
        const matchGermanWordsSequential = (origWords, spokenWords) => {
            const feedback = [];
            let si = 0;
            for (const ow of origWords) {
                if (!ow) continue;
                let found = false;
                for (let j = si; j < spokenWords.length; j++) {
                    if (germanWordDistanceOk(ow, spokenWords[j])) {
                        found = true;
                        si = j + 1;
                        break;
                    }
                }
                feedback.push({ word: ow, correct: found });
            }
            return feedback;
        };