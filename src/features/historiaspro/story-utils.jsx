        const mullerStoryClean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s([,.;:!?])/g, '$1').trim();
        const mullerStorySimplifyGerman = (txt) => {
            return String(txt || '')
                .replace(/\bjedoch\b/gi, 'aber')
                .replace(/\bdennoch\b/gi, 'trotzdem')
                .replace(/\baufgrund\b/gi, 'wegen')
                .replace(/\bbeziehungsweise\b/gi, 'oder')
                .replace(/\baußerdem\b/gi, 'auch')
                .replace(/\binsbesondere\b/gi, 'vor allem')
                .replace(/\ballerdings\b/gi, 'aber')
                .replace(/\bdaher\b/gi, 'deshalb');
        };
        const mullerStoryStylizeGerman = (txt, level, tone) => {
            let out = mullerStoryClean(txt);
            if (!out) return '';
            if (tone === 'natural') out = out.replace(/\s,\s/g, ', ');
            if (tone === 'formal') {
                out = out
                    .replace(/\bich\b/g, 'Ich')
                    .replace(/\bwir\b/g, 'Wir')
                    .replace(/\bman\b/g, 'man');
            }
            if (level === 'A2') out = mullerStorySimplifyGerman(out);
            if (level === 'B1') out = mullerStorySimplifyGerman(out).replace(/\bwelche[rnms]?\b/gi, 'die');
            return out;
        };
        const mullerStorySplitScenes = (deText, esText) => {
            const deParts = String(deText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const esParts = String(esText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const out = deParts.slice(0, 14).map((line, i) => ({
                speaker: i % 2 === 0 ? 'Lukas' : 'Elena',
                text: line,
                translation: esParts[i] || ''
            }));
            return out.length ? out : [{ speaker: 'Lukas', text: mullerStoryClean(deText), translation: mullerStoryClean(esText) }];
        };
        const mullerStoryGlossary = (deText) => {
            const words = String(deText || '')
                .toLowerCase()
                .replace(/[^a-zäöüß\s-]/gi, ' ')
                .split(/\s+/)
                .map((w) => w.trim())
                .filter((w) => w.length >= 6 && !/^\d+$/.test(w));
            const unique = Array.from(new Set(words)).slice(0, 10);
            return unique.map((w) => ({ de: w, es: '(revísalo en Lexikon)' }));
        };

          const mullerLexikonApplyPairsFromTranslate = (sourceText, translated, detectedLang, targetLang) => {
              const d = String(detectedLang || '').toLowerCase();
              const t = String(targetLang || '').toLowerCase();
              const outClean = String(translated || '').replace(/^\(sin resultado\)$/, '');
              const src = String(sourceText || '').trim();
              if (!outClean) return;
              if (t === 'de') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              } else if (t === 'es') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              }
          };