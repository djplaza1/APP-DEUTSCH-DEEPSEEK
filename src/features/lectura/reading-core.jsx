var mullerNormalizeGermanWordToken = (raw) => String(raw || '')
    .toLowerCase()
    .replace(/^[^a-zäöüß]+|[^a-zäöüß]+$/gi, '')
    .trim();

var mullerReadingTokenizeText = (text) => String(text || '')
    .split(/(\s+)/)
    .map((chunk) => {
        if (!chunk) return { text: '', word: '', clickable: false };
        if (/^\s+$/.test(chunk)) return { text: chunk, word: '', clickable: false };
        const clean = mullerNormalizeGermanWordToken(chunk);
        return { text: chunk, word: clean, clickable: !!clean };
    });
