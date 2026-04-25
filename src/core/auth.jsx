   const MULLER_ACCOUNTS_KEY = 'muller_accounts_v1';
        const MULLER_SESSION_KEY = 'muller_session_v1';
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
            if (at < 1) return e || '—';
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