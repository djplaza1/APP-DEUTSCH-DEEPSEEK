// -------------------- DATOS DE RESPALDO --------------------
const DEFAULT_PLURALS = [
    { singular: "der Tisch", plural: "die Tische", regla: "+e" },
    { singular: "die Lampe", plural: "die Lampen", regla: "+n" },
    { singular: "das Buch", plural: "die Bücher", regla: "¨+er" }
];
const DEFAULT_VERBPREP = [
    { verbo: "warten", preposicion: "auf", ejemplo: "Ich warte auf den Bus." },
    { verbo: "sich interessieren", preposicion: "für", ejemplo: "Ich interessiere mich für Kunst." },
    { verbo: "denken", preposicion: "an", ejemplo: "Ich denke an dich." }
];
const DEFAULT_PREPOSITIONS = [
    { preposicion: "aus", caso: "Dativ", ejemplo: "Ich komme aus Spanien." },
    { preposicion: "für", caso: "Akkusativ", ejemplo: "Das Geschenk ist für dich." },
    { preposicion: "in", caso: "Wechsel", ejemplo: "Ich bin in der Stadt (Dativ) / Ich gehe in die Stadt (Akkusativ)." }
];

// -------------------- EXTRACTORES (guardan en localStorage) --------------------
function extractPluralsFromGuion(guionData, scriptTitle) {
    if (!guionData || !Array.isArray(guionData)) return;
    let existing = JSON.parse(localStorage.getItem('muller_extracted_plurals') || '[]');
    guionData.forEach(scene => {
        const text = scene.text;
        const matches = text.match(/\bdie\s+([A-ZÄÖÜ][a-zäöüß]+(?:e|er|en|n|s)?)\b/g) || [];
        matches.forEach(m => {
            const plural = m.replace('die ', '');
            let singular = plural.replace(/[äöü]/g, c => ({'ä':'a','ö':'o','ü':'u'}[c]));
            singular = singular.replace(/(e|er|n|en|s)$/, '');
            if (singular && !existing.find(p => p.plural === plural)) {
                existing.push({ singular, plural, example: text, scriptTitle, regla: 'extraído' });
            }
        });
    });
    localStorage.setItem('muller_extracted_plurals', JSON.stringify(existing));
}

function extractVerbPrepsFromGuion(guionData, scriptTitle) {
    let existing = JSON.parse(localStorage.getItem('muller_extracted_verbprep') || '[]');
    const patterns = DEFAULT_VERBPREP.map(v => ({ verbo: v.verbo, prep: v.preposicion }));
    guionData.forEach(scene => {
        const text = scene.text;
        patterns.forEach(p => {
            if (text.includes(p.verbo) && text.includes(p.prep)) {
                if (!existing.find(v => v.verbo === p.verbo)) {
                    existing.push({ ...p, ejemplo: text, scriptTitle });
                }
            }
        });
    });
    localStorage.setItem('muller_extracted_verbprep', JSON.stringify(existing));
}

function extractPrepositionsFromGuion(guionData, scriptTitle) {
    let existing = JSON.parse(localStorage.getItem('muller_extracted_prepositions') || '[]');
    guionData.forEach(scene => {
        const text = scene.text;
        DEFAULT_PREPOSITIONS.forEach(p => {
            if (text.includes(p.preposicion)) {
                if (!existing.find(pr => pr.preposicion === p.preposicion)) {
                    existing.push({ ...p, example: text, scriptTitle });
                }
            }
        });
    });
    localStorage.setItem('muller_extracted_prepositions', JSON.stringify(existing));
}

function extractArticlesFromGuionFinal(guionData, scriptTitle) {
    if (!guionData || !Array.isArray(guionData)) return;
    const corrections = JSON.parse(localStorage.getItem('muller_article_corrections') || '{}');
    let existing = JSON.parse(localStorage.getItem('muller_extracted_articles') || '[]');
    const regex = /\b(Der|Die|Das|Ein|Eine)\s+([A-ZÄÖÜ][a-zäöüß]+)\s+(ist|sind|hat|haben|kann|muss|will|möchte|kommt|geht|steht|liegt|sitzt|arbeitet|spricht|denkt|findet|glaubt|weiß|sieht|hört|fährt|läuft|bringt|nimmt|gibt|hilft|trifft|schläft|wäscht|trägt|verliert|schreibt|liest|kennt|nennt)\b/gi;
    guionData.forEach(scene => {
        const text = scene.text || '';
        let match;
        while ((match = regex.exec(text)) !== null) {
            const articleRaw = match[1].toLowerCase();
            const noun = match[2];
            let finalArticle = corrections[noun];
            if (!finalArticle) {
                const found = existing.find(item => item.word === noun);
                if (found) finalArticle = found.article;
            }
            if (!finalArticle) {
                if (noun.toLowerCase().endsWith('ung') || noun.toLowerCase().endsWith('heit') || noun.toLowerCase().endsWith('keit')) finalArticle = 'die';
                else if (noun.toLowerCase().endsWith('chen') || noun.toLowerCase().endsWith('lein')) finalArticle = 'das';
                else if (noun.toLowerCase().endsWith('er') || noun.toLowerCase().endsWith('ling')) finalArticle = 'der';
                else finalArticle = articleRaw === 'ein' ? 'der' : articleRaw === 'eine' ? 'die' : articleRaw;
            }
            if (finalArticle && noun.length > 1 && !existing.find(item => item.word === noun)) {
                existing.push({
                    word: noun, article: finalArticle,
                    examples: [text], translation: scene.translation || '',
                    scriptTitle, dateAdded: new Date().toISOString(),
                    inferred: !corrections[noun]
                });
            }
        }
    });
    localStorage.setItem('muller_extracted_articles', JSON.stringify(existing));
}
