        const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } = React;

        class MullerErrorBoundary extends React.Component {
            constructor(props) {
                super(props);
                this.state = { hasError: false, message: '' };
            }
            static getDerivedStateFromError(error) {
                return { hasError: true, message: error && error.message ? String(error.message) : 'Error inesperado' };
            }
            componentDidCatch(error, errorInfo) {
                try { console.error('MullerErrorBoundary', error, errorInfo); } catch (e) {}
            }
            handleReload = () => {
                try { window.location.reload(); } catch (e) {}
            };
            render() {
                if (!this.state.hasError) return this.props.children;
                return (
                    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <div style={{ width: '100%', maxWidth: '540px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '14px', background: 'rgba(15,23,42,0.85)', padding: '1rem 1.1rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Se recuperó un error de la interfaz</h2>
                            <p style={{ margin: '0.55rem 0 0.2rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                                La app evitó una pantalla negra completa. Puedes recargar para continuar.
                            </p>
                            <p style={{ margin: '0.35rem 0 0.9rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                                Detalle: {this.state.message || 'sin detalle'}
                            </p>
                            <button type="button" onClick={this.handleReload} style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.55rem 0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                                Recargar aplicación
                            </button>
                        </div>
                    </div>
                );
            }
        }

        /** Supabase (gratis): Dashboard â†’ Project Settings â†’ API â†’ Project URL y anon public key */
        window.MULLER_SUPABASE_URL = window.MULLER_SUPABASE_URL || 'https://mrimappoycvfujzegxdt.supabase.co';
        window.MULLER_SUPABASE_ANON_KEY = window.MULLER_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yaW1hcHBveWN2ZnVqemVneGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzI1MDMsImV4cCI6MjA5MjIwODUwM30.L_5Lk3S_TgiaSe8jAAhTcQTbUsQiTjxA9pWq0ZDayBY';
        window.MULLER_CREATOR_EMAIL = window.MULLER_CREATOR_EMAIL || 'djplaza1@gmail.com';
        window.MULLER_REWARDED_AD_URL = window.MULLER_REWARDED_AD_URL || '';
        window.MULLER_PREMIUM_CHECKOUT_URL = window.MULLER_PREMIUM_CHECKOUT_URL || '';

        // --- COMPONENTE AISLANTE DE ICONOS (Lucide + contenedor â€œpremiumâ€ opcional) ---
        const Icon = ({ name, className, nav = false }) => {
            const inner = <span className="lucide-wrapper" dangerouslySetInnerHTML={{ __html: `<i data-lucide="${name}" class="${className || ''}"></i>` }} />;
            return nav ? <span className="nav-tab-icon">{inner}</span> : inner;
        };

        // --- BASES DE DATOS Y CONFIGURACIÃ“N INICIAL (sin cambios) ---
        const DEFAULT_GUION = [
            { speaker: 'Lukas', text: 'Hallo Elena! Heute ist ein groÃŸer Tag.', translation: 'Â¡Hola Elena! Hoy es un gran dÃ­a.', vocab: [{ de: 'der Tag', es: 'el dÃ­a', diff: 0 }] },
            { speaker: 'Lukas', text: 'Ich bin nervös, weil wir Bilder ausstellen.', translation: 'Estoy nervioso porque exponemos cuadros.', vocab: [{ de: 'ausstellen', es: 'exponer', diff: 0 }] },
            { speaker: 'Elena', text: 'Keine Sorge. Du bist ein toller Künstler.', translation: 'No te preocupes. Eres un gran artista.', isRedemittel: true, vocab: [{ de: 'der Künstler', es: 'el artista', diff: 0 }] },
            { speaker: 'Elena', text: 'Du wirst heute viel Anerkennung bekommen.', translation: 'Hoy recibirás mucho reconocimiento.', vocab: [{ de: 'die Anerkennung', es: 'el reconocimiento', diff: 1 }, { de: 'bekommen', es: 'recibir', diff: 0 }] },
            { speaker: 'Lukas', text: 'Schau dir dieses Gemälde hier an.', translation: 'Mira este cuadro de aquí.', vocab: [{ de: 'das Gemälde', es: 'el cuadro', diff: 0 }] },
            { speaker: 'Lukas', text: 'Es ist im Sommer entstanden.', translation: 'Surgió (fue creado) en verano.', vocab: [{ de: 'entstehen', es: 'surgir / crearse', diff: 1 }] },
            { speaker: 'Lukas', text: 'Das ist super! Es gefällt mir sehr.', translation: '¡Eso es genial! Me gusta mucho.', isRedemittel: true, vocab: [{ de: 'super', es: 'genial', diff: 0 }] },
            { speaker: 'Elena', text: 'Man sieht den Einfluss der Natur.', translation: 'Se ve la influencia de la naturaleza.', vocab: [{ de: 'der Einfluss', es: 'la influencia', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Guten Tag. Wer ist der Maler?', translation: 'Buenas tardes. ¿Quién es el pintor?', vocab: [{ de: 'der Maler', es: 'el pintor', diff: 0 }] },
            { speaker: 'Lukas', text: 'Ich bin es. Ist das eine Skulptur?', translation: 'Soy yo. ¿Es eso una escultura?', vocab: [{ de: 'die Skulptur', es: 'la escultura', diff: 0 }] },
            { speaker: 'Herr Weber', text: 'Das Bild erinnert mich an meine Lebensgeschichte.', translation: 'El cuadro me recuerda a la historia de mi vida.', vocab: [{ de: 'die Lebensgeschichte', es: 'la historia de vida', diff: 0 }] },
            { speaker: 'Herr Weber', text: 'Ich bin 1945 geboren worden.', translation: 'Yo nací en 1945.', vocab: [{ de: 'geboren werden', es: 'nacer', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Damals gab es viel Zerstörung.', translation: 'En aquel entonces había mucha destrucción.', vocab: [{ de: 'die Zerstörung', es: 'la destrucción', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Meine Familie musste schnell fliehen.', translation: 'Mi familia tuvo que huir rápido.', vocab: [{ de: 'fliehen', es: 'huir', diff: 1 }] },
            { speaker: 'Elena', text: 'Sie mussten oft gegen Hunger kämpfen.', translation: 'Tuvieron que luchar a menudo contra el hambre.', vocab: [{ de: 'kämpfen gegen', es: 'luchar contra', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Ja. Ich setze mich für Menschenrechte ein.', translation: 'Sí. Yo me comprometo (intercedo) por los derechos humanos.', vocab: [{ de: 'sich einsetzen für', es: 'interceder por', diff: 1 }, { de: 'das Menschenrecht', es: 'el derecho humano', diff: 0 }] },
            { speaker: 'Herr Weber', text: 'Wir müssen jedes Vorurteil bekämpfen.', translation: 'Tenemos que combatir cada prejuicio.', vocab: [{ de: 'das Vorurteil', es: 'el prejuicio', diff: 1 }] },
            { speaker: 'Lukas', text: 'Da hast du völlig recht!', translation: '¡Ahí tienes toda la razón!', isRedemittel: true, vocab: [{ de: 'recht haben', es: 'tener razón', diff: 1 }] },
            { speaker: 'Lukas', text: 'Es gibt ein Gewitter. Da war ein Blitz!', translation: 'Hay una tormenta. ¡Allí hubo un rayo!', vocab: [{ de: 'das Gewitter', es: 'la tormenta eléctrica', diff: 0 }, { de: 'der Blitz', es: 'el rayo', diff: 1 }] },
            { speaker: 'Lukas', text: 'Elena! Es gab einen Diebstahl in der Galerie!', translation: '¡Elena! ¡Hubo un robo en la galería!', vocab: [{ de: 'der Diebstahl', es: 'el robo', diff: 1 }] },
            { speaker: 'Lukas', text: 'Die Polizei muss den Dieb verhaften.', translation: 'La policía debe detener al ladrón.', vocab: [{ de: 'verhaften', es: 'detener', diff: 1 }] }
        ];
        window.__DEFAULT_GUION__ = DEFAULT_GUION;

        const TEMPUS_DICT = {
            "ausstellen": "Prät: stellte aus | Perf: hat ausgestellt",
            "bekommen": "Prät: bekam | Perf: hat bekommen",
            "entstehen": "Prät: entstand | Perf: ist entstanden",
            "entstanden": "Prät: entstand | Perf: ist entstanden",
            "sehen": "Prät: sah | Perf: hat gesehen",
            "sieht": "Prät: sah | Perf: hat gesehen",
            "geboren": "Prät: wurde geboren | Perf: ist geboren worden",
            "fliehen": "Prät: floh | Perf: ist geflohen",
            "kämpfen": "Prät: kämpfte | Perf: hat gekämpft",
            "anerkennen": "Prät: erkannte an | Perf: hat anerkannt",
            "stehlen": "Prät: stahl | Perf: hat gestohlen",
            "gestohlen": "Prät: stahl | Perf: hat gestohlen",
            "verhaften": "Prät: verhaftete | Perf: hat verhaftet",
            "sterben": "Prät: starb | Perf: ist gestorben",
            "gestorben": "Prät: starb | Perf: ist gestorben",
            "einsetzen": "Prät: setzte ein | Perf: hat eingesetzt",
            "essen": "PrÃ¤t: aÃŸ | Perf: hat gegessen",
            "trinken": "Prät: trank | Perf: hat getrunken",
            "fahren": "Prät: fuhr | Perf: ist gefahren",
            "gehen": "Prät: ging | Perf: ist gegangen",
            "kommen": "Prät: kam | Perf: ist gekommen",
            "sprechen": "Prät: sprach | Perf: hat gesprochen",
            "nehmen": "Prät: nahm | Perf: hat genommen",
            "geben": "Prät: gab | Perf: hat gegeben",
            "helfen": "Prät: half | Perf: hat geholfen",
            "laufen": "Prät: lief | Perf: ist gelaufen",
            "schlafen": "Prät: schlief | Perf: hat geschlafen",
            "treffen": "Prät: traf | Perf: hat getroffen",
            "finden": "Prät: fand | Perf: hat gefunden",
            "bleiben": "Prät: blieb | Perf: ist geblieben",
            "tragen": "Prät: trug | Perf: hat getragen",
            "waschen": "Prät: wusch | Perf: hat gewaschen",
            "verlieren": "Prät: verlor | Perf: hat verloren",
            "schreiben": "Prät: schrieb | Perf: hat geschrieben",
            "lesen": "Prät: las | Perf: hat gelesen",
            "wissen": "Prät: wusste | Perf: hat gewusst",
            "denken": "Prät: dachte | Perf: hat gedacht",
            "bringen": "Prät: brachte | Perf: hat gebracht",
            "kennen": "Prät: kannte | Perf: hat gekannt",
            "nennen": "Prät: nannte | Perf: hat genannt"
        };

                const BX_DB_EMPTY = { vocabulario: [], verbos: [], preposiciones: [], conectores: [], redemittel: [] };
        function normalizeBxPayload(data) {
            if (!data || typeof data !== 'object') return { b1: { ...BX_DB_EMPTY }, b2: { ...BX_DB_EMPTY } };
            const b1 = data.b1 || data.B1;
            const b2 = data.b2 || data.B2;
            return {
                b1: b1 ? { ...BX_DB_EMPTY, ...b1 } : { ...BX_DB_EMPTY },
                b2: b2 ? { ...BX_DB_EMPTY, ...b2 } : { ...BX_DB_EMPTY }
            };
        }
        const BX_DB_FALLBACK = normalizeBxPayload({
            b1: {
                vocabulario: [{ b1: "Daten werden geladen ⬦", b2: "b1-b2-database.json fehlt oder Netzwerkfehler.", es: "", trick: "Coloca b1-b2-database.json junto a index.html en el servidor." }]
            },
            b2: {
                vocabulario: [{ b1: "Daten werden geladen ⬦", b2: "Mismo JSON: claves b1 y b2.", es: "", trick: "Amplía arrays en el JSON sin tocar index.html." }]
            }
        });

        function tryBxSession() {
            try {
                const raw = sessionStorage.getItem('muller_b1b2_json_v1');
                if (!raw) return null;
                return normalizeBxPayload(JSON.parse(raw));
            } catch (e) {
                return null;
            }
        }

        const GRAMMAR_PATTERNS = [
            { regex: /(interessier[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|sehr|wirklich)\s+)*für)/gi, tooltip: "sich interessieren für + Akk", base: "sich interessieren für" },
            { regex: /(gegen\s+(?:.*?\s+)?kämpfen|kämpfen\s+(?:.*?\s+)?gegen)/gi, tooltip: "kämpfen gegen + Akk", base: "kämpfen gegen" },
            { regex: /(setz[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|heute|jetzt)\s+)*(?:.*?\s+)?für(?:.*?\s+)?ein)/gi, tooltip: "sich einsetzen für + Akk", base: "sich einsetzen für" },
            { regex: /(erinner[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|noch|sehr)\s+)*an)/gi, tooltip: "sich erinnern an + Akk", base: "sich erinnern an" },
            { regex: /(wart[en|e|et]+\s+(?:.*?\s+)?auf)/gi, tooltip: "warten auf + Akk", base: "warten auf" }
        ];

        const CONN_LIST = ["weil", "dass", "obwohl", "wenn", "als", "damit", "ob", "bevor", "nachdem", "deshalb", "deswegen", "darum", "trotzdem", "dann", "danach", "auÃŸerdem", "und", "aber", "oder", "denn", "sondern"];
        const PREP_DAT = ["aus", "bei", "mit", "nach", "seit", "von", "zu", "ab"];
        const PREP_AKK = ["durch", "für", "gegen", "ohne", "um"];
        const PREP_WECHSEL = ["in", "an", "auf", "neben", "hinter", "über", "unter", "vor", "zwischen"];

        const MULLER_BX_USER_OVERLAY_KEY = 'muller_bx_user_overlay_v1';

        const MULLER_ACCOUNTS_KEY = 'muller_accounts_v1';
        const MULLER_SESSION_KEY = 'muller_session_v1';

        const MULLER_BOT_PLAYERS = [
            { id: 'bot_elena', name: 'Elena Vogt', tag: 'München', lvl: 'B2' },
            { id: 'bot_jonas', name: 'Jonas Keller', tag: 'Hamburg', lvl: 'B1' },
            { id: 'bot_fatima', name: 'Fatima Al-Sayed', tag: 'Köln', lvl: 'B2' },
            { id: 'bot_lukas', name: 'Lukas Brandt', tag: 'Berlin', lvl: 'B1' },
            { id: 'bot_sophie', name: 'Sophie Nguyen', tag: 'Frankfurt', lvl: 'B2' },
            { id: 'bot_marco', name: 'Marco Rossi', tag: 'Stuttgart', lvl: 'B1' },
            { id: 'bot_nina', name: 'Nina Hoffmann', tag: 'Leipzig', lvl: 'B2' },
            { id: 'bot_ken', name: 'Ken Yamamoto', tag: 'Dresden', lvl: 'B1' },
            { id: 'bot_laura', name: 'Laura García', tag: 'Madrid', lvl: 'B2' },
            { id: 'bot_timo', name: 'Timo Schulz', tag: 'Bremen', lvl: 'B1' },
            { id: 'bot_aylin', name: 'Aylin Demir', tag: 'Düsseldorf', lvl: 'B2' },
            { id: 'bot_felix', name: 'Felix Werner', tag: 'Nürnberg', lvl: 'B1' },
            { id: 'bot_mira', name: 'Mira Popov', tag: 'Wien', lvl: 'B2' },
            { id: 'bot_oscar', name: 'Ã“scar Prieto', tag: 'Barcelona', lvl: 'B1' },
        ];

        function mullerHash32(str) {
            let h = 2166136261 >>> 0;
            const s = String(str);
            for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
            return h >>> 0;
        }

        function mullerIsoWeekMonday(d) {
            d = d || new Date();
            const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const day = x.getDay() || 7;
            if (day !== 1) x.setDate(x.getDate() - (day - 1));
            return x.toISOString().slice(0, 10);
        }

        function mullerMaskEmail(email) {
            const e = String(email || '');
            const at = e.indexOf('@');
            if (at < 1) return e || 'â€”';
            return e.slice(0, 2) + '***' + e.slice(at);
        }

        function mullerAccountsLoad() {
            try {
                const raw = localStorage.getItem(MULLER_ACCOUNTS_KEY);
                if (!raw) return {};
                const o = JSON.parse(raw);
                return o && typeof o === 'object' ? o : {};
            } catch (err) { return {}; }
        }

        function mullerAccountsSave(map) {
            try { localStorage.setItem(MULLER_ACCOUNTS_KEY, JSON.stringify(map)); } catch (err) {}
        }

        function mullerRandomSaltBytes() {
            const a = new Uint8Array(16);
            crypto.getRandomValues(a);
            return a;
        }

        function mullerBytesToB64(u8) {
            let s = '';
            for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
            return btoa(s);
        }

        function mullerB64ToBytes(b64) {
            const bin = atob(b64);
            const u8 = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
            return u8;
        }

        async function mullerHashPassword(password, saltBytes) {
            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
            const bits = await crypto.subtle.deriveBits(
                { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
                keyMaterial,
                256
            );
            return new Uint8Array(bits);
        }

        async function mullerAuthRegister(email, password, displayName) {
            if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('CRYPTO_UNAVAILABLE');
            const em = String(email || '').trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) throw new Error('EMAIL_INVALID');
            if (!password || password.length < 6) throw new Error('PASS_SHORT');
            const acc = mullerAccountsLoad();
            if (acc[em]) throw new Error('EMAIL_TAKEN');
            const salt = mullerRandomSaltBytes();
            const hash = await mullerHashPassword(password, salt);
            const userId = 'u_' + Date.now().toString(36) + '_' + (mullerHash32(em) % 1000000000).toString(36);
            acc[em] = {
                userId,
                displayName: String(displayName || '').trim() || 'Estudiante',
                saltB64: mullerBytesToB64(salt),
                hashB64: mullerBytesToB64(hash),
                createdAt: new Date().toISOString()
            };
            mullerAccountsSave(acc);
            try { localStorage.setItem(MULLER_SESSION_KEY, JSON.stringify({ email: em })); } catch (err) {}
            return acc[em];
        }

        async function mullerAuthLogin(email, password) {
            if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('CRYPTO_UNAVAILABLE');
            const em = String(email || '').trim().toLowerCase();
            const acc = mullerAccountsLoad()[em];
            if (!acc || !acc.saltB64 || !acc.hashB64) throw new Error('BAD_CREDENTIALS');
            const salt = mullerB64ToBytes(acc.saltB64);
            const hash = await mullerHashPassword(password, salt);
            const target = mullerB64ToBytes(acc.hashB64);
            if (hash.length !== target.length) throw new Error('BAD_CREDENTIALS');
            for (let i = 0; i < hash.length; i++) if (hash[i] !== target[i]) throw new Error('BAD_CREDENTIALS');
            try { localStorage.setItem(MULLER_SESSION_KEY, JSON.stringify({ email: em })); } catch (err) {}
            return acc;
        }

        function mullerAuthLogout() {
            try { localStorage.removeItem(MULLER_SESSION_KEY); } catch (err) {}
        }

        function mullerAuthGetSession() {
            try {
                const raw = localStorage.getItem(MULLER_SESSION_KEY);
                if (!raw) return null;
                const o = JSON.parse(raw);
                const em = o && o.email ? String(o.email).toLowerCase() : '';
                if (!em) return null;
                const acc = mullerAccountsLoad()[em];
                if (!acc) return null;
                return { email: em, displayName: acc.displayName, userId: acc.userId, createdAt: acc.createdAt };
            } catch (err) { return null; }
        }

        function mullerLeagueComputeUserScore(stats) {
            if (!stats || typeof stats !== 'object') return 0;
            const xp = Number(stats.xp) || 0;
            const coins = Number(stats.coins) || 0;
            const streak = Number(stats.streakDays) || 0;
            const diktat = Number(stats.diktatCorrect) || 0;
            const pron = Number(stats.pronunciationAttempts) || 0;
            const raw = xp * 0.12 + coins * 0.35 + streak * 28 + diktat * 3 + pron * 2;
            return Math.max(0, Math.min(99999, Math.floor(raw)));
        }

        function mullerBotWeekScore(botId, weekKey) {
            const h = mullerHash32(String(botId) + '|' + String(weekKey));
            const h2 = mullerHash32(String(weekKey) + '|' + String(botId));
            const base = 900 + (h % 4200);
            const wave = (h2 % 1400) - 200;
            return Math.max(100, Math.min(99999, base + wave));
        }

        function mullerLeagueBuildRanking(userStats, username, session) {
            const week = mullerIsoWeekMonday();
            const userScore = mullerLeagueComputeUserScore(userStats);
            const rows = [
                {
                    id: 'local_player',
                    name: username || 'Estudiante',
                    isBot: false,
                    isSelf: true,
                    score: userScore,
                    sub: session ? mullerMaskEmail(session.email) : 'Invitado (sin email en este dispositivo)',
                    rank: 0
                },
                ...MULLER_BOT_PLAYERS.map((b) => ({
                    id: b.id,
                    name: b.name,
                    isBot: true,
                    isSelf: false,
                    score: mullerBotWeekScore(b.id, week),
                    sub: b.tag + ' · ' + b.lvl,
                    rank: 0
                }))
            ];
            rows.sort((a, b) => b.score - a.score);
            rows.forEach((r, i) => { r.rank = i + 1; });
            return { week, rows };
        }

        function mullerSupabaseConfigured() {
            const u = window.MULLER_SUPABASE_URL && String(window.MULLER_SUPABASE_URL).trim();
            const k = window.MULLER_SUPABASE_ANON_KEY && String(window.MULLER_SUPABASE_ANON_KEY).trim();
            return !!(u && k);
        }

        function mullerGetSupabaseClient() {
            if (!mullerSupabaseConfigured()) return null;
            if (window.__mullerSbClient) return window.__mullerSbClient;
            const g = typeof self !== 'undefined' ? self : window;
            const mod = g.supabase;
            const createClient = mod && typeof mod.createClient === 'function' ? mod.createClient : null;
            if (!createClient) return null;
            try {
                window.__mullerSbClient = createClient(
                    String(window.MULLER_SUPABASE_URL).trim(),
                    String(window.MULLER_SUPABASE_ANON_KEY).trim(),
                    {
                        auth: {
                            persistSession: true,
                            autoRefreshToken: true,
                            detectSessionInUrl: true,
                            storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
                        },
                    }
                );
            } catch (err) {
                return null;
            }
            return window.__mullerSbClient;
        }

        function mullerCloudSyncErrorLabel(error) {
            if (!error) return 'Error de nube';
            const code = String(error.code || '').trim();
            const msg = String(error.message || error.details || error.hint || '').toLowerCase();
            if (code === '42P01' || (msg.includes('relation') && msg.includes('does not exist')) || msg.includes('muller_user_state')) {
                return 'Falta tabla nube';
            }
            if (code === '42501' || msg.includes('permission denied') || msg.includes('row-level security') || msg.includes('rls')) {
                return 'Permisos nube';
            }
            if (msg.includes('jwt') || msg.includes('token') || msg.includes('expired')) {
                return 'Sesion nube expirada';
            }
            return 'Error al leer nube';
        }

        function tryBxUserOverlay() {
            try {
                const raw = localStorage.getItem(MULLER_BX_USER_OVERLAY_KEY);
                if (!raw) return normalizeBxPayload({});
                return normalizeBxPayload(JSON.parse(raw));
            } catch (e) {
                return normalizeBxPayload({});
            }
        }

        function mergeBxLevel(base, extra) {
            const out = {};
            Object.keys(BX_DB_EMPTY).forEach((k) => {
                out[k] = [...(base[k] || []), ...(extra[k] || [])];
            });
            return out;
        }

        function mergeBxDatabases(remoteNorm, overlayNorm) {
            const r = normalizeBxPayload(remoteNorm || {});
            const o = normalizeBxPayload(overlayNorm || {});
            return {
                b1: mergeBxLevel(r.b1, o.b1),
                b2: mergeBxLevel(r.b2, o.b2)
            };
        }

        function mullerFindUserBxCategory(overlayNorm, level, uid) {
            if (!uid || !overlayNorm || !overlayNorm[level]) return null;
            const lv = overlayNorm[level];
            for (const cat of Object.keys(BX_DB_EMPTY)) {
                const arr = lv[cat];
                if (!Array.isArray(arr)) continue;
                if (arr.some((x) => x && x._mullerUid === uid)) return cat;
            }
            return null;
        }

        function mullerBxItemKey(item) {
            return (item.b1 || '') + '\u0000' + (item.b2 || '') + '\u0000' + (item.es || '');
        }

        /** Quita tarjetas de usuario cuyo Distribuir se hizo con un guion guardado concreto (id en Biblioteca). */
        function mullerStripBxOverlayBySourceScriptId(overlayNorm, scriptId) {
            const sid = scriptId != null ? String(scriptId) : '';
            if (!sid) return normalizeBxPayload(overlayNorm || {});
            const o = JSON.parse(JSON.stringify(normalizeBxPayload(overlayNorm || {})));
            ['b1', 'b2'].forEach((lv) => {
                Object.keys(BX_DB_EMPTY).forEach((cat) => {
                    o[lv][cat] = (o[lv][cat] || []).filter((x) => String(x && x._mullerSourceScriptId || '') !== sid);
                });
            });
            return o;
        }

        /** Conectores típicos al inicio de frase (no incluimos und/oder/aber para reducir falsos positivos). */
        const MULLER_BX_CONN_START = ['weil', 'dass', 'obwohl', 'wenn', 'als', 'damit', 'ob', 'bevor', 'nachdem', 'deshalb', 'deswegen', 'darum', 'trotzdem', 'dann', 'danach', 'auÃŸerdem', 'denn', 'sondern', 'falls', 'sobald', 'solange', 'wÃ¤hrend', 'zuerst', 'anschlieÃŸend', 'schlieÃŸlich', 'zunÃ¤chst', 'inzwischen', 'allerdings', 'jedoch', 'hingegen', 'folglich', 'trotz', 'auÃŸer', 'indem'];

        function mullerClassifyBibliotecaLine(german, meta) {
            if (!german || typeof german !== 'string') return 'vocabulario';
            const g = german.replace(/\s+/g, ' ').trim();
            const lower = g.toLowerCase();
            if (meta && meta.isRedemittel) return 'redemittel';

            const firstTok = lower.split(/[\s,.;:]+/).filter(Boolean)[0] || '';
            if (MULLER_BX_CONN_START.includes(firstTok)) return 'conectores';

            const connMulti = ['zuerst', 'danach', 'spÃ¤ter', 'schlieÃŸlich', 'zunÃ¤chst', 'anschlieÃŸend', 'inzwischen', 'deswegen', 'trotzdem', 'allerdings', 'hingegen', 'folglich', 'auÃŸerdem', 'jedoch', 'dafÃ¼r', 'dagegen', 'dabei', 'sonst'];
            if (connMulti.some((c) => lower.startsWith(c + ' '))) return 'conectores';

            if (/^(können|könnte|könnten|dürfte|dürfen|entschuldigung|vielen dank|danke|herzlichen|guten tag|guten morgen|guten abend|bis bald|auf wiedersehen|wie bitte|kein problem|ich möchte|ich hätte gerne|ich würde gerne|lass uns|wir könnten|ich bin der meinung)/i.test(lower) && g.length < 140) return 'redemittel';

            if (/^(sich\s+[a-zÃ¤Ã¶Ã¼ÃŸ]+\s+(an|auf|fÃ¼r|von|Ã¼ber|mit|zu)\b)/i.test(g)) return 'verbos';
            if (/\b(freuen|erinnern|halten|denken|sorgen|interessieren|vorbereiten|kümmern|verlassen|verzichten|bewerben|verabreden|entscheiden|einigen|bemühen|verstehen|bedanken)\s+(mich|dich|sich|uns|euch)?\s*(an|auf|für|von|über|mit|zu|in)\b/i.test(lower)) return 'verbos';

            const words = g.split(/\s+/).filter(Boolean);
            if (meta && meta.isPair && words.length <= 5) return 'vocabulario';

            if (words.length <= 3 && /^[a-zÃ¤Ã¶Ã¼ÃŸ]+(en|eln|ern)$/i.test(words[0])) return 'verbos';

            if (/^(an|auf|in|mit|für|zu|von|über|unter|vor|nach|aus|bei|gegen|ohne|um|anstatt|trotz|während)\s+(dem|der|den|das|die|ein|eine|mich|dir|mir|sich|ihm|ihr|uns|euch)/i.test(g)) return 'preposiciones';

            if (/\b(an|auf|in|mit|für|zu|von|über|nach|vor|aus|bei)\s+(dem|der|den|das|die|ein|eine|mich|dich|sich)\b/i.test(lower)) {
                if (/^(ich|du|er|sie|es|wir|ihr|man|sie)\s+/i.test(g)) return 'preposiciones';
                if (words.length <= 8) return 'preposiciones';
            }

            if (/^(ich|du|er|sie|es|wir|ihr|man)\s+.+\b(an|auf|mit|für|zu|von|über|in|nach|vor|aus|bei)\s+(dem|der|den|das|die|ein|eine|mich|dich|sich)\b/i.test(g)) return 'preposiciones';

            return 'vocabulario';
        }

        function mullerExtractBibliotecaSegments(raw) {
            const out = [];
            if (!raw || typeof raw !== 'string') return out;
            const lines = raw.split(/\n/);
            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('#')) continue;

                const speakerMatch = line.match(/^([^:]+):\s*(.+)$/);
                if (speakerMatch) {
                    let content = speakerMatch[2];
                    const isRedemittel = /\[R\]|\bNützlich\b/i.test(content);
                    content = content.replace(/\[R\]/g, '').replace(/\bNützlich\.?\s*/gi, '').trim();

                    let vocabInner = null;
                    const vocabMatch = content.match(/\[(.*?)\]/);
                    if (vocabMatch) {
                        vocabInner = vocabMatch[1];
                        content = content.replace(vocabMatch[0], '').trim();
                    }

                    let translation = '';
                    const transMatch = content.match(/\(([^)]+)\)/);
                    if (transMatch) {
                        translation = transMatch[1].trim();
                        content = content.replace(transMatch[0], '').trim();
                    }

                    const germanText = content.replace(/[ðŸ”´ðŸ”µðŸŸ¢â€¢]/g, '').replace(/\s+/g, ' ').trim();
                    if (germanText) out.push({ german: germanText, es: translation, isRedemittel });

                    if (vocabInner) {
                        vocabInner.split(',').forEach((piece) => {
                            const parts = piece.split('-');
                            if (parts.length >= 2) {
                                const de = parts[0].trim().replace(/[ðŸ”´ðŸ”µðŸŸ¢â€¢]/g, '');
                                const es = parts.slice(1).join('-').trim();
                                if (de) out.push({ german: de, es: es, isRedemittel: false, isPair: true });
                            }
                        });
                    }
                    continue;
                }

                const pairMatch = line.match(/^(.+?)\s*[-â€“â€”]\s*(.+)$/);
                if (pairMatch && !line.includes(':')) {
                    const de = pairMatch[1].replace(/^[⬢\-\d.)\]]+\s*/, '').trim();
                    const es = pairMatch[2].trim();
                    const looksDe = /[Ã¤Ã¶Ã¼ÃŸÃ„Ã–Ãœ]/.test(de) || /^(der|die|das|ein|eine|ich|du|sich|und|nicht)\b/i.test(de);
                    if (de && es && looksDe) {
                        out.push({ german: de, es: es, isRedemittel: false, isPair: true });
                        continue;
                    }
                }

                const plain = line.replace(/^[⬢\-\d.)\]]+\s*/, '').trim();
                if (plain.length >= 2) out.push({ german: plain, es: '', isRedemittel: false });
            }
            return out;
        }

        /** Lista plana de ítems para distribuir (sin duplicados). */
        function mullerBibliotecaFlatItems(text) {
            const segs = mullerExtractBibliotecaSegments(text);
            const out = [];
            const seen = new Set();
            for (const seg of segs) {
                const cat = mullerClassifyBibliotecaLine(seg.german, seg);
                const es = seg.es && seg.es.length ? seg.es : '(añade traducción en la tarjeta)';
                const item = {
                    b1: seg.german,
                    b2: seg.german,
                    es: es,
                    trick: 'Biblioteca · ' + cat + ' · heurística local (sin IA)'
                };
                const k = mullerBxItemKey(item) + '|' + cat;
                if (seen.has(k)) continue;
                seen.add(k);
                out.push({ cat, item, seg });
            }
            return out;
        }

        /** Heurística local B1 vs B2 por frase (no es IA; revisa en B1/B2 si falla). */
        function mullerGuessBibliotecaItemLevel(item, seg) {
            const g = (item.b1 || '').trim();
            if (!g) return 'b1';
            const lower = g.toLowerCase();
            const words = g.split(/\s+/).filter(Boolean);
            const w = words.length;

            if (seg && seg.isPair && w <= 5) return 'b1';

            if (/\b(Herausforderung|Bedeutung|MaÃŸnahmen|entsprechend|voraussichtlich|gleichwohl|insofern|hinsichtlich|bezÃ¼glich|unabhÃ¤ngig davon|im Hinblick auf|von groÃŸer)\b/i.test(g)) return 'b2';
            if (/\b(sodass|sofern|sobald|solange|anstatt dass|ohne dass|wobei|wodurch|weshalb)\b/i.test(lower)) return 'b2';
            if (/\b(dessen|deren|wessen)\b/i.test(lower) && w > 4) return 'b2';
            if (g.length > 115) return 'b2';
            if (w >= 17) return 'b2';
            if (/\b(wurde|wurden|worden)\b/i.test(lower) && w > 6) return 'b2';

            if (w <= 10 && g.length <= 75) return 'b1';
            if (w <= 13) return 'b1';

            return 'b2';
        }

        function mullerBibliotecaTextToBxBuckets(text) {
            const buckets = { vocabulario: [], verbos: [], preposiciones: [], conectores: [], redemittel: [] };
            const flat = mullerBibliotecaFlatItems(text);
            for (const { cat, item } of flat) {
                buckets[cat].push(item);
            }
            return {
                buckets,
                counts: {
                    vocabulario: buckets.vocabulario.length,
                    verbos: buckets.verbos.length,
                    preposiciones: buckets.preposiciones.length,
                    conectores: buckets.conectores.length,
                    redemittel: buckets.redemittel.length,
                    total: flat.length
                }
            };
        }

        const WRITING_COPY_DRILLS = [
            "Der Termin findet am Dienstag statt.",
            "Ich würde gerne einen Termin vereinbaren.",
            "Können Sie mir bitte helfen?",
            "Das Wetter ist heute sehr schön.",
            "Ich interessiere mich für Kunst und Kultur.",
            "Trotz des Regens sind wir spazieren gegangen.",
            "Wegen des Staus kam ich zu spät.",
            "Sobald ich Zeit habe, rufe ich dich an.",
            "Entschuldigung, ich habe mich verspätet.",
            "Könnten Sie das bitte wiederholen?"
        ];
        const WRITING_PROMPTS_DE = [
            { de: "Beschreibe deinen typischen Arbeitstag.", es: "Describe tu día laboral típico." },
            { de: "Was machst du gern in deiner Freizeit?", es: "¿Qué te gusta hacer en tu tiempo libre?" },
            { de: "Erzähle von deiner letzten Reise.", es: "Habla de tu último viaje." },
            { de: "Warum lernst du Deutsch?", es: "¿Por qué estudias alemán?" },
            { de: "Was sind deine Pläne für die Zukunft?", es: "¿Cuáles son tus planes para el futuro?" },
            { de: "Beschreibe dein Zuhause.", es: "Describe tu hogar." },
            { de: "Was isst du gern? Was isst du nicht gern?", es: "¿Qué te gusta y qué no te gusta comer?" },
            { de: "Schreibe einen kurzen Brief an einen Freund.", es: "Escribe una carta corta a un amigo." }
        ];
        const WRITING_DICTATION_LINES = [
            { de: "Guten Tag, ich habe eine Frage.", es: "Buenos días, tengo una pregunta." },
            { de: "Der Schlüssel liegt auf dem Tisch.", es: "La llave está sobre la mesa." },
            { de: "Wir treffen uns um acht Uhr.", es: "Quedamos a las ocho." },
            { de: "Ich freue mich auf das Wochenende.", es: "Me alegro por el fin de semana." },
            { de: "Das Museum ist heute geschlossen.", es: "El museo está cerrado hoy." }
        ];
        const WRITING_TELC_TASKS = [
            {
                title: 'TELC B1 · E-Mail informal (invitar/cancelar)',
                level: 'B1',
                promptEs: 'Escribe un email a una amiga alemana. Debes: saludar, explicar por qué escribes, dar 2 detalles (fecha/lugar), pedir confirmación y despedirte.',
                scaffoldDe: [
                    'Betreff: Einladung am Samstag',
                    'Liebe Anna,',
                    'ich schreibe dir, weil ...',
                    'Am ... um ... treffen wir uns in/bei ...',
                    'Kannst du mir bitte bis ... antworten?',
                    'Liebe GrÃ¼ÃŸe',
                    'Dein/Deine ...'
                ],
                checklist: ['Anrede + saludo', 'Motivo claro', '2 datos concretos', 'Petición/pregunta', 'Despedida']
            },
            {
                title: 'TELC B1 · Beschwerde (correo formal corto)',
                level: 'B1',
                promptEs: 'Reclamación simple por un problema con una compra online. Incluye: qué compraste, qué problema hay, qué solución quieres.',
                scaffoldDe: [
                    'Betreff: Reklamation meiner Bestellung',
                    'Sehr geehrte Damen und Herren,',
                    'am ... habe ich ... bestellt.',
                    'Leider habe ich folgendes Problem: ...',
                    'Ich bitte Sie um ... (Ersatz/Rückerstattung).',
                    'Mit freundlichen GrÃ¼ÃŸen'
                ],
                checklist: ['Registro formal (Sie)', 'Problema descrito', 'Solicitud explícita', 'Cierre formal']
            },
            {
                title: 'TELC B2 · E-Mail formal (petición argumentada)',
                level: 'B2',
                promptEs: 'Escribe a una institución para solicitar un cambio de fecha. Justifica, propone alternativa y muestra cortesía formal.',
                scaffoldDe: [
                    'Betreff: Bitte um Terminverschiebung',
                    'Sehr geehrte Damen und Herren,',
                    'hiermit möchte ich höflich um ... bitten.',
                    'Aus folgenden Gründen ist der ursprüngliche Termin schwierig: ...',
                    'Als Alternative schlage ich ... vor.',
                    'Für Ihr Verständnis bedanke ich mich im Voraus.',
                    'Mit freundlichen GrÃ¼ÃŸen'
                ],
                checklist: ['Objetivo claro', 'Justificación desarrollada', 'Alternativa concreta', 'Registro B2 formal']
            },
            {
                title: 'TELC B2 · Carta al periódico (opinión)',
                level: 'B2',
                promptEs: 'Carta de opinión sobre el uso del móvil en clase/trabajo. Estructura: introducción, postura, 2 argumentos, cierre.',
                scaffoldDe: [
                    'Betreff: Stellungnahme zum Thema ...',
                    'Sehr geehrte Redaktion,',
                    'mit Interesse habe ich Ihren Artikel über ... gelesen.',
                    'Meiner Meinung nach ...',
                    'Erstens ... / Zweitens ...',
                    'Zusammenfassend bin ich der Auffassung, dass ...',
                    'Mit freundlichen GrÃ¼ÃŸen'
                ],
                checklist: ['Introducción referida al tema', 'Opinión explícita', '2 argumentos conectados', 'Conclusión clara']
            }
        ];
        const LETTER_DRILLS = [
            { title: "Umlaute Ã„ Ã– Ãœ und ÃŸ", sample: "Ã„pfel Â· Ã–l Â· Ãœber Â· StraÃŸe", practice: "Ã„pfel Ã–l Ãœber StraÃŸe" },
            { title: "Alltag", sample: "schÃ¶n Â· mÃ¼de Â· hÃ¶ren Â· groÃŸ", practice: "SchÃ¶n mÃ¼de hÃ¶ren groÃŸ" },
            { title: "Satzanfang", sample: "GroÃŸschreibung: Ich, Du, Der, Die", practice: "Ich lerne Deutsch jeden Tag." }
        ];

        const levenshteinDistance = (a, b) => {
            if (a.length === 0) return b.length;
            if (b.length === 0) return a.length;
            const matrix = [];
            for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
            for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                    }
                }
            }
            return matrix[b.length][a.length];
        };

        /** Quita repeticiones consecutivas de la misma palabra (STT mÃ³vil suele duplicar 5â€“20 veces). */
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

        /** Normaliza texto alemÃ¡n para comparar lo que dicta el STT con el guion (umlauts, ÃŸ, puntuaciÃ³n). */
        const normalizeGermanSpeechText = (s) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.toLowerCase().trim();
            t = t.replace(/\u00df/g, 'ss').replace(/ÃŸ/g, 'ss');
            t = t.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
            t = t.replace(/[â€™'`Â´]/g, "'");
            t = t.replace(/[^a-z0-9\s']/g, ' ');
            t = t.replace(/\s+/g, ' ').trim();
            return t;
        };
        const mullerPdfCleanText = (s) => String(s || '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\s+\n/g, '\n')
            .replace(/\n\s+/g, '\n')
            .trim();
        const mullerPdfGuessUnitLesson = (s) => {
            const txt = String(s || '');
            const unitHit = txt.match(/\b(?:Lektion|Einheit|Unidad|Unit)\s*[:\-]?\s*([A-Z0-9Ã„Ã–Ãœa-zÃ¤Ã¶Ã¼ÃŸ]+)/i);
            const lessonHit = txt.match(/\b(?:Thema|Tema|Kapitel|Lecci[oÃ³]n)\s*[:\-]?\s*([A-Z0-9Ã„Ã–Ãœa-zÃ¤Ã¶Ã¼ÃŸ]+)/i);
            return {
                unit: unitHit ? String(unitHit[1] || '').trim() : '',
                lesson: lessonHit ? String(lessonHit[1] || '').trim() : ''
            };
        };

        const MULLER_READING_FONT_STORAGE = 'muller_reading_font_px_v1';
        const MULLER_READING_FONT_MIN = 14;
        const MULLER_READING_FONT_MAX = 34;
        const MULLER_READING_FONT_STEP = 1;
        const MULLER_MIC_PERMISSION_PREF_KEY = 'muller_auto_request_mic_v1';
        const mullerClamp = (n, min, max) => Math.max(min, Math.min(max, n));
        const mullerNormalizeGermanWordToken = (raw) => String(raw || '')
            .toLowerCase()
            .replace(/[äöüß]/g, function(m) { return {ä:'ae',ö:'oe',ü:'ue',ß:'ss'}[m]; })
            .replace(/^[^a-z]+|[^a-z]+$/gi, '')
            .trim();
        const mullerReadingTokenizeText = (text) => String(text || '')
            .split(/(\s+)/)
            .map((chunk) => {
                if (!chunk) return { text: '', word: '', clickable: false };
                if (/^\s+$/.test(chunk)) return { text: chunk, word: '', clickable: false };
                const clean = mullerNormalizeGermanWordToken(chunk);
                return { text: chunk, word: clean, clickable: !!clean };
            });
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

        /** SRS vocabulario (SM-2 simplificado): mapa en localStorage `muller_vocab_srs_v1` */
        const MULLER_VOCAB_SRS_STORAGE = 'muller_vocab_srs_v1';
        function mullerVocabSrsKey(w) {
            const de = (w && w.de ? String(w.de) : '').trim().toLowerCase();
            const es = (w && w.es ? String(w.es) : '').trim().toLowerCase();
            return de + '\u0000' + es;
        }
        function mullerGetVocabSrsMap() {
            try {
                const raw = localStorage.getItem(MULLER_VOCAB_SRS_STORAGE);
                return raw ? JSON.parse(raw) : {};
            } catch (e) { return {}; }
        }
        function mullerSetVocabSrsMap(map) {
            try { localStorage.setItem(MULLER_VOCAB_SRS_STORAGE, JSON.stringify(map)); } catch (e) {}
        }
        function mullerApplyVocabSrsRating(map, word, level) {
            const key = mullerVocabSrsKey(word);
            const todayStr = new Date().toISOString().slice(0, 10);
            const prev = map[key] || null;
            const q = level === 'hard' ? 2 : level === 'normal' ? 3 : 4;
            let interval = prev && typeof prev.interval === 'number' ? prev.interval : 0;
            let repetitions = prev && typeof prev.repetitions === 'number' ? prev.repetitions : 0;
            let easeFactor = prev && typeof prev.easeFactor === 'number' ? prev.easeFactor : 2.5;
            if (q < 3) {
                repetitions = 0;
                interval = 1;
                easeFactor = Math.max(1.3, easeFactor - 0.2);
            } else {
                if (repetitions === 0) interval = 1;
                else if (repetitions === 1) interval = 6;
                else interval = Math.max(1, Math.round(interval * easeFactor));
                repetitions += 1;
                easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
                easeFactor = Math.max(1.3, easeFactor);
            }
            const dueDate = new Date(todayStr + 'T12:00:00');
            dueDate.setDate(dueDate.getDate() + interval);
            const due = dueDate.toISOString().slice(0, 10);
            const prevVC = prev && typeof prev.viewCount === 'number' ? prev.viewCount : 0;
            const ratedCount = (prev && typeof prev.ratedCount === 'number' ? prev.ratedCount : 0) + 1;
            return { ...map, [key]: { interval, repetitions, easeFactor, due, lastRated: todayStr, viewCount: Math.max(prevVC, 1), ratedCount, lastViewed: todayStr } };
        }
        function mullerIncrementSrsView(map, word) {
            const key = mullerVocabSrsKey(word);
            const prev = map[key] || {};
            const viewCount = (typeof prev.viewCount === 'number' ? prev.viewCount : 0) + 1;
            const todayStr = new Date().toISOString().slice(0, 10);
            return { ...map, [key]: { ...prev, viewCount, lastViewed: todayStr } };
        }

        /** Racha â€œhonestaâ€: el dÃ­a cuenta solo si hay actividad mÃ­nima (umbrales fijos en cÃ³digo). */
        const MULLER_STREAK_QUAL_KEY = 'muller_streak_qualifying_days_v1';
        const MULLER_STREAK_TODAY_KEY = 'muller_streak_today_stats_v1';
        const MULLER_STREAK_MIN_VOCAB_RATINGS = 8;
        const MULLER_STREAK_MIN_ACTIVITY_POINTS = 45;
        const MULLER_STREAK_MIN_ACTIVE_SEC = 420;
        const MULLER_ONBOARDING_KEY = 'muller_onboarding_done_v1';
        const MULLER_THEME_KEY = 'muller_ui_theme_v1';
        const MULLER_MAIN_GOAL_KEY = 'muller_main_daily_goal_v1';
        const MULLER_GOAL_CLAIM_KEY = 'muller_main_goal_claim_date_v1';
        const MULLER_OCR_HIST_KEY = 'muller_ocr_history_v1';
        const MULLER_PDF_STUDY_STORAGE_KEY = 'muller_pdf_study_v1';
        const MULLER_PDF_STUDY_LIBRARY_KEY = 'muller_pdf_study_library_v1';
        const MULLER_PDF_NOTES_STORAGE_KEY = 'muller_pdf_study_notes_v1';
        const MULLER_PDF_STORED_PAGES_MAX = 80;
        const MULLER_PDF_STORED_TEXT_MAX = 3200;
        const MULLER_PDF_OCR_RETRY_MAX = 1;
        const MULLER_PDF_EXTRACT_YIELD_EVERY = 2;
        const MULLER_TTS_RATE_KEY = 'muller_tts_rate_preset_v1';
        const MULLER_PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/legacy/build/pdf.worker.min.js';

        function mullerGetStreakTodayStats() {
            const today = new Date().toISOString().slice(0, 10);
            try {
                const raw = localStorage.getItem(MULLER_STREAK_TODAY_KEY);
                if (!raw) return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                const o = JSON.parse(raw);
                if (o.date !== today) return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                return o;
            } catch (e) {
                return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
            }
        }
        function mullerSaveStreakTodayStats(o) {
            try { localStorage.setItem(MULLER_STREAK_TODAY_KEY, JSON.stringify(o)); } catch (e) {}
        }
        function mullerQualifyingMap() {
            try { return JSON.parse(localStorage.getItem(MULLER_STREAK_QUAL_KEY) || '{}'); } catch (e) { return {}; }
        }
        function mullerSetQualifyingMap(m) {
            try { localStorage.setItem(MULLER_STREAK_QUAL_KEY, JSON.stringify(m)); } catch (e) {}
        }
        function mullerUpdateQualifyingForStats(stats) {
            const today = new Date().toISOString().slice(0, 10);
            if (stats.date !== today) return;
            const ok = stats.vocabRated >= MULLER_STREAK_MIN_VOCAB_RATINGS
                || stats.points >= MULLER_STREAK_MIN_ACTIVITY_POINTS
                || stats.activeSec >= MULLER_STREAK_MIN_ACTIVE_SEC;
            const m = mullerQualifyingMap();
            if (ok) m[today] = true;
            else delete m[today];
            mullerSetQualifyingMap(m);
        }
        function mullerComputeHonestStreakDays() {
            const qual = mullerQualifyingMap();
            const today = new Date().toISOString().slice(0, 10);
            let streak = 0;
            const d = new Date();
            if (!qual[today]) d.setDate(d.getDate() - 1);
            for (let guard = 0; guard < 400; guard++) {
                const key = d.toISOString().slice(0, 10);
                if (qual[key]) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                } else break;
            }
            return streak;
        }
        function mullerBumpVocabStreakRating() {
            let st = mullerGetStreakTodayStats();
            const today = new Date().toISOString().slice(0, 10);
            if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
            st.vocabRated += 1;
            mullerSaveStreakTodayStats(st);
            mullerUpdateQualifyingForStats(st);
        }
        function mullerGetMainDailyGoalCards() {
            try {
                const n = parseInt(localStorage.getItem(MULLER_MAIN_GOAL_KEY) || '15', 10);
                return Math.max(3, Math.min(120, n || 15));
            } catch (e) { return 15; }
        }
        function mullerPushOcrHistory(entry) {
            try {
                const raw = localStorage.getItem(MULLER_OCR_HIST_KEY);
                const arr = raw ? JSON.parse(raw) : [];
                arr.unshift({
                    ...entry,
                    at: new Date().toISOString(),
                    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
                });
                while (arr.length > 15) arr.pop();
                localStorage.setItem(MULLER_OCR_HIST_KEY, JSON.stringify(arr));
                return arr;
            } catch (e) {
                return [];
            }
        }

        /** Simulacro oral B1 â€” plantillas ampliadas (solo front). */
        const MULLER_ORAL_B1_QUESTIONS = [
            { de: 'Was halten Sie von Kunst in der modernen Gesellschaft?', es: '¿Qué opina del arte en la sociedad moderna?', model: 'Ich finde, dass Kunst wichtig ist, weil sie die Kultur bereichert.' },
            { de: 'Wie wichtig ist Ihnen Umweltschutz im Alltag?', es: '¿Qué importancia tiene para usted la protección del medio ambiente?', model: 'Für mich ist Umweltschutz sehr wichtig, deshalb trenne ich Müll.' },
            { de: 'Was denken Sie über soziale Medien?', es: '¿Qué piensa de las redes sociales?', model: 'Soziale Medien haben Vorteile, aber man sollte vorsichtig sein.' },
            { de: 'Beschreiben Sie Ihren typischen Arbeitstag.', es: 'Describa su jornada laboral típica.', model: 'Normalerweise stehe ich früh auf und fahre mit dem Bus zur Arbeit.' },
            { de: 'Wie verbringen Sie Ihre Freizeit?', es: '¿Cómo pasa su tiempo libre?', model: 'In meiner Freizeit treffe ich Freunde oder lese ich Bücher.' },
            { de: 'Warum lernen Sie Deutsch?', es: '¿Por qué estudia alemán?', model: 'Ich lerne Deutsch, weil ich im Ausland arbeiten möchte.' },
            { de: 'Was sind Ihre Pläne für die nächsten Jahre?', es: '¿Cuáles son sus planes para los próximos años?', model: 'Ich möchte eine Weiterbildung machen und später eine Familie gründen.' },
            { de: 'Wie sieht Ihr Traumurlaub aus?', es: '¿Cómo sería sus vacaciones ideales?', model: 'Am liebsten fahre ich ans Meer und entspanne am Strand.' },
            { de: 'Welche Rolle spielt die Familie in Ihrem Leben?', es: '¿Qué papel tiene la familia en su vida?', model: 'Meine Familie unterstützt mich, und wir treffen uns oft am Wochenende.' },
            { de: 'Was würden Sie an Ihrer Stadt ändern?', es: '¿Qué cambiaría en su ciudad?', model: 'Ich würde mehr Grünflächen schaffen und den Verkehr reduzieren.' },
            { de: 'Wie gehen Sie mit Stress um?', es: '¿Cómo gestiona el estrés?', model: 'Bei Stress gehe ich spazieren oder höre Musik.' },
            { de: 'Welche Erfahrungen haben Sie mit anderen Kulturen gemacht?', es: '¿Qué experiencias ha tenido con otras culturas?', model: 'Ich habe gelernt, offen und respektvoll zu kommunizieren.' },
            { de: 'Was bedeutet für Sie ein gutes Zusammenleben in der Gesellschaft?', es: '¿Qué significa para usted una buena convivencia?', model: 'Toleranz und gegenseitiger Respekt sind mir sehr wichtig.' },
            { de: 'Erzählen Sie von einem wichtigen Erlebnis in Ihrem Leben.', es: 'Cuente una experiencia importante en su vida.', model: 'Ein wichtiges Erlebnis war mein Studium im Ausland.' },
            { de: 'Wie informieren Sie sich über aktuelle Nachrichten?', es: '¿Cómo se informa de las noticias?', model: 'Ich lese online Zeitung und schaue abends die Nachrichten.' },
            { de: 'Was erwarten Sie von einem guten Chef bzw. einer guten Chefin?', es: '¿Qué espera de un buen jefe o jefa?', model: 'Ich erwarte klare Kommunikation und faire Behandlung.' },
            { de: 'Diskutieren Sie kurz: Bildung vs. Berufserfahrung.', es: 'Debate breve: formación vs. experiencia laboral.', model: 'Beides ist wichtig, aber Erfahrung hilft im Alltag oft schneller.' },
            { de: 'Wie stehen Sie zu Homeoffice?', es: '¿Qué opina del teletrabajo?', model: 'Homeoffice ist flexibel, aber man braucht Disziplin.' }
        ];
        function mullerSortVocabBySrs(words, map) {
            const todayStr = new Date().toISOString().slice(0, 10);
            const today = new Date(todayStr + 'T12:00:00');
            function urgency(w) {
                const rec = map[mullerVocabSrsKey(w)];
                if (!rec || !rec.due) return 0.3;
                const due = new Date(rec.due + 'T12:00:00');
                const diffDays = Math.floor((due - today) / 864e5);
                if (diffDays < 0) return diffDays;
                if (diffDays === 0) return 0;
                return 500 + diffDays;
            }
            return [...words].sort((a, b) => {
                const ua = urgency(a), ub = urgency(b);
                if (ua !== ub) return ua - ub;
                return (a.de || '').localeCompare(b.de || '');
            });
        }
        function mullerCountVocabSrsDue(words, map) {
            const todayStr = new Date().toISOString().slice(0, 10);
            let n = 0;
            words.forEach((w) => {
                const rec = map[mullerVocabSrsKey(w)];
                if (!rec || !rec.due) { n++; return; }
                if (rec.due <= todayStr) n++;
            });
            return n;
        }

        /** Textos de ayuda contextual (pestañas, modos, submodos). */
        const MULLER_EXERCISE_HELP = {
            nav_historia: { title: 'Historia', what: 'Es el núcleo del entrenador: escenas de diálogo con audio, vocabulario integrado y modos extra (dictado, huecos, roleplay⬦). Avanza con los controles inferiores.', tips: ['Empieza escuchando cada escena varias veces antes de leer la traducción.', 'Combina con Podcast o velocidad (slider) para acostumbrar el oído.', 'Usa los toggles de arriba solo uno a la vez para no mezclar objetivos.'] },
            nav_shadowing: { title: 'Shadowing', what: 'Repites en voz alta justo después del modelo de audio (misma escena que en Historia). Entrena ritmo, entonación y pronunciación sin inventar texto nuevo.', tips: ['Empieza más lento (control de velocidad) y sube cuando fluya.', 'No mires la traducción hasta haber shadoweado al menos una vez.', 'Si puedes, graba tu voz y compárala con el modelo.'] },
            nav_escritura: { title: 'Escritura', what: 'Lienzo para tableta: caligrafía, dictados, temas y OCR opcional. Pensado para escribir a mano como en el papel del examen.', tips: ['Activa líneas de cuaderno si te ayuda la alineación.', 'En dictado, escucha dos veces antes de mirar la solución.', 'En tableta, apoya la mano: el lienzo usa pointer capture para no perder trazos.'] },
            nav_vocab: { title: 'Vocabulario', what: 'Tarjetas de la lista activa (guion o lección propia): escuchas alemán, revelas español y calificas. El SRS programa el repaso.', tips: ['Di la palabra en voz alta antes de revelar.', 'Usa Fácil/Normal/Difícil con honestidad: el calendario depende de ello.', 'Mezcla lecciones en Biblioteca para sesiones largas.'] },
            nav_b1: { title: 'B1 Fundamentos', what: 'Banco de frases modelo (JSON) por categorías: vocabulario, verbos, preposiciones, conectores, Redemittel y modo mix.', tips: ['Alterna MIX con categorías débiles.', 'Escucha la frase varias veces antes de leer la traducción.', 'Anota en Escritura las que quieras fijar.'] },
            nav_b2: { title: 'B2 Meisterklasse', what: 'Misma estructura que B1 pero con estructuras mÃ¡s altas; Ãºtil para subir registro y conectores complejos.', tips: ['Lee en voz alta la versiÃ³n â€œaltaâ€ para automatizar.', 'Compara con la lÃ­nea bÃ¡sica si el JSON la trae.', 'Lleva un cuaderno de frases copiadas a mano.'] },
            nav_progreso: { title: 'Progreso', what: 'Resumen de racha, mazos difícil/normal, gramática, gráfico semanal y exportación PDF/Anki.', tips: ['Exporta PDF antes de examen para revisar en papel.', 'Los mazos se alimentan desde Vocab y gramática guardada en Historia.', 'SRS de vocabulario tiene su propio contador en la pantalla de ayuda.'] },
            nav_biblioteca: { title: 'Biblioteca', what: 'Guardas guiones pegados desde la IA y listas de vocabulario personalizadas; puedes enviar un texto pegado a B1 o B2 (vocabulario, verbos, etc.) con nivel automÃ¡tico por frase o forzando un nivel.', tips: ['Revisa el formato del prompt de IA antes de pegar.', 'â€œDistribuirâ€ estima B1/B2 por heurÃ­stica local (no es IA); puedes forzar todo a B1 o B2.', 'Las tarjetas del archivo b1-b2-database.json no son â€œtuyasâ€: â€œBorrar aportacionesâ€ solo quita lo aÃ±adido desde Distribuir.', 'Las lecciones de vocab se practican con el botÃ³n Practicar.'] },
            nav_lexikon: { title: 'Lexikon', what: 'TraducciÃ³n de palabras o frases (detecciÃ³n automÃ¡tica de idioma hacia alemÃ¡n o espaÃ±ol que elijas); opciÃ³n aparte para solo Wiktionary; guardar pares en las mismas lecciones que en Biblioteca â†’ Vocab.', tips: ['En â€œPalabra â†’ traducciÃ³nâ€ elige ESâ†’DE si buscas cÃ³mo se dice en alemÃ¡n una palabra en espaÃ±ol.', 'En el traductor usa â€œâ†’ AlemÃ¡nâ€ o â€œâ†’ EspaÃ±olâ€ para forzar el sentido (incluye palabras malsonantes: el servicio puede devolver equivalentes o censura segÃºn el motor).', 'Si el desplegable de lecciones estÃ¡ vacÃ­o, crea lecciones en Biblioteca â†’ Vocab; al abrir Lexikon se vuelve a leer el almacenamiento local.'] },
            nav_telc: { title: 'TELC por nivel', what: 'OrientaciÃ³n por nivel CEFR: estructura tÃ­pica de examen (lectura, escucha, escritura, oral), checklist del dÃ­a y enlaces oficiales. No sustituye modelos de examen ni convocatoria.', tips: ['Elige tu nivel arriba (A1â€“C2).', 'Los tiempos reales los marca tu centro; confirma en tu hoja de inscripciÃ³n.', 'Para modelos oficiales usa telc.de / el centro examinador.', 'Combina con la pestaÃ±a Entrenamiento para prÃ¡ctica tipo test.'] },
            nav_ia: { title: 'IA Story Builder', what: 'Genera un guion nuevo con nivel y tema; útil cuando quieres vocabulario fresco sin pegar texto manual.', tips: ['Indica bien el nivel (B1/B2) y el tema.', 'Tras generar, guarda y estudia en Historia.', 'Combina con vocab propio en el campo de palabras si existe.'] },
            nav_comunidad: { title: 'Comunidad', what: 'OpciÃ³n A: cuenta solo en el navegador (PBKDF2 local). OpciÃ³n B (gratis): Supabase â€” mismo registro pero con sesiÃ³n en la nube, directorio de perfiles y tabla de liga semanal compartida; bots siguen siendo simulados en tu ranking.', tips: ['Pega URL y anon key de Supabase en index.html (Project Settings â†’ API) y ejecuta supabase/schema.sql en el SQL Editor.', 'El plan gratuito de Supabase suele bastar para estudio; revisa lÃ­mites en el dashboard.', 'Si no configuras Supabase, todo sigue funcionando en modo local.', 'Tecla O para abrir Comunidad.'] },
            historia_base: { title: 'Historia â€” vista general', what: 'Escuchas y lees escenas; el vocabulario resaltado enlaza con las tarjetas. Abajo tienes play, escenas y velocidad.', tips: ['Primero escucha, luego muestra traducciÃ³n.', 'Sube o baja la velocidad segÃºn el nivel del dÃ­a.', 'PDF del guion sirve para repaso offline.'] },
            historia_podcast: { title: 'Modo Podcast', what: 'Reproduce el guion actual escena a escena sin tener que pulsar â€œsiguienteâ€. Con â€œTodos los guionesâ€ (barra superior) pasa al siguiente guion guardado al terminar el actual â€” Ãºtil en coche para encadenar varios.', tips: ['Elige el guion en el menÃº â€œGuion en Historiaâ€ (arriba a la izquierda).', 'Podcast solo afecta al guion cargado; â€œTodos los guionesâ€ encadena tus guiones de Biblioteca en orden.', 'Combina con Solo audio y velocidad para manos libres.'] },
            historia_interview: { title: 'Simulación oral (Teil 2)', what: 'Pregunta tipo examen; mantienes pulsado el micrófono para responder y recibes feedback por palabras.', tips: ['Responde en frases completas, no solo sí/no.', 'Mira el feedback de palabras para afinar pronunciación.', 'Relájate: es entrenamiento, no evaluación oficial.'] },
            historia_roleplay: { title: 'Roleplay / tu turno', what: 'La app silencia voces para que leas o digas tú la réplica; puedes escuchar modelo, grabar y ver puntuación.', tips: ['Haz primero play del modelo y luego imita.', 'Comprueba la traducción solo después de intentar.', 'Pasa de escena cuando estés satisfecho con tu toma.'] },
            historia_puzzle: { title: 'Satzbau (puzzle)', what: 'Reconstruye la frase arrastrando trozos en orden. Refuerza orden de palabras en alemán.', tips: ['Escucha la pista de audio antes de mirar la solución.', 'Piensa en el verbo en segunda posición en main clauses.', 'Comprueba solo cuando hayas colocado todas las piezas.'] },
            historia_diktat: { title: 'Diktat', what: 'Dictado: escribes lo que oyes y comparas con el modelo. Refuerza ortografÃ­a y oÃ­do.', tips: ['No mires el texto hasta corregir.', 'Repite el audio varias veces; el TELC permite escuchar.', 'Presta atenciÃ³n a umlauts y ÃŸ.'] },
            historia_huecos: { title: 'Huecos (Lückentext)', what: 'Palabras clave ocultas en el texto; piensa significado y forma antes de seguir.', tips: ['Lee la frase entera en silencio primero.', 'Fíjate en colocaciones del vocabulario marcado.', 'Si bloqueas, revela traducción y vuelve a intentar.'] },
            historia_artikel: { title: 'Artículos (Sniper)', what: 'Los artículos aparecen ocultos: debes decidir der/die/das o forma casuada al leer.', tips: ['Revisa género en las tarjetas de vocabulario de la escena.', 'Di en voz alta la palabra con artículo correcto antes de continuar.', 'Combina con entrenamiento avanzado de artículos para más volumen.'] },
            historia_declinar: { title: 'Declinación', what: 'Se ocultan terminaciones de artículos/adjetivos: piensa caso (Nom/Akk/Dat/Gen).', tips: ['Identifica primero qué sustantivo gobierna el verbo/preposición.', 'Repasa la tabla corta en cabeza antes de mostrar.', 'Enlaza con el modo de preposiciones en Entrenamiento.'] },
            historia_tempus: { title: 'Tempus', what: 'Panel extra con formas verbales del texto para repasar Präteritum/Perfekt y familia.', tips: ['Di en voz alta las tres formas que propone el panel.', 'Compara con la frase original en contexto.', 'Anota verbos irregulares en tu lista.'] },
            historia_blind: { title: 'Modo oído (blur)', what: 'El texto aparece borroso hasta que te acercas: fuerzas escucha primero.', tips: ['Escucha el audio completo una vez con ojos en blur.', 'Quita blur solo para palabras concretas.', 'Ideal para reducir dependencia de la lectura.'] },
            historia_dialogue: { title: 'Diálogo estándar', what: 'Ves la escena, reproduces audio y puedes mostrar traducción. Es el modo por defecto sin dictado ni puzzle.', tips: ['Alterna lectura en voz alta y solo escucha.', 'Pulsa Tutor IA si una estructura no te encaja.', 'Guarda gramática con el botón de guardar si quieres repasarla después.'] },
            historia_herramientas: { title: 'Barra de herramientas (Historia)', what: 'FlÃ¼stern: voz mÃ¡s baja; Ruido: ambiente; Diktat/Huecos/ArtÃ­culos/Declinar/Tempus/Satzbau/OÃ­do y selector de personajes mudos cambian cÃ³mo interactÃºas con la misma escena.', tips: ['Activa solo una herramienta â€œfuerteâ€ a la vez (dictado, puzzleâ€¦).', 'Mutear personajes sirve para practicar solo tus lÃ­neas.', 'Satzbau y Diktat son los mÃ¡s lentos: reserva tiempo.'] },
            historia_quiz: { title: 'Quiz / examen rápido', what: 'Modo pregunta-respuesta cuando esté activo en tu flujo.', tips: ['Lee el enunciado dos veces.', 'Gestiona el tiempo como en examen.', 'Repasa errores en Historia normal después.'] },
            shadowing_main: { title: 'Shadowing â€” cÃ³mo practicar', what: 'Escuchas la frase del guion con voz preferida, luego la repites al unÃ­sono o justo despuÃ©s. El micrÃ³fono opcional da feedback por palabra.', tips: ['No traduzcas mentalmente palabra a palabra: imita sonido.', 'Si el texto es largo, divide en mitades.', 'Ajusta la velocidad shadow si la app lo permite.'] },
            escritura_free: { title: 'Escritura â€” libre', what: 'Hoja en blanco para apuntes, conjugaciones o lo que necesites.', tips: ['Goma con varios anchos borra sin vaciar el lienzo; Deshacer trazo quita el Ãºltimo gesto.', 'Marcador y subrayado ayudan a marcar errores o Ã©nfasis como en papel.', 'Guarda PNG o usa OCR cuando quieras revisar el texto.'] },
            escritura_copy: { title: 'Escritura â€” copia', what: 'Copias frases modelo para caligrafÃ­a y ortografÃ­a.', tips: ['Mira la frase completa, luego escribe de memoria en el lienzo.', 'Repite la misma lÃ­nea varias veces.', 'Compara tu escritura con la fuente al final.'] },
            escritura_dictation: { title: 'Escritura â€” dictado', what: 'Escuchas un dictado por TTS y escribes; puedes ver la soluciÃ³n para autocorregir.', tips: ['Dos escuchas antes de revelar.', 'Anota en borrador mental la puntuaciÃ³n.', 'Pasa a otro dictado cuando domines el actual.'] },
            escritura_prompt: { title: 'Escritura â€” tema', what: 'Recibes un tema B1/B2 para escribir un mini texto a mano.', tips: ['Escribe un esquema de 3 ideas en el lienzo.', 'No pares en la primera frase: busca 5â€“8 lÃ­neas.', 'Lee en voz alta lo escrito para detectar errores.'] },
            escritura_letters: { title: 'Escritura â€” letras alemanas', what: 'Practicas Ã„, Ã–, Ãœ, ÃŸ y ligaduras tÃ­picas.', tips: ['Haz filas enteras de una letra antes de mezclar.', 'Pronuncia en voz alta mientras escribes.', 'Pasa al siguiente bloque cuando salgan uniformes.'] },
            escritura_guion: { title: 'Escritura â€” guion', what: 'Copias lÃ­neas del guion cargado en Historia/Biblioteca.', tips: ['Avanza escena a escena como en shadowing lento.', 'Tapar traducciÃ³n hasta haber escrito.', 'Ãštil como dictado propio: lÃ©ete la frase y escribe sin mirar.'] },
            escritura_vocab: { title: 'Escritura â€” vocabulario', what: 'Escribes a mano la palabra activa de tu lista de vocabulario.', tips: ['Di la palabra en voz alta antes de trazar.', 'Si la lista estÃ¡ vacÃ­a, abre Vocab o carga guion.', 'Combina con OCR si quieres comparar trazo con modelo.'] },
            vocab_active_recall: { title: 'Vocabulario â€” active recall', what: 'Escuchas alemÃ¡n, intentas recordar espaÃ±ol, revelas y calificas. El SRS ordena la lista automÃ¡ticamente.', tips: ['No marques â€œfÃ¡cilâ€ si solo reconoces: hay que recordar.', 'Usa escritura a mano si necesitas refuerzo motor.', 'Mezcla lecciones para variedad.'] },
            bx_mix: { title: 'B1/B2 â€” modo MIX', what: 'Baraja frases de todas las categorÃ­as del JSON activo.', tips: ['Ideal cuando ya dominas categorÃ­as sueltas.', 'Marca mentalmente las que fallas y vuelve en modo categorÃ­a.', 'Escucha primero, lee despuÃ©s.'] },
            bx_vocabulario: { title: 'B1/B2 â€” vocabulario', what: 'Frases cortas con lÃ©xico clave por nivel.', tips: ['Lee en voz alta ambas columnas.', 'Copia 3 que te cuesten a Escritura.', 'Relaciona con Historia buscando palabras en guion.'] },
            bx_verbos: { title: 'B1/B2 â€” verbos', what: 'Patrones verbales y colocaciones frecuentes.', tips: ['En voz alta: infinitivo + ejemplo.', 'Crea una mini frase tuya con cada verbo.', 'Cruza con preposiciones si el verbo las pide.'] },
            bx_preposiciones: { title: 'B1/B2 â€” preposiciones', what: 'Uso de Kasus con preposiciones tÃ­picas.', tips: ['Memoriza verbo + preposiciÃ³n como bloque.', 'Haz dos frases: una Dativo otra Akkusativ si aplica.', 'Repasa en Entrenamiento para mÃ¡s Ã­tems.'] },
            bx_conectores: { title: 'B1/B2 â€” conectores', what: 'Conectores lÃ³gicos para escritura oral y Redemittel.', tips: ['Clasifica: oposiciÃ³n, causa, consecuencia, tiempo.', 'Escribe un minipÃ¡rrafo usando solo conectores nuevos.', 'Ãšsalos en Historia al improvisar respuestas.'] },
            bx_redemittel: { title: 'B1/B2 â€” Redemittel', what: 'FÃ³rmulas listas para examen oral/escrito.', tips: ['Aprende de memoria 5 por semana.', 'DÃ­las en voz alta con buena entonaciÃ³n.', 'Inserta una por respuesta en simulaciÃ³n oral.'] },
            progreso_dashboard: { title: 'Progreso â€” panel', what: 'Ves racha, monedas, mazos y exportaciones; el bloque de Entrenamiento resume prÃ¡ctica avanzada si lo usas.', tips: ['Haz PDF antes de vacaciones para no perder la foto.', 'Revisa mazos difÃ­cil cada pocos dÃ­as.', 'Combina con backup JSON flotante para copia total.'] },
            guiones_import: { title: 'Biblioteca â€” guiones', what: 'Pegas texto de la IA con tÃ­tulo y lo guardas; al cargarlo se vuelve tu Historia activa.', tips: ['Comprueba tÃ­tulos para encontrar lecciones rÃ¡pido.', 'Borra versiones viejas para no confundirte.', 'El prompt sugerido estÃ¡ arriba: cÃ³pialo tal cual a ChatGPT/Gemini.'] },
            guiones_vocab_custom: { title: 'Biblioteca â€” vocabulario propio', what: 'Pegas listas â€œalemÃ¡n â€” espaÃ±olâ€ y guardas lecciones; luego Practicar o mezcla.', tips: ['Una lÃ­nea por palabra facilita el parseo.', 'Mezcla varias lecciones para simular examen amplio.', 'Exporta a Anki desde Progreso si usas mazos allÃ­.'] },
            guiones_bx_distrib: { title: 'Biblioteca â†’ B1 / B2 (subpestaÃ±as)', what: 'Desde un texto pegado se extraen frases y se clasifican por tipo (vocabulario, verbos, etc.); cada frase se coloca en B1 o B2 segÃºn reglas locales o en un solo nivel si lo fuerzas.', tips: ['Si tenÃ­as un guion guardado cargado en Historia al pulsar Distribuir, esas tarjetas quedan vinculadas: al borrar ese guion puedes quitar tambiÃ©n esas entradas en B1/B2.', 'El nivel automÃ¡tico es una estimaciÃ³n: revisa en B1/B2 y mueve o borra tarjetas con â€œTu bibliotecaâ€.', 'Frases antiguas sin vincular: usa â€œBorrar mis aportacionesâ€ o borra tarjeta a tarjeta. El archivo b1-b2-database.json del proyecto no se borra desde aquÃ­.'] },
            guiones_mix: { title: 'Mezclar lecciones de vocabulario', what: 'Seleccionas varias lecciones guardadas y generas una sesiÃ³n Ãºnica en la pestaÃ±a Vocab.', tips: ['Marca al menos dos lecciones si quieres variedad.', 'Las tarjetas difÃ­ciles se suelen repetir al final.', 'Ãšsalo antes de un examen para repaso amplio.'] },
            storybuilder: { title: 'IA Story Builder', what: 'Pides a la app/IA integrada un guion según nivel y tema; luego lo estudias como cualquier Historia.', tips: ['Sé concreto en el tema (trabajo, medio ambiente⬦).', 'Revisa que el vocabulario coincida con tus metas.', 'Guarda siempre en Biblioteca para no perderlo.'] },
            practice_mazos: { title: 'Entrenamiento rápido (mazos)', what: 'Repasas tarjetas guardadas como difícil, normal o gramática: audio, revelar traducción, siguiente.', tips: ['No mires revelar hasta haber intentado recordar.', 'Haz lotes cortos varias veces al día.', 'Cuando vacíe un mazo, vuelve a Historia para añadir nuevas frases.'] },
            advanced_menu: { title: 'Entrenamiento avanzado', what: 'Práctica guiada de artículos, verbos con preposición, preposiciones puras, conectores y simulacro tipo examen con cronómetro.', tips: ['Empieza por la categoría con peor porcentaje en el dashboard.', 'El modo examen entrena gestión de tiempo, no solo aciertos.', 'Cierra sesiones cortas para fijar mejor.', 'Artículos (JSON): usa "levels": ["A1","A2","B1"] para que la misma palabra salga en varios mazos; si repites la misma "de" con otro "level", la app une los niveles automáticamente.'] },
            advanced_exam: { title: 'Simulacro TELC (avanzado)', what: 'CronÃ³metro orientativo, pistas limitadas y mezcla de Ã­tems segÃºn lo que elijas.', tips: ['Elige duraciÃ³n realista (20â€“30 min al principio).', 'Usa pistas solo cuando lleves bloqueado mÃ¡s de un minuto.', 'Al terminar, repasa solo los fallos en modo categorÃ­a.'] },
            nav_ruta: { title: 'Ruta A0 â†’ C1', what: 'Camino guiado desde cero real: lecciones con frases, huecos, lectura en voz alta y recompensas. PestaÃ±a GramÃ¡tica resume reglas por nivel. Test de nivel sugiere por dÃ³nde empezar.', tips: ['Tecla R para abrir Ruta.', 'Elige mentor (voz) arriba: Frau Lena, Herr Tom o Lina.', 'Cada 3 lecciones completadas hay bonus extra de monedas.', 'El contenido se ampliarÃ¡ por niveles hasta C1.'] },
            ruta_gramatica: { title: 'Ruta â€” GramÃ¡tica', what: 'Resumen por niveles (A1, A2, B1) con explicaciones claras. No sustituye un libro de texto: combÃ­nalo con Historia y ejercicios.', tips: ['Abre el bloque del nivel que estudies en el camino.', 'Copia un ejemplo a Escritura para fijarlo.', 'Si algo no cuadra, pregunta a tu tutor o al foro.'] },
            nav_inicio: { title: 'Inicio', what: 'Pantalla principal con accesos rápidos y pendientes de repaso (SRS). Desde aquí saltas a Historia, vocab, shadowing, etc.', tips: ['Tecla I para volver al Inicio.', 'El número en Vocab indica tarjetas prioritarias del SRS.', 'Tras la bienvenida (banderas), eliges qué practicar.'] },
            hub_centro: { title: 'Centro MÃ¼ller', what: 'Voces del sistema, ayuda, IA Chrome local; el plan del dÃ­a y el resumen rÃ¡pido estÃ¡n en Progreso.', tips: ['Configura voces antes de sesiones largas.', 'PestaÃ±a â€œIA Chromeâ€: resumen local con Gemini Nano si tu Chrome lo permite.', 'Esc para cerrar el panel.', 'Repite el tour si te pierdes.'] },
            hub_chrome_ai: { title: 'IA local (Chrome / Gemini Nano)', what: 'Usa la API Summarizer del navegador: el modelo se descarga en tu PC y el resumen se genera en local sin API key. Requiere Chrome de escritorio reciente y requisitos de hardware.', tips: ['Si no aparece la API, activa las funciones de IA en chrome://flags y reinicia.', 'Edge puede llevar APIs similares detrás de flags; Firefox/Safari no suelen soportarlo aún.', 'No sustituye un profesor: revisa los resúmenes.'] },
        };

        window.__MULLER_OPEN_EXERCISE_HELP = function (id) {
            try { window.dispatchEvent(new CustomEvent('mullerOpenExerciseHelp', { detail: { id: String(id) } })); } catch (e) {}
        };

        /** Sonidos UI (Web Audio, sin archivos). localStorage muller_sfx_enabled = '0' desactiva. */
        window.__mullerSfxEnabled = function () {
            try { return localStorage.getItem('muller_sfx_enabled') !== '0'; } catch (e) { return true; }
        };
        window.__mullerConsecutiveCorrect = 0;
        window.__mullerPlaySfx = function (kind, arg2) {
            if (!window.__mullerSfxEnabled()) return;
            try {
                var Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) return;
                if (!window.__mullerAudioCtx) window.__mullerAudioCtx = new Ctx();
                var ctx = window.__mullerAudioCtx;
                if (ctx.state === 'suspended') ctx.resume();
                var t0 = ctx.currentTime;
                function tone(freq, start, len, vol, typ) {
                    var o = ctx.createOscillator();
                    var g = ctx.createGain();
                    o.type = typ || 'sine';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(vol, t0 + start);
                    g.gain.exponentialRampToValueAtTime(0.001, t0 + start + len);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(t0 + start);
                    o.stop(t0 + start + len + 0.02);
                }
                if (kind === 'ok') {
                    tone(523, 0, 0.1, 0.11);
                    tone(784, 0.09, 0.14, 0.1);
                } else if (kind === 'bad') {
                    tone(160, 0, 0.12, 0.1, 'triangle');
                    tone(110, 0.08, 0.14, 0.08, 'triangle');
                } else if (kind === 'tick') {
                    tone(660, 0, 0.06, 0.07);
                } else if (kind === 'levelup') {
                    tone(392, 0, 0.08, 0.09);
                    tone(523, 0.07, 0.08, 0.09);
                    tone(659, 0.14, 0.11, 0.1);
                } else if (kind === 'complete') {
                    [523, 659, 784, 1046].forEach(function (f, i) {
                        tone(f, i * 0.08, 0.22, 0.095);
                    });
                } else if (kind === 'streak') {
                    var n = Math.max(5, Number(arg2) || 5);
                    var tier = Math.floor(n / 5);
                    var base = 392 * Math.pow(1.035, Math.min(tier, 40));
                    var count = 4 + Math.min(6, Math.floor(tier / 4));
                    for (var si = 0; si < count; si++) {
                        tone(base * Math.pow(1.259921, si), si * 0.055, 0.11, 0.09);
                    }
                    tone(Math.min(1400, base * Math.pow(1.259921, count)), count * 0.055 + 0.02, 0.2, 0.1);
                }
            } catch (e) {}
        };
        /** Acierto / fallo en ejercicios: ok/bad + racha global 5,10,15⬦ (sin límite). opts.silent: no audio. */
        window.__mullerNotifyExerciseOutcome = function (correct, opts) {
            opts = opts || {};
            if (correct) {
                window.__mullerConsecutiveCorrect = (window.__mullerConsecutiveCorrect || 0) + 1;
                var streakN = window.__mullerConsecutiveCorrect;
                if (!opts.silent && window.__mullerSfxEnabled()) {
                    window.__mullerPlaySfx('ok');
                    if (streakN > 0 && streakN % 5 === 0) {
                        setTimeout(function () { window.__mullerPlaySfx('streak', streakN); }, 130);
                    }
                }
            } else {
                window.__mullerConsecutiveCorrect = 0;
                if (!opts.silent && window.__mullerSfxEnabled()) {
                    window.__mullerPlaySfx('bad');
                }
            }
        };
        window.__mullerToast = function (message, kind) {
            try {
                window.dispatchEvent(new CustomEvent('muller-toast', { detail: { message: String(message || ''), kind: String(kind || 'info') } }));
            } catch (e) {}
        };
        window.__mullerRandomMotivation = function () {
            var m = [
                'Cada error es una pista. ¡Sigue!',
                'Los expertos también fallaron al principio.',
                'Respira, escucha de nuevo y prueba otra vez.',
                'Tu cerebro está creando conexiones nuevas ahora mismo.',
                'Persistencia > perfección. Tú puedes.',
                'Un paso más cerca: corrige y sigue.',
            ];
            return m[Math.floor(Math.random() * m.length)];
        };

        window.mullerRutaDefaultProgress = function () {
            return { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 };
        };
        window.mullerRutaLoad = function () {
            try {
                var raw = localStorage.getItem('muller_ruta_progress_v1');
                return raw ? Object.assign(window.mullerRutaDefaultProgress(), JSON.parse(raw)) : window.mullerRutaDefaultProgress();
            } catch (e) { return window.mullerRutaDefaultProgress(); }
        };
        window.mullerRutaSave = function (p) {
            try { localStorage.setItem('muller_ruta_progress_v1', JSON.stringify(p)); } catch (e) {}
        };
        window.mullerRutaIsLessonUnlocked = function (levels, levelIdx, lessonIdx, completed) {
            if (!levels[levelIdx] || !levels[levelIdx].lessons[lessonIdx]) return false;
            if (levelIdx === 0 && lessonIdx === 0) return true;
            if (lessonIdx === 0) {
                var prev = levels[levelIdx - 1];
                return prev.lessons.every(function (l) { return completed[l.id]; });
            }
            var prevId = levels[levelIdx].lessons[lessonIdx - 1].id;
            return !!completed[prevId];
        };

        window.MULLER_RUTA_LEVELS = [
            {
                id: 'a0-1',
                title: 'Nivel 0 · Base absoluta',
                badge: 'A0',
                lessons: [
                    {
                        id: 'a0-1-l1',
                        title: 'Sonidos + presentaciones mínimas',
                        topic: 'presentacion',
                        rewardCoins: 12,
                        rewardXp: 18,
                        grammarTip: 'En alemán, la frase base suele ir con verbo en 2ª posición: Ich bin Ana.',
                        phrases: [
                            { de: 'Ich bin Ana.', es: 'Soy Ana.' },
                            { de: 'Ich komme aus Sevilla.', es: 'Vengo de Sevilla.' },
                            { de: 'Ich lerne Deutsch.', es: 'Aprendo alemán.' }
                        ],
                        fill: { prompt: 'Completa: Ich ___ Ana.', answer: 'bin', hint: 'Verbo «sein», 1ª persona.' },
                        speak: { target: 'Ich bin Ana.' }
                    },
                    {
                        id: 'a0-1-l2',
                        title: 'Clase y objetos básicos',
                        topic: 'clase',
                        rewardCoins: 12,
                        rewardXp: 18,
                        grammarTip: 'Memoriza sustantivo + artículo como bloque: der Tisch, die Tür, das Buch.',
                        phrases: [
                            { de: 'Das ist ein Buch.', es: 'Eso es un libro.' },
                            { de: 'Die Tür ist offen.', es: 'La puerta está abierta.' },
                            { de: 'Der Tisch ist groÃŸ.', es: 'La mesa es grande.' }
                        ],
                        fill: { prompt: 'Completa: Das ist ___ Buch.', answer: 'ein', hint: 'Artículo indefinido neutro.' },
                        speak: { target: 'Das ist ein Buch.' }
                    }
                ]
            },
            {
                id: 'a1-1',
                title: 'Nivel 1 · Primeros pasos',
                badge: 'A1.1',
                lessons: [
                    {
                        id: 'a1-1-l1',
                        title: 'Saludos y presentación',
                        topic: 'presentacion',
                        rewardCoins: 15,
                        rewardXp: 20,
                        grammarTip: 'En frases declarativas el verbo conjugado va en 2.Âª posiciÃ³n: sujeto â€“ verbo â€“ resto.',
                        phrases: [
                            { de: 'Guten Tag! Ich heiÃŸe Maria.', es: 'Â¡Buenos dÃ­as! Me llamo MarÃ­a.' },
                            { de: 'Wie geht es dir?', es: '¿Cómo estás?' },
                            { de: 'Ich komme aus Spanien.', es: 'Vengo de España.' },
                        ],
                        fill: { prompt: 'Completa: Ich ___ aus Spanien.', answer: 'komme', hint: 'Verbo «kommen» en 1.ª persona singular.' },
                        speak: { target: 'Ich komme aus Spanien.' },
                    },
                    {
                        id: 'a1-1-l2',
                        title: 'Artículos básicos',
                        topic: 'hogar',
                        rewardCoins: 15,
                        rewardXp: 22,
                        grammarTip: 'der (m), die (f), das (n). Muchos plurales llevan «die».',
                        phrases: [
                            { de: 'Das Buch ist neu.', es: 'El libro es nuevo.' },
                            { de: 'Die Frau liest.', es: 'La mujer lee.' },
                            { de: 'Der Mann wartet.', es: 'El hombre espera.' },
                        ],
                        fill: { prompt: '___ Buch liegt hier. (neutro)', answer: 'Das', hint: 'Artículo neutro.' },
                        speak: { target: 'Das Buch ist neu.' },
                    },
                ],
            },
            {
                id: 'a1-2',
                title: 'Nivel 2 · Rutina',
                badge: 'A1.2',
                lessons: [
                    {
                        id: 'a1-2-l1',
                        title: 'Hora y días',
                        topic: 'rutina',
                        rewardCoins: 18,
                        rewardXp: 24,
                        grammarTip: '«Um acht Uhr» = a las ocho. Los días llevan mayúscula: Montag, Dienstag⬦',
                        phrases: [
                            { de: 'Ich stehe um sieben Uhr auf.', es: 'Me levanto a las siete.' },
                            { de: 'Am Montag gehe ich zur Arbeit.', es: 'El lunes voy al trabajo.' },
                            { de: 'Das Wochenende ist kurz.', es: 'El fin de semana es corto.' },
                        ],
                        fill: { prompt: 'Ich stehe ___ sieben Uhr auf.', answer: 'um', hint: 'Preposición para «a las» con hora.' },
                        speak: { target: 'Am Montag gehe ich zur Arbeit.' },
                    },
                    {
                        id: 'a1-2-l2',
                        title: 'Comida simple',
                        topic: 'alimentos',
                        rewardCoins: 18,
                        rewardXp: 25,
                        grammarTip: '«Ich möchte» + Akkusativ del objeto: Ich möchte einen Kaffee.',
                        phrases: [
                            { de: 'Ich esse gern Brot.', es: 'Me gusta comer pan.' },
                            { de: 'Ich trinke Wasser.', es: 'Bebo agua.' },
                            { de: 'Was isst du gern?', es: '¿Qué te gusta comer?' },
                        ],
                        fill: { prompt: 'Ich möchte ___ Kaffee. (masculino acusativo)', answer: 'einen', hint: 'Artículo acusativo masculino.' },
                        speak: { target: 'Ich esse gern Brot.' },
                    },
                ],
            },
            {
                id: 'a2-1',
                title: 'Nivel 3 · Conectar frases',
                badge: 'A2.1',
                lessons: [
                    {
                        id: 'a2-1-l1',
                        title: '«Weil» y verbo al final',
                        topic: 'conectores',
                        rewardCoins: 22,
                        rewardXp: 30,
                        grammarTip: 'Tras «weil/dass/obwohl» el verbo conjugado va al final de la suboración.',
                        phrases: [
                            { de: 'Ich lerne Deutsch, weil ich reisen möchte.', es: 'Estudio alemán porque quiero viajar.' },
                            { de: 'Weil es regnet, bleibe ich zu Hause.', es: 'Como llueve, me quedo en casa.' },
                        ],
                        fill: { prompt: 'Ich bleibe zu Hause, weil ich krank ___.', answer: 'bin', hint: 'Verbo «sein» al final (1.ª persona).' },
                        speak: { target: 'Ich lerne Deutsch, weil ich reisen möchte.' },
                    },
                    {
                        id: 'a2-1-l2',
                        title: 'Perfekt básico',
                        topic: 'gramatica',
                        rewardCoins: 22,
                        rewardXp: 32,
                        grammarTip: 'Perfekt: habe/hat + participio al final (regulares: ge- + stem + -t).',
                        phrases: [
                            { de: 'Ich habe gestern gearbeitet.', es: 'Ayer he trabajado.' },
                            { de: 'Sie hat das schon gemacht.', es: 'Ella ya lo ha hecho.' },
                        ],
                        fill: { prompt: 'Ich habe gestern viel ___. (arbeiten)', answer: 'gearbeitet', hint: 'Participio de «arbeiten».' },
                        speak: { target: 'Ich habe gestern gearbeitet.' },
                    },
                ],
            },
        ];

        window.MULLER_GRAMMAR_REF = [
            {
                level: 'A1',
                title: 'Fundamentos',
                blocks: [
                    { t: 'Orden de la frase (V2)', b: 'En la frase principal afirmativa, el verbo flexionado ocupa la segunda posición: «Heute gehe ich ins Kino.»' },
                    { t: 'Artículos y género', b: 'Memoriza sustantivo + artículo (der/die/das). El plural suele ser «die». Compara: der Tisch, die Lampe, das Fenster.' },
                    { t: 'Presente regular', b: 'Sufijos típicos: -e, -st, -t, -en. Irregulares comunes: sein, haben, werden.' },
                ],
            },
            {
                level: 'A2',
                title: 'Oraciones compuestas',
                blocks: [
                    { t: 'Subordinadas con Â«dass/weil/obwohlÂ»', b: 'El verbo conjugado va al final: Â«Ich weiÃŸ, dass du kommst.Â»' },
                    { t: 'Perfekt', b: 'Auxiliar haben/sein + participio II. Muchos verbos de movimiento usan «sein» (sein, bleiben, passieren⬦ contexto).' },
                    { t: 'Preposiciones y Kasus', b: 'Aprende bloques: «mit» + Dat., «für» + Akk., preposiciones de lugar «Wo?/Wohin?» con Dat./Akk.' },
                ],
            },
            {
                level: 'B1',
                title: 'Matices',
                blocks: [
                    { t: 'Konjunktiv II (politez)', b: '«Ich hätte gern⬦», «Könnten Sie⬦?» para peticiones suaves.' },
                    { t: 'Pasiva y alternativas', b: 'Â«Es wird gemachtÂ» / Â«Man machtÂ» â€” reconocer sujeto impersonal.' },
                    { t: 'Conectores', b: 'Â«trotzdemÂ», Â«deshalbÂ», Â«auÃŸerdemÂ» â€” practica posiciÃ³n del verbo en cada tipo.' },
                ],
            },
            {
                level: 'B2',
                title: 'Estructuras avanzadas',
                blocks: [
                    { t: 'Conectores complejos', b: 'Introduce «während», «sobald», «falls», «hingegen». Ajusta el orden verbal según subordinada/principal.' },
                    { t: 'Nominalización y registro', b: 'Convierte acciones en sustantivos cuando el registro lo pide: «die Entscheidung treffen».' },
                    { t: 'Pasiva y enfoque informativo', b: 'Alterna activa/pasiva según el foco de la frase: proceso vs agente.' },
                ],
            },
            {
                level: 'C1',
                title: 'Precisión y estilo',
                blocks: [
                    { t: 'Conectores de argumentación', b: 'Usa «demzufolge», «folglich», «infolgedessen», «nichtsdestotrotz» con control de registro.' },
                    { t: 'Subordinación compleja', b: 'Encadena ideas con subordinadas sin perder claridad ni control de verbos al final.' },
                    { t: 'Matiz léxico', b: 'Elige verbo y conector por intención comunicativa (formal, neutral, académico).' },
                ],
            },
        ];

 window.MULLER_PLACEMENT_QUESTIONS = [
  // A1 (7 preguntas)
  { level: 'A1', q: 'Ich ___ aus Spanien.', opts: ['bin', 'habe', 'werde'], ok: 0 },
  { level: 'A1', q: '___ Buch liegt auf dem Tisch.', opts: ['Der', 'Die', 'Das'], ok: 2 },
  { level: 'A1', q: 'Wie ___ du?', opts: ['heiÃŸen', 'heiÃŸt', 'heiÃŸe'], ok: 1 },
  { level: 'A1', q: 'Wir ___ müde.', opts: ['sind', 'seid', 'ist'], ok: 0 },
  { level: 'A1', q: '___ ist dein Name?', opts: ['Was', 'Wie', 'Wo'], ok: 1 },
  { level: 'A1', q: 'Ich ___ gern Pizza.', opts: ['esse', 'isst', 'esst'], ok: 0 },
  { level: 'A1', q: 'Er ___ einen Hund.', opts: ['habe', 'hast', 'hat'], ok: 2 },

  // A2 (8 preguntas)
  { level: 'A2', q: 'Letzte Woche ___ wir im Kino.', opts: ['waren', 'sind', 'haben'], ok: 0 },
  { level: 'A2', q: 'Ich freue mich ___ das Wochenende.', opts: ['auf', 'über', 'für'], ok: 0 },
  { level: 'A2', q: 'Er ___ jeden Tag um 7 Uhr ___.', opts: ['steht ... auf', 'aufsteht', 'stehst ... auf'], ok: 0 },
  { level: 'A2', q: 'Das ist der Mann, ___ ich kenne.', opts: ['der', 'den', 'dem'], ok: 1 },
  { level: 'A2', q: 'Ich habe mein Buch ___.', opts: ['vergessen', 'vergesse', 'vergisst'], ok: 0 },
  { level: 'A2', q: '___ du mir helfen?', opts: ['Kannst', 'Kann', 'Können'], ok: 0 },
  { level: 'A2', q: 'Wir sind ___ Berlin gefahren.', opts: ['in', 'nach', 'zu'], ok: 1 },
  { level: 'A2', q: 'Er ___ krank, deshalb bleibt er zu Hause.', opts: ['ist', 'hat', 'wird'], ok: 0 },

  // B1 (8 preguntas)
  { level: 'B1', q: 'Wenn ich mehr Zeit ___, würde ich reisen.', opts: ['hätte', 'habe', 'gehabt'], ok: 0 },
  { level: 'B1', q: 'Das ist der Mann, mit ___ ich gesprochen habe.', opts: ['dem', 'der', 'den'], ok: 0 },
  { level: 'B1', q: 'Ich ___ gestern meine Oma ___.', opts: ['habe ... besucht', 'bin ... besucht', 'habe ... besuchen'], ok: 0 },
  { level: 'B1', q: '___ es regnet, bleiben wir drinnen.', opts: ['Wenn', 'Weil', 'Dass'], ok: 1 },
  { level: 'B1', q: 'Er ___ schon seit drei Jahren in Berlin.', opts: ['lebt', 'wohnt', 'arbeitet'], ok: 0 },
  { level: 'B1', q: 'Ich wünsche mir, dass du ___.', opts: ['kommst', 'kommst', 'kommen'], ok: 0 },
  { level: 'B1', q: 'Das Haus ___ 1990 ___.', opts: ['wurde ... gebaut', 'wird ... gebaut', 'ist ... gebaut'], ok: 0 },
  { level: 'B1', q: '___ du mich ___, wäre ich früher gekommen.', opts: ['Hättest ... angerufen', 'Hast ... angerufen', 'Würdest ... anrufen'], ok: 0 },

  // B2 (7 preguntas)
  { level: 'B2', q: 'Es ist wichtig, dass der Antrag rechtzeitig ___.', opts: ['eingereicht wird', 'eingereicht wurde', 'einreicht'], ok: 0 },
  { level: 'B2', q: '___ der hohen Kosten wurde das Projekt gestoppt.', opts: ['Wegen', 'Trotz', 'Aufgrund'], ok: 0 },
  { level: 'B2', q: 'Hätte ich das gewusst, ___ ich anders gehandelt.', opts: ['hätte', 'wäre', 'würde'], ok: 0 },
  { level: 'B2', q: 'Die Diskussion, ___ wir gestern geführt haben, war sehr interessant.', opts: ['die', 'der', 'das'], ok: 0 },
  { level: 'B2', q: 'Er gilt ___ einer der besten Experten.', opts: ['als', 'für', 'wie'], ok: 0 },
  { level: 'B2', q: '___ ich mich rechtzeitig beworben habe, wurde ich nicht eingeladen.', opts: ['Obwohl', 'Weil', 'Da'], ok: 0 },
  { level: 'B2', q: 'Die MaÃŸnahmen ___ nur langsam ___.', opts: ['werden ... umgesetzt', 'wurden ... umgesetzt', 'sind ... umgesetzt'], ok: 0 },
];

        /** Contenido orientativo TELC / marcos similares (no texto de examen oficial). */
        window.MULLER_TELC_BY_LEVEL = {
            A1: {
                label: 'A1 · Start Deutsch 1 / equivalente',
                summary: 'Nivel inicial: tareas cortas, vocabulario cotidiano y comprensión global.',
                sections: [
                    { title: 'Pruebas típicas (estructura general)', items: ['Lectura: textos muy breves (avisos, carteles, formularios sencillos).', 'Escucha: diálogos lentos en situaciones cotidianas (tiendas, horarios).', 'Escritura: rellenar formularios, mensajes cortos (correo, SMS).', 'Oral: presentarse, preguntar precios, pedir información fija (Redemittel).'] },
                    { title: 'Qué trabajar en Müller', items: ['Ruta A1 y Vocab con SRS.', 'Historia en modo dictado y huecos.', 'Shadowing con frases cortas.'] },
                ],
            },
            A2: {
                label: 'A2 · Fit in Deutsch A2 / Goethe-Zertifikat A2',
                summary: 'Comprende frases aisladas y textos sencillos sobre temas familiares.',
                sections: [
                    { title: 'Pruebas típicas', items: ['Lectura: correos breves, anuncios, textos informativos sencillos.', 'Escucha: entender la idea principal en medios claros.', 'Escritura: correo o carta corta (motivo, tiempo, petición).', 'Oral: describir rutina, planes; interacción en situaciones conocidas.'] },
                    { title: 'Enfoque TELC', items: ['Suele haber varias partes de lectura con tareas de verificación.', 'La expresión escrita pide cumplir el encargo (Auftrag) del enunciado.'] },
                ],
            },
            B1: {
                label: 'B1 · TELC Deutsch B1 / Zertifikat B1',
                summary: 'Nivel independiente: textos auténticos moderados y producción conectada.',
                sections: [
                    { title: 'Estructura habitual (4 competencias)', items: ['Lesen: varios textos (periodÃ­stico, opiniÃ³n, prÃ¡ctico) con preguntas globales y detalle.', 'HÃ¶ren: entrevistas, reportajes; una sola emisiÃ³n en muchos centros â€” lee antes las preguntas.', 'Schreiben: dos tareas (p. ej. correo + texto argumentativo o foro); respeta extensiÃ³n y registro.', 'Sprechen: interacciÃ³n (informaciÃ³n, opiniones); a veces preparaciÃ³n previa.'] },
                    { title: 'Estrategia', items: ['Marca tiempo por bloque al inicio.', 'En escritura: plan de 5 minutos + pÃ¡rrafos con conectores (jedoch, deshalb, auÃŸerdem).', 'En oral: no solo vocabulario: claridad y turnos.'] },
                ],
            },
            B2: {
                label: 'B2 · TELC Deutsch B2 / Zertifikat B2',
                summary: 'Textos más largos y matizados; producción argumentativa y registro elevado.',
                sections: [
                    { title: 'Pruebas tÃ­picas', items: ['Lectura: artÃ­culos, comentarios; inferencias y opiniones del autor.', 'Escucha: ritmo mÃ¡s natural; notas y detalles.', 'Escritura: carta formal / texto de opiniÃ³n con estructura clara (Einleitung â€“ Hauptteil â€“ Schluss).', 'Oral: debate, ventajas/desventajas, matizar posiciones.'] },
                    { title: 'Errores frecuentes', items: ['Confundir registro (du/Sie, coloquial vs académico).', 'Subordinadas sin verbo al final.', 'Tiempo insuficiente en la última parte escrita.'] },
                ],
            },
            C1: {
                label: 'C1 Â· TELC Deutsch C1 / Kleines / GroÃŸes Deutsch',
                summary: 'Comprensión sutil; producción estructurada y variación léxica.',
                sections: [
                    { title: 'Enfoque', items: ['Lectura: textos complejos (ironía, matices, estructura implícita).', 'Escucha: conferencias, entrevistas densas.', 'Escritura: textos formales extensos (informe, ensayo breve) con cohesión fuerte.', 'Oral: argumentación fina, reformulación, concesión (zwar ⬦ aber).'] },
                    { title: 'Preparación', items: ['Lee prensa alemana (Zeit, Spiegel) con anotación de conectores.', 'Simula cronómetro en Escritura (panel Müller / TELC).'] },
                ],
            },
            C2: {
                label: 'C2 · TELC Deutsch C2 (casi nativo)',
                summary: 'Comprensión casi total; producción precisa y estilísticamente variada.',
                sections: [
                    { title: 'Pruebas típicas', items: ['Lectura: textos literarios o especializados; reformulación y síntesis.', 'Escucha: velocidad y ambiente natural.', 'Escritura: resúmenes, estilo y precisión léxica.', 'Oral: presentación estructurada y discusión abierta.'] },
                    { title: 'Nota', items: ['C2 no es â€œmÃ¡s vocabularioâ€: es precisiÃ³n, registro y estilo.'] },
                ],
            },
        };

        // --- COMPONENTE PRINCIPAL ---
