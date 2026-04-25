const MULLER_READING_FONT_STORAGE = 'muller_reading_font_px_v1';
const MULLER_READING_FONT_MIN = 14;
const MULLER_READING_FONT_MAX = 34;
const MULLER_READING_FONT_STEP = 1;
const MULLER_MIC_PERMISSION_PREF_KEY = 'muller_auto_request_mic_v1';

const GRAMMAR_PATTERNS = [
    { regex: /(interessier[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|sehr|wirklich)\s+)*für)/gi, tooltip: "sich interessieren für + Akk", base: "sich interessieren für" },
    { regex: /(gegen\s+(?:.*?\s+)?kämpfen|kämpfen\s+(?:.*?\s+)?gegen)/gi, tooltip: "kämpfen gegen + Akk", base: "kämpfen gegen" },
    { regex: /(setz[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|heute|jetzt)\s+)*(?:.*?\s+)?für(?:.*?\s+)?ein)/gi, tooltip: "sich einsetzen für + Akk", base: "sich einsetzen für" },
    { regex: /(erinner[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|noch|sehr)\s+)*an)/gi, tooltip: "sich erinnern an + Akk", base: "sich erinnern an" },
    { regex: /(wart[en|e|et]+\s+(?:.*?\s+)?auf)/gi, tooltip: "warten auf + Akk", base: "warten auf" }
];

const CONN_LIST = ["weil", "dass", "obwohl", "wenn", "als", "damit", "ob", "bevor", "nachdem", "deshalb", "deswegen", "darum", "trotzdem", "dann", "danach", "außerdem", "und", "aber", "oder", "denn", "sondern"];
const PREP_DAT = ["aus", "bei", "mit", "nach", "seit", "von", "zu", "ab"];
const PREP_AKK = ["durch", "für", "gegen", "ohne", "um"];
const PREP_WECHSEL = ["in", "an", "auf", "neben", "hinter", "über", "unter", "vor", "zwischen"];
