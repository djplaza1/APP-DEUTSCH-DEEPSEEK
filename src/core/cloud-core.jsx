       const MULLER_BX_USER_OVERLAY_KEY = 'muller_bx_user_overlay_v1';

     




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