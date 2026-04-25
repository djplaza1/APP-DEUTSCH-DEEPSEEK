        /** Quita repeticiones consecutivas de la misma palabra (STT móvil suele duplicar 5–20 veces). */
        const dedupeConsecutiveWords = (s) => {
            if (!s || typeof s !== 'string') return '';
            const parts = s.trim().split(/\s+/).filter(Boolean);
            const out = [];
            for (const w of parts) {
                const low = w.toLowerCase();
                if (out.length && out[out.length - 1].toLowerCase() === low) continue;
                out.push(w);
            }
            return out.join(' ');
        };

        /** Une un nuevo trozo final del STT sin duplicar: en Android muchos motores reenvían la frase COMPLETA en cada evento. */
        const mergeSpeechFinalChunk = (prev, chunk) => {
            if (!chunk || !String(chunk).trim()) return prev || '';
            const n = String(chunk).trim();
            if (!prev || !String(prev).trim()) return n;
            const p = String(prev).trim();
            if (n === p) return p;
            if (n.startsWith(p)) return n;
            if (p.startsWith(n)) return p;
            if (p.includes(n) && n.length < p.length) return p;
            if (n.includes(p) && p.length < n.length) return n;
            return `${p} ${n}`.trim();
        };

        /** Si el STT repite la frase entera 2+ veces (p. ej. "a b c a b c"), deja una sola copia. */
        const collapseFullPhraseRepeat = (s) => {
            if (!s || typeof s !== 'string') return '';
            const w = s.trim().split(/\s+/).filter(Boolean);
            if (w.length < 2) return s.trim();
            for (let period = 1; period <= Math.floor(w.length / 2); period++) {
                if (w.length % period !== 0) continue;
                const unit = w.slice(0, period);
                let ok = true;
                for (let rep = 1; rep < w.length / period; rep++) {
                    for (let i = 0; i < period; i++) {
                        if (w[rep * period + i].toLowerCase() !== unit[i].toLowerCase()) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) break;
                }
                if (ok) return unit.join(' ');
            }
            return s.trim();
        };

        /** Limpieza extra: colapsa triples+ y pasa dedupe consecutivo. */
        const collapseStutterRepeats = (s) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.trim();
            let prev = '';
            while (prev !== t) {
                prev = t;
                t = t.replace(/\b(\S+)(?:\s+\1)+\b/gi, '$1').trim();
            }
            t = dedupeConsecutiveWords(t);
            t = collapseFullPhraseRepeat(t);
            return dedupeConsecutiveWords(t);
        };

        /** Normaliza texto alemán para comparar lo que dicta el STT con el guion (umlauts, ß, puntuación). */
        const normalizeGermanSpeechText = (s) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.toLowerCase().trim();
            t = t.replace(/\u00df/g, 'ss').replace(/ß/g, 'ss');
            t = t.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
            t = t.replace(/[’'`´]/g, "'");
            t = t.replace(/[^a-z0-9\s']/g, ' ');
            t = t.replace(/\s+/g, ' ').trim();
            return t;
        };