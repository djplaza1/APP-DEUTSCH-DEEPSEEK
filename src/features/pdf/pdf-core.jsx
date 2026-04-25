var mullerPdfCleanText = (s) => String(s || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .trim();

var mullerPdfGuessUnitLesson = (s) => {
    const txt = String(s || '');
    const unitHit = txt.match(/\b(?:Lektion|Einheit|Unidad|Unit)\s*[:\-]?\s*([A-Z0-9ÄÖÜa-zäöüß]+)/i);
    const lessonHit = txt.match(/\b(?:Thema|Tema|Kapitel|Lecci[oó]n)\s*[:\-]?\s*([A-Z0-9ÄÖÜa-zäöüß]+)/i);
    return {
        unit: unitHit ? String(unitHit[1] || '').trim() : '',
        lesson: lessonHit ? String(lessonHit[1] || '').trim() : ''
    };
};

var MULLER_PDF_STUDY_STORAGE_KEY = 'muller_pdf_study_v1';
var MULLER_PDF_STUDY_LIBRARY_KEY = 'muller_pdf_study_library_v1';
var MULLER_PDF_NOTES_STORAGE_KEY = 'muller_pdf_study_notes_v1';
var MULLER_PDF_NOTES_LEGACY_DOC_ID = '__legacy__';
var MULLER_PDF_COACH_STATS_KEY = 'muller_pdf_coach_stats_v1';
var MULLER_PDF_DIDACTIC_LIBRARY_KEY = 'muller_pdf_didactic_library_v1';
var MULLER_PDF_STORED_PAGES_MAX = 80;
var MULLER_PDF_STORED_TEXT_MAX = 3200;
var MULLER_PDF_OCR_RETRY_MAX = 1;
var MULLER_PDF_EXTRACT_YIELD_EVERY = 2;
var MULLER_PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/legacy/build/pdf.worker.min.js';
var MULLER_PDF_DIDACTIC_STOPWORDS = new Set([
    'der', 'die', 'das', 'und', 'oder', 'aber', 'denn', 'doch', 'nicht', 'ein', 'eine', 'einer', 'einem', 'einen',
    'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'man', 'mit', 'von', 'zu', 'im', 'in', 'am', 'an', 'auf', 'ist',
    'sind', 'war', 'waren', 'hat', 'haben', 'sein', 'wie', 'auch', 'nur', 'schon', 'noch', 'bei', 'nach', 'vor'
]);
