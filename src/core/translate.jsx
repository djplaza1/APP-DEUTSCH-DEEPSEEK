  const mullerTranslateGtxFull = async (text, sl, tl) => {
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
              const r = await fetch(url);
              if (!r.ok) throw new Error('gtx');
              const data = await r.json();
              let out = '';
              if (data && data[0]) data[0].forEach((p) => { if (p && p[0]) out += p[0]; });
              const detected = data && data[2] != null ? String(data[2]) : '';
              return { text: out.trim(), detected };
          };

          const mullerTranslateViaGtx = async (text, sl, tl) => {
              const { text: out } = await mullerTranslateGtxFull(text, sl, tl);
              return out;
          };

          const mullerTranslateViaMyMemory = async (text, pair) => {
              const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`);
              const j = await r.json();
              const st = j && j.responseStatus;
              if (!r.ok || (st != null && Number(st) !== 200 && st !== '200')) throw new Error('mm');
              return String((j.responseData && j.responseData.translatedText) || '').trim();
          };