var BX_DB_EMPTY = { vocabulario: [], verbos: [], preposiciones: [], conectores: [], redemittel: [] };
function normalizeBxPayload(data) {
            if (!data || typeof data !== 'object') return { b1: { ...BX_DB_EMPTY }, b2: { ...BX_DB_EMPTY } };
            const b1 = data.b1 || data.B1;
            const b2 = data.b2 || data.B2;
            return {
                b1: b1 ? { ...BX_DB_EMPTY, ...b1 } : { ...BX_DB_EMPTY },
                b2: b2 ? { ...BX_DB_EMPTY, ...b2 } : { ...BX_DB_EMPTY }
            };
        }
