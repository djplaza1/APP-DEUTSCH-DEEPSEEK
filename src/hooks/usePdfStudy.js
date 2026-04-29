// Hook: usePdfStudy
window.usePdfStudy = function(deps) {
  const {
    setActiveTab, setWritingMode, setWritingTelcInputMode, setWritingTelcTypedText,
    setReadingSource, setReadingTextInput
  } = deps;

  const pdfStudyBufferRef = React.useRef(null);
  const pdfStudyDocHandleRef = React.useRef(null);

  const [pdfStudyDoc, setPdfStudyDoc] = React.useState(() => {
    try { const raw = localStorage.getItem(MULLER_PDF_STUDY_STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch(e) { return null; }
  });
  const [pdfStudyPageIdx, setPdfStudyPageIdx] = React.useState(0);
  const [pdfStudyExtracting, setPdfStudyExtracting] = React.useState(false);
  const [pdfStudyErr, setPdfStudyErr] = React.useState('');
  const [pdfStudyBusyMsg, setPdfStudyBusyMsg] = React.useState('');
  const [pdfStudyOcrBusy, setPdfStudyOcrBusy] = React.useState(false);
  const [pdfStudyLastApplied, setPdfStudyLastApplied] = React.useState('');
  const [pdfStudyFullscreen, setPdfStudyFullscreen] = React.useState(false);
  const [pdfStudyInkNonce, setPdfStudyInkNonce] = React.useState(0);
  const [pdfStudyNotesByPage, setPdfStudyNotesByPage] = React.useState(() => {
    try { const raw = localStorage.getItem(MULLER_PDF_NOTES_STORAGE_KEY); return raw ? JSON.parse(raw) : {}; }
    catch(e) { return {}; }
  });
  const [pdfStudySavedDocs, setPdfStudySavedDocs] = React.useState(() => {
    try { const raw = localStorage.getItem(MULLER_PDF_STUDY_LIBRARY_KEY); return raw ? JSON.parse(raw) : []; }
    catch(e) { return []; }
  });
  const [pdfStudyBlobUrl, setPdfStudyBlobUrl] = React.useState('');

  const loadPdfStudyFile = React.useCallback(async (file) => {
    if (!file) return;
    if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
      setPdfStudyErr('PDF no disponible en este navegador.');
      return;
    }
    try {
      const nextUrl = URL.createObjectURL(file);
      setPdfStudyBlobUrl((prev) => { if (prev) { try { URL.revokeObjectURL(prev); } catch(e) {} } return nextUrl; });
    } catch(e) { setPdfStudyBlobUrl(''); }
    setPdfStudyExtracting(true);
    setPdfStudyErr('');
    setPdfStudyBusyMsg('Leyendo PDF…');
    pdfStudyBufferRef.current = null;
    pdfStudyDocHandleRef.current = null;
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
      const buffer = await file.arrayBuffer();
      pdfStudyBufferRef.current = buffer;
      const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
      pdfStudyDocHandleRef.current = pdf;
      const totalPages = Math.max(1, Number(pdf.numPages) || 1);
      const pages = [];
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setPdfStudyBusyMsg('Extrayendo página ' + pageNum + '/' + totalPages + '…');
        let text = '';
        try { const pg = await pdf.getPage(pageNum); const tc = await pg.getTextContent(); text = mullerPdfCleanText((tc.items || []).map(it => String((it && it.str) || '')).join(' ')); } catch(e) {}
        const firstSlice = text.slice(0, 400);
        const meta = mullerPdfGuessUnitLesson(firstSlice);
        pages.push({ page: pageNum, unit: meta.unit, lesson: meta.lesson, text: text.slice(0, MULLER_PDF_STORED_TEXT_MAX), ocrPending: !text });
        if ((pageNum % MULLER_PDF_EXTRACT_YIELD_EVERY) === 0) await new Promise(resolve => setTimeout(resolve, 0));
      }
      const compactPages = pages.slice(0, MULLER_PDF_STORED_PAGES_MAX);
      const payload = { id: 'pdf-' + Date.now(), name: file.name || 'Libro PDF', size: file.size || 0, totalPages, pages: compactPages, importedAt: new Date().toISOString() };
      setPdfStudyDoc(payload);
      setPdfStudyPageIdx(0);
      try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(payload)); } catch(e) {}
      const extractedCount = compactPages.filter(p => p.text).length;
      setPdfStudyBusyMsg('PDF listo: ' + extractedCount + '/' + compactPages.length + ' páginas con texto.');
    } catch(err) {
      setPdfStudyErr(err && err.message ? err.message : 'No se pudo leer el PDF.');
    } finally {
      setPdfStudyExtracting(false);
    }
  }, []);

  const runPdfPageOcr = React.useCallback(async (pageNumber) => {
    if (!pdfStudyDoc) return;
    const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
    const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
    const page = pages[idx];
    if (!page) return;
    if (page.text && page.text.length >= 40) { setPdfStudyBusyMsg('Esta página ya tiene texto; OCR no es necesario.'); return; }
    if (typeof Tesseract === 'undefined') { setPdfStudyErr('No se pudo cargar OCR (Tesseract).'); return; }
    if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') { setPdfStudyErr('OCR PDF no disponible en este navegador.'); return; }
    if (!pdfStudyBufferRef.current && !pdfStudyDocHandleRef.current) { setPdfStudyErr('Para OCR real de página, vuelve a subir el PDF en esta sesión.'); setPdfStudyBusyMsg('OCR no disponible: falta el PDF en memoria.'); return; }
    setPdfStudyOcrBusy(true);
    let worker = null;
    let attemptNo = 0;
    const attemptCap = 1 + Math.max(0, Number(MULLER_PDF_OCR_RETRY_MAX) || 0);
    try {
      setPdfStudyErr('');
      const safePage = Math.max(1, Number(page.page || pageNumber) || 1);
      while (attemptNo < attemptCap) {
        try {
          setPdfStudyBusyMsg('Preparando OCR página ' + safePage + (attemptNo > 0 ? ' (reintento ' + attemptNo + '/' + (attemptCap - 1) + ')' : '') + '…');
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
          let pdf = pdfStudyDocHandleRef.current;
          if (!pdf) { pdf = await window.pdfjsLib.getDocument({ data: pdfStudyBufferRef.current }).promise; pdfStudyDocHandleRef.current = pdf; }
          const pg = await pdf.getPage(safePage);
          let ocrText = '';
          const scales = [1.6, 2.1];
          for (let attempt = 0; attempt < scales.length; attempt++) {
            const scale = scales[attempt];
            const viewport = pg.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.floor(viewport.width));
            canvas.height = Math.max(1, Math.floor(viewport.height));
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('No se pudo crear el contexto de imagen para OCR.');
            await pg.render({ canvasContext: ctx, viewport }).promise;
            setPdfStudyBusyMsg('OCR página ' + safePage + ': intento ' + (attempt + 1) + '/' + scales.length + (attemptNo > 0 ? ' · retry ' + attemptNo : '') + '…');
            worker = await Tesseract.createWorker('deu', 1, { logger: m => { if (m && m.status === 'recognizing text' && typeof m.progress === 'number') { setPdfStudyBusyMsg('OCR página ' + safePage + ': ' + Math.round(100 * m.progress) + '%'); } } });
            const result = await worker.recognize(canvas);
            await worker.terminate();
            worker = null;
            const raw = result && result.data ? result.data.text : '';
            ocrText = mullerPdfCleanText(raw);
            if (ocrText.length >= 24 || attempt === scales.length - 1) break;
          }
          if (!ocrText) { setPdfStudyErr('OCR sin texto. Prueba una página más nítida o con más contraste.'); setPdfStudyBusyMsg('OCR página ' + safePage + ': sin texto detectado.'); return; }
          const meta = mullerPdfGuessUnitLesson(ocrText.slice(0, 400));
          const nextPages = pages.map((p, pIdx) => {
            if (pIdx !== idx) return p;
            return { ...p, unit: p.unit || meta.unit, lesson: p.lesson || meta.lesson, text: ocrText.slice(0, MULLER_PDF_STORED_TEXT_MAX), ocrPending: false, ocrUpdatedAt: new Date().toISOString() };
          });
          const nextDoc = { ...pdfStudyDoc, pages: nextPages, updatedAt: new Date().toISOString() };
          setPdfStudyDoc(nextDoc);
          try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(nextDoc)); } catch(e) {}
          setPdfStudyBusyMsg('OCR completado en página ' + safePage + '.');
          return;
        } catch(attemptErr) {
          if (worker) { try { await worker.terminate(); } catch(e) {} worker = null; }
          attemptNo += 1;
          if (attemptNo >= attemptCap) throw attemptErr;
          setPdfStudyBusyMsg('OCR página ' + safePage + ': error temporal, reintentando…');
          await new Promise(resolve => setTimeout(resolve, 220));
        }
      }
    } catch(err) {
      setPdfStudyErr(err && err.message ? err.message : 'Error al ejecutar OCR de página.');
    } finally {
      if (worker) { try { await worker.terminate(); } catch(e) {} }
      setPdfStudyOcrBusy(false);
    }
  }, [pdfStudyDoc]);

  const applyPdfStudyTextToReading = React.useCallback((pageNumber) => {
    if (!pdfStudyDoc) return;
    const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
    const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
    const txt = page && page.text ? String(page.text).trim() : '';
    if (!txt) { setPdfStudyErr('Página sin texto extraído todavía.'); return; }
    setReadingSource('paste');
    setReadingTextInput(txt);
    setPdfStudyBusyMsg('Página ' + page.page + ' enviada a Lectura.');
    setPdfStudyLastApplied('✓ Página ' + page.page + ' cargada en Lectura');
  }, [pdfStudyDoc, setReadingSource, setReadingTextInput]);

  const applyPdfStudyTextToWriting = React.useCallback((pageNumber) => {
    if (!pdfStudyDoc) return;
    const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
    const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
    const txt = page && page.text ? String(page.text).trim() : '';
    if (!txt) { setPdfStudyErr('Página sin texto extraído todavía.'); return; }
    setActiveTab('escritura');
    setWritingMode('telc');
    setWritingTelcInputMode('keyboard');
    setWritingTelcTypedText(txt);
    setPdfStudyBusyMsg('Página ' + page.page + ' enviada a Escritura TELC.');
    setPdfStudyLastApplied('✓ Página ' + page.page + ' cargada en Escritura TELC');
  }, [pdfStudyDoc, setActiveTab, setWritingMode, setWritingTelcInputMode, setWritingTelcTypedText]);

  const updatePdfStudyPageMeta = React.useCallback((pageNumber, patch = {}) => {
    if (!pdfStudyDoc) return;
    const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
    const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
    const page = pages[idx];
    if (!page) return;
    const nextPages = pages.map((p, pIdx) => {
      if (pIdx !== idx) return p;
      return { ...p, unit: patch && typeof patch.unit === 'string' ? patch.unit.trim() : p.unit, lesson: patch && typeof patch.lesson === 'string' ? patch.lesson.trim() : p.lesson };
    });
    const nextDoc = { ...pdfStudyDoc, pages: nextPages, updatedAt: new Date().toISOString() };
    setPdfStudyDoc(nextDoc);
    try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(nextDoc)); } catch(e) {}
  }, [pdfStudyDoc]);

  const activePdfPageData = React.useMemo(() => {
    if (!pdfStudyDoc || !Array.isArray(pdfStudyDoc.pages) || !pdfStudyDoc.pages.length) return {};
    const idx = Math.max(0, Math.min(pdfStudyDoc.pages.length - 1, pdfStudyPageIdx));
    return pdfStudyDoc.pages[idx] || {};
  }, [pdfStudyDoc, pdfStudyPageIdx]);

  const activePdfPageNotes = React.useMemo(() => {
    const page = activePdfPageData && activePdfPageData.page ? Number(activePdfPageData.page) : 0;
    if (!page || !pdfStudyNotesByPage || typeof pdfStudyNotesByPage !== 'object') return { drawing: '', typed: '' };
    const entry = pdfStudyNotesByPage[String(page)] || {};
    return { drawing: typeof entry.drawing === 'string' ? entry.drawing : '', typed: typeof entry.typed === 'string' ? entry.typed : '' };
  }, [activePdfPageData, pdfStudyNotesByPage]);

  const pdfStudyCanvasPadKey = React.useMemo(() => {
    const basePage = Math.max(1, Number(activePdfPageData && activePdfPageData.page ? activePdfPageData.page : 1));
    const nonce = Math.max(0, Number(pdfStudyInkNonce) || 0);
    return (basePage * 1000) + nonce;
  }, [activePdfPageData, pdfStudyInkNonce]);

  const updatePdfPageNotes = React.useCallback((pageNumber, patch = {}) => {
    const safePage = Math.max(1, Number(pageNumber) || 1);
    setPdfStudyNotesByPage((prev) => {
      const base = prev && typeof prev === 'object' ? prev : {};
      const key = String(safePage);
      const current = base[key] && typeof base[key] === 'object' ? base[key] : {};
      const next = { ...base, [key]: { ...current, drawing: patch && typeof patch.drawing === 'string' ? patch.drawing : (typeof current.drawing === 'string' ? current.drawing : ''), typed: patch && typeof patch.typed === 'string' ? patch.typed : (typeof current.typed === 'string' ? current.typed : ''), updatedAt: new Date().toISOString() } };
      try { localStorage.setItem(MULLER_PDF_NOTES_STORAGE_KEY, JSON.stringify(next)); } catch(e) {}
      return next;
    });
  }, []);

  const clearPdfStudyDoc = React.useCallback(() => {
    setPdfStudyFullscreen(false);
    setPdfStudyDoc(null);
    setPdfStudyPageIdx(0);
    setPdfStudyErr('');
    setPdfStudyBusyMsg('PDF eliminado del panel.');
    setPdfStudyLastApplied('');
    setPdfStudyNotesByPage({});
    try { localStorage.removeItem(MULLER_PDF_STUDY_STORAGE_KEY); } catch(e) {}
    try { localStorage.removeItem(MULLER_PDF_NOTES_STORAGE_KEY); } catch(e) {}
    try { setPdfStudyBlobUrl((prev) => { if (prev) { try { URL.revokeObjectURL(prev); } catch(e) {} } return ''; }); } catch(e) {}
    pdfStudyBufferRef.current = null;
    pdfStudyDocHandleRef.current = null;
  }, []);

  const saveCurrentPdfStudyDoc = React.useCallback(() => {
    if (!pdfStudyDoc) return;
    const pagesCount = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages.length : 0;
    const entry = { id: pdfStudyDoc.id || ('pdf-' + Date.now()), name: pdfStudyDoc.name || 'Libro PDF', importedAt: pdfStudyDoc.importedAt || new Date().toISOString(), totalPages: pdfStudyDoc.totalPages || pagesCount, updatedAt: new Date().toISOString(), doc: pdfStudyDoc };
    setPdfStudySavedDocs((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      const withoutSame = arr.filter(x => String(x.id || '') !== String(entry.id));
      const next = [entry, ...withoutSame].slice(0, 20);
      try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify(next)); } catch(e) {}
      return next;
    });
    setPdfStudyBusyMsg('PDF guardado en biblioteca: ' + entry.name + '.');
  }, [pdfStudyDoc]);

  const loadPdfStudyFromLibrary = React.useCallback((libraryId) => {
    const arr = Array.isArray(pdfStudySavedDocs) ? pdfStudySavedDocs : [];
    const hit = arr.find(x => String(x.id || '') === String(libraryId));
    if (!hit || !hit.doc) return;
    setPdfStudyDoc(hit.doc);
    setPdfStudyPageIdx(0);
    setPdfStudyErr('');
    setPdfStudyLastApplied('');
    setPdfStudyBusyMsg('PDF cargado desde biblioteca: ' + (hit.name || 'Libro PDF') + '.');
    pdfStudyBufferRef.current = null;
    pdfStudyDocHandleRef.current = null;
    try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(hit.doc)); } catch(e) {}
  }, [pdfStudySavedDocs]);

  const removePdfStudyFromLibrary = React.useCallback((libraryId) => {
    const id = String(libraryId || '');
    if (!id) return;
    setPdfStudySavedDocs((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      const next = arr.filter(x => String((x && x.id) || '') !== id);
      try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify(next)); } catch(e) {}
      return next;
    });
    setPdfStudyBusyMsg('PDF eliminado de la biblioteca.');
  }, []);

  const clearPdfStudyLibrary = React.useCallback(() => {
    setPdfStudySavedDocs([]);
    try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify([])); } catch(e) {}
    setPdfStudyBusyMsg('Biblioteca PDF vaciada.');
  }, []);

  const openPdfStudyFullscreen = React.useCallback((pageNumber) => {
    if (!pdfStudyDoc) return;
    const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
    setPdfStudyPageIdx(idx);
    setPdfStudyInkNonce(0);
    setPdfStudyFullscreen(true);
  }, [pdfStudyDoc]);

  const closePdfStudyFullscreen = React.useCallback(() => {
    setPdfStudyFullscreen(false);
  }, []);

  return {
    pdfStudyDoc, setPdfStudyDoc,
    pdfStudyPageIdx, setPdfStudyPageIdx,
    pdfStudyExtracting, setPdfStudyExtracting,
    pdfStudyErr, setPdfStudyErr,
    pdfStudyBusyMsg, setPdfStudyBusyMsg,
    pdfStudyOcrBusy, setPdfStudyOcrBusy,
    pdfStudyLastApplied, setPdfStudyLastApplied,
    pdfStudyFullscreen, setPdfStudyFullscreen,
    pdfStudyInkNonce, setPdfStudyInkNonce,
    pdfStudyNotesByPage, setPdfStudyNotesByPage,
    pdfStudySavedDocs, setPdfStudySavedDocs,
    pdfStudyBlobUrl, setPdfStudyBlobUrl,
    loadPdfStudyFile,
    runPdfPageOcr,
    applyPdfStudyTextToReading,
    applyPdfStudyTextToWriting,
    updatePdfStudyPageMeta,
    activePdfPageData,
    activePdfPageNotes,
    pdfStudyCanvasPadKey,
    updatePdfPageNotes,
    clearPdfStudyDoc,
    saveCurrentPdfStudyDoc,
    loadPdfStudyFromLibrary,
    removePdfStudyFromLibrary,
    clearPdfStudyLibrary,
    openPdfStudyFullscreen,
    closePdfStudyFullscreen
  };
};
