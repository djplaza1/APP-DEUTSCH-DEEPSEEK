          const sanitizeHistoriaSpeechText = (text) => {
              return String(text || '')
                  .replace(/\[R\]/gi, '')
                  .replace(/\bN[üu]tzlich\b\.?/gi, '')
                  .replace(/\b[ÚU]TIL\b\.?/gi, '')
                  .replace(/\s{2,}/g, ' ')
                  .trim();
          };