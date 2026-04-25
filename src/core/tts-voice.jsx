
        /** Voces TTS del sistema (gratis): preferencias en localStorage. Audiolibro y utterances sueltos usan __mullerApplyPreferred*Voice */
        window.__mullerResolveVoice = function (storageKey) {
            try {
                const raw = localStorage.getItem(storageKey);
                if (!raw) return null;
                const all = window.speechSynthesis.getVoices();
                return all.find(function (x) { return x.voiceURI === raw || x.name === raw; }) || null;
            } catch (e) { return null; }
        };
        window.__mullerApplyPreferredDeVoice = function (utterance) {
            const v = window.__mullerResolveVoice('muller_tts_de');
            if (v) utterance.voice = v;
        };
        window.__mullerApplyPreferredEsVoice = function (utterance) {
            const v = window.__mullerResolveVoice('muller_tts_es');
            if (v) utterance.voice = v;
        };
        window.__mullerRankVoiceNatural = function (v) {
            const n = (v.name || '').toLowerCase();
            let s = 0;
            if (/neural|natural|premium|enhanced|wavenet|journey|generative/i.test(n)) s += 50;
            if (/google|microsoft|azure|apple|cloud/i.test(n)) s += 20;
            if (/de[-_]|german|deutsch/i.test(n)) s += 5;
            return s;
        };

 

