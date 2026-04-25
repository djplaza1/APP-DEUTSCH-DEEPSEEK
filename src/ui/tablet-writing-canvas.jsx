          /** Lienzo para lápiz óptico / dedo: pointer capture, sin scroll al trazar. Herramientas: lápiz, goma, marcador, subrayado + deshacer. */
          const TabletWritingCanvas = ({ padKey, grid, strokeW, compareTarget, onOcrCompared, snapshotData, snapshotPadKey, onSnapshotChange, backgroundImageData = '', overlayMode = false, hideOcrUi = false }) => {
              const wrapRef = useRef(null);
              const canvasRef = useRef(null);
              const ctxRef = useRef(null);
              const drawingRef = useRef(false);
              const movedRef = useRef(false);
              const lastPtRef = useRef({ x: 0, y: 0 });
              const undoStackRef = useRef([]);
              const sizeRef = useRef({ w: 400, h: 400 });
              const strokeWRef = useRef(strokeW);
              strokeWRef.current = strokeW;
              const [writingTool, setWritingTool] = useState('pen');
              const [penColor, setPenColor] = useState('#f1f5f9');
              const [eraserW, setEraserW] = useState(18);
              const [hlPreset, setHlPreset] = useState('yellow');
              const [hlWidth, setHlWidth] = useState(24);
              const [ocrLoading, setOcrLoading] = useState(false);
              const [ocrText, setOcrText] = useState('');
              const [ocrHint, setOcrHint] = useState('');
              const [ocrErr, setOcrErr] = useState('');
              const [ocrComparePct, setOcrComparePct] = useState(null);
              const [canUndo, setCanUndo] = useState(false);
              const currentHlPathRef = useRef([]);
              const strokeBaseRef = useRef(null);

              const HL_MAP = useMemo(() => ({
                  yellow: 'rgba(250, 204, 21, 0.42)',
                  green: 'rgba(74, 222, 128, 0.42)',
                  pink: 'rgba(244, 114, 182, 0.42)',
                  orange: 'rgba(251, 146, 60, 0.42)',
                  blue: 'rgba(96, 165, 250, 0.45)',
                  cyan: 'rgba(34, 211, 238, 0.42)',
                  purple: 'rgba(192, 132, 252, 0.42)',
                  red: 'rgba(248, 113, 113, 0.38)',
                  gray: 'rgba(148, 163, 184, 0.4)',
              }), []);

              const layoutCanvas = useCallback(() => {
                  const canvas = canvasRef.current;
                  const wrap = wrapRef.current;
                  if (!canvas || !wrap) return;
                  const iw = typeof window !== 'undefined' ? window.innerWidth : 400;
                  const ih = typeof window !== 'undefined' ? window.innerHeight : 700;
                  const w = Math.max(8, wrap.clientWidth || (overlayMode ? Math.min(920, iw - 24) : iw - 24));
                  let h;
                  if (!overlayMode) {
                      h = Math.max(360, Math.min(680, Math.floor(ih * 0.52)));
                  } else {
                      h = Math.max(200, wrap.clientHeight || 0, Math.floor(ih * 0.38));
                  }
                  const dpr = window.devicePixelRatio || 1;
                  sizeRef.current = { w, h };
                  canvas.width = w * dpr;
                  canvas.height = h * dpr;
                  canvas.style.width = `${w}px`;
                  canvas.style.height = `${h}px`;
                  const ctx = canvas.getContext('2d');
                  ctx.setTransform(1, 0, 0, 1, 0, 0);
                  ctx.scale(dpr, dpr);
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctxRef.current = ctx;
                  undoStackRef.current = [];
                  setCanUndo(false);
              }, [padKey, overlayMode]);

              useEffect(() => {
                  if (!overlayMode) return;
                  const wrap = wrapRef.current;
                  if (!wrap || typeof ResizeObserver === 'undefined') return;
                  const ro = new ResizeObserver(() => { layoutCanvas(); });
                  ro.observe(wrap);
                  return () => { try { ro.disconnect(); } catch (e) {} };
              }, [overlayMode, layoutCanvas]);

              useEffect(() => { layoutCanvas(); }, [layoutCanvas]);
              useEffect(() => {
                  const canvas = canvasRef.current;
                  const ctx = ctxRef.current;
                  if (!canvas || !ctx) return;
                  let cancelled = false;
                  const drawSnapshot = () => {
                      if (!snapshotData || snapshotPadKey !== padKey) return;
                      const img = new Image();
                      img.onload = () => {
                          if (cancelled) return;
                          try { ctx.drawImage(img, 0, 0, sizeRef.current.w, sizeRef.current.h); } catch (err) {}
                      };
                      img.src = snapshotData;
                  };
                  ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
                  if (backgroundImageData) {
                      const bg = new Image();
                      bg.onload = () => {
                          if (cancelled) return;
                          try { ctx.drawImage(bg, 0, 0, sizeRef.current.w, sizeRef.current.h); } catch (err) {}
                          drawSnapshot();
                      };
                      bg.src = backgroundImageData;
                  } else {
                      drawSnapshot();
                  }
                  return () => { cancelled = true; };
              }, [snapshotData, snapshotPadKey, padKey, backgroundImageData]);

              const getPos = (e) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return { x: 0, y: 0 };
                  const rect = canvas.getBoundingClientRect();
                  let cx = e.clientX;
                  let cy = e.clientY;
                  if (e.touches && e.touches[0]) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
                  else if (e.changedTouches && e.changedTouches[0]) { cx = e.changedTouches[0].clientX; cy = e.changedTouches[0].clientY; }
                  return { x: cx - rect.left, y: cy - rect.top };
              };

              const applyStrokeStyle = (ctx, tool) => {
                  ctx.globalAlpha = 1;
                  ctx.globalCompositeOperation = 'source-over';
                  ctx.shadowBlur = 0;
                  if (tool === 'eraser') {
                      ctx.globalCompositeOperation = 'destination-out';
                      ctx.strokeStyle = 'rgba(0,0,0,1)';
                      ctx.fillStyle = 'rgba(0,0,0,1)';
                      ctx.lineWidth = eraserW;
                  } else if (tool === 'highlighter') {
                      ctx.strokeStyle = HL_MAP[hlPreset] || HL_MAP.yellow;
                      ctx.lineWidth = hlWidth;
                      ctx.globalAlpha = 1;
                  } else if (tool === 'underline') {
                      ctx.strokeStyle = penColor;
                      ctx.lineWidth = 3;
                  } else {
                      ctx.strokeStyle = penColor;
                      ctx.lineWidth = strokeWRef.current;
                  }
              };

              const drawSegment = (ctx, x0, y0, x1, y1, tool) => {
                  ctx.save();
                  applyStrokeStyle(ctx, tool);
                  ctx.beginPath();
                  if (tool === 'underline') {
                      const o = 12;
                      ctx.moveTo(x0, y0 + o);
                      ctx.lineTo(x1, y1 + o);
                  } else {
                      ctx.moveTo(x0, y0);
                      ctx.lineTo(x1, y1);
                  }
                  ctx.stroke();
                  ctx.restore();
              };

              const stampDot = (ctx, x, y, tool) => {
                  ctx.save();
                  applyStrokeStyle(ctx, tool);
                  ctx.beginPath();
                  if (tool === 'underline') {
                      ctx.fillStyle = penColor;
                      ctx.arc(x, y + 12, 1.4, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                  } else if (tool === 'eraser') {
                      ctx.arc(x, y, eraserW * 0.45, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                  } else if (tool === 'highlighter') {
                      ctx.fillStyle = HL_MAP[hlPreset] || HL_MAP.yellow;
                      ctx.arc(x, y, Math.max(6, hlWidth * 0.38), 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                  } else {
                      ctx.fillStyle = penColor;
                      ctx.arc(x, y, Math.max(1.2, strokeWRef.current * 0.45), 0, Math.PI * 2);
                  }
                  ctx.fill();
                  ctx.restore();
              };

              const pushUndoBeforeStroke = () => {
                  const canvas = canvasRef.current;
                  const ctx = ctxRef.current;
                  if (!canvas || !ctx) return;
                  try {
                      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
                      undoStackRef.current.push(snap);
                      if (undoStackRef.current.length > 12) undoStackRef.current.shift();
                      setCanUndo(undoStackRef.current.length > 0);
                  } catch (err) {}
              };

              const undoLastStroke = () => {
                  const canvas = canvasRef.current;
                  const ctx = ctxRef.current;
                  if (!canvas || !ctx || undoStackRef.current.length === 0) return;
                  const snap = undoStackRef.current.pop();
                  try {
                      ctx.putImageData(snap, 0, 0);
                  } catch (err) {}
                  setCanUndo(undoStackRef.current.length > 0);
                  try {
                      if (typeof onSnapshotChange === 'function' && canvasRef.current) onSnapshotChange(canvasRef.current.toDataURL('image/png'));
                  } catch (err) {}
              };

              const startDraw = (e) => {
                  e.preventDefault();
                  const ctx = ctxRef.current;
                  if (!ctx) return;
                  try { if (e.pointerId != null) canvasRef.current.setPointerCapture(e.pointerId); } catch (err) {}
                  pushUndoBeforeStroke();
                  drawingRef.current = true;
                  movedRef.current = false;
                  const p = getPos(e);
                  lastPtRef.current = { x: p.x, y: p.y };
                  if (writingTool === 'highlighter') {
                      const canvas = canvasRef.current;
                      try { strokeBaseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch(err) { strokeBaseRef.current = null; }
                      currentHlPathRef.current = [{ x: p.x, y: p.y }];
                  }
              };
              const moveDraw = (e) => {
                  e.preventDefault();
                  if (!drawingRef.current || !ctxRef.current) return;
                  const ctx = ctxRef.current;
                  const p = getPos(e);
                  const lx = lastPtRef.current.x;
                  const ly = lastPtRef.current.y;
                  if (Math.hypot(p.x - lx, p.y - ly) < 0.35) return;
                  movedRef.current = true;
                  if (writingTool === 'highlighter') {
                      currentHlPathRef.current.push({ x: p.x, y: p.y });
                      if (strokeBaseRef.current) { try { ctx.putImageData(strokeBaseRef.current, 0, 0); } catch(err) {} }
                      ctx.save();
                      applyStrokeStyle(ctx, 'highlighter');
                      ctx.beginPath();
                      const pts = currentHlPathRef.current;
                      ctx.moveTo(pts[0].x, pts[0].y);
                      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
                      ctx.stroke();
                      ctx.restore();
                  } else {
                      drawSegment(ctx, lx, ly, p.x, p.y, writingTool);
                  }
                  lastPtRef.current = { x: p.x, y: p.y };
              };
              const endDraw = (e) => {
                  e.preventDefault();
                  if (drawingRef.current && ctxRef.current && !movedRef.current) {
                      const p = lastPtRef.current;
                      stampDot(ctxRef.current, p.x, p.y, writingTool);
                  }
                  drawingRef.current = false;
                  movedRef.current = false;
                  currentHlPathRef.current = [];
                  strokeBaseRef.current = null;
                  try { if (e.pointerId != null) canvasRef.current.releasePointerCapture(e.pointerId); } catch (err) {}
                  try {
                      if (typeof onSnapshotChange === 'function' && canvasRef.current) onSnapshotChange(canvasRef.current.toDataURL('image/png'));
                  } catch (err) {}
              };

              const clearPad = () => {
                  const ctx = ctxRef.current;
                  const { w, h } = sizeRef.current;
                  if (!ctx) return;
                  ctx.clearRect(0, 0, w, h);
                  if (backgroundImageData) {
                      const bg = new Image();
                      bg.onload = () => {
                          try { ctx.drawImage(bg, 0, 0, w, h); } catch (err) {}
                      };
                      bg.src = backgroundImageData;
                  }
                  undoStackRef.current = [];
                  setCanUndo(false);
                  if (typeof onSnapshotChange === 'function') onSnapshotChange('');
              };
              const savePng = () => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const link = document.createElement('a');
                  link.download = `muller_escritura_${Date.now()}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
              };

              const canvasToBlackOnWhite = (source) => {
                  const w = source.width;
                  const h = source.height;
                  const tmp = document.createElement('canvas');
                  tmp.width = w;
                  tmp.height = h;
                  const sctx = source.getContext('2d');
                  const tctx = tmp.getContext('2d');
                  const img = sctx.getImageData(0, 0, w, h);
                  const d = img.data;
                  const out = tctx.createImageData(w, h);
                  const o = out.data;
                  for (let i = 0; i < d.length; i += 4) {
                      const a = d[i + 3];
                      const v = a > 40 ? 0 : 255;
                      o[i] = v;
                      o[i + 1] = v;
                      o[i + 2] = v;
                      o[i + 3] = 255;
                  }
                  tctx.putImageData(out, 0, 0);
                  return tmp;
              };

              const runHandwritingOcr = async () => {
                  if (typeof Tesseract === 'undefined') {
                      setOcrErr('No se pudo cargar Tesseract.js. Comprueba la conexión y recarga.');
                      return;
                  }
                  const source = canvasRef.current;
                  if (!source || source.width < 8) return;
                  setOcrErr('');
                  setOcrText('');
                  setOcrComparePct(null);
                  setOcrLoading(true);
                  setOcrHint('Preparando imagen…');
                  let worker;
                  try {
                      const bw = canvasToBlackOnWhite(source);
                      worker = await Tesseract.createWorker('deu', 1, {
                          logger: (m) => {
                              if (m.status === 'recognizing text' && m.progress != null) setOcrHint(`Leyendo… ${Math.round(100 * m.progress)}%`);
                              else if (m.status && String(m.status).includes('loading')) setOcrHint('Descargando modelo alemán (solo la 1ª vez, ~2–5 MB)…');
                              else if (m.status) setOcrHint(String(m.status));
                          },
                      });
                      const { data: { text } } = await worker.recognize(bw);
                      await worker.terminate();
                      worker = null;
                      const t = (text || '').replace(/\s+\n/g, '\n').trim();
                      setOcrText(t);
                      let computedPct = null;
                      if (compareTarget && t) {
                          const a = normalizeGermanSpeechText(compareTarget);
                          const b = normalizeGermanSpeechText(t);
                          if (a.length && b.length) {
                              const dist = levenshteinDistance(a, b);
                              const maxL = Math.max(a.length, b.length, 1);
                              computedPct = Math.min(100, Math.max(0, Math.round((100 * (maxL - dist)) / maxL)));
                              setOcrComparePct(computedPct);
                          } else setOcrComparePct(null);
                      } else setOcrComparePct(null);
                      if (!t) setOcrHint('No se detectó texto. Escribe más grande o con más contraste.');
                      else setOcrHint('');
                      if (typeof onOcrCompared === 'function' && (computedPct != null || t)) {
                          onOcrCompared({
                              pct: computedPct,
                              textSnippet: (t || '').slice(0, 120),
                              targetSnippet: typeof compareTarget === 'string' ? compareTarget.slice(0, 120) : '',
                              recognizedText: t || ''
                          });
                      }
                  } catch (err) {
                      if (worker) try { await worker.terminate(); } catch (e) {}
                      setOcrErr(err?.message || 'Error en OCR');
                      setOcrHint('');
                  } finally {
                      setOcrLoading(false);
                  }
              };

              const canvasCursor = writingTool === 'eraser' ? 'cell' : writingTool === 'highlighter' ? 'copy' : 'crosshair';

              return (
                  <div className={overlayMode ? 'flex flex-col h-full min-h-0 w-full' : 'space-y-3'}>
                      <div className={`rounded-xl border border-white/10 bg-black/25 space-y-2 ${overlayMode ? 'p-2 shrink-0' : 'p-2 md:p-3'}`}>
                          <p className="text-[10px] font-bold text-rose-300/90 uppercase tracking-wider text-center md:text-left">{overlayMode ? 'Herram. · PDF' : 'Herramientas'}</p>
                          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                              {[
                                  { id: 'pen', label: 'Lápiz', icon: 'pen-line', title: 'Trazo normal (usa el grosor de abajo)' },
                                  { id: 'eraser', label: 'Goma', icon: 'eraser', title: 'Borra solo lo que pasas por encima (elige ancho de goma)' },
                                  { id: 'highlighter', label: 'Marcador', icon: 'highlighter', title: 'Resalta como fluorescente (encima del texto)' },
                                  { id: 'underline', label: 'Subrayado', icon: 'minus', title: 'Línea fina bajo el trazo (subrayar palabras)' },
                              ].map((t) => (
                                  <button
                                      key={t.id}
                                      type="button"
                                      title={t.title}
                                      onClick={() => setWritingTool(t.id)}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-bold border transition ${writingTool === t.id ? 'bg-rose-700 border-rose-400/60 text-white shadow' : 'bg-slate-800/90 border-white/10 text-gray-400 hover:text-white'}`}
                                  >
                                      <Icon name={t.icon} className="w-3.5 h-3.5 shrink-0 opacity-90" />
                                      {t.label}
                                  </button>
                              ))}
                          </div>
                          {(writingTool === 'pen' || writingTool === 'underline') && (
                              <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Tinta:</span>
                                  {[
                                      { c: '#000000', lab: 'Negro' },
                                      { c: '#0f172a', lab: 'Grafito' },
                                      { c: '#f1f5f9', lab: 'Blanco' },
                                      { c: '#94a3b8', lab: 'Gris' },
                                      { c: '#60a5fa', lab: 'Azul' },
                                      { c: '#22c55e', lab: 'Verde' },
                                      { c: '#14b8a6', lab: 'Verde agua' },
                                      { c: '#eab308', lab: 'Amarillo' },
                                      { c: '#f97316', lab: 'Naranja' },
                                      { c: '#f87171', lab: 'Rojo' },
                                      { c: '#ec4899', lab: 'Rosa' },
                                      { c: '#a855f7', lab: 'Violeta' },
                                      { c: '#c4b5fd', lab: 'Lila' },
                                      { c: '#2dd4bf', lab: 'Turquesa' },
                                  ].map((x) => (
                                      <button
                                          key={x.c}
                                          type="button"
                                          title={x.lab}
                                          onClick={() => setPenColor(x.c)}
                                          className={`w-7 h-7 rounded-full border-2 shrink-0 ${penColor === x.c ? 'border-white ring-2 ring-rose-400/80' : 'border-white/30'} ${x.c === '#000000' || x.c === '#0f172a' ? 'ring-1 ring-white/50' : ''}`}
                                          style={{ background: x.c }}
                                      />
                                  ))}
                              </div>
                          )}
                          {writingTool === 'eraser' && (
                              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Ancho goma:</span>
                                  {[10, 18, 28, 42].map((ew) => (
                                      <button key={ew} type="button" onClick={() => setEraserW(ew)} className={`px-2 py-1 rounded-md text-[10px] font-black border ${eraserW === ew ? 'bg-amber-700 border-amber-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} title={`Goma ${ew}px`}>
                                          {ew}px
                                      </button>
                                  ))}
                                  <span className="text-[9px] text-slate-600 ml-1">Fino = letra · ancho = palabra</span>
                              </div>
                          )}
                          {writingTool === 'highlighter' && (
                              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Color:</span>
                                  {[
                                      { id: 'yellow', bg: 'bg-yellow-400' },
                                      { id: 'green', bg: 'bg-green-400' },
                                      { id: 'pink', bg: 'bg-pink-400' },
                                      { id: 'orange', bg: 'bg-orange-400' },
                                      { id: 'blue', bg: 'bg-blue-400' },
                                      { id: 'cyan', bg: 'bg-cyan-400' },
                                      { id: 'purple', bg: 'bg-purple-400' },
                                      { id: 'red', bg: 'bg-red-400' },
                                      { id: 'gray', bg: 'bg-slate-400' },
                                  ].map((h) => (
                                      <button key={h.id} type="button" onClick={() => setHlPreset(h.id)} className={`w-8 h-5 rounded border-2 ${h.bg} ${hlPreset === h.id ? 'border-white ring-1 ring-rose-300' : 'border-white/20'}`} title={h.id} />
                                  ))}
                                  <span className="text-[10px] text-slate-500 ml-1">Ancho:</span>
                                  {[16, 24, 34].map((hw) => (
                                      <button key={hw} type="button" onClick={() => setHlWidth(hw)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${hlWidth === hw ? 'bg-lime-800 text-white' : 'bg-slate-800 text-gray-500'}`}>
                                          {hw}
                                      </button>
                                  ))}
                              </div>
                          )}
                          {writingTool === 'underline' && (
                              <p className="text-[9px] text-sky-400/90 text-center md:text-left pt-1 border-t border-white/5">Subrayado: traza encima; la raya usa el <strong className="text-sky-200">color de tinta</strong> (elige arriba).</p>
                          )}
                          </div>
                      <div
                          ref={wrapRef}
                          className={
                              overlayMode
                                  ? 'relative w-full flex-1 min-h-[120px] overflow-hidden rounded-lg border border-white/15 bg-transparent'
                                  : grid
                                  ? 'writing-pad-wrap'
                                  : 'rounded-xl border-2 border-slate-600 bg-[#0c1222] overflow-hidden'
                          }
                      >
                          <canvas
                              ref={canvasRef}
                              className="writing-lab-canvas"
                              style={{ cursor: canvasCursor, touchAction: 'none' }}
                              onPointerDown={startDraw}
                              onPointerMove={moveDraw}
                              onPointerUp={endDraw}
                              onPointerLeave={endDraw}
                              onPointerCancel={endDraw}
                          />
                      </div>
                      <div className={`flex flex-wrap gap-2 justify-center items-center ${overlayMode ? 'shrink-0 pt-1' : ''}`}>
                          <button type="button" onClick={undoLastStroke} disabled={!canUndo} className={`rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-35 disabled:pointer-events-none font-bold ${overlayMode ? 'px-2 py-1 text-[11px]' : 'px-4 py-2 text-sm'}`} title="Deshacer el último trazo">
                              <span className="inline-flex items-center gap-1.5"><Icon name="undo-2" className="w-4 h-4" /> Deshacer</span>
                          </button>
                          <button type="button" onClick={clearPad} className={`rounded-lg bg-slate-700 hover:bg-slate-600 font-bold ${overlayMode ? 'px-2 py-1 text-[11px]' : 'px-4 py-2 text-sm'}`} title="Vacía todo el lienzo">Borrar</button>
                          {!hideOcrUi && (
                              <>
                                  <button type="button" onClick={savePng} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-sm font-bold">Guardar PNG</button>
                                  <button
                                      type="button"
                                      disabled={ocrLoading}
                                      onClick={runHandwritingOcr}
                                      className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-sm font-bold flex items-center gap-2"
                                      title="OCR gratuito en tu dispositivo (Tesseract). La primera vez descarga el idioma alemán."
                                  >
                                      {ocrLoading ? <span className="animate-pulse">⏳ OCR…</span> : <><Icon name="scan-line" className="w-4 h-4" /> Reconocer texto</>}
                                  </button>
                              </>
                          )}
                          {hideOcrUi && (
                              <button type="button" onClick={savePng} className={`rounded-lg bg-emerald-800/90 hover:bg-emerald-700 font-bold ${overlayMode ? 'px-2 py-1 text-[11px]' : 'px-3 py-2 text-sm'}`} title="Exportar anotación">
                                  PNG
                              </button>
                          )}
                      </div>
                      {!hideOcrUi && (
                          <>
                      <p className="text-[10px] text-center text-slate-500 px-1">
                          Motor: <strong className="text-slate-400">Tesseract.js</strong> (alemán, local). El manuscrito es aproximado; la letra muy ligada o muy pequeña empeora el resultado.
                      </p>
                      {ocrComparePct !== null && (
                          <p className="text-center text-sm font-bold text-emerald-300/95">Coincidencia con el texto modelo (OCR): {ocrComparePct}%</p>
                      )}
                      {ocrHint && <p className="text-xs text-indigo-300/90 text-center">{ocrHint}</p>}
                      {ocrErr && <p className="text-xs text-red-400 text-center bg-red-950/40 rounded-lg px-2 py-1">{ocrErr}</p>}
                      {(ocrText || ocrLoading) && (
                          <div className="rounded-xl border border-indigo-600/40 bg-black/40 p-3">
                              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Texto reconocido (editable)</label>
                              <textarea
                                  className="mt-2 w-full min-h-[100px] bg-slate-900/80 border border-white/10 rounded-lg p-2 text-sm text-white font-mono"
                                  value={ocrText}
                                  onChange={(e) => setOcrText(e.target.value)}
                                  placeholder={ocrLoading ? '…' : ''}
                                  readOnly={ocrLoading}
                              />
                          </div>
                      )}
                          </>
                      )}
                      {hideOcrUi && overlayMode && (
                          <p className="text-[9px] text-cyan-200/80 text-center px-1">Se guarda en esta página (local). Activa &quot;Desplazar PDF&quot; para mover el documento.</p>
                      )}
                  </div>
              );
          };

          window.TabletWritingCanvas = TabletWritingCanvas;