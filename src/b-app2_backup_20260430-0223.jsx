          const themeShellClass = uiTheme === 'light' ? 'muller-theme-light' : uiTheme === 'hc' ? 'muller-theme-hc' : '';

          const currentPracticeList = practiceActive === 'diff' ? userStats.difficultVocab : (practiceActive === 'norm' ? userStats.normalVocab : userStats.difficultGrammar);
          const currentPracticeItem = currentPracticeList ? currentPracticeList[practiceIndex] : null;

          /** Lienzo para lápiz óptico / dedo: pointer capture, sin scroll al trazar. Herramientas: lápiz, goma, marcador, subrayado + deshacer. */
          const TabletWritingCanvas = ({ padKey, grid, strokeW, compareTarget, onOcrCompared, snapshotData, snapshotPadKey, onSnapshotChange, backgroundImageData = '' }) => {
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
              }), []);

              const layoutCanvas = useCallback(() => {
                  const canvas = canvasRef.current;
                  const wrap = wrapRef.current;
                  if (!canvas || !wrap) return;
                  const w = wrap.clientWidth;
                  const h = Math.max(360, Math.min(680, Math.floor((typeof window !== 'undefined' ? window.innerHeight : 700) * 0.52)));
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
              }, [padKey]);

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
                      ctx.strokeStyle = '#38bdf8';
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
                      ctx.fillStyle = '#38bdf8';
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
                  setOcrHint('Preparando imagen⬦');
                  let worker;
                  try {
                      const bw = canvasToBlackOnWhite(source);
                      worker = await Tesseract.createWorker('deu', 1, {
                          logger: (m) => {
                              if (m.status === 'recognizing text' && m.progress != null) setOcrHint(`Leyendo⬦ ${Math.round(100 * m.progress)}%`);
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
                  <div className="space-y-3">
                      <div className="rounded-xl border border-white/10 bg-black/25 p-2 md:p-3 space-y-2">
                          <p className="text-[10px] font-bold text-rose-300/90 uppercase tracking-wider text-center md:text-left">Herramientas</p>
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
                          {writingTool === 'pen' && (
                              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Tinta:</span>
                                  {[
                                      { c: '#f1f5f9', lab: 'Blanco' },
                                      { c: '#60a5fa', lab: 'Azul' },
                                      { c: '#f87171', lab: 'Rojo' },
                                      { c: '#c4b5fd', lab: 'Violeta' },
                                  ].map((x) => (
                                      <button key={x.c} type="button" title={x.lab} onClick={() => setPenColor(x.c)} className={`w-7 h-7 rounded-full border-2 shrink-0 ${penColor === x.c ? 'border-white ring-2 ring-rose-400/80' : 'border-white/20'}`} style={{ background: x.c }} />
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
                              <p className="text-[9px] text-sky-400/90 text-center md:text-left pt-1 border-t border-white/5">Subrayado: traza encima de la línea; la raya azul sale un poco más abajo (como subrayar en papel).</p>
                          )}
                      </div>
                      <div ref={wrapRef} className={grid ? 'writing-pad-wrap' : 'rounded-xl border-2 border-slate-600 bg-[#0c1222] overflow-hidden'}>
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
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                          <button type="button" onClick={undoLastStroke} disabled={!canUndo} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-35 disabled:pointer-events-none text-sm font-bold" title="Deshacer el último trazo">
                              <span className="inline-flex items-center gap-1.5"><Icon name="undo-2" className="w-4 h-4" /> Deshacer trazo</span>
                          </button>
                          <button type="button" onClick={clearPad} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-bold" title="Vacía todo el lienzo">Borrar lienzo</button>
                          <button type="button" onClick={savePng} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-sm font-bold">Guardar PNG</button>
                          <button
                              type="button"
                              disabled={ocrLoading}
                              onClick={runHandwritingOcr}
                              className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-sm font-bold flex items-center gap-2"
                              title="OCR gratuito en tu dispositivo (Tesseract). La primera vez descarga el idioma alemán."
                          >
                              {ocrLoading ? <span className="animate-pulse">⏳ OCR⬦</span> : <><Icon name="scan-line" className="w-4 h-4" /> Reconocer texto</>}
                          </button>
                      </div>
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
                                  placeholder={ocrLoading ? '⬦' : ''}
                                  readOnly={ocrLoading}
                              />
                          </div>
                      )}
                  </div>
              );
          };

          // Componente de escritura a mano (canvas)
          const HandwritingPad = ({ onClose }) => {
              const canvasRef = useRef(null);
              const [isDrawing, setIsDrawing] = useState(false);
              const [ctx, setCtx] = useState(null);
              useEffect(() => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                      const context = canvas.getContext('2d');
                      context.lineCap = 'round';
                      context.lineJoin = 'round';
                      context.strokeStyle = '#ffffff';
                      context.lineWidth = 4;
                      setCtx(context);
                      const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
                      resize();
                      window.addEventListener('resize', resize);
                      return () => window.removeEventListener('resize', resize);
                  }
              }, []);
              const startDrawing = (e) => { e.preventDefault(); setIsDrawing(true); const { offsetX, offsetY } = getCoordinates(e); ctx.beginPath(); ctx.moveTo(offsetX, offsetY); };
              const draw = (e) => { e.preventDefault(); if (!isDrawing) return; const { offsetX, offsetY } = getCoordinates(e); ctx.lineTo(offsetX, offsetY); ctx.stroke(); };
              const stopDrawing = () => { setIsDrawing(false); };
              const getCoordinates = (e) => {
                  const canvas = canvasRef.current;
                  const rect = canvas.getBoundingClientRect();
                  let clientX, clientY;
                  if (e.touches) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
                  else { clientX = e.clientX; clientY = e.clientY; }
                  return { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
              };
              const clearCanvas = () => { ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); };
              const saveDrawing = () => {
                  const canvas = canvasRef.current;
                  const image = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.download = `handwriting_${Date.now()}.png`;
                  link.href = image;
                  link.click();
              };
              return (
                  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                      <div className="bg-gray-800 rounded-2xl p-4 max-w-2xl w-full">
                          <h3 className="text-xl font-bold mb-2">✍️ Escritura a mano</h3>
                          <canvas ref={canvasRef} className="handwriting-canvas" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                          <div className="flex gap-3 mt-4">
                              <button onClick={clearCanvas} className="bg-gray-600 px-4 py-2 rounded-lg">Borrar</button>
                              <button onClick={saveDrawing} className="bg-green-600 px-4 py-2 rounded-lg">Guardar dibujo</button>
                              <button onClick={onClose} className="bg-red-600 px-4 py-2 rounded-lg">Cerrar</button>
                          </div>
                      </div>
                  </div>
              );
          };

          const writingScriptOptions = useMemo(() => {
              const out = [];
              if (Array.isArray(savedScripts)) {
                  savedScripts.forEach((s) => {
                      try {
                          const rows = JSON.parse(s.data || '[]');
                          const count = Array.isArray(rows) ? rows.filter((r) => r && typeof r.text === 'string' && r.text.trim()).length : 0;
                          out.push({ id: String(s.id), title: s.title || 'Sin título', count });
                      } catch (e) {
                          out.push({ id: String(s.id), title: s.title || 'Sin título', count: 0 });
                      }
                  });
              }
              return out;
          }, [savedScripts]);

          const writingDictationPool = useMemo(() => {
              const fromScenes = (scenes, originLabel) => {
                  if (!Array.isArray(scenes)) return [];
                  return scenes
                      .filter((s) => s && typeof s.text === 'string' && s.text.trim() && typeof s.translation === 'string' && s.translation.trim())
                      .map((s, idx) => ({
                          de: String(s.text).trim(),
                          es: String(s.translation).trim(),
                          origin: originLabel,
                          idx
                      }));
              };
              if (writingDictSource === 'builtin') {
                  return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'current_story') {
                  const rows = fromScenes(guionData, activeScriptTitle || 'Historia actual');
                  return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'all_saved') {
                  const rows = [];
                  (savedScripts || []).forEach((s) => {
                      try {
                          const scenes = JSON.parse(s.data || '[]');
                          rows.push(...fromScenes(scenes, s.title || 'Guion guardado'));
                      } catch (e) {}
                  });
                  return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'one_saved') {
                  const sid = String(writingDictScriptId || '');
                  const picked = (savedScripts || []).find((s) => String(s.id) === sid);
                  if (!picked) return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  try {
                      const scenes = JSON.parse(picked.data || '[]');
                      const rows = fromScenes(scenes, picked.title || 'Guion guardado');
                      return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  } catch (e) {
                      return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  }
              }
              return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
          }, [writingDictSource, writingDictScriptId, guionData, activeScriptTitle, savedScripts]);

          const writingCompareTarget = useMemo(() => {
              if (activeTab !== 'escritura') return null;
              if (writingMode === 'copy') return WRITING_COPY_DRILLS[writingCopyIdx % WRITING_COPY_DRILLS.length];
              if (writingMode === 'dictation') {
                  if (!writingDictationPool.length) return null;
                  return writingDictationPool[writingDictIdx % writingDictationPool.length].de;
              }
              if (writingMode === 'telc' && WRITING_TELC_TASKS.length) return WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].dePrompt;
              if (writingMode === 'letters') return LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].practice;
              if (writingMode === 'guion' && guionData.length) return guionData[Math.min(writingGuionWriteIdx, guionData.length - 1)]?.text || null;
              if (writingMode === 'vocab' && currentVocabList.length) return currentVocabList[writingVocabIdx % currentVocabList.length].de;
              return null;
          }, [activeTab, writingMode, writingCopyIdx, writingDictIdx, writingLetterIdx, writingGuionWriteIdx, writingVocabIdx, guionData, currentVocabList, writingDictationPool, writingTelcIdx]);
          const getSelfCheckItems = useCallback(() => {
              const items = [
                  { id: 'mic-api', label: 'Micrófono API', ok: !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') },
                  { id: 'tts-api', label: 'Voz TTS', ok: !!(window.speechSynthesis && typeof window.speechSynthesis.speak === 'function') },
                  { id: 'stories', label: 'Texto disponible', ok: String(readingTargetText || '').trim().length > 0 },
                  { id: 'lectura-mic', label: 'Lectura continua', ok: !readingListening || !!readingAutoRestartRef.current },
                  { id: 'telc-mode', label: 'TELC activo', ok: writingMode === 'telc' || WRITING_TELC_TASKS.length > 0 },
                  { id: 'telc-input', label: 'TELC teclado/lápiz', ok: writingMode !== 'telc' || ['pen', 'keyboard'].includes(writingTelcInputMode) }
              ];
              return items;
          }, [readingTargetText, readingListening, writingMode, writingTelcInputMode]);
          const runTelcWritingCoach = useCallback((rawText, task) => {
              const text = String(rawText || '').trim();
              if (!text) {
                  setWritingTelcCoach(null);
                  return;
              }
              const t = text;
              const low = normalizeGermanSpeechText(t);
              const words = low.split(/\s+/).filter(Boolean);
              const sentences = t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
              const connectors = ['weil', 'deshalb', 'außerdem', 'denn', 'damit', 'trotzdem', 'obwohl', 'zuerst', 'danach', 'zum schluss', 'daher', 'allerdings'];
              const formalMarkers = ['sehr geehrte', 'mit freundlichen grüßen', 'ich möchte', 'hiermit', 'vielen dank', 'bitte'];
              const informalMarkers = ['liebe', 'hallo', 'viele grüße', 'bis bald'];
              const hasFormal = formalMarkers.some((x) => low.includes(x));
              const hasInformal = informalMarkers.some((x) => low.includes(x));
              const connectorHits = connectors.filter((x) => low.includes(x)).length;
              const scoreTask = Math.max(0, Math.min(5, Math.round((words.length >= 65 ? 3 : words.length >= 40 ? 2 : 1) + (task && Array.isArray(task.checklist) ? Math.min(2, task.checklist.filter((c) => low.includes(normalizeGermanSpeechText(c).split(/\s+/)[0] || '')).length) : 0))));
              const scoreRegister = Math.max(0, Math.min(5, hasFormal ? 5 : hasInformal ? 3 : 2));
              const scoreCohesion = Math.max(0, Math.min(5, Math.round((sentences.length >= 4 ? 2 : 1) + Math.min(3, connectorHits))));
              const umlautHits = (t.match(/[äöüß]/gi) || []).length;
              const punctHits = (t.match(/[.,!?]/g) || []).length;
              const scoreGrammar = Math.max(0, Math.min(5, Math.round((punctHits >= 3 ? 2 : 1) + (umlautHits >= 2 ? 1 : 0) + (words.length >= 50 ? 2 : words.length >= 30 ? 1 : 0))));
              const total = scoreTask + scoreRegister + scoreCohesion + scoreGrammar;
              const max = 20;
              const pct = Math.round((total / max) * 100);
              const suggestion = [
                  scoreTask < 4 ? 'Añade más contenido concreto del encargo (datos, petición y cierre).' : null,
                  scoreRegister < 4 ? 'Refuerza registro formal TELC (Sehr geehrte..., Mit freundlichen Grüßen).' : null,
                  scoreCohesion < 4 ? 'Usa más conectores: weil, deshalb, außerdem, trotzdem.' : null,
                  scoreGrammar < 4 ? 'Revisa signos de puntuación, mayúsculas de sustantivos y umlauts.' : null
              ].filter(Boolean);
              setWritingTelcCoach({
                  total,
                  max,
                  pct,
                  scoreTask,
                  scoreRegister,
                  scoreCohesion,
                  scoreGrammar,
                  suggestionText: suggestion.length ? suggestion.join(' ') : 'Muy buen texto para TELC. Solo pule estilo y precisión.'
              });
          }, []);
          const runTelcCoachFromCurrentInput = useCallback(() => {
              if (!WRITING_TELC_TASKS.length) return;
              const task = WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length];
              const sourceText = writingTelcInputMode === 'keyboard' ? writingTelcTypedText : writingTelcLastOcrText;
              runTelcWritingCoach(sourceText, task);
          }, [writingTelcIdx, writingTelcInputMode, writingTelcTypedText, writingTelcLastOcrText, runTelcWritingCoach]);
          useEffect(() => {
              if (writingMode !== 'telc') return;
              setWritingTelcCoach(null);
          }, [writingMode, writingTelcIdx, writingTelcInputMode]);

          const persistDailyPatch = (patch) => {
              const k = 'muller_daily_v1_' + new Date().toISOString().slice(0, 10);
              setDailyChallenges((prev) => {
                  const next = { ...prev, ...patch };
                  try { localStorage.setItem(k, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          };
          const claimDailyStamp = (key) => {
              if (dailyChallenges[key]) return;
              persistDailyPatch({ [key]: true });
              saveProgress({ coins: userStats.coins + 5, activityByDay: mergeActivityPoints(12) });
          };
// finishOnboarding ahora viene de useOnboardingState()
          const sortedDeVoices = useMemo(() => {
              try {
                  return window.speechSynthesis.getVoices()
                      .filter((v) => v.lang && v.lang.toLowerCase().startsWith('de'))
                      .sort((a, b) => (window.__mullerRankVoiceNatural(b) || 0) - (window.__mullerRankVoiceNatural(a) || 0));
              } catch (e) { return []; }
          }, [voicesLoaded, showMullerHub, ttsPrefsEpoch]);
          const sortedEsVoices = useMemo(() => {
              try {
                  return window.speechSynthesis.getVoices()
                      .filter((v) => v.lang && v.lang.toLowerCase().startsWith('es'))
                      .sort((a, b) => (window.__mullerRankVoiceNatural(b) || 0) - (window.__mullerRankVoiceNatural(a) || 0));
              } catch (e) { return []; }
          }, [voicesLoaded, showMullerHub, ttsPrefsEpoch]);
          const healthSnapshot = useMemo(() => {
              const listeningBusy = !!(isListening || rutaListening || readingListening);
              let micOk = false;
              try {
                  micOk = !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
              } catch (e) { micOk = false; }
              let voiceCount = 0;
              try {
                  if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
                      voiceCount = window.speechSynthesis.getVoices().length || 0;
                  }
              } catch (e) { voiceCount = 0; }
              const savedScriptsCount = Array.isArray(savedScripts) ? savedScripts.length : 0;
              const storyScenesCount = Array.isArray(guionData) ? guionData.length : 0;
              const micLabel = micOk
                  ? (listeningBusy ? 'Disponible (activo)' : 'Disponible')
                  : 'No soportado';
              const ok = micOk && voiceCount > 0 && (savedScriptsCount > 0 || storyScenesCount > 0);
              return {
                  ok,
                  micOk,
                  micLabel,
                  voiceCount,
                  savedScriptsCount,
                  storyScenesCount,
                  listeningBusy
              };
          }, [isListening, rutaListening, readingListening, savedScripts, guionData, voicesLoaded]);

          const oralLeftSec = (mode === 'interview' && oralDeadline)
              ? Math.max(0, Math.ceil((oralDeadline - Date.now()) / 1000))
              : null;
          void oralClock;
          const activeSectionMeta = useMemo(() => {
              const map = {
                  inicio: { icon: 'layout-dashboard', title: 'Inicio', desc: 'Panel rápido y continuidad', tone: 'border-indigo-500/35 bg-indigo-900/25 text-indigo-200' },
                  ruta: { icon: 'map', title: 'Ruta', desc: 'Camino A1-A2 guiado', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  historia: { icon: 'play', title: 'Historia', desc: 'Escucha, modos y simulación oral', tone: 'border-blue-500/35 bg-blue-900/25 text-blue-200' },
                  lectura: { icon: 'mic', title: 'Lectura', desc: 'Leer en voz alta y comparar', tone: 'border-sky-500/35 bg-sky-900/25 text-sky-200' },
                  shadowing: { icon: 'audio-lines', title: 'Shadowing', desc: 'Fluidez y pronunciación', tone: 'border-teal-500/35 bg-teal-900/25 text-teal-200' },
                  escritura: { icon: 'pen-line', title: 'Escritura', desc: 'Canvas, dictado y OCR', tone: 'border-rose-500/35 bg-rose-900/25 text-rose-200' },
                  vocabulario: { icon: 'book-open', title: 'Vocabulario', desc: 'SRS y recall activo', tone: 'border-amber-500/35 bg-amber-900/25 text-amber-200' },
                  entrenamiento: { icon: 'graduation-cap', title: 'Entrenamiento', desc: 'Artículos, prep. y simulacro', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  bxbank: { icon: bxBankLevel === 'b1' ? 'target' : 'layers', title: bxBankLevel === 'b1' ? 'Banco B1' : 'Banco B2', desc: 'Frases y estructuras por nivel', tone: bxBankLevel === 'b1' ? 'border-emerald-500/35 bg-emerald-900/25 text-emerald-200' : 'border-sky-500/35 bg-sky-900/25 text-sky-200' },
                  progreso: { icon: 'bar-chart', title: 'Progreso', desc: 'Métricas, export y objetivos', tone: 'border-yellow-500/35 bg-yellow-900/25 text-yellow-200' },
                  guiones: { icon: 'file-text', title: 'Biblioteca', desc: 'Guiones y distribución', tone: 'border-purple-500/35 bg-purple-900/25 text-purple-200' },
                  lexikon: { icon: 'library', title: 'Lexikon', desc: 'Diccionario y traducción', tone: 'border-cyan-500/35 bg-cyan-900/25 text-cyan-200' },
                  telc: { icon: 'clipboard-check', title: 'TELC', desc: 'Guía por niveles A1-C2', tone: 'border-orange-500/35 bg-orange-900/25 text-orange-200' },
                  storybuilder: { icon: 'sparkles', title: 'IA', desc: 'Generación y resumen de contenido', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  historiaspro: { icon: 'feather', title: 'Historias Pro', desc: 'ES/DE/OCR y estilización', tone: 'border-emerald-500/35 bg-emerald-900/25 text-emerald-200' },
                  comunidad: { icon: 'trophy', title: 'Comunidad', desc: 'Economía, directorio y liga', tone: 'border-violet-500/35 bg-violet-900/25 text-violet-200' },
              };
              return map[activeTab] || { icon: 'layout-dashboard', title: 'Inicio', desc: 'Panel rápido y continuidad', tone: 'border-indigo-500/35 bg-indigo-900/25 text-indigo-200' };
          }, [activeTab, bxBankLevel]);
          const activeModeBadge = useMemo(() => {
              if (activeTab === 'historia') {
                  if (mode === 'interview') return 'Modo oral B1';
                  if (podcastMode) return 'Modo podcast';
                  if (historiaAudioOnly) return 'Solo audio';
                  if (diktatMode) return 'Diktat';
                  if (puzzleMode) return 'Puzzle';
              }
              if (activeTab === 'vocabulario' && vocabSrsDueCount > 0) return `${vocabSrsDueCount} SRS pendientes`;
              if (activeTab === 'entrenamiento') return 'Simulacro y práctica avanzada';
              if (activeTab === 'bxbank') return bxBankLevel === 'b1' ? 'Banco B1 activo' : 'Banco B2 activo';
              return null;
          }, [activeTab, mode, podcastMode, historiaAudioOnly, diktatMode, puzzleMode, vocabSrsDueCount, bxBankLevel]);
          const activeSectionHint = useMemo(() => {
              const h = {
                  inicio: 'Sugerencia: abre Entrenamiento si quieres práctica tipo examen.',
                  ruta: 'Sugerencia: completa lección + huecos + voz para cerrar ciclo.',
                  historia: 'Sugerencia: escucha, repite y luego activa Diktat para consolidar.',
                  lectura: 'Sugerencia: lee completo, luego revisa solo las palabras en rojo.',
                  shadowing: 'Sugerencia: empieza con velocidad media y sube a normal.',
                  escritura: 'Sugerencia: usa modo dictado + OCR para detectar fallos.',
                  vocabulario: 'Sugerencia: marca Fácil solo si recuerdas sin mirar traducción.',
                  entrenamiento: 'Sugerencia: alterna categoría débil y simulacro corto.',
                  bxbank: 'Sugerencia: usa MIX y luego guarda tarjetas clave en escritura.',
                  progreso: 'Sugerencia: exporta backup antes de cambios grandes.',
                  guiones: 'Sugerencia: distribuye texto al Banco B1/B2 para ampliar mazos.',
                  lexikon: 'Sugerencia: guarda pares útiles y repásalos en vocabulario.',
                  telc: 'Sugerencia: elige nivel y combina con simulacro en Entrenamiento.',
                  storybuilder: 'Sugerencia: guarda siempre el guion generado en Biblioteca.',
                  historiaspro: 'Sugerencia: genera en A2/B1 y envía escenas a Historia.',
                  comunidad: 'Sugerencia: revisa economía y liga al final de cada sesión.',
              };
              return h[activeTab] || '';
          }, [activeTab]);

          return (
            <div className={`flex flex-col muller-main-fill h-[100svh] max-h-[100svh] w-full font-sans md:rounded-xl overflow-x-hidden md:overflow-hidden shadow-2xl relative transition-colors duration-500 muller-theme-bg ${reduceMotionUi ? 'muller-reduce-motion' : ''} ${themeShellClass} ${uiTheme === 'light' ? 'text-slate-900' : 'text-white'} ${getBgColor()}`}>

              {showSplash && (
                  <div className="fixed inset-0 z-[300] overflow-hidden" role="dialog" aria-modal="true" aria-label="Pantalla de inicio Profesor Plaza Müller">
                      <div className="absolute inset-0 flex flex-col">
                          <div className="flex-1" style={{ background: 'linear-gradient(180deg, #000000 0%, #000000 33%, #DD0000 33%, #DD0000 67%, #FFCE00 67%, #FFCE00 100%)' }} aria-hidden="true" />
                          <div className="h-[160px] md:h-[192px] bg-white border-y-2 border-black/20 shadow-[0_8px_25px_rgba(0,0,0,0.25)] flex items-stretch px-2 md:px-4">
                              <button
                                  type="button"
                                  onClick={() => setShowSplash(false)}
                                  className={`shrink-0 rounded-none p-0 bg-transparent border-0 h-full w-[160px] md:w-[192px] flex items-center justify-center ${splashLogoBlink ? 'animate-pulse ring-4 ring-amber-400/75' : ''}`}
                                  aria-label="Entrar a la aplicación pulsando el logo"
                                  title="Pulsa el logo para entrar"
                              >
                                  <img
                                      src="./icons/profesor-plaza-muller-logo.jpg"
                                      alt="Logo Profesor Plaza Müller"
                                      className="h-full w-full object-cover"
                                  />
                              </button>
                              <div className="ml-2 md:ml-3 flex-1 h-full flex items-center justify-center overflow-hidden">
                                  <p className="w-full text-center text-black font-black uppercase tracking-[0.04em] whitespace-nowrap text-[clamp(1.35rem,5.4vw,4.15rem)] leading-none">
                                      PROFESOR PLAZA MÜLLER
                                  </p>
                              </div>
                          </div>
                          <div className="flex-1" style={{ background: 'linear-gradient(180deg, #AA151B 0%, #AA151B 33%, #F1BF00 33%, #F1BF00 67%, #AA151B 67%, #AA151B 100%)' }} aria-hidden="true" />
                      </div>
                  </div>
              )}
              
              {/* SUPERIOR NAV BAR */}
              <div className="muller-top-nav fixed top-0 left-0 right-0 w-full bg-gradient-to-b from-zinc-900/95 via-black/90 to-black/95 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-1.5 md:p-2.5 pt-[max(0.35rem,env(safe-area-inset-top,0px))] flex flex-col gap-1.5 justify-stretch items-stretch z-20">
                  <div className="flex flex-col gap-1.5 w-full min-w-0">
                      <div className="muller-nav-row gap-1.5 md:gap-2 bg-zinc-950/85 p-1 md:p-1.5 rounded-2xl ring-1 ring-white/[0.1] w-full min-w-0 touch-manipulation">
                      <button onClick={()=>{setActiveTab('inicio'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'inicio' ? 'bg-indigo-600 text-white shadow-[0_0_18px_rgba(79,70,229,0.5)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="layout-dashboard" className="w-4 h-4 md:w-5 md:h-5" /> Inicio</button>
                      <button onClick={()=>{setActiveTab('ruta'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'ruta' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="map" className="w-4 h-4 md:w-5 md:h-5" /> Ruta</button>
                      <button onClick={()=>{setActiveTab('historia'); setMode('dialogue'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'historia' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="play" className="w-4 h-4 md:w-5 md:h-5" /> Historia</button>
                      <button onClick={()=>{setActiveTab('lectura'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'lectura' ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="mic" className="w-4 h-4 md:w-5 md:h-5" /> Lectura</button>
                      <button onClick={()=>{setActiveTab('shadowing'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'shadowing' ? 'bg-teal-600 text-white shadow-[0_0_18px_rgba(13,148,136,0.5)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="audio-lines" className="w-4 h-4 md:w-5 md:h-5" /> Shadowing</button>
                      <button onClick={()=>{setActiveTab('escritura'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'escritura' ? 'bg-rose-700 text-white shadow-[0_0_18px_rgba(190,18,60,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="pen-line" className="w-4 h-4 md:w-5 md:h-5" /> Escritura</button>
                      <button onClick={()=>{setActiveTab('vocabulario'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'vocabulario' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="book-open" className="w-4 h-4 md:w-5 md:h-5" /> Vocab{vocabSrsDueCount > 0 ? <span className="ml-0.5 min-w-[1.1rem] px-1 rounded-full bg-white/20 text-[10px] font-black leading-none py-0.5" title="Tarjetas prioritarias SRS en la lista actual">{vocabSrsDueCount > 99 ? '99+' : vocabSrsDueCount}</span> : null}</button>
                      <button onClick={()=>{setActiveTab('entrenamiento'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'entrenamiento' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.6)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="graduation-cap" className="w-4 h-4 md:w-5 md:h-5" /> Entrena</button>
                      <button onClick={()=>{setActiveTab('bxbank'); setBxBankLevel('b1'); stopAudio(); setPracticeActive(null); setBxCategory('mix');}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'bxbank' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.8)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="target" className="w-4 h-4 md:w-5 md:h-5" /> Banco B1/B2</button>
                      </div>

                  <div className="flex w-full min-w-0 flex-col gap-1.5 border-t border-b border-white/[0.08] py-1.5 sm:flex-row sm:items-center sm:justify-between bg-black/20">
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                      <button type="button" onClick={() => window.__MULLER_OPEN_EXERCISE_HELP && window.__MULLER_OPEN_EXERCISE_HELP('nav_inicio')} className="text-[10px] font-black text-amber-200/90 hover:text-white underline underline-offset-2 px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10" title="Ayuda contextual rápida">
                          Ayuda
                      </button>
                      <span className="inline-flex flex-col items-center gap-0.5">
                          <button type="button" aria-label="Centro Müller: voces, plan del día y ayuda" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); }} className="bg-gradient-to-br from-sky-600 to-indigo-900 hover:from-sky-500 hover:to-indigo-800 text-white p-2 rounded-full shadow-lg ring-2 ring-white/15 transition" title="Voces del sistema, plan del día, retos y tour">
                              <Icon name="layout-dashboard" className="w-5 h-5" />
                          </button>
                      </span>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center flex-wrap gap-1.5 md:gap-2 justify-end overflow-visible">
                      <div className="flex items-center gap-2 md:gap-3 bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20 whitespace-nowrap">
                          <div className="relative flex items-center mr-1 md:mr-2 border-r border-white/20 pr-2 md:pr-3" ref={userMenuWrapRef}>
                              <button
                                  type="button"
                                  id="muller-user-menu-trigger"
                                  aria-haspopup="menu"
                                  aria-expanded={userMenuOpen}
                                  aria-controls="muller-user-menu"
                                  onClick={() => setUserMenuOpen((o) => !o)}
                                  className="flex items-center gap-1.5 min-h-[2.25rem] rounded-lg pl-0.5 pr-1.5 py-0.5 -my-0.5 text-left touch-manipulation hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80"
                                  title="Menú de cuenta"
                              >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-900 text-sm font-black text-white ring-1 ring-white/20">
                                      {(String(userStats.username || 'E').trim().charAt(0) || '?').toUpperCase()}
                                  </span>
                                  <span className="flex min-w-0 flex-col items-start leading-tight">
                                      <span className="flex max-w-[7.5rem] items-center gap-1 truncate text-[11px] font-bold uppercase tracking-wide text-amber-400 md:max-w-[9rem]">
                                          {userStats.isPremium ? <Icon name="crown" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> : <Icon name="user-circle" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />}
                                          <span className="truncate">{userStats.username || 'Estudiante'}</span>
                                      </span>
                                      <span className="hidden text-[9px] font-semibold normal-case tracking-normal text-gray-500 sm:inline">Sync: {cloudSyncLabel}</span>
                                  </span>
                                  <Icon name="chevron-down" className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition md:h-4 md:w-4 ${userMenuOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {userMenuOpen && (
                                  <div
                                      id="muller-user-menu"
                                      role="menu"
                                      aria-labelledby="muller-user-menu-trigger"
                                      className="absolute right-0 top-[calc(100%+6px)] z-[130] min-w-[15rem] max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl border border-white/12 bg-zinc-950/98 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl ring-1 ring-white/5"
                                  >
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setProfileSettingsTab('perfil');
                                              setShowProfileSettingsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="user-circle" className="h-4 w-4 shrink-0 text-amber-400" /> Perfil / cuenta
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setProfileSettingsTab('ajustes');
                                              setShowProfileSettingsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="settings" className="h-4 w-4 shrink-0 text-sky-400" /> Ajustes premium
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setActiveTab('progreso');
                                              stopAudio();
                                              setPracticeActive(null);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="bar-chart" className="h-4 w-4 shrink-0 text-yellow-400" /> Progreso y exportar PDF/Anki
                                      </button>
                                      <div className="my-1 border-t border-white/10" role="separator" />
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              window.dispatchEvent(new Event('muller-export-full-backup'));
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="download" className="h-4 w-4 shrink-0 text-sky-400" /> Exportar backup (JSON)
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              const el = document.getElementById('muller-backup-file-input');
                                              if (el) el.click();
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="upload" className="h-4 w-4 shrink-0 text-indigo-400" /> Importar datos⬦
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setShowMullerHub(true);
                                              setMullerHubTab('tips');
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="lightbulb" className="h-4 w-4 shrink-0 text-amber-300" /> Consejos y tour
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setShowShortcutsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="keyboard" className="h-4 w-4 shrink-0 text-gray-300" /> Atajos de teclado
                                      </button>
                                  </div>
                              )}
                          </div>
                          <span className="flex items-center gap-1 font-black text-red-500 text-xs md:text-sm"><Icon name="heart" className="w-3 h-3 md:w-4 md:h-4 fill-current" /> {userStats.hearts}</span>
                          <span className="flex items-center gap-1 font-black text-yellow-400 text-xs md:text-sm"><Icon name="coins" className="w-3 h-3 md:w-4 md:h-4 fill-current" /> {coinsUiLabel}</span>
                      </div>
                      {activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !podcastMode && !practiceActive && (
                          <div className="flex flex-wrap items-center gap-1 md:gap-1.5 bg-black/70 p-1 rounded-xl border border-white/10 backdrop-blur-md max-w-[100%] justify-end">
                              <button onClick={() => setFluesternMode(!fluesternMode)} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${fluesternMode ? 'bg-zinc-600 text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-gray-300 hover:bg-white/10'}`} title="Modo Flüstern"><Icon name="ear" className="w-3 h-3 md:w-4 md:h-4" /> Flüstern</button>
                              <button onClick={() => setNoiseEnabled(!noiseEnabled)} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${noiseEnabled ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-gray-300 hover:bg-white/10'}`} title="Ruido de fondo (examen)"><Icon name="volume-2" className="w-3 h-3 md:w-4 md:h-4" /> Ruido</button>
                              <button onClick={() => {setDiktatMode(!diktatMode); setBlindMode(false); setLueckentextMode(false); setPuzzleMode(false); setDeclinaMode(false); setArtikelSniperMode(false); resetModes(); stopAudio();}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${diktatMode ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="edit" className="w-3 h-3 md:w-4 md:h-4" /> Diktat</button>
                              <button onClick={() => {setLueckentextMode(!lueckentextMode); setDiktatMode(false); setPuzzleMode(false); setArtikelSniperMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${lueckentextMode ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="edit-3" className="w-3 h-3 md:w-4 md:h-4" /> Huecos</button>
                              <button onClick={() => {setArtikelSniperMode(!artikelSniperMode); setDiktatMode(false); setLueckentextMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${artikelSniperMode ? 'bg-red-800 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="target" className="w-3 h-3 md:w-4 md:h-4" /> Artículos</button>
                              <button onClick={() => {setDeclinaMode(!declinaMode); setDiktatMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${declinaMode ? 'bg-pink-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="wand-2" className="w-3 h-3 md:w-4 md:h-4" /> Declinar</button>
                              <button onClick={() => {setTempusMode(!tempusMode);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${tempusMode ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="clock" className="w-3 h-3 md:w-4 md:h-4" /> Tempus</button>
                              <button onClick={() => {setPuzzleMode(!puzzleMode); setDiktatMode(false); setBlindMode(false); setDeclinaMode(false); setArtikelSniperMode(false); resetModes(); stopAudio();}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${puzzleMode ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="puzzle" className="w-3 h-3 md:w-4 md:h-4" /> Satzbau</button>
                              <button onClick={() => {setBlindMode(!blindMode); setDiktatMode(false); setPuzzleMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${blindMode ? 'bg-blue-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>{blindMode ? <Icon name="eye-off" className="w-3 h-3 md:w-4 md:h-4" /> : <Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" />} Oído</button>
                              <div className="flex items-center gap-0.5 md:gap-1 pl-1 md:pl-2 border-l border-white/20">
                                  <Icon name="mic-off" className={`w-3 h-3 md:w-4 md:h-4 ${roleplayChar !== 'none' ? 'text-red-400' : 'text-gray-400'}`} />
                                  <select className="bg-transparent text-[10px] md:text-xs text-white font-bold outline-none cursor-pointer" value={roleplayChar} onChange={(e) => setRoleplayChar(e.target.value)}>
                                      <option value="none" className="text-black">No mutear</option>
                                      <option value="Todos" className="text-black font-bold">Mutear TODOS</option>
                                      <option value="Lukas" className="text-black">Lukas</option>
                                      <option value="Elena" className="text-black">Elena</option>
                                      <option value="Herr Weber" className="text-black">Weber</option>
                                  </select>
                              </div>
                          </div>
                      )}
                      {activeTab === 'historia' && (
                          <div className="flex relative">
                              <button type="button" onClick={() => setShowHistoriaMenu(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border whitespace-nowrap ${showHistoriaMenu ? 'bg-blue-700 border-blue-500 text-white' : 'bg-black/50 border-white/20 text-gray-200 hover:bg-white/10'}`}>
                                  <Icon name="sliders-horizontal" className="w-3.5 h-3.5" /> Opciones Historia
                              </button>
                              {showHistoriaMenu && (
                                  <>
                                      <div className="fixed inset-0 z-[199] bg-black/60" onClick={() => setShowHistoriaMenu(false)} />
                                      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-3 flex flex-col gap-1.5 w-[90vw] max-w-xs">
                                          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1 pb-0.5">Opciones Historia</p>
                                          <button onClick={()=>{setPodcastMode(v=>!v); setBlindMode(false); setDiktatMode(false); setPuzzleMode(false); setHistoriaAudioOnly(false); setShowHistoriaMenu(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${podcastMode ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                              <Icon name="car" className="w-4 h-4 shrink-0" /> Podcast
                                          </button>
                                          <button type="button" disabled={savedScripts.length === 0} onClick={() => { setHistoriaPlaylistAllScripts(v=>!v); setShowHistoriaMenu(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${historiaPlaylistAllScripts ? 'bg-fuchsia-700 text-white' : 'text-gray-200 hover:bg-white/10'} ${savedScripts.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                              <Icon name="repeat" className="w-4 h-4 shrink-0" /> Todos los guiones
                                          </button>
                                          <button type="button" onClick={() => { setHistoriaAudioOnly(v=>!v); if (!historiaAudioOnly) setPodcastMode(false); setShowHistoriaMenu(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${historiaAudioOnly ? 'bg-violet-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                              <Icon name="headphones" className="w-4 h-4 shrink-0" /> Solo audio
                                          </button>
                                          <div className="my-0.5 border-t border-white/10" />
                                          <button type="button" onClick={() => { setActiveTab('historia'); setMode('interview'); setOralQIdx(0); setOralDeadline(Date.now() + oralSecs * 1000); setOralClock(0); stopAudio(); setPodcastMode(false); setHistoriaAudioOnly(false); setShowHistoriaMenu(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-emerald-200 hover:bg-emerald-900/50 transition w-full text-left">
                                              <Icon name="mic" className="w-4 h-4 shrink-0" /> Oral B1
                                          </button>
                                          <button type="button" onClick={() => setShowHistoriaMenu(false)} className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white/50 hover:bg-white/10 transition w-full">
                                              Cerrar
                                          </button>
                                      </div>
                                  </>
                              )}
                          </div>
                      )}
                  </div>
                  </div>
              </div>
              </div>

              <div className="w-full border-b border-white/[0.08] bg-black/35 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 ${activeSectionMeta.tone}`}>
                          <Icon name={activeSectionMeta.icon} className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider text-cyan-300 truncate">Müller · sección activa</p>
                          <p className="text-sm font-bold text-white truncate">{activeSectionMeta.title} <span className="text-gray-400 font-semibold">· {activeSectionMeta.desc}</span></p>
                          {activeSectionHint ? <p className="text-[10px] text-gray-500 truncate">{activeSectionHint}</p> : null}
                      </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap md:justify-end">
                      {activeModeBadge ? <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/35 bg-amber-900/30 text-amber-200">{activeModeBadge}</span> : null}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-500/35 bg-rose-950/40 text-rose-200">❤️ {userStats.hearts}</span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/35 bg-amber-950/40 text-amber-200">🪙 {coinsUiLabel}</span>
                      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('muller-open-profile-settings', { detail: { tab: 'ajustes' } }))} className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-sky-500/35 bg-sky-900/30 text-sky-200 hover:bg-sky-800/40 transition">Ajustes</button>
                  </div>
              </div>

              {toastItems.length > 0 && (
                  <div className="fixed top-24 right-3 z-[170] flex flex-col gap-2 max-w-[min(92vw,360px)]">
                      {toastItems.map((t) => (
                          <div key={t.id} className={`muller-glass-card rounded-xl px-3 py-2 text-xs font-bold ${t.kind === 'error' ? 'border-red-500/45 text-red-100 bg-red-900/35' : t.kind === 'success' ? 'border-emerald-500/45 text-emerald-100 bg-emerald-900/35' : 'text-sky-100'}`}>
                              {t.message}
                          </div>
                      ))}
                  </div>
              )}

              {/* MODAL LOGIN */}
              {showProfileSettingsModal && (
                  <div className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowProfileSettingsModal(false)} role="presentation">
                      <div className="bg-slate-900 border border-sky-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Perfil y ajustes">
                          <div className="flex items-center justify-between gap-2 p-4 border-b border-white/10 bg-black/35">
                              <h2 className="text-lg md:text-2xl font-black text-white flex items-center gap-2"><Icon name="settings" className="w-5 h-5 md:w-6 md:h-6 text-sky-300" /> Perfil y ajustes premium</h2>
                              <button type="button" onClick={() => setShowProfileSettingsModal(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20 text-gray-300 hover:bg-white/10">Cerrar</button>
                          </div>
                          <div className="p-3 border-b border-white/10 flex flex-wrap gap-2 bg-black/20">
                              {[
                                  { id: 'perfil', label: 'Perfil' },
                                  { id: 'ajustes', label: 'Ajustes' },
                                  { id: 'atajos', label: 'Atajos' },
                              ].map((t) => (
                                  <button key={t.id} type="button" onClick={() => setProfileSettingsTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${profileSettingsTab === t.id ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                              ))}
                          </div>
                          <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-8.5rem)]">
                              {profileSettingsTab === 'perfil' && (
                                  <div className="space-y-4">
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                          <div><p className="text-gray-500">Usuario</p><p className="font-black text-white truncate">{userStats.username || 'Estudiante'}</p></div>
                                          <div><p className="text-gray-500">Vidas</p><p className="font-black text-red-300">{userStats.hearts}</p></div>
                                          <div><p className="text-gray-500">Monedas</p><p className="font-black text-amber-300">{coinsUiLabel}</p></div>
                                          <div><p className="text-gray-500">Racha</p><p className="font-black text-orange-300">{userStats.streakDays || 0} días</p></div>
                                      </div>
                                      {unifiedAuth ? (
                                          <div className="space-y-3">
                                              <p className="text-sm text-emerald-300 font-bold">Sesión iniciada · {unifiedAuth.source === 'supabase' ? 'Supabase' : 'Local'}</p>
                                              <p className="text-xs text-gray-400">Email: {mullerMaskEmail(unifiedAuth.email)}</p>
                                              <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-2">
                                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Cambiar nombre visible</label>
                                                  <div className="flex flex-col sm:flex-row gap-2">
                                                      <input type="text" value={profileNameDraft} onChange={(e) => setProfileNameDraft(e.target.value)} className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500" placeholder="Ej: SuperKlaus" />
                                                      <button type="button" disabled={profileNameBusy} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-sm"
                                                          onClick={async () => {
                                                              const nextName = String(profileNameDraft || '').trim();
                                                              if (!nextName) { setProfileNameMsg('Escribe un nombre válido.'); return; }
                                                              setProfileNameBusy(true); setProfileNameMsg('');
                                                              try {
                                                                  if (unifiedAuth.source === 'supabase') {
                                                                      const client = mullerGetSupabaseClient();
                                                                      if (!client || !supabaseUser) throw new Error('Supabase no disponible');
                                                                      const { error: e1 } = await client.auth.updateUser({ data: { display_name: nextName } });
                                                                      if (e1) throw new Error(e1.message);
                                                                      const { error: e2 } = await client.from('profiles').upsert({ id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }, { onConflict: 'id' });
                                                                      if (e2) throw new Error(e2.message);
                                                                      setSupabaseProfile((p) => ({ ...(p || {}), id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }));
                                                                  } else {
                                                                      const map = mullerAccountsLoad(); const em = unifiedAuth.email;
                                                                      if (map[em]) { map[em].displayName = nextName; mullerAccountsSave(map); }
                                                                  }
                                                                  saveProgress({ username: nextName }); setAuthTick((x) => x + 1); setProfileNameMsg('Nombre actualizado.');
                                                              } catch (err) {
                                                                  setProfileNameMsg('No se pudo actualizar: ' + (err && err.message ? err.message : 'error'));
                                                              } finally { setProfileNameBusy(false); }
                                                          }}>{profileNameBusy ? 'Guardando⬦' : 'Guardar nombre'}</button>
                                                  </div>
                                                  {profileNameMsg ? <p className="text-xs text-gray-400">{profileNameMsg}</p> : null}
                                              </div>
                                              <button type="button" className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10"
                                                  onClick={async () => {
                                                      const client = mullerGetSupabaseClient();
                                                      if (unifiedAuth.source === 'supabase' && client) { try { await client.auth.signOut(); } catch (err) {} setSupabaseUser(null); setSupabaseProfile(null); }
                                                      mullerAuthLogout(); setAuthTick((x) => x + 1); setAuthPassword(''); setShowProfileSettingsModal(false);
                                                  }}>Cerrar sesión</button>
                                          </div>
                                      ) : (
                                          <div className="space-y-3">
                                              <div className="flex gap-2">
                                                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Entrar</button>
                                                  <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Registro gratis</button>
                                              </div>
                                              {authError ? <p className="text-sm text-red-400 font-semibold">{authError}</p> : null}
                                              <input type="email" autoComplete="email" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email" />
                                              <input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Contraseña (mín. 6)" />
                                              {authMode === 'register' ? <input type="text" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authDisplayName} onChange={(e) => setAuthDisplayName(e.target.value)} placeholder="Nombre visible" /> : null}
                                              <button type="button" disabled={authBusy} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-black text-white"
                                                  onClick={async () => {
                                                      setAuthBusy(true); setAuthError('');
                                                      const errMap = { CRYPTO_UNAVAILABLE: 'Necesitas https o localhost para registrar con cifrado seguro.', EMAIL_INVALID: 'Introduce un email válido.', PASS_SHORT: 'La contraseña debe tener al menos 6 caracteres.', EMAIL_TAKEN: 'Ese email ya está registrado en este dispositivo.', BAD_CREDENTIALS: 'Email o contraseña incorrectos.' };
                                                      try {
                                                          const client = mullerGetSupabaseClient();
                                                          if (client) {
                                                              const em = authEmail.trim();
                                                              if (authMode === 'register') {
                                                                  const dn = (authDisplayName || userStats.username || 'Estudiante').trim();
                                                                  const { data, error } = await client.auth.signUp({ email: em, password: authPassword, options: { data: { display_name: dn } } });
                                                                  if (error) throw new Error(error.message);
                                                                  saveProgress({ username: dn });
                                                                  if (data.session && data.session.user) setSupabaseUser(data.session.user); else if (data.user) setSupabaseUser(data.user);
                                                              } else {
                                                                  const { data, error } = await client.auth.signInWithPassword({ email: em, password: authPassword });
                                                                  if (error) throw new Error(error.message);
                                                                  if (data.user) { setSupabaseUser(data.user); const meta = data.user.user_metadata && data.user.user_metadata.display_name; if (meta) saveProgress({ username: String(meta) }); }
                                                              }
                                                          } else if (authMode === 'register') { const acc = await mullerAuthRegister(authEmail, authPassword, authDisplayName || userStats.username); saveProgress({ username: acc.displayName }); }
                                                          else { const acc = await mullerAuthLogin(authEmail, authPassword); saveProgress({ username: acc.displayName }); }
                                                          setAuthPassword(''); setAuthTick((x) => x + 1); setShowProfileSettingsModal(false);
                                                      } catch (err) { setAuthError(errMap[err.message] || err.message || 'Error'); }
                                                      finally { setAuthBusy(false); }
                                                  }}>{authBusy ? '⬦' : authMode === 'register' ? 'Crear cuenta' : 'Entrar'}</button>
                                          </div>
                                      )}
                                  </div>
                              )}
                              {profileSettingsTab === 'ajustes' && (
                                  <div className="space-y-4">
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Tema global</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[{ id: 'dark', label: 'Oscuro' }, { id: 'light', label: 'Claro' }, { id: 'hc', label: 'Alto contraste' }].map((t) => (
                                                  <button key={t.id} type="button" onClick={() => { setUiTheme(t.id); try { localStorage.setItem(MULLER_THEME_KEY, t.id); } catch (e) {} }} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${uiTheme === t.id ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>{t.label}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-300 mb-2">Audio y voz</p>
                                          <div className="flex flex-wrap gap-2 mb-3">
                                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 bg-slate-800 text-gray-200">Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setNoiseEnabled(!noiseEnabled)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${noiseEnabled ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Ruido examen: {noiseEnabled ? 'ON' : 'OFF'}</button>
                                          </div>
                                          <p className="text-[11px] text-gray-500 mb-2">Velocidad TTS global</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[{ id: 'Lenta', rate: '0.82' }, { id: 'Normal', rate: '0.92' }, { id: 'Examen', rate: '1.00' }].map((p) => (
                                                  <button key={p.id} type="button" className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(typeof window !== 'undefined' && (localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') === p.rate) ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} onClick={() => { try { localStorage.setItem(MULLER_TTS_RATE_KEY, p.rate); } catch (e) {} setTtsPrefsEpoch((x) => x + 1); }}>{p.id}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2">Preferencias de uso</p>
                                          <div className="flex flex-wrap gap-2">
                                              <button type="button" onClick={() => setShowFloatingTools((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${showFloatingTools ? 'bg-cyan-700 border-cyan-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Herramientas rápidas (Ajustes): {showFloatingTools ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setReduceMotionUi((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${reduceMotionUi ? 'bg-emerald-700 border-emerald-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Reducir animaciones: {reduceMotionUi ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setPodcastMode((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${podcastMode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Podcast: {podcastMode ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setHistoriaAudioOnly((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${historiaAudioOnly ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Solo audio: {historiaAudioOnly ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => { try { localStorage.setItem(MULLER_ONBOARDING_KEY, '1'); } catch (e) {} setShowOnboarding(false); setOnboardingNever(true); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 bg-slate-800 text-gray-300">Desactivar onboarding</button>
                                              <button type="button" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); setShowProfileSettingsModal(false); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/30 bg-sky-900/30 text-sky-200">Más ajustes de voces⬦</button>
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Respaldo y sincronización</p>
                                          <div className="flex flex-wrap gap-2">
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-full-backup'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/35 bg-sky-900/35 text-sky-200">Exportar backup total</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-open-backup-import'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-500/35 bg-indigo-900/35 text-indigo-200">Importar backup</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-srs-only'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/35 bg-emerald-900/35 text-emerald-200">Exportar solo SRS</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-decks-only'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/35 bg-amber-900/35 text-amber-200">Exportar solo mazos</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-show-sync-help'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-500/35 bg-teal-900/35 text-teal-200">Guía de sincronización</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-request-mic'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-green-500/35 bg-green-900/35 text-green-200">Permiso de micrófono</button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {profileSettingsTab === 'atajos' && (
                                  <div className="space-y-2 text-sm text-gray-300">
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> Ayuda rápida</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> Inicio · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> Ruta · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> Historia</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> Vocab · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> Progreso · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> Centro Müller</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> Cerrar modales</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {showLoginModal && (
                  <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <div className="bg-slate-900 border border-amber-500 p-6 md:p-8 rounded-2xl max-w-md w-full shadow-[0_0_40px_rgba(245,158,11,0.3)] text-center">
                          <Icon name="crown" className="w-12 h-12 md:w-16 md:h-16 text-amber-500 mx-auto mb-4" />
                          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Cuenta VIP</h1>
                          <input type="text" placeholder="Ej: SuperKlaus" className="w-full bg-black/50 border border-gray-600 p-3 md:p-4 rounded-xl text-white font-bold text-center mb-6 outline-none focus:border-amber-500 text-sm md:text-base" value={tempUsername} onChange={(e)=>setTempUsername(e.target.value)} />
                          <button onClick={handleRegister} className="w-full bg-amber-600 hover:bg-amber-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-lg md:text-xl shadow-xl transition">Empezar a Estudiar</button>
                      </div>
                  </div>
              )}

              {/* MODAL MUERTE */}
              {showDeathModal && (
                  <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <Icon name="heart" className="w-20 h-20 md:w-24 md:h-24 text-red-600 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
                      <h1 className="text-3xl md:text-5xl font-black text-white mb-4 text-center">¡Te has quedado sin vidas!</h1>
                      <div className="flex gap-4">
                          <button onClick={buyHearts} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-base md:text-xl shadow-xl flex items-center gap-2"><Icon name="coins" className="w-5 h-5 md:w-6 md:h-6" /> Comprar 5 ❤️ (50 Coins)</button>
                      </div>
                  </div>
              )}

              {showOnboarding && onboardingStep >= 1 && onboardingStep <= 5 && (() => {
                  const obSteps = [
                      { t: 'Bienvenida', d: 'Müller funciona en el navegador: Historia (audio), Vocab con SRS, Escritura con OCR local, B1/B2 y Progreso. Todo gratis en este dispositivo.' },
                      { t: 'Pestañas', d: 'Arriba cambias de actividad. La pestaña Entrenamiento abre artículos, verbos y preposiciones con simulacro. El panel azul es el Centro Müller (voces, plan, ayuda).' },
                      { t: 'Temas y accesibilidad', d: 'En Centro Müller → Voces puedes elegir tema Oscuro / Claro / Alto contraste y presets de velocidad TTS (Lenta / Normal / Examen).' },
                      { t: 'Objetivos y racha', d: 'En Vocab configuras objetivo diario de tarjetas; la racha solo sube si hay actividad mínima real (umbrales fijos en el informe del Centro).' },
                      { t: 'Copia de seguridad', d: 'Ahora las acciones de exportar/importar están dentro de Perfil → Ajustes → Respaldo y sincronización. Ahí puedes hacer backup total o solo SRS / mazos, sin botones flotantes tapando la pantalla.' },
                  ];
                  const ob = obSteps[onboardingStep - 1];
                  return (
                  <div className="fixed inset-0 z-[128] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => finishOnboarding()} role="presentation">
                      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                          <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2">Onboarding · paso {onboardingStep}/5</p>
                          <h3 className="text-xl font-black text-white mb-2">{ob.t}</h3>
                          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{ob.d}</p>
                          <label className="flex items-center gap-2 text-xs text-gray-500 mb-4 cursor-pointer">
                              <input type="checkbox" className="accent-sky-500" checked={onboardingNever} onChange={(e) => setOnboardingNever(e.target.checked)} />
                              No volver a mostrar (se guarda en este navegador)
                          </label>
                          <div className="flex justify-between gap-2">
                              <button type="button" className="text-xs text-gray-500" onClick={() => finishOnboarding()}>Saltar</button>
                              <button type="button" className="px-4 py-2 rounded-lg bg-sky-600 font-bold text-sm" onClick={() => (onboardingStep < 5 ? setOnboardingStep(onboardingStep + 1) : finishOnboarding())}>{onboardingStep < 5 ? 'Siguiente' : 'Empezar'}</button>
                          </div>
                      </div>
                  </div>
                  );
              })()}

              {showShortcutsModal && (
                  <div className="fixed inset-0 z-[129] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowShortcutsModal(false)} role="presentation">
                      <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-black text-white mb-3">Atajos de teclado</h3>
                          <ul className="text-sm text-gray-400 space-y-2">
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> — esta ayuda</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> — Inicio</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> — Ruta (A0→C1)</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> — Historia</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> — Vocabulario</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> — Progreso</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> — Centro Müller</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">O</kbd> — Comunidad (cuenta, directorio, liga)</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> — cerrar modales</li>
                          </ul>
                          <button type="button" className="mt-4 w-full py-2 rounded-xl bg-slate-700 font-bold text-sm" onClick={() => setShowShortcutsModal(false)}>Cerrar</button>
                      </div>
                  </div>
              )}

              {showVocabMixModal && (
                  <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <div className="bg-slate-900 border border-purple-600/50 p-4 md:p-6 rounded-2xl max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <h2 className="text-lg md:text-xl font-black text-purple-200 flex items-center gap-2"><Icon name="shuffle" className="w-5 h-5 md:w-6 md:h-6" /> Mezclar lecciones</h2>
                              <ExerciseHelpBtn helpId="guiones_mix" compact />
                          </div>
                          <p className="text-xs text-gray-400 mb-4">Marca las lecciones que quieres incluir y pulsa Mezclar.</p>
                          <div className="flex flex-col gap-2 mb-4">
                              {customVocabLessons.map((lesson) => (
                                  <label key={lesson.id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500">
                                      <input type="checkbox" className="accent-purple-500 w-4 h-4" checked={!!mixLessonSelection[lesson.id]} onChange={(e) => setMixLessonSelection((prev) => ({ ...prev, [lesson.id]: e.target.checked }))} />
                                      <span className="text-sm text-white font-bold">{lesson.title}</span>
                                      <span className="text-[10px] text-gray-500 ml-auto">{lesson.words.length} pal.</span>
                                  </label>
                              ))}
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => setShowVocabMixModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl font-bold text-sm">Cancelar</button>
                              <button onClick={() => {
                                  const selected = customVocabLessons.filter((l) => mixLessonSelection[l.id]);
                                  if (selected.length === 0) { alert("Selecciona al menos una lección."); return; }
                                  let words = [];
                                  selected.forEach((lesson) => { words = words.concat(lesson.words); });
                                  words.sort(() => Math.random() - 0.5);
                                  const diffWords = words.filter((w) => w.diff === 1);
                                  const final = mullerSortVocabBySrs([...words, ...diffWords], mullerGetVocabSrsMap());
                                  setCurrentVocabList(final);
                                  setActiveScriptTitle("Mezcla personalizada");
                                  setVocabReviewIndex(0);
                                  setShowVocabTranslation(false);
                                  setShowVocabMixModal(false);
                                  setActiveTab('vocabulario');
                              }} className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded-xl font-bold text-sm">Mezclar e ir a Vocab</button>
                          </div>
                      </div>
                  </div>
              )}

              {showMullerHub && (
                  <div className="fixed inset-0 z-[85] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6" onClick={() => setShowMullerHub(false)} role="presentation">
                      <div role="dialog" aria-modal="true" aria-labelledby="muller-hub-title" className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                          <h2 id="muller-hub-title" className="sr-only">Centro Müller</h2>
                          <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-black/40 items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                  {[
                                      { id: 'voices', label: 'Voces' },
                                      { id: 'tips', label: 'Ayuda' },
                                      { id: 'chromeai', label: 'IA Chrome' },
                                  ].map((t) => (
                                      <button key={t.id} type="button" onClick={() => setMullerHubTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${mullerHubTab === t.id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                  ))}
                              </div>
                              <ExerciseHelpBtn helpId="hub_centro" compact className="!border-sky-500/30" />
                          </div>
                          <div className="p-4 md:p-5 overflow-y-auto text-sm">
                              {mullerHubTab === 'voices' && (
                                  <div className="space-y-4">
                                      <p className="text-xs text-gray-400">Las voces <strong className="text-white">neural / premium</strong> (si las trae tu navegador) suelen sonar más naturales. Todo es <strong className="text-white">gratis</strong>: usa el motor de voz del sistema (Chrome/Edge suelen traer más opciones).</p>
                                      <button
                                          type="button"
                                          className="text-[10px] font-bold text-sky-400 hover:text-white underline underline-offset-2"
                                          onClick={() => {
                                              window.speechSynthesis.getVoices();
                                              setTtsPrefsEpoch((x) => x + 1);
                                          }}
                                      >
                                          Recargar lista de voces
                                      </button>
                                      <div>
                                          <label className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Alemán (Historias, Shadowing, B1/B2⬦)</label>
                                          <select
                                              className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs"
                                              value={ttsDeUri}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setTtsDeUri(v);
                                                  if (v) localStorage.setItem('muller_tts_de', v);
                                                  else localStorage.removeItem('muller_tts_de');
                                                  setTtsPrefsEpoch((x) => x + 1);
                                                  window.speechSynthesis.cancel();
                                              }}
                                          >
                                              <option value="">Predeterminada (automática Müller)</option>
                                              {sortedDeVoices.map((v) => {
                                                  const uri = v.voiceURI || v.name;
                                                  return (
                                                  <option key={uri + v.name} value={uri}>{v.name} · {v.lang}{window.__mullerRankVoiceNatural(v) >= 20 ? ' ★' : ''}</option>
                                                  );
                                              })}
                                          </select>
                                          <button
                                              type="button"
                                              className="mt-2 text-xs font-bold text-sky-300 hover:text-white"
                                              onClick={() => {
                                                  const u = new SpeechSynthesisUtterance('Guten Tag, ich übe Deutsch mit Professor Müller.');
                                                  u.lang = 'de-DE';
                                                  window.__mullerApplyPreferredDeVoice(u);
                                                  u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92;
                                                  window.speechSynthesis.cancel();
                                                  window.speechSynthesis.speak(u);
                                              }}
                                          >
                                              ▶ Probar voz alemana
                                          </button>
                                      </div>
                                      <div>
                                          <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Español (traducciones en podcast / vocab)</label>
                                          <select
                                              className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs"
                                              value={ttsEsUri}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setTtsEsUri(v);
                                                  if (v) localStorage.setItem('muller_tts_es', v);
                                                  else localStorage.removeItem('muller_tts_es');
                                                  setTtsPrefsEpoch((x) => x + 1);
                                              }}
                                          >
                                              <option value="">Predeterminada (automática)</option>
                                              {sortedEsVoices.map((v) => {
                                                  const uri = v.voiceURI || v.name;
                                                  return (
                                                  <option key={uri + v.name} value={uri}>{v.name} · {v.lang}</option>
                                                  );
                                              })}
                                          </select>
                                          <button
                                              type="button"
                                              className="mt-2 text-xs font-bold text-amber-300 hover:text-white"
                                              onClick={() => {
                                                  const u = new SpeechSynthesisUtterance('Hola, repaso vocabulario y traducciones.');
                                                  u.lang = 'es-ES';
                                                  window.__mullerApplyPreferredEsVoice(u);
                                                  window.speechSynthesis.cancel();
                                                  window.speechSynthesis.speak(u);
                                              }}
                                          >
                                              ▶ Probar voz español
                                          </button>
                                      </div>
                                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                                          <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Velocidad TTS (preset)</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[
                                                  { id: 'slow', label: 'Lenta', rate: '0.78' },
                                                  { id: 'normal', label: 'Normal', rate: '0.92' },
                                                  { id: 'exam', label: 'Examen', rate: '1.0' },
                                              ].map((p) => (
                                                  <button key={p.id} type="button" className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(typeof window !== 'undefined' && (localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') === p.rate) ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} onClick={() => { try { localStorage.setItem(MULLER_TTS_RATE_KEY, p.rate); } catch (e) {} setTtsPrefsEpoch((x) => x + 1); }}>
                                                      {p.label} ({p.rate})
                                                  </button>
                                              ))}
                                          </div>
                                          <p className="text-[10px] text-gray-500">Historias, simulacro oral y pruebas de voz usan esta base (ajusta el slider de escena si hace falta).</p>
                                      </div>
                                      <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
                                          <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Tema visual</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[
                                                  { id: 'dark', label: 'Oscuro' },
                                                  { id: 'light', label: 'Claro' },
                                                  { id: 'hc', label: 'Alto contraste' },
                                              ].map((t) => (
                                                  <button key={t.id} type="button" onClick={() => { setUiTheme(t.id); try { localStorage.setItem(MULLER_THEME_KEY, t.id); } catch (e) {} }} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${uiTheme === t.id ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>{t.label}</button>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {mullerHubTab === 'tips' && (
                                  <div className="space-y-3 text-xs text-gray-300">
                                      <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Atajos de teclado (fuera de campos de texto)</p>
                                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">?</kbd> o <kbd className="px-1 rounded bg-black/50 border border-white/20">Shift+/</kbd> — ayuda de atajos</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">I</kbd> — Inicio (panel principal)</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">H</kbd> — pestaña Historia</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">V</kbd> — Vocab</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">P</kbd> — Progreso</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">M</kbd> — Centro Müller</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">Esc</kbd> — cierra paneles / ayuda</li>
                                      </ul>
                                      <p>Usa <strong className="text-white">Chrome o Edge</strong> para más voces y mejor reconocimiento de voz.</p>
                                      <p><strong className="text-white">GitHub Pages</strong> requiere HTTPS; el micrófono funciona al permitir permisos.</p>
                                      <p>Si la lista sale vacía, pulsa <strong className="text-white">Recargar lista de voces</strong> en la pestaña Voces o recarga la página.</p>
                                      <p><kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 text-[10px]">Esc</kbd> cierra este panel.</p>
                                      <button type="button" onClick={() => { setTourStep(1); setShowMullerHub(false); }} className="w-full py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 font-bold text-xs">Repetir tour guiado (5 pasos)</button>
                                  </div>
                              )}
                              {mullerHubTab === 'chromeai' && (
                                  <div className="space-y-3 text-xs text-gray-300">
                                      <ExerciseHelpBtn helpId="hub_chrome_ai" compact className="!border-violet-500/40" />
                                      <p className="text-[11px] leading-relaxed text-gray-400">
                                          Esto usa la <strong className="text-white">IA integrada de Google Chrome</strong> (<strong className="text-violet-300">Gemini Nano</strong>): el modelo se <strong className="text-white">descarga en tu PC</strong> y luego puede funcionar <strong className="text-white">sin depender de nuestro servidor</strong>. No es la “galería” de Edge: Microsoft Edge puede tener APIs parecidas <strong className="text-gray-300">con flags</strong>.
                                      </p>
                                      <p className="text-[10px] text-gray-500">
                                          Requisitos típicos: Chrome de escritorio reciente, espacio libre en disco, modelo descargable desde Chrome. Documentación:{' '}
                                          <a className="text-sky-400 underline hover:text-white" href="https://developer.chrome.com/docs/ai/built-in" target="_blank" rel="noopener noreferrer">Built-in AI (Chrome)</a>
                                          {' · '}
                                          <a className="text-sky-400 underline hover:text-white" href="https://developer.chrome.com/docs/ai/summarizer-api" target="_blank" rel="noopener noreferrer">Summarizer API</a>
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                          <button type="button" onClick={fillChromeAiFromScene} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-[11px] border border-white/10">Cargar escena actual (Historia)</button>
                                          <button type="button" disabled={chromeAiBusy} onClick={runChromeLocalSummarize} className="px-3 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 disabled:opacity-50 font-bold text-[11px] border border-violet-500/40">Resumir con Gemini Nano (local)</button>
                                      </div>
                                      <textarea
                                          className="w-full min-h-[100px] bg-black/50 border border-white/15 rounded-lg p-2 text-white font-mono text-[11px] outline-none focus:border-violet-500"
                                          placeholder="Pega aquí un texto en alemán (guion, artículo…) o usa “Cargar escena”."
                                          value={chromeAiText}
                                          onChange={(e) => setChromeAiText(e.target.value)}
                                      />
                                      {chromeAiLine ? <p className="text-[10px] text-amber-200/90">{chromeAiLine}</p> : null}
                                      {chromeAiOut ? (
                                          <div className="bg-black/40 border border-violet-800/40 rounded-xl p-3 text-[11px] text-gray-200 whitespace-pre-wrap max-h-48 overflow-y-auto">{chromeAiOut}</div>
                                      ) : null}
                                  </div>
                              )}
                          </div>
                          <div className="p-3 border-t border-white/10 flex justify-end">
                              <button type="button" onClick={() => setShowMullerHub(false)} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-bold text-sm">Cerrar</button>
                          </div>
                      </div>
                  </div>
              )}

              {tourStep >= 1 && tourStep <= 5 && (() => {
                  const steps = [
                      { t: 'Bienvenido al Entrenador Müller', d: 'Historia es el centro: escenas, audio y modos (Diktat, quiz⬦). Usa las pestañas arriba para cambiar de actividad.' },
                      { t: 'Voces naturales (gratis)', d: 'Pulsa el icono del panel azul: elige voz alemana y español del sistema. Prueba con el botón “Probar voz”.' },
                      { t: 'Vocab y Progreso', d: 'Fácil/Normal/Difícil programa repaso espaciado (SRS). En Progreso ves mazos y exportas a Anki.' },
                      { t: 'Entrenamiento avanzado', d: 'Entrenamiento concentra artículos, verbos y preposiciones con seguimiento de precisión.' },
                      { t: 'Shadowing, Escritura y B1/B2', d: 'Shadowing entrena pronunciación; Escritura incluye OCR; B1/B2 son frases modelo. ¡Viel Erfolg!' },
                  ];
                  const item = steps[tourStep - 1];
                  const i = tourStep - 1;
                  return (
                  <div className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4" onClick={() => setTourStep(0)}>
                      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-black text-white mb-2">{item.t}</h3>
                          <p className="text-sm text-gray-400 mb-4">{item.d}</p>
                          <div className="flex gap-2 justify-between items-center">
                              <button type="button" className="text-xs text-gray-500" onClick={() => setTourStep(0)}>Saltar</button>
                              <button type="button" className="px-4 py-2 rounded-lg bg-sky-600 font-bold text-sm" onClick={() => (i < 4 ? setTourStep(tourStep + 1) : setTourStep(0))}>{i < 4 ? 'Siguiente' : 'Listo'}</button>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-3 text-center">{tourStep}/5</p>
                      </div>
                  </div>
                  );
              })()}

              {exerciseHelpId && MULLER_EXERCISE_HELP[exerciseHelpId] && (
                  <div className="fixed inset-0 z-[125] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setExerciseHelpId(null)} role="presentation">
                      <div role="dialog" aria-modal="true" aria-labelledby="exercise-help-title" className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
                          <h3 id="exercise-help-title" className="text-lg font-black text-white mb-2 pr-6">{MULLER_EXERCISE_HELP[exerciseHelpId].title}</h3>
                          <p className="text-sm text-gray-300 leading-relaxed mb-4">{MULLER_EXERCISE_HELP[exerciseHelpId].what}</p>
                          <p className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">Consejos</p>
                          <ul className="list-disc list-inside text-sm text-gray-400 space-y-2 mb-6">
                              {MULLER_EXERCISE_HELP[exerciseHelpId].tips.map((t, i) => (
                                  <li key={i}>{t}</li>
                              ))}
                          </ul>
                          <button type="button" className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm" onClick={() => setExerciseHelpId(null)}>Cerrar</button>
                          <p className="text-[10px] text-gray-600 mt-3 text-center"><kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20">Esc</kbd> también cierra</p>
                      </div>
                  </div>
              )}

              <nav className="muller-nav-row muller-mobile-bottom-nav muller-bottom-secondary-nav bg-zinc-950/90 p-1 md:p-1.5 rounded-t-2xl ring-1 ring-white/[0.1]" aria-label="Herramientas, segunda fila fija, scroll horizontal">
                  {activeTab === 'bxbank' ? (
                      <div className="muller-bxbank-btns" aria-label="Cambio de banco B1 o B2">
                          <button type="button" onClick={() => { setBxBankLevel('b1'); setActiveTab('bxbank'); setBxCategory('mix'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${bxBankLevel === 'b1' ? 'bg-emerald-600 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="target" className="w-4 h-4 md:w-5 md:h-5" />B1</button>
                          <button type="button" onClick={() => { setBxBankLevel('b2'); setActiveTab('bxbank'); setBxCategory('mix'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${bxBankLevel === 'b2' ? 'bg-teal-600 text-white shadow-[0_0_18px_rgba(20,184,166,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="layers" className="w-4 h-4 md:w-5 md:h-5" />B2</button>
                      </div>
                  ) : null}
                  <button type="button" onClick={() => { setActiveTab('progreso'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'progreso' ? 'bg-cyan-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="bar-chart" className="w-4 h-4 md:w-5 md:h-5" />Progreso</button>
                  <button type="button" onClick={() => { setActiveTab('guiones'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'guiones' ? 'bg-violet-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="file-text" className="w-4 h-4 md:w-5 md:h-5" />Biblioteca</button>
                  <button type="button" onClick={() => { setActiveTab('lexikon'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'lexikon' ? 'bg-sky-600 text-white shadow-[0_0_18px_rgba(14,165,233,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="library" className="w-4 h-4 md:w-5 md:h-5" />Lexikon</button>
                  <button type="button" onClick={() => { setActiveTab('telc'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'telc' ? 'bg-orange-600 text-white shadow-[0_0_18px_rgba(234,88,12,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="clipboard-check" className="w-4 h-4 md:w-5 md:h-5" />TELC</button>
                  <button type="button" onClick={() => { setActiveTab('storybuilder'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'storybuilder' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="sparkles" className="w-4 h-4 md:w-5 md:h-5" />IA</button>
                  <button type="button" onClick={() => { setActiveTab('historiaspro'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'historiaspro' ? 'bg-emerald-600 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="feather" className="w-4 h-4 md:w-5 md:h-5" />Maestros Pro</button>
                  <button type="button" onClick={() => { setActiveTab('comunidad'); stopAudio(); setPracticeActive(null); }} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'comunidad' ? 'bg-amber-600 text-white shadow-[0_0_18px_rgba(245,158,11,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="trophy" className="w-4 h-4 md:w-5 md:h-5" />Comunidad</button>
              </nav>

              {/* CONTENIDO PRINCIPAL */}
              <div className={`muller-app-main flex-1 overflow-y-auto relative flex flex-col hide-scrollbar ${activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !podcastMode && !practiceActive ? 'pt-[calc(var(--muller-mobile-header-h)+3.2rem)] md:pt-[calc(var(--muller-mobile-header-h)+2.8rem)]' : 'pt-[var(--muller-mobile-header-h)]'} pb-[calc(var(--muller-mobile-bottom-nav-h)+max(0.5rem,env(safe-area-inset-bottom,0px)))] ${activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !practiceActive ? 'muller-main-historia-pb' : ''} ${uiTheme === 'light' ? 'text-slate-900' : ''}`}>
                  
                  {activeTab === 'telc' && !practiceActive && (() => {
                      const telcPack = (window.MULLER_TELC_BY_LEVEL && window.MULLER_TELC_BY_LEVEL[telcLevel]) || (window.MULLER_TELC_BY_LEVEL && window.MULLER_TELC_BY_LEVEL.B1);
                      const tc = uiTheme === 'light' ? 'text-slate-800 border-orange-200 bg-white/90' : 'text-gray-200 border-orange-900/40 bg-black/35';
                      const tcMuted = uiTheme === 'light' ? 'text-slate-600' : 'text-gray-400';
                      const tcHeading = uiTheme === 'light' ? 'text-slate-900' : 'text-white';
                      const lvBtnOff = uiTheme === 'light' ? 'bg-slate-200/90 border-slate-300 text-slate-600 hover:bg-slate-300' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white';
                      return (
                      <div className={`p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24 ${uiTheme === 'light' ? 'text-slate-900' : ''}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                              <h1 className={`text-2xl md:text-4xl font-black flex items-center gap-2 ${uiTheme === 'light' ? 'text-orange-800' : 'text-orange-300'}`}><Icon name="clipboard-check" className="w-8 h-8 md:w-10 md:h-10" /> TELC · Guía y examen</h1>
                              <ExerciseHelpBtn helpId="nav_telc" />
                          </div>
                          <p className={`text-sm mb-4 leading-relaxed ${tcMuted}`}>Orientación educativa por nivel (CEFR). No es un modelo oficial de examen: para convocatorias y modelos actuales usa <a href="https://www.telc.net" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${uiTheme === 'light' ? 'text-orange-700' : 'text-orange-400'}`}>telc.net</a> y tu centro.</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lv) => (
                                  <button key={lv} type="button" onClick={() => setTelcLevel(lv)} className={`px-3 py-2 rounded-xl text-sm font-black border transition ${telcLevel === lv ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : lvBtnOff}`}>{lv}</button>
                              ))}
                          </div>
                          <div className={`rounded-2xl border p-4 md:p-6 mb-6 ${tc}`}>
                              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${uiTheme === 'light' ? 'text-orange-600' : 'text-orange-400/90'}`}>Nivel seleccionado</p>
                              <h2 className={`text-xl md:text-2xl font-black mb-2 ${tcHeading}`}>{telcPack.label}</h2>
                              <p className={`text-sm leading-relaxed ${tcMuted}`}>{telcPack.summary}</p>
                          </div>
                          <div className="space-y-5 text-sm mb-8">
                              {(telcPack.sections || []).map((sec, si) => (
                                  <section key={si} className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                      <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="book-open" className={`w-5 h-5 shrink-0 ${uiTheme === 'light' ? 'text-orange-600' : 'text-orange-400'}`} /> {sec.title}</h3>
                                      <ul className="list-disc list-inside space-y-1.5">
                                          {(sec.items || []).map((line, li) => (
                                              <li key={li} className={uiTheme === 'light' ? 'text-slate-700' : ''}>{line}</li>
                                          ))}
                                      </ul>
                                  </section>
                              ))}
                          </div>
                          <h2 className={`text-lg font-black mb-3 ${tcHeading}`}>Día del examen (todos los niveles)</h2>
                          <div className={`space-y-6 text-sm ${uiTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="briefcase" className="w-5 h-5" /> Qué llevar</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Documento de identidad válido (mismo que al registrarte).</li>
                                      <li>Confirmación / hoja de inscripción al examen (si el centro la envió).</li>
                                      <li>Lápiz negro o azul y goma (si el centro permite escritura a mano).</li>
                                      <li>Reloj analógico silencioso si te ayuda (sin smartwatch en sala).</li>
                                      <li>Llegada con margen: localiza baños y aula el día anterior si puedes.</li>
                                  </ul>
                              </section>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="clock" className="w-5 h-5" /> Tiempos orientativos</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Lectura: varias tareas seguidas — gestiona el reloj desde el primer minuto.</li>
                                      <li>Escritura: planifica unos minutos de borrador antes de escribir en limpio.</li>
                                      <li>Oral: suele haber preparación corta; usa notas solo si el formato lo permite.</li>
                                      <li>Escucha: en muchos centros una sola emisión — lee las preguntas antes del audio.</li>
                                  </ul>
                              </section>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="lightbulb" className="w-5 h-5" /> Consejos</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Descansa bien; el cansancio penaliza sobre todo la escucha.</li>
                                      <li>Si no entiendes una instrucción, pide aclaración corta en alemán.</li>
                                      <li>En la redacción: coherencia y conectores antes que vocabulario raro.</li>
                                  </ul>
                              </section>
                          </div>
                          <div className={`rounded-xl border border-dashed border-orange-500/35 p-4 mb-6 text-xs ${uiTheme === 'light' ? 'bg-orange-50 text-slate-600' : 'bg-orange-950/20 text-gray-400'}`}>
                              Práctica tipo test: abre la pestaña <strong className={uiTheme === 'light' ? 'text-fuchsia-700' : 'text-fuchsia-300'}>Entrenamiento</strong> (artículos, verbos+prep., preposiciones) y el simulacro con cronómetro si está disponible en tu versión.
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2">
                              <button type="button" onClick={() => {
                                  const lines = [
                                      `Checklist TELC — Müller · nivel ${telcLevel}`,
                                      telcPack.label,
                                      telcPack.summary,
                                      '',
                                      'Qué llevar: DNI/documento, confirmación, lápices, llegada temprana.',
                                      'Tiempos: gestionar lectura; planificar escritura; oral con preparación; escucha única.',
                                      'Consejos: descanso, pedir aclaraciones, coherencia en la redacción.',
                                  ];
                                  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
                                  const a = document.createElement('a');
                                  a.href = URL.createObjectURL(blob);
                                  a.download = `telc_checklist_${telcLevel}_${new Date().toISOString().slice(0, 10)}.txt`;
                                  a.click();
                                  URL.revokeObjectURL(a.href);
                              }} className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 font-bold text-sm border border-orange-500/40">Exportar checklist (.txt)</button>
                              <button type="button" onClick={() => {
                                  const w = window.open('', '_blank');
                                  if (!w) return;
                                  w.document.write(`<html><head><title>TELC Müller ${telcLevel}</title></head><body style="font-family:sans-serif;padding:24px;max-width:640px;"><h1>TELC · ${telcLevel}</h1><p>${telcPack.summary}</p><p>Usa Ctrl+P para PDF.</p><h2>Checklist</h2><ul><li>Documento</li><li>Confirmación</li><li>Material de escritura</li></ul></body></html>`);
                                  w.document.close();
                                  w.print();
                              }} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10">Imprimir / PDF (navegador)</button>
                          </div>
                      </div>
                      );
                  })()}

                  {/* STORY BUILDER (sin cambios) */}
                  {activeTab === 'storybuilder' && (
                      <div className="p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 flex flex-col justify-start md:justify-center min-h-full">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-fuchsia-400"><Icon name="sparkles" className="w-6 h-6 md:w-10 md:h-10" /> AI Story Builder</h1>
                              <ExerciseHelpBtn helpId="storybuilder" />
                          </div>
                          <p className="text-fuchsia-200 mb-6 md:mb-8 text-base md:text-lg">Crea historias a medida generadas por IA utilizando el nivel y vocabulario exacto que quieres repasar.</p>
                          <p className="text-[11px] text-fuchsia-400/80 mb-4 max-w-xl leading-relaxed border border-fuchsia-800/40 rounded-xl p-3 bg-black/20">Nota: la IA integrada aquí es simulada en el navegador (sin coste). Si conectas un proveedor de IA externo, sería opcional y con <strong className="text-fuchsia-200">clave aportada por ti</strong> — no hay IA de pago centralizada en esta app.</p>
                          {!isGeneratingStory ? (
                              <div className="bg-fuchsia-900/40 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-fuchsia-500/50 shadow-2xl flex flex-col gap-4 md:gap-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                      <div>
                                          <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm">Nivel del Idioma:</label>
                                          <div className="flex gap-2 flex-wrap">
                                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                                                  <button key={lvl} onClick={()=>setAiLevel(lvl)} className={`px-2 md:px-4 py-1 md:py-2 rounded-xl font-black text-xs md:text-sm transition ${aiLevel === lvl ? 'bg-fuchsia-500 text-white shadow-lg scale-105' : 'bg-black/50 text-gray-400 hover:bg-fuchsia-900/50'}`}>{lvl}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm">Temática:</label>
                                          <select className="w-full bg-black/50 border border-fuchsia-800 p-2 md:p-3 rounded-xl text-white outline-none focus:border-fuchsia-400 text-sm md:text-base" value={aiTheme} onChange={(e)=>setAiTheme(e.target.value)}>
                                              <option value="Alltag">Vida Cotidiana (Alltag)</option>
                                              <option value="Krimi">Policíaca (Krimi)</option>
                                              <option value="Beruf">Trabajo / Entrevista (Beruf)</option>
                                              <option value="Reise">Viaje y Vacaciones (Reise)</option>
                                              <option value="Abenteuer">Aventura (Abenteuer)</option>
                                              <option value="SciFi">Ciencia Ficción (SciFi)</option>
                                              <option value="Romantik">Romance (Romantik)</option>
                                              <option value="Horror">Terror (Horror)</option>
                                              <option value="Geschichte">Histórico (Geschichte)</option>
                                              <option value="Komödie">Comedia (Komödie)</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm flex items-center justify-between">
                                          <span>Palabras Clave (Opcional)</span>
                                          <span className="text-[10px] md:text-xs font-normal text-fuchsia-400/70 bg-fuchsia-950 px-2 py-0.5 rounded">Separadas por comas</span>
                                      </label>
                                      <textarea className="w-full h-20 md:h-24 bg-black/50 border border-fuchsia-800 p-3 md:p-4 rounded-xl text-white outline-none focus:border-fuchsia-400 resize-none font-mono text-xs md:text-sm" placeholder="Ej: der Apfel, wandern, gefährlich, sich erinnern an..." value={aiCustomWords} onChange={(e)=>setAiCustomWords(e.target.value)} />
                                  </div>
                                  <button onClick={handleGenerateAIStory} className="mt-2 w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl shadow-[0_0_30px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2 md:gap-3 transition transform hover:scale-105"><Icon name="brain" className="w-5 h-5 md:w-7 md:h-7" /> Generar Historia Mágica</button>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center h-48 md:h-64 gap-4 md:gap-6 animate-pulse">
                                  <Icon name="brain" className="w-12 h-12 md:w-20 md:h-20 text-fuchsia-500" />
                                  <h2 className="text-lg md:text-2xl font-bold text-fuchsia-300 text-center">La IA del Profesor Müller está escribiendo un guion...</h2>
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'historiaspro' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                              <div>
                                  <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-emerald-300"><Icon name="feather" className="w-7 h-7 md:w-10 md:h-10" /> Historias Pro</h1>
                                  <p className="text-sm text-emerald-100/80 mt-1">Escribe en español/alemán o sube manuscrito (OCR), y obtén versión natural por nivel, simplificada, glosario y escenas para `Historia`.</p>
                              </div>
                              <div className={`text-xs px-3 py-2 rounded-xl border ${cloudSyncState === 'synced' ? 'bg-emerald-900/40 border-emerald-500/35 text-emerald-200' : cloudSyncState === 'syncing' ? 'bg-sky-900/35 border-sky-500/35 text-sky-200' : cloudSyncState === 'error' ? 'bg-rose-900/40 border-rose-500/40 text-rose-200' : 'bg-black/30 border-white/10 text-gray-300'}`}>
                                  Sync: {cloudSyncLabel}{cloudSyncAt ? ` · ${new Date(cloudSyncAt).toLocaleTimeString()}` : ''}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                              <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:p-5 space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                      {[
                                          { id: 'es', label: 'Entrada español' },
                                          { id: 'de', label: 'Entrada alemán (corregir)' },
                                          { id: 'ocr', label: 'OCR manuscrito' },
                                      ].map((x) => (
                                          <button key={x.id} type="button" onClick={() => setStoriesProInputMode(x.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${storiesProInputMode === x.id ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black/30 border-white/10 text-gray-300'}`}>{x.label}</button>
                                      ))}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <label className="text-xs text-gray-400">
                                          Nivel de salida
                                          <select className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2 py-2 text-white" value={storiesProLevel} onChange={(e) => setStoriesProLevel(e.target.value)}>
                                              {['A2', 'B1', 'B2', 'C1'].map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                                          </select>
                                      </label>
                                      <label className="text-xs text-gray-400">
                                          Estilo
                                          <select className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2 py-2 text-white" value={storiesProTone} onChange={(e) => setStoriesProTone(e.target.value)}>
                                              <option value="natural">Natural</option>
                                              <option value="formal">Formal</option>
                                          </select>
                                      </label>
                                  </div>
                                  {storiesProInputMode === 'ocr' && (
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                          <div className="flex items-center gap-2 mb-2">
                                              <label className="text-xs text-gray-400">Idioma OCR:</label>
                                              <select className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white" value={storiesProOcrLang} onChange={(e) => setStoriesProOcrLang(e.target.value)}>
                                                  <option value="es">Español</option>
                                                  <option value="de">Alemán</option>
                                              </select>
                                          </div>
                                          <input type="file" accept="image/*" onChange={(e) => runHistoriasProOcr(e.target.files && e.target.files[0])} className="w-full text-xs text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-emerald-700 file:text-white" />
                                      </div>
                                  )}
                                  <textarea value={storiesProSourceText} onChange={(e) => setStoriesProSourceText(e.target.value)} className="w-full h-52 bg-black/45 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-y" placeholder={storiesProInputMode === 'de' ? 'Escribe tu historia en alemán para corrección/estilización⬦' : 'Escribe tu historia en español⬦'} />
                                  {storiesProErr ? <p className="text-xs text-rose-300">{storiesProErr}</p> : null}
                                  <div className="flex flex-wrap gap-2">
                                      <button type="button" disabled={storiesProBusy} onClick={runHistoriasProGenerate} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 font-bold text-sm">{storiesProBusy ? 'Procesando⬦' : 'Generar Historias Pro'}</button>
                                      <button type="button" disabled={!storiesProResult} onClick={sendHistoriasProToHistoria} className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 font-bold text-sm">Enviar escenas a Historia</button>
                                  </div>
                              </section>

                              <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:p-5 space-y-3">
                                  {!storiesProResult ? (
                                      <p className="text-sm text-gray-400">Genera una historia para ver salida natural, versión simplificada, glosario y escenas prácticas.</p>
                                  ) : (
                                      <>
                                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 mb-1">Alemán natural ({storiesProLevel})</p>
                                              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{storiesProResult.deNatural}</p>
                                          </div>
                                          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-sky-300 mb-1">Versión simplificada</p>
                                              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{storiesProResult.deSimple}</p>
                                          </div>
                                          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-violet-300 mb-1">Glosario rápido</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {(storiesProResult.glossary || []).map((g, i) => <span key={i} className="text-xs rounded-md px-2 py-1 bg-black/35 border border-white/10 text-gray-200">{g.de}</span>)}
                                              </div>
                                          </div>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Escenas para Historia</p>
                                              <ul className="space-y-1.5 text-sm text-gray-300 max-h-40 overflow-y-auto">
                                                  {(storiesProResult.scenes || []).map((s, i) => <li key={i}><span className="font-bold text-emerald-300">{s.speaker}:</span> {s.text}</li>)}
                                              </ul>
                                          </div>
                                      </>
                                  )}
                              </section>
                          </div>
                      </div>
                  )}

                  {/* ENTRENAMIENTO DASHBOARD (sin cambios) */}
                  {practiceActive && currentPracticeItem && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in">
                         <button onClick={() => setPracticeActive(null)} className="absolute top-4 left-4 md:top-8 md:left-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold text-sm md:text-base"><Icon name="chevron-left" className="w-4 h-4 md:w-5 md:h-5" /> Volver</button>
                         <div className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8">
                             <h2 className="text-2xl md:text-3xl font-black text-amber-500 uppercase tracking-widest"><Icon name="brain" className="w-6 h-6 md:w-8 md:h-8 inline mr-2" /> Entrenamiento Rápido</h2>
                             <ExerciseHelpBtn helpId="practice_mazos" />
                         </div>
                         <div className="w-full max-w-2xl bg-black/40 p-6 md:p-12 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
                             <button onClick={() => playPracticeAudio(practiceActive === 'grammar' ? currentPracticeItem.base : currentPracticeItem.de)} className="bg-white/10 p-3 md:p-4 rounded-full mb-4 md:mb-6 hover:bg-white/20 transition"><Icon name="volume-2" className="w-6 h-6 md:w-8 md:h-8" /></button>
                             {practiceActive === 'grammar' ? (
                                 <h1 className="text-3xl md:text-5xl font-black text-cyan-400 text-center mb-6 md:mb-8">{currentPracticeItem.base}</h1>
                             ) : (
                                 <h1 className="text-4xl md:text-7xl font-black text-white text-center mb-6 md:mb-8 flex items-center justify-center flex-wrap">{getArticleVisual(currentPracticeItem.de)}{currentPracticeItem.de}</h1>
                             )}
                             {!practiceShowTrans ? (
                                 <button onClick={() => setPracticeShowTrans(true)} className="bg-blue-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-xl md:text-2xl shadow-xl hover:bg-blue-500 transition">Revelar</button>
                             ) : (
                                 <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-4">
                                     {practiceActive === 'grammar' ? (
                                         <div className="bg-black/60 p-4 md:p-6 rounded-xl md:rounded-2xl w-full mb-6 md:mb-8 text-center border border-cyan-800/50">
                                             <p className="text-lg md:text-2xl text-white mb-2 italic">"{currentPracticeItem.exampleDe}"</p>
                                             <p className="text-base md:text-xl text-cyan-200">({currentPracticeItem.exampleEs})</p>
                                         </div>
                                     ) : (
                                         <h2 className="text-2xl md:text-4xl font-bold text-gray-300 text-center mb-6 md:mb-8 bg-black/60 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl w-full">{currentPracticeItem.es}</h2>
                                     )}
                                     <button onClick={nextPracticeWord} className="bg-green-600 w-full py-3 md:py-4 rounded-xl font-bold text-xl md:text-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-green-500">Siguiente <Icon name="arrow-right" className="w-5 h-5 md:w-6 md:h-6" /></button>
                                 </div>
                             )}
                         </div>
                         <p className="mt-4 md:mt-6 text-gray-500 font-bold text-sm md:text-base">Tarjeta {practiceIndex + 1} de {currentPracticeList.length}</p>
                      </div>
                  )}

                  {activeTab === 'entrenamiento' && !practiceActive && (
                      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                              <div>
                                  <h1 className="text-2xl md:text-4xl font-black text-fuchsia-200 flex items-center gap-2 md:gap-3"><Icon name="graduation-cap" className="w-8 h-8 md:w-10 md:h-10" /> Entrenamiento avanzado</h1>
                                  <p className="text-xs md:text-sm text-fuchsia-100/80 mt-1">Centro principal de práctica: artículos, verbos con preposición, preposiciones y simulacro TELC.</p>
                              </div>
                              <ExerciseHelpBtn helpId="advanced_menu" />
                          </div>
                          <AdvancedPracticePanelFinal embedded />
                      </div>
                  )}

                  {/* B1 / B2 (sin cambios) */}
                  {activeTab === 'bxbank' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500 flex flex-col min-h-full">
                          <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start md:items-center mb-6 md:mb-8 border-b border-sky-900/50 pb-4 md:pb-6 gap-4">
                              <div className="min-w-0 flex-1 md:max-w-[min(100%,28rem)]">
                                  <h1 className={`text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 ${bxBankLevel === 'b1' ? 'text-emerald-400' : 'text-sky-400'}`}>
                                      {bxBankLevel === 'b1' ? <Icon name="target" className="w-8 h-8 md:w-10 md:h-10" /> : <Icon name="layers" className="w-8 h-8 md:w-10 md:h-10" />} 
                                      {bxBankLevel === 'b1' ? 'Banco B1 · Fundamentos' : 'Banco B2 · Meisterklasse'}
                                  </h1>
                                  <p className="text-gray-300 text-xs md:text-sm mt-1">{bxBankLevel === 'b1' ? 'Domina las bases absolutas.' : 'Estructuras avanzadas de nativos.'}</p>
                                  <p className="text-[10px] text-gray-500 mt-1">Tarjetas desde <code className="text-amber-200/90">b1-b2-database.json</code> más lo que añadas desde <strong className="text-gray-400">Biblioteca → Distribuir texto → B1/B2</strong> (local).</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 justify-end">
                                  <div className="flex gap-1 md:gap-2 flex-wrap bg-black/40 p-1 md:p-2 rounded-xl border border-white/10">
                                      <button onClick={()=>setBxCategory('vocabulario')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'vocabulario' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Vocabulario</button>
                                      <button onClick={()=>setBxCategory('verbos')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'verbos' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Verbos</button>
                                      <button onClick={()=>setBxCategory('preposiciones')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'preposiciones' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Prep.</button>
                                      <button onClick={()=>setBxCategory('conectores')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'conectores' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Conectores</button>
                                      <button onClick={()=>setBxCategory('redemittel')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'redemittel' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Redemittel</button>
                                      <button onClick={()=>setBxCategory('mix')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-1 shadow-lg border border-white/20 ${bxCategory === 'mix' ? 'ring-1 md:ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}><Icon name="shuffle" className="w-3 h-3 md:w-4 md:h-4" /> MIX</button>
                                  </div>
                                  <ExerciseHelpBtn helpId={bxExerciseHelpId} title={'Ayuda: categoría ' + bxCategory} />
                              </div>
                              <div className="w-full md:basis-full flex flex-wrap items-center gap-2 mt-1 md:mt-0 pt-3 border-t border-white/10 md:order-last">
                                  <span className="text-[10px] font-bold text-rose-300/95 uppercase tracking-wider w-full sm:w-auto">Mis aportaciones (Biblioteca)</span>
                                  {bxBankLevel === 'b1' ? (
                                      <button type="button" onClick={() => clearBxUserLevelAllCategories('b1')} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/40">Borrar todo B1</button>
                                  ) : (
                                      <button type="button" onClick={() => clearBxUserLevelAllCategories('b2')} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/40">Borrar todo B2</button>
                                  )}
                                  {bxCategory !== 'mix' ? (
                                      <button type="button" onClick={() => clearBxUserOneCategory(bxBankLevel === 'b1' ? 'b1' : 'b2', bxCategory)} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-100 border border-amber-600/35">
                                          Borrar solo: {bxCategory === 'vocabulario' ? 'Vocabulario' : bxCategory === 'verbos' ? 'Verbos' : bxCategory === 'preposiciones' ? 'Prep.' : bxCategory === 'conectores' ? 'Conectores' : 'Redemittel'}
                                      </button>
                                  ) : (
                                      <span className="text-[9px] text-gray-500">Elige una categoría (no MIX) para borrar solo esa subpestaña.</span>
                                  )}
                              </div>
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-3xl mx-auto">
                              {bxCurrentList.length > 0 ? (
                                  <>
                                      <div className={`absolute top-0 right-0 px-2 md:px-4 py-0.5 md:py-1 rounded-full font-bold border uppercase text-[10px] md:text-xs tracking-widest ${bxBankLevel === 'b1' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30' : 'bg-sky-900/50 text-sky-300 border-sky-500/30'}`}>
                                          {bxCategory === 'mix' ? 'Modo Mix (Aleatorio)' : bxCategory}
                                      </div>
                                      <div className={`w-full bg-slate-900/90 p-4 md:p-10 rounded-2xl md:rounded-3xl border-2 shadow-2xl mt-6 md:mt-8 ${bxBankLevel === 'b1' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-sky-500/50 shadow-[0_0_40px_rgba(14,165,233,0.3)]'}`}>
                                          <p className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px] md:text-sm"><Icon name="languages" className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />{bxBankLevel === 'b1' ? 'Básico / Común:' : 'Nivel B1:'}</p>
                                          <p className="text-base md:text-2xl text-white/60 mb-4 md:mb-8 decoration-red-500/50 decoration-2">"{bxCurrentList[bxIndex]?.b1}"</p>
                                          <p className={`font-black mb-2 uppercase tracking-widest text-[10px] md:text-sm ${bxBankLevel === 'b1' ? 'text-emerald-400' : 'text-sky-400'}`}><Icon name="trophy" className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />{bxBankLevel === 'b1' ? 'Mejor / Nivel B1 Real:' : 'Nivel B2/C1:'}</p>
                                          <p className="text-xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">"{bxCurrentList[bxIndex]?.b2}"</p>
                                          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">({bxCurrentList[bxIndex]?.es})</p>
                                          <div className="bg-black/40 p-3 md:p-4 rounded-xl border border-white/10 flex gap-2 md:gap-3">
                                              <Icon name="brain" className="w-5 h-5 md:w-6 md:h-6 text-amber-400 flex-shrink-0 mt-0.5 md:mt-1" />
                                              <p className="text-xs md:text-sm text-gray-200 leading-relaxed"><strong className="text-amber-400 uppercase tracking-wide">La Lógica del Profesor:</strong> <br/> {bxCurrentList[bxIndex]?.trick}</p>
                                          </div>
                                          {bxCurrentList[bxIndex]?._mullerUser ? (
                                              <div className="mt-4 md:mt-5 flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 items-stretch sm:items-center border-t border-white/10 pt-4">
                                                  <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider">Tu biblioteca</span>
                                                  <button type="button" onClick={handleBxUserCardDelete} className="text-xs md:text-sm bg-red-900/70 hover:bg-red-800 text-red-100 px-3 py-2 rounded-xl font-bold border border-red-700/50">Eliminar tarjeta</button>
                                                  <div className="flex flex-wrap items-center gap-2">
                                                      <span className="text-[10px] text-gray-500">Mover a</span>
                                                      <select value={bxMoveTargetCat} onChange={(e) => setBxMoveTargetCat(e.target.value)} className="bg-black/60 border border-gray-600 text-white text-xs md:text-sm rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500">
                                                          {Object.keys(BX_DB_EMPTY).filter((c) => {
                                                              const it = bxCurrentList[bxIndex];
                                                              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
                                                              const src = bxCategory === 'mix' ? (it._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, it._mullerUid)) : bxCategory;
                                                              return c !== src;
                                                          }).map((c) => (
                                                              <option key={c} value={c}>{c === 'vocabulario' ? 'Vocabulario' : c === 'verbos' ? 'Verbos' : c === 'preposiciones' ? 'Prep.' : c === 'conectores' ? 'Conectores' : 'Redemittel'}</option>
                                                          ))}
                                                      </select>
                                                      <button type="button" onClick={handleBxUserCardMove} className="text-xs md:text-sm bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 px-3 py-2 rounded-xl font-bold border border-emerald-600/50">Mover aquí</button>
                                                  </div>
                                              </div>
                                          ) : null}
                                      </div>
                                      <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 w-full max-w-sm justify-between">
                                          <button type="button" onClick={() => setBxIndex(i => i > 0 ? i - 1 : bxCurrentList.length - 1)} className="muller-icon-nav bg-gray-800 hover:bg-gray-700 text-white p-3 md:p-4 rounded-full transition border border-white/15"><Icon name="chevron-left" className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                                          <button onClick={() => { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(bxCurrentList[bxIndex].b2); u.lang = 'de-DE'; window.__mullerApplyPreferredDeVoice(u); window.speechSynthesis.speak(u); }} className={`text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg flex items-center gap-2 flex-1 justify-center text-sm md:text-base ${bxBankLevel === 'b1' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-sky-600 hover:bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]'}`}><Icon name="volume-2" className="w-5 h-5 md:w-6 md:h-6" /> Escuchar</button>
                                          <button type="button" onClick={() => setBxIndex(i => i < bxCurrentList.length - 1 ? i + 1 : 0)} className="muller-icon-nav bg-gray-800 hover:bg-gray-700 text-white p-3 md:p-4 rounded-full transition border border-white/15"><Icon name="chevron-right" className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                                      </div>
                                      <p className="text-gray-500 font-bold mt-4 text-xs md:text-sm">Tarjeta {bxIndex + 1} / {bxCurrentList.length}</p>
                                  </>
                              ) : (
                                  <div className="text-gray-500 font-bold text-base md:text-xl">Categoría sin datos (Selecciona otra).</div>
                              )}
                          </div>
                      </div>
                  )}

                  {activeTab === 'lexikon' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                              <h1 className="text-2xl md:text-4xl font-black text-cyan-300 flex items-center gap-2 md:gap-3">
                                  <Icon name="library" className="w-8 h-8 md:w-10 md:h-10" /> Lexikon
                              </h1>
                              <ExerciseHelpBtn helpId="nav_lexikon" />
                          </div>
                          <p className="text-gray-400 text-xs md:text-sm mb-6 border-b border-white/10 pb-4">Traducción de palabras o frases (detección automática del idioma de origen) y opción de solo Wiktionary. Los textos salen por internet; puedes guardar pares en las mismas lecciones que en <strong className="text-amber-200">Biblioteca → Vocab</strong>.</p>

                          <div className="rounded-2xl border border-cyan-700/40 bg-slate-900/80 p-4 md:p-6 mb-6 shadow-xl">
                              <h2 className="text-lg font-black text-cyan-200 mb-3 flex items-center gap-2"><Icon name="search" className="w-5 h-5" /> Palabra o frase</h2>
                              <p className="text-[11px] text-gray-500 mb-3">Elige primero si quieres <strong className="text-gray-300">traducción</strong> (recomendado para español → alemán) o solo enlaces a <strong className="text-gray-300">Wiktionary</strong> (definiciones en un idioma).</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                  <input type="text" value={lexikonSearch} onChange={(e) => setLexikonSearch(e.target.value)} placeholder="Palabra o frase⬦" className="flex-1 min-w-[160px] bg-black/50 border border-cyan-800/60 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-500" onKeyDown={(e) => { if (e.key === 'Enter') runLexikonDictionarySearch(); }} />
                                  <select value={lexikonDictKind} onChange={(e) => setLexikonDictKind(e.target.value)} className="bg-black/50 border border-cyan-800/60 rounded-xl px-3 py-2 text-white text-sm outline-none max-w-[min(100%,220px)]">
                                      <option value="tr-es-de">Traducción: ES → DE</option>
                                      <option value="tr-de-es">Traducción: DE → ES</option>
                                      <option value="wiki-de">Solo Wiktionary (alemán)</option>
                                      <option value="wiki-es">Solo Wiktionary (español)</option>
                                  </select>
                                  <button type="button" disabled={lexikonDictLoading} onClick={runLexikonDictionarySearch} className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 font-bold text-sm disabled:opacity-50">{lexikonDictLoading ? '⬦' : 'Buscar'}</button>
                              </div>
                              {lexikonResults && lexikonResults.dictTranslate && !lexikonResults.error ? (
                                  <div className="rounded-xl bg-cyan-950/40 border border-cyan-600/25 p-4 space-y-2">
                                      <p className="text-white text-base md:text-lg"><span className="text-gray-400 font-bold text-xs uppercase mr-2">Entrada</span><strong>{lexikonResults.query}</strong></p>
                                      <p className="text-cyan-100 text-lg md:text-2xl font-bold leading-snug">{lexikonResults.out || '—'}</p>
                                      {lexikonResults.detected ? (
                                          <p className="text-[10px] text-gray-500">Idioma detectado (aprox.): {lexikonResults.detected} → {lexikonResults.tl === 'de' ? 'alemán' : 'español'}</p>
                                      ) : null}
                                      <div className="flex flex-wrap gap-2 pt-1">
                                          {lexikonResults.tl === 'de' && lexikonResults.out ? (
                                              <a href={`https://de.wiktionary.org/wiki/${encodeURIComponent((lexikonResults.out.split(/[\s,.;]+/)[0] || '').replace(/^[\s"'«»]+|[\s"'»]+$/g, ''))}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline">Wiktionary DE (1.ª palabra del resultado)</a>
                                          ) : null}
                                          <button type="button" onClick={() => { setLexikonTransText(lexikonSearch); setLexikonTransTarget(lexikonDictKind === 'tr-es-de' ? 'de' : 'es'); setLexikonTransOut(''); }} className="text-[10px] font-bold text-amber-300 hover:text-white">Copiar a traductor abajo</button>
                                      </div>
                                  </div>
                              ) : lexikonResults && !lexikonResults.error && (lexikonResults.titles || []).length > 0 ? (
                                  <ul className="space-y-2 text-sm">
                                      {(lexikonResults.titles || []).map((t, i) => (
                                          <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-white/5 pb-2">
                                              <span className="text-white font-bold">{t}</span>
                                              <div className="flex gap-2 flex-wrap">
                                                  {lexikonResults.urls && lexikonResults.urls[i] ? (
                                                      <a href={lexikonResults.urls[i]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline">Abrir entrada</a>
                                                  ) : null}
                                                  <button type="button" onClick={() => { setLexikonTransText(t); setLexikonTransOut(''); }} className="text-[10px] font-bold text-amber-300 hover:text-white">→ Traductor</button>
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                              ) : lexikonResults && !lexikonResults.error && !lexikonResults.dictTranslate ? (
                                  <p className="text-gray-500 text-sm">Sin resultados. Prueba otra grafía.</p>
                              ) : null}
                          </div>

                          <div className="rounded-2xl border border-indigo-700/40 bg-slate-900/80 p-4 md:p-6 mb-6 shadow-xl">
                              <h2 className="text-lg font-black text-indigo-200 mb-3 flex items-center gap-2"><Icon name="languages" className="w-5 h-5" /> Traductor (DE ↔ ES)</h2>
                              <p className="text-[11px] text-gray-500 mb-2">Elige el idioma de <strong className="text-gray-300">salida</strong>; el origen se detecta solo (evita que una palabra española se traduzca mal por empate DE/ES).</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                  <button type="button" onClick={() => setLexikonTransTarget('de')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${lexikonTransTarget === 'de' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>→ Alemán</button>
                                  <button type="button" onClick={() => setLexikonTransTarget('es')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${lexikonTransTarget === 'es' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>→ Español</button>
                              </div>
                              <textarea value={lexikonTransText} onChange={(e) => setLexikonTransText(e.target.value)} placeholder="Frase o palabra (cualquier registro)⬦" className="w-full min-h-[100px] bg-black/50 border border-indigo-800/60 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500 mb-3" />
                              <button type="button" disabled={lexikonTransLoading} onClick={runLexikonTranslate} className="mb-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm disabled:opacity-50">{lexikonTransLoading ? 'Traduciendo⬦' : 'Traducir'}</button>
                              {lexikonTransOut ? (
                                  <div className="rounded-xl bg-indigo-950/50 border border-indigo-600/30 p-4 mb-4">
                                      <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Resultado</p>
                                      <p className="text-white text-lg md:text-xl leading-relaxed whitespace-pre-wrap">{lexikonTransOut}</p>
                                  </div>
                              ) : null}
                              <div className="border-t border-white/10 pt-4 space-y-3">
                                  <p className="text-[10px] font-bold text-amber-300 uppercase">Guardar par en lección (Vocab)</p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                      <select value={lexikonSaveLessonId} onChange={(e) => setLexikonSaveLessonId(e.target.value)} className="bg-black/60 border border-amber-800/60 text-white text-sm rounded-lg px-3 py-2 outline-none flex-1 min-w-[180px]">
                                          <option value="">— Elige lección —</option>
                                          <option value="__new__">+ Nueva lección⬦</option>
                                          {customVocabLessons.map((l) => (
                                              <option key={l.id} value={l.id}>{l.title} ({l.words?.length || 0} pal.)</option>
                                          ))}
                                      </select>
                                      {lexikonSaveLessonId === '__new__' ? (
                                          <input type="text" value={lexikonNewLessonTitle} onChange={(e) => setLexikonNewLessonTitle(e.target.value)} placeholder="Título nueva lección" className="bg-black/50 border border-amber-800/60 rounded-lg px-3 py-2 text-white text-sm flex-1 min-w-[140px]" />
                                      ) : null}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <label className="flex-1 min-w-[120px] text-[10px] text-gray-500 block">Alemán<input type="text" value={lexikonPairDe} onChange={(e) => setLexikonPairDe(e.target.value)} className="mt-0.5 w-full bg-black/50 border border-emerald-800/50 rounded-lg px-2 py-1.5 text-sm text-emerald-100" placeholder="der Bahnhof⬦" /></label>
                                      <label className="flex-1 min-w-[120px] text-[10px] text-gray-500 block">Español<input type="text" value={lexikonPairEs} onChange={(e) => setLexikonPairEs(e.target.value)} className="mt-0.5 w-full bg-black/50 border border-sky-800/50 rounded-lg px-2 py-1.5 text-sm text-sky-100" placeholder="la estación⬦" /></label>
                                  </div>
                                  <button type="button" onClick={() => appendPairToCustomLesson(lexikonPairDe, lexikonPairEs)} className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 font-bold text-sm border border-amber-500/40">Guardar par DE / ES en la lección</button>
                                  <p className="text-[10px] text-gray-500">Usa el orden detectado (arriba) o traduce antes de guardar. Puedes abrir la lección en Vocab → Practicar.</p>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* PROGRESO (con botones de sincronización añadidos en barra) */}
                  {activeTab === 'progreso' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                              <div className="rounded-2xl border border-sky-500/35 bg-gradient-to-br from-sky-950/70 to-slate-900/80 p-4 md:p-5 shadow-xl">
                                  <h2 className="text-xs font-black text-sky-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="calendar" className="w-4 h-4" /> Plan de hoy</h2>
                                  <div className="grid gap-2">
                                      <button type="button" className="py-2 px-3 rounded-xl bg-blue-900/40 border border-blue-500/25 text-left text-xs hover:bg-blue-900/60 transition" onClick={() => { setActiveTab('historia'); setMode('dialogue'); stopAudio(); setPracticeActive(null); }}>1. Historia — escenas en voz alta o podcast</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-teal-900/40 border border-teal-500/25 text-left text-xs hover:bg-teal-900/60 transition" onClick={() => { setActiveTab('shadowing'); stopAudio(); setPracticeActive(null); }}>2. Shadowing — misma escena + pronunciación</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-amber-900/40 border border-amber-500/25 text-left text-xs hover:bg-amber-900/60 transition" onClick={() => { setActiveTab('vocabulario'); stopAudio(); setPracticeActive(null); }}>3. Vocab — tarjetas</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-purple-900/40 border border-purple-500/25 text-left text-xs hover:bg-purple-900/60 transition" onClick={() => { setActiveTab('entrenamiento'); stopAudio(); setPracticeActive(null); }}>4. Entrenamiento avanzado</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-rose-900/40 border border-rose-500/25 text-left text-xs hover:bg-rose-900/60 transition" onClick={() => { setActiveTab('escritura'); setWritingMode('dictation'); stopAudio(); setPracticeActive(null); }}>5. Escritura — dictado + OCR</button>
                                  </div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider pt-3 mb-2">Retos del día (+5 monedas, una vez al día)</p>
                                  <div className="flex flex-wrap gap-2">
                                      <button type="button" disabled={dailyChallenges.vocab} onClick={() => claimDailyStamp('vocab')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.vocab ? 'bg-gray-800 text-gray-500' : 'bg-amber-700 hover:bg-amber-600 text-white'}`}>{dailyChallenges.vocab ? '✓ Vocab' : 'He practicado vocab'}</button>
                                      <button type="button" disabled={dailyChallenges.shadow} onClick={() => claimDailyStamp('shadow')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.shadow ? 'bg-gray-800 text-gray-500' : 'bg-teal-700 hover:bg-teal-600 text-white'}`}>{dailyChallenges.shadow ? '✓ Shadow' : 'He hecho shadowing'}</button>
                                      <button type="button" disabled={dailyChallenges.write} onClick={() => claimDailyStamp('write')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.write ? 'bg-gray-800 text-gray-500' : 'bg-rose-700 hover:bg-rose-600 text-white'}`}>{dailyChallenges.write ? '✓ Escritura' : 'He escrito / OCR'}</button>
                                  </div>
                                  <button type="button" onClick={() => setTourStep(1)} className="w-full mt-3 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 font-bold text-xs border border-indigo-500/30">Iniciar tour guiado (5 pasos)</button>
                              </div>
                              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-yellow-950/20 p-4 md:p-5 shadow-xl">
                                  <h2 className="text-xs font-black text-amber-200 uppercase tracking-wider mb-3">Resumen rápido</h2>
                                  <div className="space-y-2 text-xs text-gray-300">
                                      <p><span className="text-white font-bold">Racha (honesta):</span> {userStats.streakDays} días</p>
                                      <p className="text-[10px] text-gray-500 leading-snug">Cuenta solo si hubo actividad mínima: ≥{MULLER_STREAK_MIN_VOCAB_RATINGS} tarjetas de vocab calificadas, o ≥{MULLER_STREAK_MIN_ACTIVITY_POINTS} puntos, o ≥{Math.round(MULLER_STREAK_MIN_ACTIVE_SEC / 60)} min con la app (timer).</p>
                                      <p><span className="text-white font-bold">Monedas:</span> {coinsUiLabel}</p>
                                      <p><span className="text-emerald-300 font-bold">SRS vocabulario:</span> {Object.keys(vocabSrsMap).length} tarjetas (este dispositivo)</p>
                                      <p><span className="text-white font-bold">Pronunciación:</span> {userStats.pronunciationAttempts || 0} intentos</p>
                                      <p><span className="text-white font-bold">Diktat:</span> {userStats.diktatCorrect || 0} / {userStats.diktatAttempts || 0}</p>
                                      <p className="text-[10px] text-gray-500 pt-1">Exporta PDF desde el botón de abajo.</p>
                                  </div>
                              </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                  <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-yellow-500"><Icon name="award" className="w-8 h-8 md:w-10 md:h-10" /> Dashboard Profesional B1</h1>
                                  <ExerciseHelpBtn helpId="progreso_dashboard" />
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={exportProgressPDF} className="bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition border border-gray-600 text-xs md:text-sm"><Icon name="file-down" className="w-4 h-4 md:w-5 md:h-5" /> Imprimir Resumen</button>
                              </div>
                          </div>
                          <div className="bg-gray-800/80 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-xl mb-6 md:mb-8">
                              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2"><Icon name="trending-up" className="w-5 h-5 md:w-6 md:h-6 text-green-400" /> Actividad Semanal</h2>
                              <p className="text-[10px] md:text-xs text-gray-500 mb-2">Basada en tus sesiones reales (vocab, diktat, práctica). Si un día está vacío, la barra es baja.</p>
                              <div className="flex items-end justify-between gap-1 md:gap-2 h-[120px] md:h-[200px] mt-4 pt-4 border-t border-gray-700 relative">
                                  {getWeeklyChartBars().map((val, i) => (
                                      <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                                          <div className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-400 relative shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{height: `${Math.max(val, 5)}%`}}>
                                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-blue-200 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">{val}%</span>
                                          </div>
                                          <span className="text-[8px] md:text-[10px] text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-tighter whitespace-nowrap hidden md:block">{getLast7Days()[i]}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          {mullerProgresoSnapshot && (
                              <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 p-4 md:p-6 rounded-2xl border border-purple-700/50 shadow-xl mb-6 md:mb-8">
                                  <h2 className="text-base md:text-lg font-bold text-purple-200 mb-3 flex items-center gap-2"><Icon name="graduation-cap" className="w-5 h-5 md:w-6 md:h-6" /> Entrenamiento Müller (avanzado)</h2>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Intentos</span><span className="font-black text-white text-lg">{mullerProgresoSnapshot.totalAttempts}</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Precisión</span><span className="font-black text-emerald-300 text-lg">{mullerProgresoSnapshot.accuracy}%</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Hoy</span><span className="font-black text-cyan-300 text-lg">{mullerProgresoSnapshot.todayAttempts}/{mullerProgresoSnapshot.dailyGoal}</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Racha</span><span className="font-black text-orange-300 text-lg">{mullerProgresoSnapshot.streakDays} d</span></div>
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-3">Abre la pestaña Entrenamiento para practicar artículos, verbos y preposiciones.</p>
                              </div>
                          )}
                          <p className="text-xs text-emerald-200/90 mb-4 flex flex-wrap items-center gap-2"><Icon name="timer" className="w-4 h-4" /> Repaso espaciado (SRS): <strong>{Object.keys(vocabSrsMap).length}</strong> palabras con fecha de repaso · se ordenan solas al abrir una lección. Solo en este navegador.</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-red-900/50 flex flex-col relative group">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-red-500"><Icon name="target" className="w-5 h-5 md:w-6 md:h-6" /> Vocab. Difícil</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.difficultVocab || userStats.difficultVocab.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vacío.</p> : 
                                       userStats.difficultVocab.map((v, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-red-900/30 text-xs md:text-sm flex justify-between"><span className="text-red-400 font-bold text-xs md:text-sm">{v.de}</span><span className="text-gray-400 text-right w-1/2 truncate text-xs md:text-sm">{v.es}</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('diff')} className="flex-1 bg-red-600 hover:bg-red-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('vocab_diff')} className="bg-red-900 hover:bg-red-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-blue-900/50 flex flex-col">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-blue-400"><Icon name="book-open" className="w-5 h-5 md:w-6 md:h-6" /> Vocab. Normal</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.normalVocab || userStats.normalVocab.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vacío.</p> : 
                                       userStats.normalVocab.map((v, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-blue-900/30 text-xs md:text-sm flex justify-between"><span className="text-blue-300 font-bold text-xs md:text-sm">{v.de}</span><span className="text-gray-400 text-right w-1/2 truncate text-xs md:text-sm">{v.es}</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('norm')} className="flex-1 bg-blue-600 hover:bg-blue-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('vocab_norm')} className="bg-blue-900 hover:bg-blue-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-cyan-900/50 flex flex-col">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-cyan-400"><Icon name="brain" className="w-5 h-5 md:w-6 md:h-6" /> Gramática</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.difficultGrammar || userStats.difficultGrammar.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vacío.</p> : 
                                       userStats.difficultGrammar.map((g, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-cyan-900/30 text-xs flex flex-col"><span className="text-cyan-400 font-bold text-xs md:text-sm mb-0.5 md:mb-1">{g.base}</span><span className="text-gray-400 truncate text-[10px] md:text-xs">"{g.exampleDe}"</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('grammar')} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('grammar')} className="bg-cyan-900 hover:bg-cyan-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* BIBLIOTECA (con checkboxes para mezcla) */}
                  {activeTab === 'guiones' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 md:gap-8 min-h-full animate-in fade-in">
                          <div className="flex-[2] bg-gray-800/50 p-4 md:p-6 rounded-2xl border border-gray-700 flex flex-col max-h-full overflow-y-auto hide-scrollbar">
                              <div className="bg-purple-900/30 border border-purple-500/50 p-4 md:p-5 rounded-xl mb-4 md:mb-6">
                                  <h3 className="text-purple-300 font-bold flex items-center gap-2 mb-2 text-sm md:text-base"><Icon name="sparkles" className="w-4 h-4 md:w-5 md:h-5" /> Instrucciones para la IA (ChatGPT/Gemini)</h3>
                                  <p className="text-xs md:text-sm text-gray-300 mb-3">Copia este prompt en tu IA favorita para que te genere diálogos perfectos y compatibles con el Entrenador Müller.</p>
                                  <div className="bg-black/60 p-2 md:p-3 rounded-lg flex items-start gap-2 border border-purple-800/50 relative group">
       <p className="text-[10px] md:text-xs font-mono text-purple-200 select-all pr-6 md:pr-8">
    "Eres un profesor de alemán experto en TELC B1. Genera un diálogo EXTENSO (sin límite de líneas) sobre [TEMA]. IMPORTANTE: marca los Redemittel clave solo con [R] al final de la línea alemana. No uses la palabra Nützlich ni símbolos raros.<br/><br/>Formato: Nombre: Frase en alemán. (Traducción) [palabra - traducción] [R]"
</p>
<button 
    className="absolute top-1 right-1 text-gray-400 hover:text-white bg-gray-800 p-1 rounded-md opacity-0 group-hover:opacity-100 transition" 
    onClick={() => navigator.clipboard.writeText(`Eres un profesor de alemán experto en TELC B1. Genera un diálogo EXTENSO (sin límite de líneas) sobre [TEMA]. IMPORTANTE: marca los Redemittel clave solo con [R] al final de la línea alemana. No uses la palabra Nützlich ni símbolos raros.\n\nFormato: Nombre: Frase en alemán. (Traducción) [palabra - traducción] [R]`)}
>
    <Icon name="copy" className="w-3 h-3 md:w-4 md:h-4" />
</button>
                                  </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
                              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-purple-400"><Icon name="edit-3" className="w-5 h-5 md:w-6 md:h-6" /> Añadir Guion Copiado</h2>
                              <ExerciseHelpBtn helpId="guiones_import" compact />
                          </div>
                              <input type="text" placeholder="Ej: Lektion 17: Die Reise..." className="w-full bg-black/50 border border-gray-600 p-2 md:p-3 rounded-lg text-white mb-3 md:mb-4 outline-none focus:border-purple-500 text-sm md:text-base" value={newScriptTitle} onChange={(e) => setNewScriptTitle(e.target.value)} />
                              <textarea className="w-full flex-1 min-h-[120px] md:min-h-[150px] bg-black/50 border border-gray-600 p-3 md:p-4 rounded-lg text-white font-mono text-xs md:text-sm mb-3 md:mb-4 outline-none focus:border-purple-500 resize-none" placeholder="Pega aquí el resultado de la IA..." value={scriptInput} onChange={(e) => setScriptInput(e.target.value)} />
                              <button onClick={handleSaveScript} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 md:py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg text-sm md:text-base"><Icon name="save" className="w-4 h-4 md:w-5 md:h-5" /> Guardar y Estudiar</button>

                              <div className="mt-6 md:mt-8 border-t border-gray-600/80 pt-5 md:pt-6">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                      <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-emerald-300"><Icon name="layout-grid" className="w-5 h-5 md:w-6 md:h-6" /> Distribuir texto → B1 / B2</h2>
                                      <ExerciseHelpBtn helpId="guiones_bx_distrib" compact />
                                  </div>
                                  <p className="text-[11px] md:text-xs text-gray-400 mb-3 leading-relaxed">Pega un guion (<code className="text-gray-300">Nombre:</code> ⬦), listas <code className="text-gray-300">alemán - español</code> o líneas sueltas. La app clasifica cada trozo en <strong className="text-gray-200">vocabulario, verbos, preposiciones, conectores o Redemittel</strong> y, con <strong className="text-gray-200">nivel automático</strong>, estima si va a B1 o B2 (heurística local, no IA). Si el cuadro está vacío, se usa el texto del guion de arriba. Tus aportaciones se guardan en el navegador y se <strong className="text-gray-200">mezclan</strong> con las tarjetas del archivo <code className="text-gray-300">b1-b2-database.json</code> (esas no se borran con el botón rojo).</p>
                                  <p className="text-[10px] md:text-xs text-indigo-300/90 mb-3 leading-relaxed bg-indigo-950/25 border border-indigo-500/20 rounded-lg px-3 py-2">Si en <strong className="text-white">Historia</strong> tenías cargado un guion <strong className="text-white">guardado en esta lista</strong>, al pulsar Distribuir las frases quedan <strong className="text-white">vinculadas a ese guion</strong>. Al borrar el guion con la papelera, te preguntamos si quieres quitar también esas tarjetas en B1/B2. Lo que enviaste con el ejemplo por defecto o sin guion cargado no se vincula (úsalo «Borrar mis aportaciones» para vaciar todo lo tuyo).</p>
                                  <textarea className="w-full min-h-[100px] md:min-h-[120px] bg-black/50 border border-emerald-800/60 p-3 rounded-lg text-white font-mono text-xs md:text-sm mb-3 outline-none focus:border-emerald-500 resize-none" placeholder="Pega aquí o déjalo vacío para usar el cuadro del guion de arriba⬦" value={bxImportText} onChange={(e) => setBxImportText(e.target.value)} />
                                  <div className="flex flex-wrap gap-2 mb-3">
                                      <button type="button" onClick={() => handleBxDistribToLevels('auto')} className="flex-1 min-w-[200px] bg-gradient-to-r from-emerald-700 to-sky-700 hover:opacity-95 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm shadow-lg">→ Nivel automático (B1 o B2 por frase)</button>
                                      <button type="button" onClick={() => handleBxDistribToLevels('b1')} className="flex-1 min-w-[120px] bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm">→ Todo a B1</button>
                                      <button type="button" onClick={() => handleBxDistribToLevels('b2')} className="flex-1 min-w-[120px] bg-sky-800 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm">→ Todo a B2</button>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                      <button type="button" onClick={clearBxUserOverlay} className="text-xs md:text-sm text-red-400 hover:text-red-300 underline">Borrar mis aportaciones B1/B2</button>
                                      {bxImportSummary ? <p className="text-[10px] md:text-xs text-emerald-200/90 flex-1 text-right">{bxImportSummary}</p> : null}
                                  </div>
                              </div>
                          </div>
                          <div className="w-full md:w-1/3 flex flex-col gap-4 max-h-[600px] md:max-h-full">
                              <div className="bg-gray-900 p-4 md:p-5 rounded-2xl border border-gray-800 flex flex-col shrink-0 h-1/3 min-h-[180px] md:min-h-[200px]">
                                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2 text-gray-200"><Icon name="file-text" className="w-5 h-5 md:w-6 md:h-6" /> Tus Guiones</h2>
                                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                                      {savedScripts.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">No hay guiones guardados.</p> : null}
                                      {savedScripts.map(script => (
                                          <div key={script.id} className="bg-black/40 p-3 md:p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition flex justify-between items-center group">
                                              <div onClick={() => loadSavedScript(script)} className="flex-1">
                                                  <p className="font-bold text-white group-hover:text-purple-400 truncate text-sm md:text-base">{script.title}</p>
                                                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">Click para cargar</p>
                                              </div>
                                              <button type="button" title="Eliminar guion" onClick={(e) => deleteSavedScript(e, script)} className="text-gray-500 hover:text-red-500 p-1 md:p-2 shrink-0 rounded-lg hover:bg-red-950/40"><Icon name="trash-2" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="bg-amber-900/20 p-4 md:p-5 rounded-2xl border border-amber-800/50 flex flex-col flex-1 min-h-0">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                      <h2 className="text-lg md:text-xl font-bold text-amber-400 flex items-center gap-2"><Icon name="library" className="w-5 h-5 md:w-6 md:h-6" /> Añadir Vocabulario</h2>
                                      <ExerciseHelpBtn helpId="guiones_vocab_custom" compact />
                                  </div>
                                  <div className="bg-black/40 p-2 md:p-3 rounded-xl border border-amber-900/50 mb-3 md:mb-4 flex flex-col gap-2 shrink-0">
                                      <div className="flex gap-2 items-center">
                                          <input type="text" placeholder="Título (Ej: Lektion 12)" className="w-2/3 bg-black/50 border border-amber-800 p-1.5 md:p-2 rounded-lg text-white text-xs md:text-sm outline-none focus:border-amber-500" value={vocabTitleInput} onChange={(e) => setVocabTitleInput(e.target.value)} />
                                          <button onClick={handleSaveCustomVocab} className="w-1/3 bg-amber-600 hover:bg-amber-500 text-white py-1.5 md:py-2 rounded-lg font-bold text-xs transition shadow-lg flex justify-center items-center gap-1"><Icon name="save" className="w-3 h-3 md:w-4 md:h-4" /> Guardar</button>
                                      </div>
                                      <p className="text-[10px] text-amber-700/90 mb-1">Paquetes de ejemplo en el repo: <code className="text-amber-200">vocab-packs/reise-mini.json</code> — abre el archivo, copia las líneas <code className="text-amber-200">de/es</code> o pega una lista: <code className="text-amber-200">der Bahnhof - la estación</code> por línea.</p>
                                  <textarea className="w-full h-12 md:h-14 bg-black/50 border border-amber-800 p-2 rounded-lg text-white font-mono text-[10px] md:text-xs outline-none focus:border-amber-500 resize-none" placeholder="Pega aquí tu lista...&#10;der Apfel - la manzana" value={vocabTextInput} onChange={(e) => setVocabTextInput(e.target.value)} />
                                  </div>
                                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                                      {customVocabLessons.length === 0 ? <p className="text-gray-500 text-xs italic">Tus lecciones guardadas aparecerán aquí.</p> : null}
                                      {customVocabLessons.map(lesson => (
                                          <div key={lesson.id} className="bg-black/40 p-2 md:p-3 rounded-lg border border-amber-900/50 hover:border-amber-500 transition flex flex-col gap-2 md:gap-3 group">
                                              <div className="flex-1">
                                                  <p className="font-bold text-amber-100 text-xs md:text-sm truncate">{lesson.title}</p>
                                                  <p className="text-[10px] text-amber-600 mt-0.5">{lesson.words.length} palabras</p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                  <button onClick={(e) => { e.stopPropagation(); let practiceList = [...lesson.words]; practiceList.sort(() => Math.random() - 0.5); let diffWords = lesson.words.filter(w => w.diff === 1); if(diffWords.length > 0) { let extraShuffled = [...diffWords].sort(() => Math.random() - 0.5); practiceList = [...practiceList, ...extraShuffled]; } setCurrentVocabList(mullerSortVocabBySrs(practiceList, mullerGetVocabSrsMap())); setActiveScriptTitle(lesson.title); setVocabReviewIndex(0); setShowVocabTranslation(false); setActiveTab('vocabulario'); }} className="bg-amber-600 hover:bg-amber-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold shadow-lg flex-1 flex justify-center items-center gap-1 md:gap-2 transition"><Icon name="play" className="w-3 h-3 md:w-4 md:h-4" /> Practicar</button>
                                                  <button onClick={(e) => { e.stopPropagation(); const newLessons = customVocabLessons.filter(l => l.id !== lesson.id); setCustomVocabLessons(newLessons); localStorage.setItem('mullerCustomVocab', JSON.stringify(newLessons)); }} className="text-gray-500 hover:text-red-500 bg-gray-900 p-1 rounded-lg border border-gray-700 transition"><Icon name="trash-2" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  <button onClick={() => {
                                      if (customVocabLessons.length === 0) { alert("No hay lecciones guardadas."); return; }
                                      const init = {};
                                      customVocabLessons.forEach((l) => { init[l.id] = true; });
                                      setMixLessonSelection(init);
                                      setShowVocabMixModal(true);
                                  }} className="mt-3 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                      <Icon name="shuffle" className="w-4 h-4" /> Practicar mezcla seleccionada
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* VOCABULARIO (con botón de escritura a mano) */}
                  {activeTab === 'vocabulario' && !practiceActive && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in relative">
                          <div className="absolute top-3 right-3 md:top-6 md:right-8 z-10 flex flex-col items-end gap-2"><ExerciseHelpBtn helpId="vocab_active_recall" />
                              <label className="flex items-center gap-2 text-[10px] font-bold text-amber-900/80 bg-white/20 px-2 py-1 rounded-lg border border-amber-900/20 cursor-pointer"><input type="checkbox" className="accent-amber-600" checked={vocabDueFilterOnly} onChange={(e) => { setVocabDueFilterOnly(e.target.checked); setVocabReviewIndex(0); }} /> Solo vencidas / nuevas hoy</label>
                          </div>
                          <h1 className="absolute top-4 md:top-8 text-lg md:text-2xl font-black text-amber-900/40 uppercase tracking-widest hidden md:block">Active Recall - {activeScriptTitle}</h1>
                          {vocabSrsDueCount > 0 ? (
                              <p className="absolute top-12 md:top-[4.25rem] left-1/2 -translate-x-1/2 max-w-lg text-center text-[10px] md:text-xs text-amber-900/70 font-bold px-3 hidden md:block">SRS: {vocabSrsDueCount} tarjetas prioritarias en esta lista (nuevas o tocadas hoy)</p>
                          ) : null}
                          <div className="w-full max-w-md mb-4 mt-10 md:mt-6 px-3">
                              <p className="text-[10px] font-bold text-amber-900/60 uppercase mb-1">Objetivo diario (tarjetas calificadas)</p>
                              <div className="flex items-center gap-2">
                                  <input type="range" min="3" max="60" step="1" value={mainDailyGoal} onChange={(e) => { const n = parseInt(e.target.value, 10); setMainDailyGoal(n); try { localStorage.setItem(MULLER_MAIN_GOAL_KEY, String(n)); } catch (err) {} }} className="flex-1 accent-amber-600" />
                                  <span className="text-xs font-mono font-bold text-amber-950 w-8">{mainDailyGoal}</span>
                              </div>
                              <div className="h-2 rounded-full bg-black/20 mt-2 overflow-hidden border border-amber-900/20">
                                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min(100, (mullerGetStreakTodayStats().vocabRated / Math.max(1, mainDailyGoal)) * 100)}%` }} />
                              </div>
                              <p className="text-[9px] text-amber-900/50 mt-1">Hoy: {mullerGetStreakTodayStats().vocabRated || 0}/{mainDailyGoal} · al completar el objetivo +10 monedas (una vez al día)</p>
                          </div>
                          {vocabDisplayList.length === 0 ? (
                              <div className="text-center text-amber-900/60 font-bold text-base md:text-2xl">{vocabDueFilterOnly ? 'No hay tarjetas vencidas en esta lista.' : 'Este guion no tiene vocabulario configurado.'}</div>
                          ) : (
                              <div className="max-w-2xl w-full flex flex-col items-center gap-6 md:gap-10">
                                  <button onClick={playVocabAudio} className="bg-white/20 hover:bg-white/30 text-amber-950 p-3 md:p-4 rounded-full transition shadow-lg mb-2 md:mb-4"><Icon name="volume-2" className="w-8 h-8 md:w-10 md:h-10" /></button>
                                  <h1 className="text-4xl md:text-8xl font-black text-slate-900 text-center drop-shadow-md flex items-center justify-center flex-wrap gap-1">{getArticleVisual(vocabDisplayList[vocabReviewIndex].de)}{vocabDisplayList[vocabReviewIndex].de}</h1>
                                  {!showVocabTranslation ? (
                                      <div className="flex gap-4">
                                          <button onClick={() => setShowVocabTranslation(true)} className="mt-6 md:mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 md:px-10 py-3 md:py-5 rounded-2xl font-bold text-2xl md:text-3xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition transform hover:scale-105 border-b-4 border-slate-700">Revelar 👀</button>
                                          <button onClick={() => setShowHandwriting(true)} className="mt-6 md:mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-6 md:px-8 py-3 md:py-5 rounded-2xl font-bold text-xl md:text-2xl shadow-lg transition transform hover:scale-105 border-b-4 border-indigo-800 flex items-center gap-2"><Icon name="edit" className="w-6 h-6" /> Escribir a mano</button>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center gap-6 md:gap-8 w-full animate-in slide-in-from-bottom-8">
                                          <h2 className="text-2xl md:text-5xl font-bold text-slate-800 text-center bg-white/60 px-4 md:px-10 py-3 md:py-6 rounded-2xl md:rounded-3xl shadow-inner border border-white/40 w-full">{vocabDisplayList[vocabReviewIndex].es}</h2>
                                          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
                                              <button onClick={() => handleVocabDifficulty('easy')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg transition">Fácil (Descartar)</button>
                                              <button onClick={() => handleVocabDifficulty('normal')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg transition">Normal</button>
                                              <button onClick={() => handleVocabDifficulty('hard')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg border-2 border-red-400 transition">Difícil</button>
                                          </div>
                                          <p className="text-[10px] md:text-xs text-slate-800/80 text-center max-w-md leading-snug">Cada opción actualiza el calendario SRS (intervalos tipo Anki/SM-2): más espacio si fue fácil, repaso antes si fue difícil.</p>
                                      </div>
                                  )}
                                  <p className="text-amber-900/60 font-bold mt-4 md:mt-8 bg-white/20 px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-amber-900/20 text-xs md:text-sm">Palabra {vocabReviewIndex + 1} de {vocabDisplayList.length}</p>
                                  {(() => {
                                      const w = vocabDisplayList[vocabReviewIndex];
                                      if (!w) return null;
                                      const s = vocabSrsMap[mullerVocabSrsKey(w)];
                                      const vc = s && typeof s.viewCount === 'number' ? s.viewCount : 0;
                                      const rc = s && typeof s.ratedCount === 'number' ? s.ratedCount : 0;
                                      return (
                                          <div className="text-[10px] text-amber-900/70 -mt-2 text-center max-w-lg space-y-0.5">
                                              {s && s.due ? <p>Próximo repaso: <strong className="text-amber-950">{s.due}</strong> · intervalo {s.interval} d · EF {typeof s.easeFactor === 'number' ? s.easeFactor.toFixed(2) : '—'}</p> : <p className="text-amber-900/50">Sin calificar aún en SRS</p>}
                                              <p>Vistas: <strong>{vc}</strong> · Calificaciones: <strong>{rc}</strong></p>
                                          </div>
                                      );
                                  })()}
                              </div>
                          )}
                          {showHandwriting && <HandwritingPad onClose={() => setShowHandwriting(false)} />}
                      </div>
                  )}

                  {activeTab === 'shadowing' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black text-teal-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="audio-lines" className="w-8 h-8 md:w-10 md:h-10" /> Shadowing
                              </h1>
                              <ExerciseHelpBtn helpId="shadowing_main" />
                          </div>
                          <p className="text-teal-50/90 text-sm md:text-base mb-6 leading-relaxed">
                              Escucha el modelo en alemán (voz del sistema), luego repite en voz alta siguiendo el ritmo y la entonación. Es la técnica de <strong className="text-white">shadowing</strong> para ganar fluidez y pronunciación tipo TELC.
                          </p>
                          {guionData.length === 0 ? (
                              <p className="text-gray-400 text-center py-12">No hay guion cargado. Abre <strong>Biblioteca</strong> y carga un guion.</p>
                          ) : (
                              <>
                                  {(() => {
                                      const si = Math.min(Math.max(0, sceneIndex), guionData.length - 1);
                                      const scene = guionData[si];
                                      const playModel = () => {
                                          if (!scene?.text) return;
                                          window.speechSynthesis.cancel();
                                          const u = new SpeechSynthesisUtterance(sanitizeHistoriaSpeechText(scene.text));
                                          u.lang = 'de-DE';
                                          u.rate = Math.min(1.15, Math.max(0.65, shadowRate));
                                          window.__mullerApplyPreferredDeVoice(u);
                                          window.speechSynthesis.speak(u);
                                      };
                                      return (
                                          <>
                                              <div className="bg-black/45 border border-teal-500/35 rounded-2xl p-4 md:p-6 mb-4 shadow-inner">
                                                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2">Escena {si + 1} / {guionData.length} · {scene?.speaker || '—'}</p>
                                                  {shadowShowText ? (
                                                      <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">{scene?.text}</p>
                                                  ) : (
                                                      <p className="text-gray-500 italic text-lg">Texto oculto — escucha el modelo y repite de memoria (shadowing ciego).</p>
                                                  )}
                                                  {shadowShowText && scene?.translation && (
                                                      <p className="text-gray-400 mt-3 text-sm italic border-t border-white/10 pt-3">({scene.translation})</p>
                                                  )}
                                              </div>
                                              <div className="flex flex-wrap gap-2 mb-4 items-center">
                                                  <span className="text-xs text-gray-400 w-full sm:w-auto">Velocidad del modelo:</span>
                                                  {[0.75, 0.88, 1].map((r) => (
                                                      <button key={r} type="button" onClick={() => setShadowRate(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${shadowRate === r ? 'bg-teal-600 text-white ring-1 ring-white/25' : 'bg-gray-800/90 text-gray-300 hover:bg-gray-700'}`}>{r === 0.75 ? 'Lenta' : r === 0.88 ? 'Media' : 'Normal'}</button>
                                                  ))}
                                                  <button type="button" onClick={() => setShadowShowText(!shadowShowText)} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-800 text-amber-100 border border-amber-700/40 hover:bg-gray-700">{shadowShowText ? 'Ocultar texto' : 'Mostrar texto'}</button>
                                              </div>
                                              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                  <button type="button" onClick={playModel} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg transition">
                                                      <Icon name="volume-2" className="w-5 h-5" /> Escuchar modelo
                                                  </button>
                                                  <button type="button" onClick={playModel} className="flex-1 bg-teal-900/85 hover:bg-teal-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-teal-500/30 transition">
                                                      <Icon name="repeat" className="w-5 h-5" /> Repetir audio
                                                  </button>
                                              </div>
                                              <p className="text-center text-gray-500 text-xs mb-4">Después de escuchar: habla al mismo tiempo o justo después; prioriza fluidez, no perfección.</p>
                                              <div className="rounded-2xl border border-teal-500/30 bg-black/35 p-4 md:p-5 mb-5">
                                                  <p className="text-xs font-bold text-teal-300 mb-1 flex items-center gap-2"><Icon name="mic" className="w-4 h-4" /> Comprobar pronunciación</p>
                                                  <p className="text-[10px] text-gray-500 mb-3">El navegador transcribe tu alemán y lo compara con el texto del guion (sin juzgar acento puro). Mantén pulsado el micrófono mientras lees la frase; suelta para ver el resultado. <span className="text-teal-400/90">En Shadowing no pierdes vidas.</span></p>
                                                  <div className="flex flex-col items-center gap-3">
                                                      <button type="button" aria-label="Mantén pulsado y lee en voz alta para comprobar pronunciación" onMouseDown={micMouseDownGuard(() => scene?.text && handleVoiceStart(scene.text, { mode: 'shadow' }))} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => scene?.text && handleVoiceStart(scene.text, { mode: 'shadow' }))} onTouchEnd={handleVoiceStop} className={`rounded-full p-5 md:p-6 text-white transition shadow-xl select-none touch-manipulation ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-400/35 shadow-[0_0_32px_rgba(239,68,68,0.55)] border-2 border-white/35' : 'muller-mic-hold-btn ring-4 ring-teal-300/35 shadow-[0_0_28px_rgba(20,184,166,0.45)]'}`} title="Mantén pulsado y lee en voz alta">
                                                          <Icon name="mic" className="w-10 h-10 md:w-12 md:h-12 text-white relative z-[1]" />
                                                      </button>
                                                      <span className="text-[10px] text-gray-500">Mantén pulsado · suelta para evaluar</span>
                                                      {grammarPolizeiMsg && (
                                                          <p className="text-amber-200/90 text-xs text-center bg-amber-950/40 border border-amber-700/30 rounded-lg px-3 py-2 w-full">{grammarPolizeiMsg}</p>
                                                      )}
                                                      {spokenText && (
                                                          <div className="w-full text-center mt-1">
                                                              <p className="text-yellow-200/95 font-mono text-sm md:text-base mb-2 break-words">"{spokenText}"</p>
                                                              {pronunciationFeedback.length > 0 && (
                                                                  <div className="flex flex-wrap gap-1 justify-center my-2 bg-black/40 p-2 rounded-xl border border-white/10">
                                                                      {pronunciationFeedback.map((item, idx) => (
                                                                          <span key={idx} className={`text-xs font-bold px-2 py-0.5 rounded ${item.correct ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/30' : 'bg-red-900/50 text-red-300 border border-red-600/30'}`}>{item.word}</span>
                                                                      ))}
                                                                  </div>
                                                              )}
                                                              {pronunciationScore !== null && (
                                                                  <div className="flex items-center justify-center gap-2 mt-2">
                                                                      <div className="flex-1 max-w-xs bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                                                          <div className={`h-full rounded-full transition-all duration-700 ${pronunciationScore >= 85 ? 'bg-emerald-500' : pronunciationScore >= 55 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${pronunciationScore}%` }} />
                                                                      </div>
                                                                      <span className="font-black text-white text-sm md:text-lg tabular-nums">{pronunciationScore}%</span>
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] text-gray-500 mt-2">&gt;85%: verde · 55–84%: mejorable · &lt;55%: repite tras escuchar el modelo</p>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="flex gap-3 justify-center flex-wrap">
                                                  <button type="button" disabled={si <= 0} onClick={() => setSceneIndex((s) => Math.max(0, s - 1))} className="muller-icon-nav inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10"><Icon name="chevron-left" className="w-5 h-5 text-white" /> Anterior</button>
                                                  <button type="button" disabled={si >= guionData.length - 1} onClick={() => setSceneIndex((s) => Math.min(guionData.length - 1, s + 1))} className="muller-icon-nav inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10">Siguiente <Icon name="chevron-right" className="w-5 h-5 text-white" /></button>
                                              </div>
                                          </>
                                      );
                                  })()}
                              </>
                          )}
                      </div>
                  )}

                  {activeTab === 'lectura' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black text-sky-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="mic" className="w-8 h-8 md:w-10 md:h-10" /> Lectura en voz alta
                              </h1>
                          </div>
                          <p className="text-sky-50/90 text-sm md:text-base mb-4 leading-relaxed">
                              Lee un texto completo y compara tu producción con el original. Puedes usar la historia actual, un guion guardado o pegar un texto manualmente.
                              Toca cualquier palabra para ver traducción al español y, si es verbo, pasado y Perfekt.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                              <label className="text-xs font-bold text-sky-200/90 uppercase tracking-wider">
                                  Fuente
                                  <select value={readingSource} onChange={(e) => setReadingSource(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white normal-case">
                                      <option value="current_story">Historia actual</option>
                                      <option value="one_saved">Guion guardado</option>
                                      <option value="paste">Texto pegado</option>
                                  </select>
                              </label>
                              {readingSource === 'one_saved' && (
                                  <label className="text-xs font-bold text-sky-200/90 uppercase tracking-wider md:col-span-2">
                                      Guion
                                      <select value={readingScriptId} onChange={(e) => setReadingScriptId(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white normal-case">
                                          <option value="__current__" disabled>Selecciona un guion⬦</option>
                                          {readingScriptOptions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                                      </select>
                                  </label>
                              )}
                          </div>
                          {readingSource === 'paste' && (
                              <textarea value={readingTextInput} onChange={(e) => setReadingTextInput(e.target.value)} placeholder="Pega aquí tu texto en alemán⬦" className="w-full h-40 bg-black/35 border border-sky-500/30 rounded-xl p-3 text-sm md:text-base text-white mb-3" />
                          )}

                          <div className="rounded-xl bg-black/35 border border-sky-500/25 p-3 mb-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                  <p className="text-[11px] text-sky-200/80">Texto objetivo</p>
                                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-sky-500/35 bg-sky-950/40 px-2 py-1">
                                      <button
                                          type="button"
                                          onClick={() => setReadingFocusMode((v) => !v)}
                                          className={`px-2 py-0.5 text-[10px] font-bold rounded border ${readingFocusMode ? 'border-emerald-300/70 text-emerald-100 bg-emerald-900/45' : 'border-sky-400/40 text-sky-100 hover:bg-sky-900/60'}`}
                                      >
                                          {readingFocusMode ? 'Modo lectura: ON' : 'Modo lectura'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx((v) => mullerClamp(v - MULLER_READING_FONT_STEP, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX))}
                                          className="px-2 py-0.5 text-xs font-black rounded bg-sky-900/70 hover:bg-sky-800 text-sky-100"
                                          aria-label="Reducir tamaño de texto"
                                      >
                                          A-
                                      </button>
                                      <span className="text-[10px] font-bold text-sky-200 tabular-nums">{readingFontPx}px</span>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx((v) => mullerClamp(v + MULLER_READING_FONT_STEP, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX))}
                                          className="px-2 py-0.5 text-xs font-black rounded bg-sky-900/70 hover:bg-sky-800 text-sky-100"
                                          aria-label="Aumentar tamaño de texto"
                                      >
                                          A+
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx(19)}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-sky-400/50 text-sky-100 hover:bg-sky-900/60"
                                      >
                                          Reset
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => readingSelectedWord && speakReadingWord(readingSelectedWord)}
                                          disabled={!readingSelectedWord || readingWordAudioBusy}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-cyan-400/55 text-cyan-100 hover:bg-cyan-900/50 disabled:opacity-40"
                                      >
                                          🔊 Palabra
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => speakReadingSentenceWithWord(readingSelectedWord)}
                                          disabled={(!readingSelectedWord && !readingSelectedSnippet) || readingWordAudioBusy}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-teal-400/55 text-teal-100 hover:bg-teal-900/50 disabled:opacity-40"
                                      >
                                          🔊 {readingSelectedSnippet ? 'Frase sel.' : 'Frase'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingSelectedSnippet('')}
                                          disabled={!readingSelectedSnippet}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-slate-400/45 text-slate-200 hover:bg-slate-800/70 disabled:opacity-35"
                                      >
                                          Limpiar frase
                                      </button>
                                  </div>
                              </div>
                          <p className="text-[11px] text-sky-200/80 mb-2">
                              Puedes seleccionar una frase con el dedo o ratón y usar 🔊 Frase para reproducir solo esa parte.
                          </p>
                          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/25 p-3 mb-3 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-[11px] font-black text-cyan-200 uppercase tracking-wider">PDF estudio (premium · MVP)</p>
                                  <span className="text-[10px] text-cyan-100/75">Texto por página + OCR fallback</span>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-400/35 bg-black/35 text-xs font-bold text-cyan-100 cursor-pointer">
                                      <input
                                          type="file"
                                          accept="application/pdf"
                                          className="hidden"
                                          onChange={(e) => {
                                              const f = e.target.files && e.target.files[0];
                                              if (f) loadPdfStudyFile(f);
                                              e.target.value = '';
                                          }}
                                      />
                                      {pdfStudyExtracting ? '⏳ Procesando PDF…' : '📄 Subir PDF'}
                                  </label>
                                  {pdfStudySavedDocs.length > 0 && (
                                      <>
                                          <select
                                              value="__none__"
                                              onChange={(e) => {
                                                  const id = e.target.value;
                                                  if (id && id !== '__none__') loadPdfStudyFromLibrary(id);
                                                  e.target.value = '__none__';
                                              }}
                                              className="bg-black/45 border border-cyan-500/35 rounded-lg px-2 py-2 text-xs text-white"
                                          >
                                              <option value="__none__">Biblioteca PDF⬦</option>
                                              {pdfStudySavedDocs.map((d) => (
                                                  <option key={d.id} value={d.id}>
                                                      {d.name} · {d.totalPages || 0}p
                                                  </option>
                                              ))}
                                          </select>
                                          <button
                                              type="button"
                                              onClick={() => {
                                                  if (!pdfStudyDoc || !pdfStudyDoc.id) return;
                                                  removePdfStudyFromLibrary(pdfStudyDoc.id);
                                              }}
                                              disabled={!pdfStudyDoc || !pdfStudyDoc.id}
                                              className="px-3 py-2 rounded-lg border border-orange-500/35 bg-orange-900/40 hover:bg-orange-800/50 disabled:opacity-45 text-xs font-bold text-orange-100"
                                          >
                                              Borrar guardado
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyLibrary}
                                              className="px-3 py-2 rounded-lg border border-amber-600/35 bg-amber-950/45 hover:bg-amber-900/55 text-xs font-bold text-amber-100"
                                          >
                                              Vaciar biblioteca
                                          </button>
                                      </>
                                  )}
                                  {pdfStudyDoc && (
                                      <>
                                          <select
                                              value={Math.max(1, (activePdfPageData.page || 1))}
                                              onChange={(e) => setPdfStudyPageIdx(Math.max(0, Number(e.target.value) - 1))}
                                              className="bg-black/45 border border-cyan-500/35 rounded-lg px-2 py-2 text-xs text-white"
                                          >
                                              {(pdfStudyDoc.pages || []).map((p) => (
                                                  <option key={p.page} value={p.page}>
                                                      Página {p.page}{p.unit ? ` · U:${p.unit}` : ''}{p.lesson ? ` · L:${p.lesson}` : ''}{p.ocrPending ? ' · OCR pendiente' : ''}
                                                  </option>
                                              ))}
                                          </select>
                                          <button
                                              type="button"
                                              onClick={() => runPdfPageOcr(activePdfPageData.page || 1)}
                                              disabled={pdfStudyOcrBusy || pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-amber-500/35 bg-amber-900/40 hover:bg-amber-800/50 disabled:opacity-45 text-xs font-bold text-amber-100"
                                          >
                                              {pdfStudyOcrBusy ? 'OCR⬦' : 'OCR página'}
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => applyPdfStudyTextToReading(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-emerald-500/35 bg-emerald-900/40 hover:bg-emerald-800/50 disabled:opacity-45 text-xs font-bold text-emerald-100"
                                          >
                                              Usar en Lectura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => applyPdfStudyTextToWriting(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-rose-500/35 bg-rose-900/40 hover:bg-rose-800/50 disabled:opacity-45 text-xs font-bold text-rose-100"
                                          >
                                              Usar en Escritura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => openPdfStudyFullscreen(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-indigo-500/35 bg-indigo-900/45 hover:bg-indigo-800/55 disabled:opacity-45 text-xs font-bold text-indigo-100"
                                          >
                                              Abrir PDF completo
                                          </button>
                                          <button
                                              type="button"
                                              onClick={saveCurrentPdfStudyDoc}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-sky-500/35 bg-sky-900/45 hover:bg-sky-800/55 disabled:opacity-45 text-xs font-bold text-sky-100"
                                          >
                                              Guardar PDF
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyDoc}
                                              disabled={pdfStudyExtracting || pdfStudyOcrBusy}
                                              className="px-3 py-2 rounded-lg border border-red-500/35 bg-red-900/45 hover:bg-red-800/55 disabled:opacity-45 text-xs font-bold text-red-100"
                                          >
                                              Quitar PDF
                                          </button>
                                      </>
                                  )}
                              </div>
                              {pdfStudyErr ? <p className="text-[11px] text-red-300">{pdfStudyErr}</p> : null}
                              {pdfStudyBusyMsg ? <p className="text-[11px] text-cyan-100/80">{pdfStudyBusyMsg}</p> : null}
                              {pdfStudyDoc && (
                                  <div className="text-[10px] text-cyan-100/80 space-y-1">
                                      <p><strong className="text-cyan-200">Libro:</strong> {pdfStudyDoc.name} · {pdfStudyDoc.totalPages} páginas</p>
                                      <p><strong className="text-cyan-200">Unidad:</strong> {activePdfPageData.unit || '—'} · <strong className="text-cyan-200">Lección:</strong> {activePdfPageData.lesson || '—'} · <strong className="text-cyan-200">Página:</strong> {activePdfPageData.page || '—'}</p>
                                      {pdfStudyLastApplied ? <p className="text-emerald-300/90">{pdfStudyLastApplied}</p> : null}
                                  </div>
                              )}
                              {pdfStudyDoc && activePdfPageData.page ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <label className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">
                                          Unidad (manual)
                                          <input
                                              value={activePdfPageData.unit || ''}
                                              onChange={(e) => updatePdfStudyPageMeta(activePdfPageData.page || 1, { unit: e.target.value })}
                                              placeholder="Ej: 3"
                                              className="mt-1 w-full bg-black/45 border border-cyan-500/30 rounded-lg px-2 py-1.5 text-xs text-white normal-case"
                                          />
                                      </label>
                                      <label className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">
                                          Lección (manual)
                                          <input
                                              value={activePdfPageData.lesson || ''}
                                              onChange={(e) => updatePdfStudyPageMeta(activePdfPageData.page || 1, { lesson: e.target.value })}
                                              placeholder="Ej: A"
                                              className="mt-1 w-full bg-black/45 border border-cyan-500/30 rounded-lg px-2 py-1.5 text-xs text-white normal-case"
                                          />
                                      </label>
                                  </div>
                              ) : null}
                              {pdfStudyDoc && (
                                  <textarea
                                      value={activePdfPageData.text || ''}
                                      readOnly
                                      className="w-full h-28 bg-black/35 border border-cyan-500/25 rounded-xl p-3 text-xs md:text-sm text-cyan-50"
                                      placeholder="Sin texto extraído en esta página todavía."
                                  />
                              )}
                          </div>
                              
                          {readingFocusMode && (
                                  <p className="text-[11px] text-emerald-200/90 mb-2">
                                      Modo lectura activo: se ocultan resultados de evaluación para concentrarte en comprensión + diccionario.
                                  </p>
                              )}
                              {readingTargetText ? (
                                  <div
                                      ref={readingTextSurfaceRef}
                                      className="text-white leading-relaxed whitespace-pre-wrap"
                                      onMouseUp={readingCaptureCurrentSelection}
                                      onTouchEnd={readingCaptureCurrentSelection}
                                      onKeyUp={readingCaptureCurrentSelection}
                                      style={{ fontSize: `${readingFontPx}px`, lineHeight: 1.65, userSelect: 'text', WebkitUserSelect: 'text' }}
                                  >
                                      {readingWordTokens.map((token, idx) => {
                                          if (!token.clickable) return <span key={`s-${idx}`}>{token.text}</span>;
                                          const isActive = token.word === readingSelectedWord;
                                          return (
                                              <span
                                                  key={`w-${idx}`}
                                                  role="button"
                                                  tabIndex={0}
                                                  className={`reading-word-token ${isActive ? 'is-active' : ''}`}
                                                  onClick={() => runReadingWordLookup(token.word)}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter' || e.key === ' ') {
                                                          e.preventDefault();
                                                          runReadingWordLookup(token.word);
                                                      }
                                                  }}
                                                  title="Tocar para ver traducción y tiempos"
                                              >
                                                  {token.text}
                                              </span>
                                          );
                                      })}
                                  </div>
                              ) : (
                                  <p className="text-sm md:text-base text-white leading-relaxed whitespace-pre-wrap">No hay texto disponible para comparar.</p>
                              )}
                              {readingSelectedSnippet && (
                                  <div className="mt-2 rounded-lg border border-teal-500/30 bg-teal-950/25 px-2.5 py-2">
                                      <p className="text-[11px] text-teal-100">
                                          Frase seleccionada: <span className="text-white">{readingSelectedSnippet.length > 160 ? `${readingSelectedSnippet.slice(0, 160)}⬦` : readingSelectedSnippet}</span>
                                      </p>
                                  </div>
                              )}
                          </div>

                          {readingWordInfo && (
                              <div className="rounded-xl bg-cyan-950/35 border border-cyan-500/30 p-3 mb-4 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                      <p className="text-cyan-200 font-black text-sm">Palabra: <span className="text-white">{readingWordInfo.word}</span></p>
                                      {readingWordInfo.loading && <span className="text-[10px] font-bold text-cyan-300 animate-pulse">Buscando⬦</span>}
                                  </div>
                                  {readingWordInfo.translation && (
                                      <p className="text-sm text-cyan-100">
                                          <span className="font-bold text-cyan-300">Traducción:</span> {readingWordInfo.translation}
                                      </p>
                                  )}
                                  {!readingWordInfo.loading && !readingWordInfo.translation && (
                                      <p className="text-xs text-cyan-200/80">No se obtuvo traducción automática para esta palabra.</p>
                                  )}
                                  {readingWordInfo.error && <p className="text-xs text-red-300">{readingWordInfo.error}</p>}
                                  {readingVerbInfo && (
                                      <div className="rounded-lg bg-black/25 border border-white/10 p-2.5">
                                          <p className="text-xs text-emerald-300 font-black mb-1">
                                              Verbo detectado{readingVerbInfo.level ? ` · ${readingVerbInfo.level}` : ''}
                                          </p>
                                          <p className="text-xs text-emerald-100">Infinitivo: <strong>{readingVerbInfo.infinitive}</strong></p>
                                          {(readingVerbInfo.translation && !readingWordInfo.translation) && (
                                              <p className="text-xs text-emerald-100">ES: {readingVerbInfo.translation}</p>
                                          )}
                                          {readingVerbInfo.praeteritum && <p className="text-xs text-emerald-100">Pasado (Präteritum): {readingVerbInfo.praeteritum}</p>}
                                          {readingVerbInfo.perfekt && <p className="text-xs text-emerald-100">Perfekt: {readingVerbInfo.perfekt}</p>}
                                          {!readingVerbInfo.praeteritum && !readingVerbInfo.perfekt && readingVerbInfo.formsHint && (
                                              <p className="text-xs text-emerald-100">{readingVerbInfo.formsHint}</p>
                                          )}
                                      </div>
                                  )}
                              </div>
                          )}

                          <div className="flex flex-wrap gap-3 items-center mb-3">
                              <button type="button" onClick={startReadingListen} disabled={readingListening || !readingTargetText} className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 font-black text-sm">🎤 Empezar lectura</button>
                              <button type="button" onClick={stopReadingListen} disabled={!readingListening} className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 font-black text-sm">⏹ Parar y evaluar</button>
                              <span className={`text-xs font-bold ${readingListening ? 'text-emerald-300 animate-pulse' : 'text-gray-500'}`}>{readingListening ? 'Escuchando⬦' : 'Micrófono en espera'}</span>
                          </div>
                          {!readingFocusMode && readingListening && readingProgress.total > 0 && (
                              <p className="text-[11px] text-sky-200/75 -mt-1 mb-3">Progreso lectura: {readingProgress.matched}/{readingProgress.total} palabras ({readingProgress.pct}%).</p>
                          )}
                          {!readingFocusMode && readingTranscript && (
                              <div className="rounded-xl bg-amber-950/35 border border-amber-600/30 p-3 mb-3">
                                  <p className="text-[11px] text-amber-200/80 mb-1">Tu lectura detectada</p>
                                  <p className="text-sm text-amber-100">{readingTranscript}</p>
                              </div>
                          )}
                          {!readingFocusMode && readingScore !== null && (
                              <div className="rounded-xl bg-sky-950/35 border border-sky-500/30 p-3 mb-3">
                                  <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2.5 rounded-full bg-black/40 overflow-hidden">
                                          <div className={`h-full ${readingScore >= 85 ? 'bg-emerald-500' : readingScore >= 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${readingScore}%` }} />
                                      </div>
                                      <span className="text-white font-black text-sm">{readingScore}%</span>
                                  </div>
                              </div>
                          )}
                          {!readingFocusMode && readingFeedback.length > 0 && (
                              <div className="rounded-xl bg-black/35 border border-red-500/30 p-3 space-y-2">
                                  <p className="text-red-200 font-bold text-sm">Palabras a mejorar</p>
                                  {readingFeedback.map((f, i) => (
                                      <div key={i} className="text-xs md:text-sm border border-white/10 rounded-lg p-2 bg-white/5">
                                          <p className="text-red-200 font-bold">{f.word}</p>
                                          <p className="text-gray-300 mt-0.5">{f.tip}</p>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'escritura' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-3 md:p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h1 className="text-2xl md:text-4xl font-black text-rose-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="pen-line" className="w-8 h-8 md:w-10 md:h-10" /> Escritura
                              </h1>
                              <ExerciseHelpBtn helpId={escrituraExerciseHelpId} />
                          </div>
                          <p className="text-stone-300/95 text-xs md:text-sm mb-4 leading-relaxed border-b border-white/10 pb-3">
                              Zona solo para escribir a mano — pensada para <strong className="text-white">tableta con lápiz</strong> (p. ej. Lenovo Tab). El lienzo usa <strong className="text-white">pointer capture</strong> para que el trazo no se pierda al apoyar la mano. Encima del lienzo tienes <strong className="text-white">goma con varios anchos</strong>, marcador fluorescente, subrayado y <strong className="text-white">deshacer el último trazo</strong> sin borrar todo. Activa las <strong className="text-white">líneas</strong> como cuaderno.
                          </p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                              {[
                                  { id: 'free', label: 'Libre', sub: 'notas / borrador' },
                                  { id: 'copy', label: 'Copia', sub: 'caligrafía' },
                                  { id: 'dictation', label: 'Dictado', sub: 'oír y escribir' },
                                  { id: 'prompt', label: 'Tema', sub: 'redacción' },
                                  { id: 'telc', label: 'TELC', sub: 'carta/email examen' },
                                  { id: 'letters', label: 'Letras DE', sub: 'ÄÖÜß' },
                                  { id: 'guion', label: 'Guion', sub: 'misma historia' },
                                  { id: 'vocab', label: 'Palabra', sub: 'del vocab' }
                              ].map((m) => (
                                  <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => { setWritingMode(m.id); setWritingDictReveal(false); setWritingCanvasKey((k) => k + 1); }}
                                      className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl text-left border transition ${writingMode === m.id ? 'bg-rose-800/90 border-rose-400/50 text-white shadow-lg' : 'bg-black/40 border-white/10 text-gray-400 hover:border-rose-500/40 hover:text-white'}`}
                                  >
                                      <span className="block text-[10px] md:text-xs font-black">{m.label}</span>
                                      <span className="block text-[9px] text-gray-500 md:text-[10px]">{m.sub}</span>
                                  </button>
                              ))}
                          </div>

                          {ocrHistoryList.length > 0 && (
                              <div className="mb-4 rounded-xl border border-indigo-500/35 bg-indigo-950/20 p-3">
                                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2">Historial OCR (últimas {ocrHistoryList.length})</p>
                                  <ul className="space-y-1.5 text-[10px] text-gray-400 max-h-36 overflow-y-auto pr-1">
                                      {ocrHistoryList.map((h) => (
                                          <li key={h.id || h.at} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-1.5">
                                              <span className="text-gray-500 shrink-0">{h.at ? new Date(h.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                              <span className="text-emerald-300 font-mono font-bold">{h.pct != null ? `${h.pct}%` : 'sin %'}</span>
                                              <span className="w-full text-gray-500 truncate italic">{(h.textSnippet || '').slice(0, 70)}{(h.textSnippet || '').length > 70 ? '⬦' : ''}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}

                          {writingMode === 'free' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4">
                                  <p className="text-rose-200/90 text-sm font-bold mb-1">Página en blanco</p>
                                  <p className="text-[11px] text-gray-500">Escribe lo que quieras: resúmenes, listas, conjugaciones⬦ Usa <strong className="text-gray-300">Borrar</strong> o <strong className="text-gray-300">Guardar PNG</strong> debajo del lienzo.</p>
                              </div>
                          )}

                          {writingMode === 'copy' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Copia la frase (caligrafía alemana)</p>
                                  <p className="text-lg md:text-2xl text-white font-medium leading-snug">{WRITING_COPY_DRILLS[writingCopyIdx % WRITING_COPY_DRILLS.length]}</p>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                      <button type="button" onClick={() => { setWritingCopyIdx((i) => (i + 1) % WRITING_COPY_DRILLS.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40">Otra frase →</button>
                                  </div>
                              </div>
                          )}

                          {writingMode === 'dictation' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-3">
                                  <p className="text-rose-200/90 text-sm font-bold">Dictado alemán</p>
                                  <p className="text-[11px] text-gray-500">
                                      Escucha (varias veces si hace falta). Escribe en el lienzo lo que oyes. Luego comprueba el texto.
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                          Fuente del dictado
                                          <select
                                              value={writingDictSource}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setWritingDictSource(v);
                                                  setWritingDictIdx(0);
                                                  setWritingDictReveal(false);
                                              }}
                                              className="mt-1 w-full bg-black/45 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white font-semibold"
                                          >
                                              <option value="builtin">Base integrada</option>
                                              <option value="current_story">Historia actual</option>
                                              <option value="all_saved">Mezcla de guiones guardados</option>
                                              <option value="one_saved">Un guion concreto</option>
                                          </select>
                                      </label>
                                      {writingDictSource === 'one_saved' && (
                                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                              Guion guardado
                                              <select
                                                  value={writingDictScriptId}
                                                  onChange={(e) => {
                                                      setWritingDictScriptId(e.target.value);
                                                      setWritingDictIdx(0);
                                                      setWritingDictReveal(false);
                                                  }}
                                                  className="mt-1 w-full bg-black/45 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white font-semibold"
                                              >
                                                  <option value="__current__" disabled>Selecciona un guion⬦</option>
                                                  {writingScriptOptions.map((s) => (
                                                      <option key={s.id} value={s.id}>{s.title} ({s.count})</option>
                                                  ))}
                                              </select>
                                          </label>
                                      )}
                                  </div>
                                  <p className="text-[10px] text-rose-200/75">
                                      Ítem {Math.min(writingDictIdx + 1, Math.max(1, writingDictationPool.length))} de {Math.max(1, writingDictationPool.length)}
                                      {writingDictationPool[writingDictIdx % Math.max(1, writingDictationPool.length)]?.origin ? ` · ${writingDictationPool[writingDictIdx % Math.max(1, writingDictationPool.length)].origin}` : ''}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!writingDictationPool.length) return;
                                              const line = writingDictationPool[writingDictIdx % writingDictationPool.length];
                                              window.speechSynthesis.cancel();
                                              const u = new SpeechSynthesisUtterance(line.de);
                                              u.lang = 'de-DE';
                                              u.rate = 0.88;
                                              window.__mullerApplyPreferredDeVoice(u);
                                              window.speechSynthesis.speak(u);
                                          }}
                                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 font-bold text-sm"
                                      >
                                          <Icon name="volume-2" className="w-4 h-4" /> Escuchar dictado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!writingDictationPool.length) return;
                                              setWritingDictIdx((i) => (i + 1) % writingDictationPool.length);
                                              setWritingDictReveal(false);
                                              setWritingCanvasKey((k) => k + 1);
                                          }}
                                          className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10"
                                      >
                                          Otro dictado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setWritingDictReveal((r) => !r)}
                                          className="text-xs font-bold px-3 py-2 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/40"
                                      >
                                          {writingDictReveal ? 'Ocultar solución' : 'Mostrar solución'}
                                      </button>
                                  </div>
                                  {writingDictReveal && writingDictationPool.length > 0 && (
                                      <div className="border border-emerald-700/40 rounded-lg p-4 md:p-5 bg-emerald-950/40">
                                          <p className="text-white font-semibold text-lg md:text-2xl leading-snug">
                                              {writingDictationPool[writingDictIdx % writingDictationPool.length].de}
                                          </p>
                                          <p className="text-emerald-200/90 text-sm md:text-base mt-2 italic leading-relaxed">
                                              {writingDictationPool[writingDictIdx % writingDictationPool.length].es || 'Sin traducción disponible en esta línea.'}
                                          </p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {writingMode === 'prompt' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Tema para redacción corta</p>
                                  <p className="text-base md:text-lg text-white font-semibold">{WRITING_PROMPTS_DE[writingPromptIdx % WRITING_PROMPTS_DE.length].de}</p>
                                  <p className="text-xs text-gray-500 italic">{WRITING_PROMPTS_DE[writingPromptIdx % WRITING_PROMPTS_DE.length].es}</p>
                                  <button type="button" onClick={() => { setWritingPromptIdx((i) => (i + 1) % WRITING_PROMPTS_DE.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40 mt-2">Otro tema</button>
                              </div>
                          )}

                          {writingMode === 'telc' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-orange-500/30 p-3 md:p-4 space-y-3">
                                  <p className="text-orange-200/95 text-sm font-black flex items-center gap-2">
                                      <Icon name="mail" className="w-4 h-4" /> TELC Schreiben a mano (carta / email)
                                  </p>
                                  <p className="text-[11px] text-gray-500">
                                      Redacta a mano como en examen real con bolígrafo óptico. Cubre todos los puntos del enunciado.
                                  </p>
                                  <div className="rounded-lg border border-orange-500/35 bg-orange-950/25 p-2.5 space-y-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-200">Método de escritura TELC</p>
                                      <div className="flex flex-wrap gap-2">
                                          <button
                                              type="button"
                                              onClick={() => setWritingTelcInputMode('pen')}
                                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${writingTelcInputMode === 'pen' ? 'bg-orange-600 text-white border-orange-300/60' : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'}`}
                                          >
                                              ✍ Lápiz óptico
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => setWritingTelcInputMode('keyboard')}
                                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${writingTelcInputMode === 'keyboard' ? 'bg-orange-600 text-white border-orange-300/60' : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'}`}
                                          >
                                              ⌨ Teclado
                                          </button>
                                      </div>
                                      {writingTelcInputMode === 'keyboard' && (
                                          <textarea
                                              value={writingTelcTypedText}
                                              onChange={(e) => setWritingTelcTypedText(e.target.value)}
                                              placeholder="Escribe aquí tu carta/email TELC con teclado⬦"
                                              className="w-full min-h-[140px] bg-black/45 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-400"
                                          />
                                      )}
                                      {writingTelcInputMode === 'pen' && (
                                          <p className="text-[11px] text-orange-100/90">
                                              Usa el lienzo de abajo y luego pulsa <strong>Evaluar texto TELC</strong> (leerá el OCR).
                                          </p>
                                      )}
                                  </div>
                                  <p className="text-[10px] text-rose-200/75">
                                      Tarea {Math.min(writingTelcIdx + 1, Math.max(1, WRITING_TELC_TASKS.length))} de {Math.max(1, WRITING_TELC_TASKS.length)} · {WRITING_TELC_TASKS[writingTelcIdx % Math.max(1, WRITING_TELC_TASKS.length)]?.level || 'TELC'}
                                  </p>
                                  <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2">
                                      <p className="text-[11px] font-black uppercase tracking-wider text-rose-300">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].title}</p>
                                      <p className="text-sm md:text-base text-white leading-relaxed">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].promptDe}</p>
                                      <p className="text-[11px] text-gray-400 italic">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].promptEs}</p>
                                      <div className="rounded-lg border border-emerald-700/35 bg-emerald-950/30 p-2">
                                          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Checklist del encargo</p>
                                          <ul className="text-[11px] text-emerald-100/90 space-y-1">
                                              {WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].checklist.map((item, i) => (
                                                  <li key={i}>⬢ {item}</li>
                                              ))}
                                          </ul>
                                      </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!WRITING_TELC_TASKS.length) return;
                                              setWritingTelcIdx((i) => (i + 1) % WRITING_TELC_TASKS.length);
                                              setWritingCanvasKey((k) => k + 1);
                                          }}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-800 hover:bg-violet-700 border border-violet-500/40"
                                      >
                                          Siguiente tarea TELC
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => speakRutaDe(WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].dePrompt)}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 inline-flex items-center gap-1.5"
                                      >
                                          <Icon name="volume-2" className="w-3.5 h-3.5" /> Escuchar enunciado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={runTelcCoachFromCurrentInput}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 border border-emerald-400/40 inline-flex items-center gap-1.5"
                                      >
                                          <Icon name="clipboard-check" className="w-3.5 h-3.5" /> Evaluar texto TELC
                                      </button>
                                  </div>
                                  {writingTelcCoach && (
                                      <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-3 space-y-2">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                              <p className="text-sm font-black text-emerald-200">TELC Writing Coach</p>
                                              <span className="text-xs font-black text-white bg-black/35 border border-white/10 rounded-full px-2 py-0.5">{writingTelcCoach.total}/{writingTelcCoach.max} · {writingTelcCoach.pct}%</span>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Aufgabe</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreTask}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Register</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreRegister}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Kohärenz</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreCohesion}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Grammatik</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreGrammar}/5</strong></p>
                                          </div>
                                          <p className="text-[11px] text-emerald-100/95">{writingTelcCoach.suggestionText}</p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {writingMode === 'letters' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">{LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].title}</p>
                                  <p className="text-xs text-amber-200/80">{LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].sample}</p>
                                  <p className="text-lg md:text-xl text-white tracking-wide font-medium">Práctica: {LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].practice}</p>
                                  <button type="button" onClick={() => { setWritingLetterIdx((i) => (i + 1) % LETTER_DRILLS.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40">Siguiente bloque</button>
                              </div>
                          )}

                          {writingMode === 'guion' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  {guionData.length === 0 ? (
                                      <p className="text-gray-500 text-sm">No hay guion. Carga uno en <strong className="text-white">Biblioteca</strong>.</p>
                                  ) : (
                                      <>
                                          <p className="text-rose-200/90 text-sm font-bold">Copia una línea del guion activo</p>
                                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Escena {writingGuionWriteIdx + 1} / {guionData.length} · {guionData[writingGuionWriteIdx]?.speaker || '—'}</p>
                                          <p className="text-lg md:text-xl text-white leading-relaxed">{guionData[writingGuionWriteIdx]?.text}</p>
                                          {guionData[writingGuionWriteIdx]?.translation && <p className="text-xs text-gray-500 italic border-t border-white/10 pt-2">({guionData[writingGuionWriteIdx].translation})</p>}
                                          <div className="flex flex-wrap gap-2 pt-2">
                                              <button type="button" disabled={writingGuionWriteIdx <= 0} onClick={() => { setWritingGuionWriteIdx((i) => Math.max(0, i - 1)); setWritingCanvasKey((k) => k + 1); }} className="muller-icon-nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-white/10 disabled:opacity-30"><Icon name="chevron-left" className="w-3.5 h-3.5 text-white shrink-0" /> Anterior</button>
                                              <button type="button" disabled={writingGuionWriteIdx >= guionData.length - 1} onClick={() => { setWritingGuionWriteIdx((i) => Math.min(guionData.length - 1, i + 1)); setWritingCanvasKey((k) => k + 1); }} className="muller-icon-nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-white/10 disabled:opacity-30">Siguiente <Icon name="chevron-right" className="w-3.5 h-3.5 text-white shrink-0" /></button>
                                          </div>
                                      </>
                                  )}
                              </div>
                          )}

                          {writingMode === 'vocab' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Repite la palabra / frase del vocabulario</p>
                                  {currentVocabList.length === 0 ? (
                                      <p className="text-gray-500 text-sm">Sin lista de vocabulario aún. Abre <strong className="text-white">Vocab</strong> o carga un guion con vocabulario en <strong className="text-white">Historia</strong>.</p>
                                  ) : (
                                      <>
                                          <p className="text-xl md:text-2xl text-amber-100 font-black">{currentVocabList[writingVocabIdx % currentVocabList.length].de}</p>
                                          <p className="text-sm text-gray-500">{currentVocabList[writingVocabIdx % currentVocabList.length].es}</p>
                                          <button type="button" onClick={() => { setWritingVocabIdx((i) => (i + 1) % currentVocabList.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 border border-amber-600/40">Otra palabra</button>
                                      </>
                                  )}
                              </div>
                          )}

                          <div className="flex flex-wrap gap-2 md:gap-3 items-center mb-3 text-[11px] md:text-xs">
                              <label className="flex items-center gap-2 cursor-pointer bg-black/30 px-2 py-1 rounded-lg border border-white/10">
                                  <input type="checkbox" className="accent-rose-500" checked={writingGrid} onChange={(e) => setWritingGrid(e.target.checked)} />
                                  Líneas (cuaderno)
                              </label>
                              <span className="text-gray-500">Grosor lápiz:</span>
                              {[2, 4, 7].map((w) => (
                                  <button key={w} type="button" onClick={() => setWritingStroke(w)} className={`px-2 py-1 rounded-lg font-bold ${writingStroke === w ? 'bg-rose-700 text-white' : 'bg-slate-800 text-gray-400'}`}>{w}px</button>
                              ))}
                          </div>

                          <TabletWritingCanvas
                              padKey={writingCanvasKey}
                              grid={writingGrid}
                              strokeW={writingStroke}
                              compareTarget={writingCompareTarget}
                              snapshotData={writingCanvasSnapshot.data}
                              snapshotPadKey={writingCanvasSnapshot.padKey}
                              onSnapshotChange={(dataUrl) => setWritingCanvasSnapshot({ padKey: writingCanvasKey, data: dataUrl || '' })}
                              onOcrCompared={(payload) => {
                                  const arr = mullerPushOcrHistory(payload);
                                  setOcrHistoryList(arr);
                                  if (writingMode === 'telc') {
                                      setWritingTelcLastOcrText(String(payload && payload.recognizedText ? payload.recognizedText : '').trim());
                                  }
                              }}
                          />
                      </div>
                  )}

                  {celebrationModal && (
                      <div className="fixed inset-0 z-[280] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true">
                          <div className="relative max-w-md w-full rounded-[2rem] border border-white/20 bg-gradient-to-br from-fuchsia-900/95 via-violet-950/95 to-indigo-950/95 p-8 shadow-[0_0_80px_rgba(236,72,153,0.35)] text-center overflow-hidden animate-in zoom-in-95 duration-300">
                              <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(251,113,133,0.5), transparent 50%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.45), transparent 45%)' }} aria-hidden="true" />
                              <div className="relative z-10">
                                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg ring-4 ring-amber-300/40">
                                      <Icon name="trophy" className="w-10 h-10 text-white" />
                                  </div>
                                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{celebrationModal.title}</h2>
                                  <p className="text-fuchsia-100/90 text-sm md:text-base mb-6">{celebrationModal.subtitle}</p>
                                  <div className="flex flex-wrap justify-center gap-3 text-sm font-bold">
                                      {celebrationModal.xp > 0 ? <span className="rounded-full bg-white/15 px-4 py-2">+{celebrationModal.xp} XP</span> : null}
                                      {celebrationModal.coins > 0 ? <span className="rounded-full bg-amber-500/30 px-4 py-2 text-amber-100">+{celebrationModal.coins} monedas</span> : null}
                                      {celebrationModal.milestone ? <span className="rounded-full bg-emerald-500/30 px-4 py-2 text-emerald-100">Bonus · 3 lecciones</span> : null}
                                      {celebrationModal.placement ? <span className="rounded-full bg-sky-500/30 px-4 py-2 text-sky-100">Test completado</span> : null}
                                      {celebrationModal.recap ? <span className="rounded-full bg-violet-500/25 px-4 py-2 text-violet-100">Repaso</span> : null}
                                  </div>
                                  <button type="button" className="mt-8 w-full rounded-xl bg-white text-violet-950 font-black py-3 hover:bg-fuchsia-100 transition" onClick={() => setCelebrationModal(null)}>¡Genial!</button>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'ruta' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                              <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="map" className="w-9 h-9 md:w-12 md:h-12 text-fuchsia-400" /> Ruta A0 → C1</h1>
                                  <p className="text-gray-400 text-sm md:text-base max-w-2xl">Camino desde cero: frases, huecos, voz y recompensas. Tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-xs">R</kbd>.</p>
                              </div>
                              <ExerciseHelpBtn helpId="nav_ruta" />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mb-4 rounded-2xl border border-white/10 bg-black/35 p-4">
                              <span className="text-xs font-bold uppercase text-gray-500">Mentor (voz)</span>
                              {[
                                  { id: 'lena', label: 'Frau Lena', sub: 'voz clara' },
                                  { id: 'tom', label: 'Herr Tom', sub: 'grave' },
                                  { id: 'lina', label: 'Lina', sub: 'aguda' },
                              ].map((m) => (
                                  <button key={m.id} type="button" onClick={() => { setRutaMentor(m.id); window.__mullerPlaySfx && window.__mullerPlaySfx('tick'); }} className={`rounded-xl px-3 py-2 text-left text-xs font-bold border transition ${rutaMentor === m.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white'}`}>
                                      <span className="block">{m.label}</span>
                                      <span className="text-[10px] font-normal opacity-80">{m.sub}</span>
                                  </button>
                              ))}
                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="ml-auto text-xs font-bold rounded-xl border border-white/15 px-3 py-2 text-gray-300 hover:bg-white/10" title="Acierto, fallo y fanfarria cada 5 aciertos seguidos (5, 10, 15⬦)">
                                  Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}
                              </button>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Tiempo en Ruta (aprox.): {Math.round((rutaProgress.playTimeMs || 0) / 60000)} min · Lecciones completadas: {rutaProgress.lessonsCompleted || 0}</p>
                          <div className="mb-4 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-slate-900/80 via-fuchsia-950/45 to-slate-900/80 p-3 md:p-4 flex flex-wrap items-center gap-3">
                              <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 overflow-hidden bg-gradient-to-br from-amber-200 via-rose-200 to-violet-200 ${rutaListening || isListening ? 'animate-pulse' : ''}`}>
                                  <div className="absolute inset-x-0 bottom-0 h-4 bg-rose-300/70" />
                                  <div className="absolute left-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className="absolute right-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className={`absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full bg-slate-700 ${rutaListening || isListening ? 'w-4 h-2' : 'w-3 h-1'}`} />
                              </div>
                              <div className="min-w-[220px]">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-300">Tutor Ruta</p>
                                  <p className="text-sm font-bold text-white">Entrenador guiado desde cero (A0 → C1)</p>
                                  <p className="text-[11px] text-gray-400">Banco de verbos detectado: <strong className="text-fuchsia-300">{(rutaVerbDb.verbs || []).length}</strong> entradas.</p>
                              </div>
                          </div>
                          {!rutaRun ? (
                              <>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                      {[
                                          { id: 'camino', label: 'Camino' },
                                          { id: 'gramatica', label: 'Gramática' },
                                          { id: 'test', label: 'Test nivel' },
                                      ].map((t) => (
                                          <button key={t.id} type="button" onClick={() => setRutaSubTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${rutaSubTab === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                      ))}
                                  </div>
                                  {rutaSubTab === 'camino' && (
                                      <div className="space-y-6">
                                          <div className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/45 p-3 md:p-4">
                                              <p className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 mb-2">Sección temática</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {[
                                                      { id: 'all', label: 'Todo' },
                                                      { id: 'presentacion', label: 'Presentación' },
                                                      { id: 'familia', label: 'Familia' },
                                                      { id: 'trabajo', label: 'Trabajo' },
                                                      { id: 'alimentos', label: 'Alimentos' },
                                                      { id: 'vivienda', label: 'Vivienda' },
                                                      { id: 'viajes', label: 'Viajes' },
                                                      { id: 'salud', label: 'Salud' },
                                                      { id: 'tiempo_libre', label: 'Tiempo libre' },
                                                      { id: 'conectores', label: 'Conectores' },
                                                      { id: 'gramatica', label: 'Gramática' }
                                                  ].map((t) => (
                                                      <button key={t.id} type="button" onClick={() => setRutaTopicFilter(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${rutaTopicFilter === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                                  ))}
                                              </div>
                                          </div>
                                          {(rutaLevels || []).map((lv, levelIdx) => (
                                              <div key={lv.id} className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/50 p-4 md:p-5">
                                                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                                                      <h3 className="text-lg font-black text-white">{lv.title}</h3>
                                                      <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">{lv.badge}</span>
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                      {lv.lessons
                                                          .map((lesson, origIdx) => ({ lesson, origIdx }))
                                                          .filter(({ lesson }) => rutaTopicFilter === 'all' || (lesson.topic || '') === rutaTopicFilter)
                                                          .map(({ lesson, origIdx }) => {
                                                          const unlocked = typeof window.mullerRutaIsLessonUnlocked === 'function' && window.mullerRutaIsLessonUnlocked(rutaLevels || [], levelIdx, origIdx, rutaProgress.completed || {}, rutaProgress || {});
                                                          const done = !!(rutaProgress.completed && rutaProgress.completed[lesson.id]);
                                                          return (
                                                              <button key={lesson.id} type="button" disabled={!unlocked} onClick={() => { if (!unlocked) return; startRutaLesson(levelIdx, origIdx); }} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${!unlocked ? 'opacity-40 cursor-not-allowed border-white/5' : done ? 'border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40' : 'border-white/15 bg-black/30 hover:bg-fuchsia-950/40'}`}>
                                                                  <span className="font-bold text-white">{lesson.title}</span>
                                                                  <span className="text-[10px] uppercase tracking-wider text-cyan-300/90">{String(lesson.topic || 'general').replace('_', ' ')}</span>
                                                                  <span className="text-xs font-bold text-amber-300">+{lesson.rewardCoins} · {lesson.rewardXp} XP</span>
                                                                  {done ? <span className="text-xs text-emerald-400">Hecho</span> : unlocked ? <span className="text-xs text-fuchsia-300">Empezar</span> : <span className="text-xs text-gray-500">Bloqueado</span>}
                                                              </button>
                                                          );
                                                      })}
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  {rutaSubTab === 'gramatica' && (
                                      <div className="space-y-4">
                                          <div className="flex justify-end"><ExerciseHelpBtn helpId="ruta_gramatica" /></div>
                                          {(window.MULLER_GRAMMAR_REF || []).map((sec) => (
                                              <div key={sec.level} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-5">
                                                  <h3 className="text-fuchsia-300 font-black text-lg mb-1">{sec.level} — {sec.title}</h3>
                                                  <div className="space-y-3 mt-3">
                                                      {sec.blocks.map((b, bi) => (
                                                          <div key={bi} className="rounded-xl border border-white/5 bg-black/25 p-3">
                                                              <p className="text-white font-bold text-sm">{b.t}</p>
                                                              <p className="text-gray-400 text-sm mt-1 leading-relaxed">{b.b}</p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          ))}
                                          <p className="text-xs text-gray-500">Ampliaremos con más temas y ejemplos conforme añadas contenido al camino.</p>
                                      </div>
                                  )}
  {rutaSubTab === 'test' && (
  <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-5 md:p-6 space-y-4">
    {!placementQuestions.length ? (
      <>
        <p className="text-white font-bold text-lg">Test de nivel adaptativo</p>
        <p className="text-gray-300 text-sm">
          Responde unas preguntas para evaluar tu nivel de alemán. El test se adapta a tus respuestas.
        </p>
        <p className="text-xs text-gray-500">
          El test completo consta de aproximadamente 30 preguntas repartidas en niveles A1, A2, B1 y B2.
        </p>
        <button
          type="button"
          onClick={startPlacementTest}
          className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 font-black py-3 text-white shadow-lg mt-4"
        >
          Comenzar test
        </button>
      </>
    ) : (
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-sky-300">Nivel actual: {placementLevel}</span>
          <span className="text-xs text-gray-400">
            Pregunta {placementIndex + 1} de {placementQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all"
            style={{ width: `${((placementIndex + 1) / placementQuestions.length) * 100}%` }}
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-white font-semibold text-lg mb-4">
            {placementQuestions[placementIndex]?.q}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {placementQuestions[placementIndex]?.opts.map((opt, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => handlePlacementAnswer(oi)}
                className="text-left px-4 py-3 rounded-lg bg-slate-800 hover:bg-sky-900 text-white border border-white/10 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Responde con sinceridad. El test se adapta para encontrar tu nivel real.
        </p>
      </>
    )}
  </div>
)}
                              </>
                          ) : (() => {
                              const L = rutaLevels || [];
                              const lv = L[rutaRun.levelIdx];
                              const lesson = lv && lv.lessons[rutaRun.lessonIdx];
                              if (!lesson) return null;
                              const plan = Array.isArray(rutaRun.exercisePlan) ? rutaRun.exercisePlan : [];
                              const exerciseIdx = rutaRun.exerciseIdx || 0;
                              const ex = plan[exerciseIdx];
                              const st = rutaRun.step || 0;
                              const score = rutaRun.score || { correct: 0, total: 0, reviewCorrect: 0, reviewTotal: 0 };
                              const accPct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
                              const reviewLabel = ex && ex.fromReview ? 'Repaso (20%)' : 'Nuevo';
                              const levelVisualKey = String(rutaRun.levelKey || '').toUpperCase();
                              const panelTone = levelVisualKey === 'A0' || levelVisualKey === 'A1'
                                  ? 'from-cyan-200 via-emerald-200 to-lime-200'
                                  : levelVisualKey === 'A2' || levelVisualKey === 'B1'
                                      ? 'from-amber-200 via-rose-200 to-violet-200'
                                      : 'from-slate-200 via-indigo-200 to-fuchsia-200';
                              const tutorMood = (levelVisualKey === 'A0' || levelVisualKey === 'A1')
                                  ? 'Modo amigable'
                                  : (levelVisualKey === 'A2' || levelVisualKey === 'B1')
                                      ? 'Modo intermedio'
                                      : 'Modo avanzado';
                               const RUTA_MAX_ATT = 3;
                               if (!window.__RUTA_AVATAR_STATE) window.__RUTA_AVATAR_STATE = { speaking: false, avatarId: 'plaza', timer: null };
                               const avatarSpeaking = window.__RUTA_AVATAR_STATE.speaking;
                               const currentAvatarId = window.__RUTA_AVATAR_STATE.avatarId;
                               const setAvatarSpeaking = (v) => {
                                   window.__RUTA_AVATAR_STATE.speaking = v;
                                   if (v) {
                                       if (window.__RUTA_AVATAR_STATE.timer) clearTimeout(window.__RUTA_AVATAR_STATE.timer);
                                       window.__RUTA_AVATAR_STATE.timer = setTimeout(() => {
                                           window.__RUTA_AVATAR_STATE.speaking = false;
                                       }, 800);
                                   }
                               };
                               const setCurrentAvatarId = (id) => { window.__RUTA_AVATAR_STATE.avatarId = id; };
                               const handlePodcastCheckpointAnswer = (opt) => {
                                   const cp = rutaPodcastUI && rutaPodcastUI.checkpoint;
                                   if (!cp || !ex) return;
                                   const mockEx = { answer: cp.answer, acceptedAnswers: cp.acceptedAnswers || [] };
                                   const res = checkRutaMcAnswer(opt, mockEx);
                                   if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(res.ok);
                                   if (res.ok) {
                                       setRutaFillTip(res.soft ? (cp.softNote || 'Válido; en examen prioriza la opción modelo.') : '');
                                       setRutaSpeakErr('');
                                       resumeRutaPodcastAfterCheckpoint();
                                       return;
                                   }
                                   const attempts = (rutaRun.exerciseAttempts || 0) + 1;
                                   if (attempts >= RUTA_MAX_ATT) {
                                       setRutaRun({ ...rutaRun, podcastHadFailure: true, exerciseAttempts: 0, rutaLastChanceHint: '' });
                                       setRutaSpeakErr(`La opción modelo era: «${cp.answer}». El podcast continúa.`);
                                       resumeRutaPodcastAfterCheckpoint();
                                       return;
                                   }
                                   const lastHint = attempts === 3 ? (cp.hint || `Último intento: revisa la pregunta y las opciones en alemán.`) : '';
                                   setRutaRun({ ...rutaRun, exerciseAttempts: attempts, rutaLastChanceHint: lastHint, forcedReveal: false });
                                   setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Casi — prueba otra vez.');
                               };
                              const handleOptionAnswer = (opt) => {
                                  if (!ex) return;
                                  const res = checkRutaMcAnswer(opt, ex);
                                  const ok = res.ok;
                                  if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(ok);
                                  if (ok) {
                                      setRutaFillTip(res.soft ? (ex.softNote || `Tu elección vale; en examen prioriza: «${ex.answer}».`) : '');
                                      setRutaSpeakErr('');
                                      setRutaRun({ ...rutaRun, step: 2, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: false });
                                      return;
                                  }
                                  const attempts = (rutaRun.exerciseAttempts || 0) + 1;
                                  if (attempts >= RUTA_MAX_ATT) {
                                      setRutaSpeakErr('');
                                      setRutaRun({ ...rutaRun, step: 2, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: true });
                                      return;
                                  }
                                  const lastHint = attempts === 3 ? (ex.hint || `Último intento: la respuesta correcta empieza por «${String(ex.answer || '').slice(0, 2)}…».`) : '';
                                  setRutaRun({ ...rutaRun, exerciseAttempts: attempts, rutaLastChanceHint: lastHint, forcedReveal: false });
                                  setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Casi — prueba otra vez.');
                              };
                              const advanceExercise = (wasCorrect) => {
                                  if (!ex) return;
                                  clearRutaPodcastPlayback();
                                  setRutaFillTip('');
                                  const nextScore = {
                                      correct: (score.correct || 0) + (wasCorrect ? 1 : 0),
                                      total: (score.total || 0) + 1,
                                      reviewCorrect: (score.reviewCorrect || 0) + (ex.fromReview && wasCorrect ? 1 : 0),
                                      reviewTotal: (score.reviewTotal || 0) + (ex.fromReview ? 1 : 0),
                                  };
                                  let newPlan = plan;
                                  let nextIdx = exerciseIdx + 1;
                                  if (!wasCorrect && ex && !ex._isRetryClone) {
                                      newPlan = [...plan];
                                      newPlan.splice(nextIdx, 0, {
                                          ...ex,
                                          id: `${ex.id}-retry-${exerciseIdx}-${Date.now()}`,
                                          _isRetryClone: true,
                                          fromReview: true
                                      });
                                  }
                                  if (nextIdx >= newPlan.length) {
                                      completeRutaLesson(rutaRun.levelIdx, rutaRun.lessonIdx, nextScore);
                                      return;
                                  }
                                  setRutaRun({
                                      ...rutaRun,
                                      step: 0,
                                      exerciseIdx: nextIdx,
                                      score: nextScore,
                                      exercisePlan: newPlan,
                                      exerciseAttempts: 0,
                                      rutaLastChanceHint: '',
                                      forcedReveal: false,
                                      podcastHadFailure: false
                                  });
                                  setRutaFillInput('');
                                  setRutaTranscript('');
                                  setRutaSpeakErr('');
                                  window.__mullerPlaySfx && window.__mullerPlaySfx('tick');
                              };
                              const submitRutaTypedExercise = () => {
                                  if (!ex) return;
                                  let ok = false;
                                  if (ex.type === 'fill') ok = checkRutaFillAnswer(ex);
                                  else if (ex.type === 'translate_de' || ex.type === 'translate_es') {
                                      ok = checkRutaTranslateExercise(ex);
                                      if (ok && window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
                                  }
                                  if (ok) {
                                      setRutaSpeakErr('');
                                      setRutaRun({ ...rutaRun, step: 2, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: false });
                                      return;
                                  }
                                  if ((ex.type === 'translate_de' || ex.type === 'translate_es') && window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
                                  const attempts = (rutaRun.exerciseAttempts || 0) + 1;
                                  if (attempts >= RUTA_MAX_ATT) {
                                      setRutaSpeakErr('');
                                      setRutaRun({ ...rutaRun, step: 2, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: true });
                                      return;
                                  }
                                  const lastHint = attempts === 3 ? (ex.hint || `Último intento: la solución tiene ${String(ex.answer || '').length} caracteres y empieza por «${String(ex.answer || '').slice(0, 2)}…».`) : '';
                                  setRutaRun({ ...rutaRun, exerciseAttempts: attempts, rutaLastChanceHint: lastHint, forcedReveal: false });
                                  setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Inténtalo de nuevo.');
                              };
                              return (
                                  <div className="rounded-2xl border border-fuchsia-500/30 bg-black/40 p-5 md:p-8">
                                      <button type="button" onClick={() => { clearRutaPodcastPlayback(); setRutaFillTip(''); setRutaRun(null); setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr(''); }} className="text-sm font-bold text-fuchsia-300 mb-4 hover:text-white">← Volver al camino</button>
                                      <h2 className="text-2xl font-black text-white mb-1">{lesson.title}</h2>
                                      <p className="text-xs text-fuchsia-400/90 mb-3">{lv.badge} · {lv.title}</p>
                                      <div className={`mb-4 rounded-xl border border-white/10 bg-gradient-to-r ${panelTone} p-[1px]`}>
                                          <div className="rounded-[11px] bg-slate-900/90 p-3 flex items-center gap-3">
                                              <div className={`relative w-14 h-14 rounded-2xl border ${rutaTutorTalking ? 'border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.35)]' : 'border-white/20'} bg-slate-800/85 grid place-items-center transition`}>
                                                  <Icon name="user-round" className={`w-7 h-7 ${rutaTutorTalking ? 'text-fuchsia-200' : 'text-slate-300'}`} />
                                                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                      <span className={`w-0.5 bg-fuchsia-300/90 rounded-full ${rutaTutorTalking ? 'h-2 animate-pulse' : 'h-1'}`} />
                                                      <span className={`w-0.5 bg-fuchsia-300/90 rounded-full ${rutaTutorTalking ? 'h-3 animate-pulse' : 'h-1.5'}`} />
                                                      <span className={`w-0.5 bg-fuchsia-300/90 rounded-full ${rutaTutorTalking ? 'h-2.5 animate-pulse' : 'h-1'}`} />
                                                  </div>
                                              </div>
                                              <div className="min-w-[180px]">
                                                  <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-300">Tutor {rutaMentor === 'tom' ? 'Tom' : rutaMentor === 'lina' ? 'Lina' : 'Lena'} · {tutorMood}</p>
                                                  <p className="text-xs text-gray-300">{rutaTutorTalking ? 'Explicando y pronunciando frase...' : (rutaListening ? 'Escuchando tu respuesta...' : 'Listo para la siguiente actividad')}</p>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="mb-6 rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/20 p-3 flex flex-wrap items-center justify-between gap-2">
                                          <p className="text-xs text-fuchsia-200 font-bold">Ejercicio {Math.min((exerciseIdx || 0) + 1, Math.max(1, plan.length))} / {Math.max(1, plan.length)} · Precisión {accPct}%</p>
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${ex && ex.fromReview ? 'bg-amber-900/40 text-amber-200 border-amber-500/35' : 'bg-cyan-900/40 text-cyan-200 border-cyan-500/35'}`}>{reviewLabel}</span>
                                      </div>
                                       {st === 0 && ex && (
                                           <>
                                               {(() => {
                                                   const avatars = window.__RUTA_AVATARS || [];
                                                   const avId = typeof window.__randomExerciseAvatar === 'function' ? window.__randomExerciseAvatar() : 'plaza';
                                                   const av = avatars.find(a => a.id === avId) || avatars[0] || { bg: '#2563eb', fg: '#60a5fa', emoji: '🧑‍🏫', name: 'Plaza' };
                                                   return (
                                                       <div className="flex items-start gap-4 mb-4">
                                                           <div className="relative inline-flex flex-col items-center flex-shrink-0" style={{ width: 56, height: 76 }}>
                                                               <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center ${avatarSpeaking && currentAvatarId === avId ? 'animate-ruta-avatar-talk border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/20'}`} style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
                                                                   <span className="select-none leading-none" style={{ fontSize: 25 }}>{av.emoji}</span>
                                                               </div>
                                                               {avatarSpeaking && currentAvatarId === avId && (
                                                                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                                       <span className="w-0.5 bg-emerald-400/90 rounded-full h-2 animate-pulse" />
                                                                       <span className="w-0.5 bg-emerald-400/90 rounded-full h-3 animate-pulse" />
                                                                       <span className="w-0.5 bg-emerald-400/90 rounded-full h-2.5 animate-pulse" />
                                                                   </div>
                                                               )}
                                                               <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
                                                           </div>
                                                           <div className="flex-1">
                                                               <p className="text-sm text-violet-200/90 mb-4 rounded-xl bg-violet-950/50 border border-violet-500/25 p-4 leading-relaxed">{lesson.grammarTip}</p>
                                                           </div>
                                                       </div>
                                                   );
                                               })()}
                                              {ex.type === 'read' ? (
                                                  <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                                                      <p className="text-lg font-bold text-white">{ex.de}</p>
                                                      <button type="button" onClick={() => { setCurrentAvatarId(avId); setAvatarSpeaking(true); speakRutaDe(ex.de); }} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-fuchsia-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar</button>
                                                  </div>
                                              ) : ex.type === 'fill' ? (
                                                  <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-4">
                                                      <p className="text-white font-bold mb-3">{ex.prompt}</p>
                                                      <p className="text-[11px] text-emerald-200/70">Solo alemán aquí. La pista de sentido (español de España) aparece al pasar a escribir la respuesta.</p>
                                                  </div>
                                              ) : ex.type === 'translate_de' ? (
                                                  <div className="mb-4 rounded-xl border border-violet-500/30 bg-violet-950/25 p-4">
                                                      <p className="text-[11px] font-black uppercase tracking-wide text-violet-300 mb-2">Español → alemán</p>
                                                      <p className="text-white text-base leading-relaxed mb-2">{ex.prompt}</p>
                                                      <p className="text-[11px] text-violet-200/80">Escribe en alemán la frase completa equivalente (sin mezclar palabras en español dentro del alemán).</p>
                                                      <button type="button" onClick={() => speakRutaEs('Escribe en alemán la traducción de lo que ves en pantalla. Las instrucciones están en español de España.', {})} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-200 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Instrucciones (voz español)</button>
                                                  </div>
                                              ) : ex.type === 'translate_es' ? (
                                                  <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-950/25 p-4">
                                                      <p className="text-[11px] font-black uppercase tracking-wide text-amber-300 mb-2">Alemán → español</p>
                                                      <p className="text-lg font-bold text-white mb-2">{ex.promptDe}</p>
                                                      <p className="text-[11px] text-amber-200/85">Escribe en español de España la traducción natural de la frase.</p>
                                                      <div className="flex flex-wrap gap-2 mt-2">
                                                          <button type="button" onClick={() => { setCurrentAvatarId(avId); setAvatarSpeaking(true); speakRutaDe(ex.promptDe); }} className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar alemán</button>
                                                          <button type="button" onClick={() => speakRutaEs('Escribe tu traducción en español de España, con naturalidad.', {})} className="inline-flex items-center gap-1 text-xs font-bold text-amber-200 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Instrucciones (voz español)</button>
                                                      </div>
                                                  </div>
                                              ) : ex.type === 'order' || ex.type === 'connector' ? (
                                                  <div className="mb-4 rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-4">
                                                      <p className="text-white font-bold mb-3">{ex.prompt}</p>
                                                  </div>
                                              ) : ex.type === 'podcast' || ex.type === 'audio_story' ? (
                                                  ex.podcast ? (
                                                      <div className="mb-4 rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
                                                          <p className="text-[11px] uppercase tracking-wide text-sky-300 font-black mb-2">{ex.title || 'Audio interactivo'}</p>
                                                          <p className="text-sm text-sky-100/90 mb-2">Diálogo largo en alemán (unos {ex.podcast.approxSeconds || 90} segundos). El audio se pausa solo en las preguntas; las instrucciones y la pregunta se leen en <strong className="text-white">español de España</strong> con voz española.</p>
                                                          <p className="text-xs text-gray-400 mb-3">{ex.podcast.lines && ex.podcast.lines.length ? `${ex.podcast.lines.length} intervenciones · ${ex.podcast.checkpoints ? ex.podcast.checkpoints.length : 0} preguntas en pausa` : ''}</p>
                                                          <button type="button" onClick={() => speakRutaEs('Pulsa el botón verde para empezar. Escucharás un podcast en alemán. Cuando suene una pregunta en español, el audio se detiene hasta que respondas.', {})} className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-sky-200 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Cómo funciona (voz español)</button>
                                                      </div>
                                                  ) : (
                                                      <div className="mb-4 rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
                                                          <p className="text-[11px] uppercase tracking-wide text-sky-300 font-black mb-2">{ex.title || 'Audio interactivo'}</p>
                                                          {Array.isArray(ex.transcript) && ex.transcript.length ? (
                                                              <div className="space-y-1.5 mb-3">
                                                                  {ex.transcript.slice(0, 3).map((line, idx) => (
                                                                      <p key={`${ex.id}-line-${idx}`} className="text-sm text-white/90">{line}</p>
                                                                  ))}
                                                              </div>
                                                          ) : null}
                                                          <p className="text-white font-bold mb-2">{ex.prompt}</p>
                                                          <button type="button" onClick={() => { setCurrentAvatarId(avId); setAvatarSpeaking(true); speakRutaDe(Array.isArray(ex.transcript) ? ex.transcript.join(' ') : (ex.prompt || '')); }} className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar audio</button>
                                                      </div>
                                                  )
                                              ) : (
                                                  <div className="mb-4 rounded-xl border border-rose-500/25 bg-rose-950/20 p-4">
                                                      <p className="text-gray-300 mb-2">Lee en voz alta en alemán:</p>
                                                      <p className="text-xl font-bold text-white leading-snug">{ex.target}</p>
                                                  </div>
                                              )}
                                              <button type="button" onClick={() => {
                                                  setRutaFillInput('');
                                                  setRutaSpeakErr('');
                                                  setRutaFillTip('');
                                                  if ((ex.type === 'podcast' || ex.type === 'audio_story') && ex.podcast) {
                                                      setRutaRun({ ...rutaRun, step: 1, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: false });
                                                      beginRutaPodcastFromExercise(ex);
                                                  } else {
                                                      setRutaRun({ ...rutaRun, step: 1, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: false });
                                                  }
                                                  window.__mullerPlaySfx && window.__mullerPlaySfx('tick');
                                              }} className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg">
                                                  {(ex.type === 'podcast' || ex.type === 'audio_story') && ex.podcast ? `Empezar audio (~${ex.podcast.approxSeconds || 90}s)` : ex.type === 'read' ? 'Marcar como leído y continuar' : ex.type === 'fill' || ex.type === 'translate_de' || ex.type === 'translate_es' ? 'Ir a respuesta' : ex.type === 'order' || ex.type === 'connector' || ex.type === 'podcast' || ex.type === 'audio_story' ? 'Responder ahora' : 'Ir a validación'}
                                              </button>
                                          </>
                                      )}
                                      {st === 1 && ex && (ex.type === 'podcast' || ex.type === 'audio_story') && ex.podcast && (
                                          <>
                                              {rutaPodcastUI && rutaPodcastUI.phase === 'question' && rutaPodcastUI.checkpoint ? (
                                                  <>
                                                      <p className="text-xs text-amber-200/90 mb-2 font-bold">Audio en pausa · Pregunta</p>
                                                      <p className="text-white text-sm leading-relaxed mb-3">{rutaPodcastUI.checkpoint.promptEs}</p>
                                                      <p className="text-[11px] text-gray-500 mb-2">Opciones (alemán):</p>
                                                      {rutaRun.rutaLastChanceHint ? <p className="text-sm text-amber-200 mb-2 font-bold border border-amber-500/40 rounded-lg px-3 py-2 bg-amber-950/40">{rutaRun.rutaLastChanceHint}</p> : null}
                                                      <p className="text-[11px] text-gray-500 mb-2">Intentos: {Math.min(RUTA_MAX_ATT, (rutaRun.exerciseAttempts || 0) + 1)} / {RUTA_MAX_ATT}</p>
                                                      <div className="grid grid-cols-1 gap-2 mb-3">
                                                          {(rutaPodcastUI.checkpoint.options || []).map((opt, idx) => (
                                                              <button key={`${ex.id}-cp-${idx}`} type="button" onClick={() => handlePodcastCheckpointAnswer(opt)} className="text-left rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 px-4 py-3 text-white font-bold text-sm">
                                                                  {opt}
                                                              </button>
                                                          ))}
                                                      </div>
                                                      {rutaSpeakErr ? <p className={`text-sm mb-2 ${rutaSpeakErr.includes('continúa') ? 'text-emerald-200' : 'text-amber-200'}`}>{rutaSpeakErr}</p> : null}
                                                  </>
                                              ) : (
                                                  <div className="mb-4 rounded-xl border border-sky-500/25 bg-sky-950/30 p-4">
                                                      <p className="text-sky-200 font-bold text-sm mb-1">Reproduciendo podcast…</p>
                                                      <p className="text-xs text-gray-400">No cierres la pantalla. Las preguntas aparecen solas y el alemán continúa al acertar.</p>
                                                      {ex.podcast.lines && ex.podcast.lines.length ? (
                                                          <p className="text-[11px] text-sky-300/80 mt-2">Progreso aproximado: línea {typeof (rutaPodcastUI && rutaPodcastUI.line) === 'number' ? rutaPodcastUI.line + 1 : 1} / {ex.podcast.lines.length}</p>
                                                      ) : null}
                                                      <button type="button" onClick={() => { clearRutaPodcastPlayback(); setRutaRun({ ...rutaRun, step: 0, exerciseAttempts: 0, rutaLastChanceHint: '' }); }} className="mt-3 text-xs font-bold text-sky-300 hover:text-white underline">Reiniciar desde el principio</button>
                                                  </div>
                                              )}
                                          </>
                                      )}
                                      {st === 1 && ex && (ex.type === 'fill' || ex.type === 'translate_de' || ex.type === 'translate_es') && (
                                          <>
                                              {(() => {
                                                  const avatars = window.__RUTA_AVATARS || [];
                                                  const avId = typeof window.__randomExerciseAvatar === 'function' ? window.__randomExerciseAvatar() : 'plaza';
                                                  const av = avatars.find(a => a.id === avId) || avatars[0] || { bg: '#2563eb', fg: '#60a5fa', emoji: '🧑‍🏫', name: 'Plaza' };
                                                  return (
                                                      <div className="flex items-start gap-4 mb-4">
                                                          <div className="relative inline-flex flex-col items-center flex-shrink-0" style={{ width: 56, height: 76 }}>
                                                              <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center ${avatarSpeaking && currentAvatarId === avId ? 'animate-ruta-avatar-talk border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/20'}`} style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
                                                                  <span className="select-none leading-none" style={{ fontSize: 25 }}>{av.emoji}</span>
                                                              </div>
                                                              {avatarSpeaking && currentAvatarId === avId && (
                                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-3 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2.5 animate-pulse" />
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
                                                          </div>
                                                          <div className="flex-1">
                                                              {ex.type === 'fill' ? (
                                                                  <p className="text-white font-bold mb-3">{ex.prompt}</p>
                                                              ) : ex.type === 'translate_de' ? (
                                                                  <p className="text-white text-base mb-3 leading-relaxed">{ex.prompt}</p>
                                                              ) : (
                                                                  <>
                                                                      <p className="text-gray-400 text-sm mb-1">Frase en alemán:</p>
                                                                      <p className="text-white font-bold mb-3">{ex.promptDe}</p>
                                                                  </>
                                                              )}
                                                              {ex.type === 'fill' && ex.promptEs ? <p className="text-xs text-emerald-200/85 mb-2"><span className="font-bold text-emerald-300/90">Sentido (español de España): </span>{ex.promptEs}</p> : null}
                                                          </div>
                                                      </div>
                                                  );
                                              })()}
                                              {rutaRun.rutaLastChanceHint ? <p className="text-sm text-amber-200 mb-2 font-bold border border-amber-500/40 rounded-lg px-3 py-2 bg-amber-950/40">{rutaRun.rutaLastChanceHint}</p> : null}
                                              <input value={rutaFillInput} onChange={(e) => setRutaFillInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'ruta-fill-submit', () => { submitRutaTypedExercise(); })} className="w-full rounded-xl bg-black/50 border border-fuchsia-500/40 px-4 py-3 text-white text-lg mb-3 outline-none focus:border-fuchsia-400" placeholder={ex.type === 'translate_es' ? 'Escribe en español' : 'Escribe en alemán'} autoComplete="off" />
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              <p className="text-[11px] text-gray-500 mb-2">Intentos: {Math.min(RUTA_MAX_ATT, (rutaRun.exerciseAttempts || 0) + 1)} / {RUTA_MAX_ATT}</p>
                                              <button type="button" onClick={() => runSingleSubmitAction('ruta-fill-submit', () => { submitRutaTypedExercise(); })} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black py-3 text-white">Comprobar</button>
                                          </>
                                      )}
                                      {st === 1 && ex && ex.type === 'read' && (
                                          <>
                                              {(() => {
                                                  const avatars = window.__RUTA_AVATARS || [];
                                                  const avId = typeof window.__randomExerciseAvatar === 'function' ? window.__randomExerciseAvatar() : 'plaza';
                                                  const av = avatars.find(a => a.id === avId) || avatars[0] || { bg: '#2563eb', fg: '#60a5fa', emoji: '🧑‍🏫', name: 'Plaza' };
                                                  return (
                                                      <div className="flex items-start gap-4 mb-4">
                                                          <div className="relative inline-flex flex-col items-center flex-shrink-0" style={{ width: 56, height: 76 }}>
                                                              <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center ${avatarSpeaking && currentAvatarId === avId ? 'animate-ruta-avatar-talk border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/20'}`} style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
                                                                  <span className="select-none leading-none" style={{ fontSize: 25 }}>{av.emoji}</span>
                                                              </div>
                                                              {avatarSpeaking && currentAvatarId === avId && (
                                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-3 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2.5 animate-pulse" />
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
                                                          </div>
                                                          <div className="flex-1">
                                                              <p className="text-gray-300 text-sm mb-2">Marca como leído para continuar:</p>
                                                          </div>
                                                      </div>
                                                  );
                                              })()}
                                              <button type="button" onClick={() => advanceExercise(true)} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black py-3 text-white">Continuar</button>
                                          </>
                                      )}
                                      {st === 1 && ex && (ex.type === 'order' || ex.type === 'connector' || ((ex.type === 'podcast' || ex.type === 'audio_story') && !ex.podcast)) && (
                                          <>
                                              {(() => {
                                                  const avatars = window.__RUTA_AVATARS || [];
                                                  const avId = typeof window.__randomExerciseAvatar === 'function' ? window.__randomExerciseAvatar() : 'plaza';
                                                  const av = avatars.find(a => a.id === avId) || avatars[0] || { bg: '#2563eb', fg: '#60a5fa', emoji: '🧑‍🏫', name: 'Plaza' };
                                                  return (
                                                      <div className="flex items-start gap-4 mb-4">
                                                          <div className="relative inline-flex flex-col items-center flex-shrink-0" style={{ width: 56, height: 76 }}>
                                                              <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center ${avatarSpeaking && currentAvatarId === avId ? 'animate-ruta-avatar-talk border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/20'}`} style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
                                                                  <span className="select-none leading-none" style={{ fontSize: 25 }}>{av.emoji}</span>
                                                              </div>
                                                              {avatarSpeaking && currentAvatarId === avId && (
                                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-3 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2.5 animate-pulse" />
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
                                                          </div>
                                                          <div className="flex-1">
                                                              {(ex.type === 'podcast' || ex.type === 'audio_story') && Array.isArray(ex.transcript) ? (
                                                                  <div className="mb-3 rounded-xl border border-sky-500/30 bg-sky-950/20 p-3">
                                                                      <p className="text-[11px] text-sky-300 font-black mb-1">Escucha y responde sobre la marcha</p>
                                                                      <p className="text-sm text-white">{ex.prompt}</p>
                                                                  </div>
                                                              ) : null}
                                                          </div>
                                                      </div>
                                                  );
                                              })()}
                                              {rutaRun.rutaLastChanceHint ? <p className="text-sm text-amber-200 mb-2 font-bold border border-amber-500/40 rounded-lg px-3 py-2 bg-amber-950/40">{rutaRun.rutaLastChanceHint}</p> : null}
                                              <p className="text-[11px] text-gray-500 mb-2">Intentos: {Math.min(RUTA_MAX_ATT, (rutaRun.exerciseAttempts || 0) + 1)} / {RUTA_MAX_ATT}</p>
                                              <div className="grid grid-cols-1 gap-2 mb-3">
                                                  {(ex.options || []).map((opt, idx) => (
                                                      <button key={`${ex.id}-opt-${idx}`} type="button" onClick={() => handleOptionAnswer(opt)} className="text-left rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 px-4 py-3 text-white font-bold text-sm">
                                                          {opt}
                                                      </button>
                                                  ))}
                                              </div>
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                          </>
                                      )}
                                      {st === 1 && ex && ex.type === 'speak' && (
                                          <>
                                              {(() => {
                                                  const avatars = window.__RUTA_AVATARS || [];
                                                  const avId = typeof window.__randomExerciseAvatar === 'function' ? window.__randomExerciseAvatar() : 'plaza';
                                                  const av = avatars.find(a => a.id === avId) || avatars[0] || { bg: '#2563eb', fg: '#60a5fa', emoji: '🧑‍🏫', name: 'Plaza' };
                                                  return (
                                                      <div className="flex items-start gap-4 mb-4">
                                                          <div className="relative inline-flex flex-col items-center flex-shrink-0" style={{ width: 56, height: 76 }}>
                                                              <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center ${avatarSpeaking && currentAvatarId === avId ? 'animate-ruta-avatar-talk border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/20'}`} style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
                                                                  <span className="select-none leading-none" style={{ fontSize: 25 }}>{av.emoji}</span>
                                                              </div>
                                                              {avatarSpeaking && currentAvatarId === avId && (
                                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-3 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2.5 animate-pulse" />
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
                                                          </div>
                                                          <div className="flex-1">
                                                              <p className="text-gray-300 mb-2">Lee en voz alta en alemán:</p>
                                                              <p className="text-xl font-bold text-white mb-4 leading-snug">{ex.target}</p>
                                                          </div>
                                                      </div>
                                                  );
                                              })()}
                                              <div className="flex flex-wrap gap-2 mb-4">
                                                  <button type="button" onClick={() => { setCurrentAvatarId(avId); setAvatarSpeaking(true); speakRutaDe(ex.target); }} className="rounded-xl bg-slate-800 border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">Escuchar modelo</button>
                                                  <button type="button" disabled={rutaListening} onClick={startRutaListen} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50">{rutaListening ? 'Escuchando⬦' : 'Grabar'}</button>
                                              </div>
                                              {rutaTranscript ? <p className="text-sm text-emerald-200/90 mb-2">Detectado: {rutaTranscript}</p> : null}
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              {rutaRun.rutaLastChanceHint ? <p className="text-sm text-amber-200 mb-2 font-bold border border-amber-500/40 rounded-lg px-3 py-2 bg-amber-950/40">{rutaRun.rutaLastChanceHint}</p> : null}
                                              <p className="text-[11px] text-gray-500 mb-2">Intentos: {Math.min(RUTA_MAX_ATT, (rutaRun.exerciseAttempts || 0) + 1)} / {RUTA_MAX_ATT}</p>
                                              <button
                                                  type="button"
                                                  onClick={() => runSingleSubmitAction('ruta-speak-validate', () => {
                                                      if (checkRutaSpeakAnswer(ex.target, rutaRun.levelKey)) {
                                                          advanceExercise(true);
                                                          return;
                                                      }
                                                      const attempts = (rutaRun.exerciseAttempts || 0) + 1;
                                                      if (attempts >= RUTA_MAX_ATT) {
                                                          setRutaSpeakErr('');
                                                          setRutaRun({ ...rutaRun, step: 2, exerciseAttempts: 0, rutaLastChanceHint: '', forcedReveal: true });
                                                          return;
                                                      }
                                                      const lastHint = attempts === 2 ? `Último intento: la frase empieza por «${String(ex.target || '').slice(0, 6)}…».` : '';
                                                      setRutaRun({ ...rutaRun, exerciseAttempts: attempts, rutaLastChanceHint: lastHint, forcedReveal: false });
                                                  })}
                                                  className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg"
                                              >
                                                  Validar
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() => runSingleSubmitAction('ruta-speak-skip', () => {
                                                      setRutaSpeakErr('');
                                                      advanceExercise(false);
                                                  })}
                                                  className="w-full mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold py-2.5 text-gray-200 border border-white/15"
                                              >
                                                  Continuar sin grabar voz
                                              </button>
                                              <p className="text-[11px] text-gray-500 mt-2">Si hoy no puedes usar micrófono, puedes avanzar igualmente y practicar voz después.</p>
                                          </>
                                      )}
                                      {st === 2 && ex && (ex.type === 'fill' || ex.type === 'translate_de' || ex.type === 'translate_es' || ex.type === 'order' || ex.type === 'connector' || ex.type === 'podcast' || ex.type === 'audio_story' || ex.type === 'speak') && (
                                          <div className="space-y-3">
                                              {(() => {
                                                  const avatars = window.__RUTA_AVATARS || [];
                                                  const avId = typeof window.__randomExerciseAvatar === 'function' ? window.__randomExerciseAvatar() : 'plaza';
                                                  const av = avatars.find(a => a.id === avId) || avatars[0] || { bg: '#2563eb', fg: '#60a5fa', emoji: '🧑‍🏫', name: 'Plaza' };
                                                  return (
                                                      <div className="flex items-start gap-4 mb-4">
                                                          <div className="relative inline-flex flex-col items-center flex-shrink-0" style={{ width: 56, height: 76 }}>
                                                              <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center ${avatarSpeaking && currentAvatarId === avId ? 'animate-ruta-avatar-talk border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)]' : 'border-white/20'}`} style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
                                                                  <span className="select-none leading-none" style={{ fontSize: 25 }}>{av.emoji}</span>
                                                              </div>
                                                              {avatarSpeaking && currentAvatarId === avId && (
                                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-3 animate-pulse" />
                                                                      <span className="w-0.5 bg-emerald-400/90 rounded-full h-2.5 animate-pulse" />
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
                                                          </div>
                                                          <div className="flex-1">
                                                              {rutaRun.forcedReveal ? (
                                                                  <p className="text-sm text-amber-200">Has agotado los {RUTA_MAX_ATT} intentos. Esta es la solución:</p>
                                                              ) : (
                                                                  <p className="text-sm text-emerald-200/90">¡Correcto!</p>
                                                              )}
                                                          </div>
                                                      </div>
                                                  );
                                              })()}
                                              {rutaFillTip ? <p className="text-sm text-cyan-200/90 border border-cyan-500/30 rounded-lg px-3 py-2 bg-cyan-950/40">{rutaFillTip}</p> : null}
                                              {(ex.type === 'podcast' || ex.type === 'audio_story') && ex.podcast ? (
                                                  <p className="text-sm text-gray-300">Has terminado el audio. {rutaRun.podcastHadFailure ? 'Hubo fallos en alguna pregunta; puedes repetir el ejercicio más adelante.' : 'Buen trabajo con las preguntas en pausa.'}</p>
                                              ) : (
                                                  <p className="text-sm text-gray-300">
                                                      {ex.type === 'speak' ? 'Frase modelo: ' : 'Respuesta correcta: '}
                                                      <strong className="text-emerald-300">{ex.type === 'speak' ? ex.target : ex.answer}</strong>
                                                  </p>
                                              )}
                                              {ex.type === 'speak' && rutaRun.forcedReveal ? (
                                                  <button type="button" onClick={() => { setCurrentAvatarId(avId); setAvatarSpeaking(true); speakRutaDe(ex.target); }} className="inline-flex items-center gap-1 text-xs font-bold text-fuchsia-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar modelo</button>
                                              ) : null}
                                              <button type="button" onClick={() => advanceExercise(!rutaRun.forcedReveal && !((ex.type === 'podcast' || ex.type === 'audio_story') && ex.podcast && rutaRun.podcastHadFailure))} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 font-black py-3 text-white">{rutaRun.forcedReveal ? 'Seguir (se repetirá este ejercicio al final)' : 'Siguiente ejercicio'}</button>
                                          </div>
                                      )}
                                  </div>
                              );
                          })()}
                      </div>
                  )}

                  {activeTab === 'inicio' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 md:mb-8">
                              <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 mb-2"><Icon name="layout-dashboard" className="w-10 h-10 md:w-14 md:h-14 text-indigo-400" /> Inicio</h1>
                              <p className="text-gray-400 text-sm md:text-base max-w-2xl">Elige qué practicar. Tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-xs">I</kbd> para volver aquí.</p>
                          </div>
                          <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/35 p-4">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                  <p className="text-cyan-200 font-black text-sm flex items-center gap-2"><Icon name="stethoscope" className="w-4 h-4" /> Diagnóstico rápido</p>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${healthSnapshot.ok ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-500/40' : 'bg-amber-900/60 text-amber-200 border border-amber-500/40'}`}>{healthSnapshot.ok ? 'Estado: OK' : 'Revisar'}</span>
                              </div>
                              <div className="mb-2 flex items-center gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setShowSelfCheckPanel((v) => !v)}
                                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-cyan-400/45 bg-cyan-900/30 text-cyan-100 hover:bg-cyan-800/40"
                                  >
                                      {showSelfCheckPanel ? 'Ocultar autochequeo' : 'Autochequeo guiado'}
                                  </button>
                                  <span className="text-[10px] text-cyan-200/80">Comprueba rápido que todo lo crítico está OK.</span>
                              </div>
                              {showSelfCheckPanel && (
                                  <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                                      {getSelfCheckItems().map((it) => (
                                          <div key={it.id} className={`rounded-lg border px-2.5 py-1.5 ${it.ok ? 'border-emerald-500/35 bg-emerald-950/25 text-emerald-200' : 'border-amber-500/35 bg-amber-950/30 text-amber-100'}`}>
                                              <span className="font-bold">{it.ok ? '✓' : '⚠'} {it.label}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Micrófono</p>
                                      <p className={`font-bold ${healthSnapshot.micOk ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.micLabel}</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Voces TTS</p>
                                      <p className={`font-bold ${healthSnapshot.voiceCount > 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.voiceCount > 0 ? `${healthSnapshot.voiceCount} disponibles` : 'Sin voces cargadas'}</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Guiones</p>
                                      <p className={`font-bold ${(healthSnapshot.savedScriptsCount > 0 || healthSnapshot.storyScenesCount > 0) ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.savedScriptsCount} guardados · {healthSnapshot.storyScenesCount} escenas</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Estado sesión</p>
                                      <p className={`font-bold ${healthSnapshot.listeningBusy ? 'text-fuchsia-300' : 'text-emerald-300'}`}>{healthSnapshot.listeningBusy ? 'Mic activo' : 'En reposo'}</p>
                                  </div>
                              </div>
                          </div>
                          {vocabSrsDueCount > 0 ? (
                              <button type="button" onClick={() => { setActiveTab('vocabulario'); setVocabDueFilterOnly(true); stopAudio(); setPracticeActive(null); }} className="w-full mb-4 text-left rounded-2xl border border-amber-500/40 bg-amber-950/50 p-4 hover:bg-amber-900/55 transition shadow-[0_0_24px_rgba(245,158,11,0.12)]">
                                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2"><Icon name="bell-ring" className="w-4 h-4" /> Pendientes de repaso (SRS)</p>
                                  <p className="text-white font-black text-2xl mt-1">{vocabSrsDueCount} tarjetas</p>
                                  <p className="text-[11px] text-gray-400 mt-1">Ir a Vocab con filtro de vencidas / prioridad</p>
                              </button>
                          ) : null}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {[
                                  { id: 'ruta', label: 'Ruta A0→C1', sub: 'Desde cero, gramática, test', icon: 'map', go: () => { setActiveTab('ruta'); } },
                                  { id: 'historia', label: 'Historia', sub: 'Guion, audio, modos', icon: 'play', go: () => { setActiveTab('historia'); setMode('dialogue'); } },
                                  { id: 'vocab', label: 'Vocabulario', sub: 'SRS y tarjetas', icon: 'book-open', go: () => setActiveTab('vocabulario') },
                                  { id: 'shadow', label: 'Shadowing', sub: 'Pronunciación', icon: 'audio-lines', go: () => setActiveTab('shadowing') },
                                  { id: 'escritura', label: 'Escritura', sub: 'OCR y dictado', icon: 'pen-line', go: () => setActiveTab('escritura') },
                                  { id: 'b1', label: 'Banco B1', sub: 'Frases modelo', icon: 'target', go: () => { setActiveTab('bxbank'); setBxBankLevel('b1'); setBxCategory('mix'); } },
                                  { id: 'b2', label: 'Banco B2', sub: 'Registro alto', icon: 'layers', go: () => { setActiveTab('bxbank'); setBxBankLevel('b2'); setBxCategory('mix'); } },
                                  { id: 'progreso', label: 'Progreso', sub: 'Plan del día y estadísticas', icon: 'bar-chart', go: () => setActiveTab('progreso') },
                                  { id: 'bib', label: 'Biblioteca', sub: 'Guiones y listas', icon: 'file-text', go: () => setActiveTab('guiones') },
                                  { id: 'lex', label: 'Lexikon', sub: 'Diccionario y traductor', icon: 'library', go: () => setActiveTab('lexikon') },
                                  { id: 'hpro', label: 'Historias Pro', sub: 'ES/DE/OCR + estilo', icon: 'feather', go: () => setActiveTab('historiaspro') },
                                  { id: 'com', label: 'Comunidad', sub: 'Cuenta, directorio, liga', icon: 'trophy', go: () => setActiveTab('comunidad') },
                              ].map((c) => (
                                  <button key={c.id} type="button" onClick={() => { stopAudio(); setPracticeActive(null); c.go(); }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/85 hover:bg-slate-800/95 p-4 text-left transition shadow-lg ring-1 ring-white/[0.04]">
                                      <span className="rounded-xl bg-black/45 p-2.5 border border-white/10 shrink-0"><Icon name={c.icon} className="w-6 h-6 text-indigo-300" /></span>
                                      <span className="min-w-0">
                                          <span className="block font-black text-white text-lg leading-tight">{c.label}</span>
                                          <span className="text-xs text-gray-500">{c.sub}</span>
                                      </span>
                                  </button>
                              ))}
                          </div>
                          <div className="mt-8 flex flex-wrap gap-3">
                              <button type="button" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); }} className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 font-bold text-sm border border-sky-500/40 shadow-lg">Centro Müller (voces · temas · IA Chrome)</button>
                              <button type="button" onClick={() => setTourStep(1)} className="px-4 py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 font-bold text-sm border border-indigo-500/40 shadow-lg">Tour guiado (5 pasos)</button>
                          </div>
                      </div>
                  )}

                  {activeTab === 'comunidad' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                                  <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="trophy" className="w-9 h-9 md:w-12 md:h-12 text-violet-400" /> Comunidad</h1>
                                  <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                                      {mullerSupabaseConfigured()
                                          ? 'Modo Supabase activo: directorio y liga global (plan gratuito). Si no hay URL/key, todo sigue en local.'
                                          : 'Cuenta local o Supabase (gratis): configura URL y clave anon en index.html y el SQL del proyecto. Liga semanal con bots simulados.'}
                                  </p>
                              </div>
                              <ExerciseHelpBtn helpId="nav_comunidad" />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {[
                                  { id: 'economia', label: 'Economía' },
                                  { id: 'directorio', label: 'Directorio' },
                                  { id: 'ligas', label: 'Liga / ranking' },
                              ].map((t) => (
                                  <button
                                      key={t.id}
                                      type="button"
                                      onClick={() => setCommunitySubTab(t.id)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${communitySubTab === t.id ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_16px_rgba(124,58,237,0.35)]' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}
                                  >
                                      {t.label}
                                  </button>
                              ))}
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Cuenta y ajustes se gestionan ahora desde el menú de usuario (arriba derecha) o el botón flotante de ajustes.</p>

                          {communitySubTab === 'cuenta' && (
                              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:p-6 shadow-xl">
                                  {unifiedAuth ? (
                                      <div className="space-y-4">
                                          <p className="text-white font-bold text-lg flex items-center gap-2"><Icon name="check-circle" className="w-5 h-5 text-emerald-400" /> Sesión iniciada</p>
                                          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-400">{unifiedAuth.source === 'supabase' ? 'Cuenta Supabase (nube · gratis)' : 'Cuenta solo en este navegador'}</p>
                                          {isCreatorAccount ? <p className="text-[11px] font-black uppercase tracking-wider text-amber-400">Modo Creador: monedas ilimitadas</p> : null}
                                          <p className="text-sm text-gray-400"><span className="text-gray-300 font-semibold">Nombre:</span> {unifiedAuth.displayName}</p>
                                          <p className="text-sm text-gray-400"><span className="text-gray-300 font-semibold">Email:</span> {mullerMaskEmail(unifiedAuth.email)}</p>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-2">
                                              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Cambiar nombre visible</label>
                                              <div className="flex flex-col sm:flex-row gap-2">
                                                  <input
                                                      type="text"
                                                      value={profileNameDraft}
                                                      onChange={(e) => setProfileNameDraft(e.target.value)}
                                                      className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                                                      placeholder="Ej: SuperKlaus"
                                                  />
                                                  <button
                                                      type="button"
                                                      disabled={profileNameBusy}
                                                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-sm"
                                                      onClick={async () => {
                                                          const nextName = String(profileNameDraft || '').trim();
                                                          if (!nextName) { setProfileNameMsg('Escribe un nombre válido.'); return; }
                                                          setProfileNameBusy(true);
                                                          setProfileNameMsg('');
                                                          try {
                                                              if (unifiedAuth.source === 'supabase') {
                                                                  const client = mullerGetSupabaseClient();
                                                                  if (!client || !supabaseUser) throw new Error('Supabase no disponible');
                                                                  const { error: e1 } = await client.auth.updateUser({ data: { display_name: nextName } });
                                                                  if (e1) throw new Error(e1.message);
                                                                  const { error: e2 } = await client.from('profiles').upsert({
                                                                      id: supabaseUser.id,
                                                                      display_name: nextName,
                                                                      updated_at: new Date().toISOString(),
                                                                  }, { onConflict: 'id' });
                                                                  if (e2) throw new Error(e2.message);
                                                                  setSupabaseProfile((p) => ({ ...(p || {}), id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }));
                                                              } else {
                                                                  const map = mullerAccountsLoad();
                                                                  const em = unifiedAuth.email;
                                                                  if (map[em]) {
                                                                      map[em].displayName = nextName;
                                                                      mullerAccountsSave(map);
                                                                  }
                                                              }
                                                              saveProgress({ username: nextName });
                                                              setAuthTick((x) => x + 1);
                                                              setProfileNameMsg('Nombre actualizado.');
                                                          } catch (err) {
                                                              setProfileNameMsg('No se pudo actualizar: ' + (err && err.message ? err.message : 'error'));
                                                          } finally {
                                                              setProfileNameBusy(false);
                                                          }
                                                      }}
                                                  >
                                                      {profileNameBusy ? 'Guardando⬦' : 'Guardar nombre'}
                                                  </button>
                                              </div>
                                              {profileNameMsg ? <p className="text-xs text-gray-400">{profileNameMsg}</p> : null}
                                          </div>
                                          <button
                                              type="button"
                                              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (unifiedAuth.source === 'supabase' && client) {
                                                      try { await client.auth.signOut(); } catch (err) {}
                                                      setSupabaseUser(null);
                                                      setSupabaseProfile(null);
                                                  }
                                                  mullerAuthLogout();
                                                  setAuthTick((x) => x + 1);
                                                  setAuthPassword('');
                                              }}
                                          >
                                              Cerrar sesión
                                          </button>
                                      </div>
                                  ) : (
                                      <div className="space-y-4">
                                          <div className="flex gap-2">
                                              <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Entrar</button>
                                              <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Registro gratis</button>
                                          </div>
                                          {authError ? <p className="text-sm text-red-400 font-semibold">{authError}</p> : null}
                                          <label className="block text-xs font-bold text-gray-500 uppercase">Email</label>
                                          <input type="email" autoComplete="email" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                                          <label className="block text-xs font-bold text-gray-500 uppercase">Contraseña (mín. 6)</label>
                                          <input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                                          {authMode === 'register' ? (
                                              <>
                                                  <label className="block text-xs font-bold text-gray-500 uppercase">Nombre visible</label>
                                                  <input type="text" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authDisplayName} onChange={(e) => setAuthDisplayName(e.target.value)} placeholder="Ej: SuperKlaus" />
                                              </>
                                          ) : null}
                                          <button
                                              type="button"
                                              disabled={authBusy}
                                              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-black text-white"
                                              onClick={async () => {
                                                  setAuthBusy(true);
                                                  setAuthError('');
                                                  const errMap = {
                                                      CRYPTO_UNAVAILABLE: 'Necesitas https o localhost para registrar con cifrado seguro.',
                                                      EMAIL_INVALID: 'Introduce un email válido.',
                                                      PASS_SHORT: 'La contraseña debe tener al menos 6 caracteres.',
                                                      EMAIL_TAKEN: 'Ese email ya está registrado en este dispositivo.',
                                                      BAD_CREDENTIALS: 'Email o contraseña incorrectos.',
                                                  };
                                                  try {
                                                      const client = mullerGetSupabaseClient();
                                                      if (client) {
                                                          const em = authEmail.trim();
                                                          if (authMode === 'register') {
                                                              const dn = (authDisplayName || userStats.username || 'Estudiante').trim();
                                                              const { data, error } = await client.auth.signUp({
                                                                  email: em,
                                                                  password: authPassword,
                                                                  options: { data: { display_name: dn } },
                                                              });
                                                              if (error) throw new Error(error.message);
                                                              saveProgress({ username: dn });
                                                              if (data.session && data.session.user) {
                                                                  setSupabaseUser(data.session.user);
                                                                  try {
                                                                      await client.from('profiles').upsert({
                                                                          id: data.session.user.id,
                                                                          display_name: dn,
                                                                          updated_at: new Date().toISOString(),
                                                                      }, { onConflict: 'id' });
                                                                  } catch (pe) {}
                                                              } else if (data.user) {
                                                                  setSupabaseUser(data.user);
                                                              }
                                                              if (!data.session) {
                                                                  alert('Si Supabase pide confirmar el email, revisa tu bandeja. En Authentication → Providers → Email puedes desactivar “Confirm email” para pruebas. El perfil se crea al confirmar.');
                                                              }
                                                          } else {
                                                              const { data, error } = await client.auth.signInWithPassword({ email: em, password: authPassword });
                                                              if (error) throw new Error(error.message);
                                                              if (data.user) {
                                                                  setSupabaseUser(data.user);
                                                                  const meta = data.user.user_metadata && data.user.user_metadata.display_name;
                                                                  if (meta) saveProgress({ username: String(meta) });
                                                              }
                                                          }
                                                      } else if (authMode === 'register') {
                                                          const acc = await mullerAuthRegister(authEmail, authPassword, authDisplayName || userStats.username);
                                                          saveProgress({ username: acc.displayName });
                                                      } else {
                                                          const acc = await mullerAuthLogin(authEmail, authPassword);
                                                          saveProgress({ username: acc.displayName });
                                                      }
                                                      setAuthPassword('');
                                                      setAuthTick((x) => x + 1);
                                                  } catch (err) {
                                                      setAuthError(errMap[err.message] || err.message || 'Error');
                                                  } finally {
                                                      setAuthBusy(false);
                                                  }
                                              }}
                                          >
                                              {authBusy ? '⬦' : authMode === 'register' ? 'Crear cuenta' : 'Entrar'}
                                          </button>
                                          <p className="text-[11px] text-gray-500 leading-relaxed">
                                              {mullerGetSupabaseClient()
                                                  ? 'Con Supabase la contraseña va por Auth seguro de Supabase (gratis). Sin URL/key en index.html se usa cuenta local con PBKDF2 en el dispositivo.'
                                                  : 'Sin Supabase configurado: la contraseña se procesa con PBKDF2 solo en tu dispositivo; no hay servidor.'}
                                          </p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {communitySubTab === 'economia' && (
                              <div className="space-y-6">
                                  <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-5">
                                      <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2"><Icon name="coins" className="w-5 h-5 text-amber-400" /> Economía de monedas</h2>
                                      <p className="text-xs text-gray-500 mb-3">
                                          {mullerGetSupabaseClient()
                                              ? 'Modo seguro: bonus/gastos pasan por RPC en Supabase con límites diarios y cooldown. Evita monedas infinitas por trucos del cliente.'
                                              : 'Sin Supabase: modo local de pruebas. Para anti-trampas real usa Supabase activo.'}
                                      </p>
                                      <p className="text-sm text-gray-300">
                                          <span className="font-bold text-white">Saldo actual:</span> {isCreatorAccount ? '∞ (Creador)' : (walletCoins != null ? walletCoins : userStats.coins)}
                                      </p>
                                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Bonus diario:</span> <span className="font-bold text-white">{rewardStatus ? (rewardStatus.daily_bonus_claimed ? 'Reclamado' : 'Disponible') : '—'}</span>
                                          </div>
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Anuncios hoy:</span> <span className="font-bold text-white">{rewardStatus ? rewardStatus.ad_claims_today : '—'}</span>
                                          </div>
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Restantes:</span> <span className="font-bold text-white">{rewardStatus ? rewardStatus.ad_remaining_today : '—'}</span>
                                          </div>
                                      </div>
                                      {rewardStatus && Number(rewardStatus.ad_cooldown_seconds || 0) > 0 ? (
                                          <p className="text-[11px] text-indigo-300 mt-2">Cooldown anuncio: {Math.ceil(Number(rewardStatus.ad_cooldown_seconds || 0) / 60)} min</p>
                                      ) : null}
                                      {walletLoading ? <p className="text-xs text-gray-500 mt-1">Sincronizando wallet⬦</p> : null}
                                      {economyMsg ? <p className="text-xs text-gray-400 mt-2">{economyMsg}</p> : null}
                                  </div>

                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                                      <h3 className="text-base font-black text-white mb-3">Formas de conseguir monedas</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-emerald-500/35 bg-emerald-900/25 hover:bg-emerald-900/40 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client) { setEconomyMsg('Activa Supabase para bonus seguro.'); return; }
                                                  const { data, error } = await client.rpc('muller_claim_reward', { p_reward_type: 'daily_bonus' });
                                                  if (error || !Array.isArray(data) || !data[0]) { setEconomyMsg('Error reclamando bonus diario.'); return; }
                                                  const row = data[0];
                                                  setWalletCoins(Number(row.balance || 0));
                                                  if (Number(row.granted || 0) > 0) setEconomyMsg('Bonus diario reclamado: +' + row.granted + ' monedas.');
                                                  else setEconomyMsg(economyReasonText(row.reason));
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-emerald-300">Bonus diario (+40)</p>
                                              <p className="text-xs text-gray-400 mt-1">1 vez al día por usuario.</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-sky-500/35 bg-sky-900/20 hover:bg-sky-900/35 p-3"
                                              onClick={() => {
                                                  const u = String(window.MULLER_REWARDED_AD_URL || '').trim();
                                                  if (!u) { setEconomyMsg('Configura window.MULLER_REWARDED_AD_URL con tu enlace de anuncio/landing monetizada.'); return; }
                                                  window.open(u, '_blank', 'noopener,noreferrer');
                                                  setAdOpenedAt(Date.now());
                                                  setEconomyMsg('Anuncio abierto. Luego pulsa "Cobrar anuncio".');
                                              }}
                                          >
                                              <p className="text-sm font-black text-sky-300">Ver anuncio recompensado</p>
                                              <p className="text-xs text-gray-400 mt-1">Abre tu enlace monetizado en nueva pestaña.</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-indigo-500/35 bg-indigo-900/20 hover:bg-indigo-900/35 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client) { setEconomyMsg('Activa Supabase para cobro seguro de anuncios.'); return; }
                                                  if (!adOpenedAt || (Date.now() - adOpenedAt > 2 * 60 * 60 * 1000)) {
                                                      setEconomyMsg('Primero abre un anuncio recompensado y cobra dentro de 2 horas.');
                                                      return;
                                                  }
                                                  const { data, error } = await client.rpc('muller_claim_reward', { p_reward_type: 'ad_reward' });
                                                  if (error || !Array.isArray(data) || !data[0]) { setEconomyMsg('Error cobrando anuncio.'); return; }
                                                  const row = data[0];
                                                  setWalletCoins(Number(row.balance || 0));
                                                  if (Number(row.granted || 0) > 0) setEconomyMsg('Cobrado anuncio: +' + row.granted + ' monedas.');
                                                  else setEconomyMsg(economyReasonText(row.reason));
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-indigo-300">Cobrar anuncio (+18)</p>
                                              <p className="text-xs text-gray-400 mt-1">Máx 6/día y cooldown de 15 min (backend).</p>
                                          </button>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                              <p className="text-sm font-black text-white">Gana jugando</p>
                                              <p className="text-xs text-gray-400 mt-1">Racha diaria, sesiones completas y práctica oral ya suman. Próximo paso: migrar TODAS las recompensas a RPC para blindaje total.</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/80 p-5">
                                      <h3 className="text-base font-black text-white mb-2 flex items-center gap-2"><Icon name="gem" className="w-5 h-5 text-fuchsia-400" /> Premium mensual</h3>
                                      <p className="text-xs text-gray-500 mb-3">Monetización simple: botón de pago externo + estado premium en Supabase. Para activación automática real necesitarás webhook (paso siguiente).</p>
                                      <p className="text-sm text-gray-300 mb-3">
                                          Estado: <span className="font-bold text-white">
                                              {premiumStatus ? (premiumStatus.is_active ? 'Activo' : 'Inactivo') : '—'}
                                          </span>
                                          {premiumStatus && premiumStatus.expires_at ? <span className="text-xs text-gray-500 ml-2">hasta {String(premiumStatus.expires_at).slice(0, 10)}</span> : null}
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-fuchsia-500/35 bg-fuchsia-900/20 hover:bg-fuchsia-900/35 p-3"
                                              onClick={() => {
                                                  const u = String(window.MULLER_PREMIUM_CHECKOUT_URL || '').trim();
                                                  if (!u) { setEconomyMsg('Configura window.MULLER_PREMIUM_CHECKOUT_URL con tu checkout mensual.'); return; }
                                                  window.open(u, '_blank', 'noopener,noreferrer');
                                                  setEconomyMsg('Checkout premium abierto.');
                                              }}
                                          >
                                              <p className="text-sm font-black text-fuchsia-300">Suscribirme mensual</p>
                                              <p className="text-xs text-gray-400 mt-1">Abre tu página de cobro (Stripe/PayPal/etc).</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-violet-500/35 bg-violet-900/20 hover:bg-violet-900/35 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client || !supabaseUser) { setEconomyMsg('Necesitas sesión Supabase.'); return; }
                                                  const until = new Date(Date.now() + 30 * 86400000).toISOString();
                                                  const { error } = await client.from('muller_premium_subscriptions').upsert({
                                                      user_id: supabaseUser.id,
                                                      plan: 'monthly',
                                                      status: 'active',
                                                      started_at: new Date().toISOString(),
                                                      expires_at: until,
                                                      updated_at: new Date().toISOString(),
                                                  }, { onConflict: 'user_id' });
                                                  if (error) { setEconomyMsg('No se pudo activar premium: ' + error.message); return; }
                                                  setEconomyMsg('Premium activado 30 días (modo manual de pruebas).');
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-violet-300">Ya pagué (activar 30d)</p>
                                              <p className="text-xs text-gray-400 mt-1">Botón temporal para test hasta conectar webhook.</p>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {communitySubTab === 'directorio' && (
                              <div className="space-y-6">
                                  {mullerSupabaseConfigured() ? (
                                      <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/80 p-5 overflow-x-auto">
                                          <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="globe" className="w-5 h-5 text-emerald-400" /> Directorio global (Supabase)</h2>
                                          {remoteProfiles === null ? (
                                              <div className="space-y-2 py-2">
                                                  <div className="muller-skeleton h-4 w-40 rounded" />
                                                  <div className="muller-skeleton h-4 w-full rounded" />
                                                  <div className="muller-skeleton h-4 w-5/6 rounded" />
                                              </div>
                                          ) : remoteProfiles.length === 0 ? (
                                              <p className="text-sm text-gray-500">Aún no hay filas en <code className="text-emerald-400/90">profiles</code>. Ejecuta el SQL del proyecto y registra un usuario.</p>
                                          ) : (
                                              <table className="w-full text-sm text-left">
                                                  <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2">Actualizado</th></tr></thead>
                                                  <tbody>
                                                      {remoteProfiles.map((row) => (
                                                          <tr key={row.id} className="border-b border-white/5 text-gray-300">
                                                              <td className="py-2 pr-2 font-bold text-white">{row.display_name || '—'}</td>
                                                              <td className="py-2 text-xs text-gray-500">{row.updated_at ? String(row.updated_at).slice(0, 10) : '—'}</td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          )}
                                      </div>
                                  ) : null}
                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 overflow-x-auto">
                                      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="users" className="w-5 h-5 text-violet-400" /> Cuentas en este navegador (sin Supabase)</h2>
                                      {directoryLocals.length === 0 ? (
                                          <p className="text-sm text-gray-500">Aún no hay registros. Crea una cuenta en la pestaña «Cuenta».</p>
                                      ) : (
                                          <table className="w-full text-sm text-left">
                                              <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2 pr-2">Email</th><th className="py-2">Alta</th></tr></thead>
                                              <tbody>
                                                  {directoryLocals.map((row) => (
                                                      <tr key={row.email} className="border-b border-white/5 text-gray-300">
                                                          <td className="py-2 pr-2 font-bold text-white">{row.displayName}</td>
                                                          <td className="py-2 pr-2">{mullerMaskEmail(row.email)}</td>
                                                          <td className="py-2 text-xs text-gray-500">{row.createdAt ? String(row.createdAt).slice(0, 10) : '—'}</td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                          </table>
                                      )}
                                  </div>
                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 overflow-x-auto">
                                      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="bot" className="w-5 h-5 text-fuchsia-400" /> Bots de práctica (liga)</h2>
                                      <p className="text-xs text-gray-500 mb-3">Competidores simulados con puntuación semanal. No son usuarios reales.</p>
                                      <table className="w-full text-sm text-left">
                                          <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2 pr-2">Ciudad / nivel</th><th className="py-2">Rol</th></tr></thead>
                                          <tbody>
                                              {MULLER_BOT_PLAYERS.map((b) => (
                                                  <tr key={b.id} className="border-b border-white/5 text-gray-300">
                                                      <td className="py-2 pr-2 font-bold text-fuchsia-200">{b.name}</td>
                                                      <td className="py-2 pr-2">{b.tag} · {b.lvl}</td>
                                                      <td className="py-2"><span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30">Bot</span></td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          )}

                          {communitySubTab === 'ligas' && (
                              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:p-6 overflow-x-auto shadow-xl">
                                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                      <h2 className="text-lg font-black text-white flex items-center gap-2"><Icon name="medal" className="w-6 h-6 text-amber-400" /> Liga semanal Müller</h2>
                                      <span className="text-xs font-mono text-gray-500">Semana (lun): {leagueBoard.week}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-4">
                                      {mullerSupabaseConfigured()
                                          ? 'Puntuación global: se sube a Supabase (tabla league_scores) mientras practicas. Los bots son simulados y se mezclan en la tabla.'
                                          : 'Tu puntuación usa XP, monedas, racha, dictados y práctica oral. Los bots tienen puntuación simulada por semana (cambia cada lunes).'}
                                  </p>
                                  <table className="w-full text-sm">
                                      <thead>
                                          <tr className="text-gray-500 border-b border-white/10 text-left">
                                              <th className="py-2 pr-2 w-10">#</th>
                                              <th className="py-2 pr-2">Participante</th>
                                              <th className="py-2 pr-2 hidden sm:table-cell">Detalle</th>
                                              <th className="py-2 text-right">Pts</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {leagueBoard.rows.map((r) => (
                                              <tr key={r.id} className={`border-b border-white/5 ${r.isSelf ? 'bg-violet-900/25' : ''}`}>
                                                  <td className="py-2.5 pr-2 font-black text-gray-500">{r.rank}</td>
                                                  <td className="py-2.5 pr-2">
                                                      <span className="font-bold text-white">{r.name}</span>
                                                      {r.isBot ? <span className="ml-2 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-fuchsia-900/40 text-fuchsia-300">Bot</span> : null}
                                                      {r.isSelf ? <span className="ml-2 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-violet-800/60 text-violet-200">Tú</span> : null}
                                                  </td>
                                                  <td className="py-2.5 pr-2 text-gray-500 text-xs hidden sm:table-cell">{r.sub}</td>
                                                  <td className="py-2.5 text-right font-black text-amber-300 tabular-nums">{r.score}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          )}
                      </div>
                  )}

                  {/* HISTORIA (Main Engine) con botón Ruido */}
                  {activeTab === 'historia' && !practiceActive && (
                     <div className="flex-1 flex flex-col relative w-full min-h-full justify-center items-center p-3 md:p-8">
                        <div className="absolute top-2 left-2 z-[12] flex flex-col gap-2 items-start max-w-[min(100%,min(420px,96vw))]">
                            <div className="flex flex-wrap gap-1 items-center">
                                <ExerciseHelpBtn helpId={historiaExerciseHelpId} />
                                <ExerciseHelpBtn helpId="historia_herramientas" compact className="!text-amber-200/95 !border-amber-500/25" title="Barra de herramientas (Diktat, huecos, artículos⬦)" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-2 py-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Guion</span>
                                <select
                                    className="bg-zinc-900/90 text-white text-[11px] md:text-xs font-bold rounded-lg px-2 py-1.5 border border-white/15 outline-none max-w-[220px] md:max-w-[280px]"
                                    value={isDefaultScript ? '__default__' : (activeSavedScriptId ? String(activeSavedScriptId) : '__other__')}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === '__default__') loadDefaultGuion();
                                        else if (v === '__other__') return;
                                        else {
                                            const s = savedScripts.find((x) => String(x.id) === v);
                                            if (s) loadSavedScript(s);
                                        }
                                    }}
                                >
                                    <option value="__default__">Ejemplo integrado (Lektion 17)</option>
                                    {savedScripts.map((s) => (
                                        <option key={String(s.id)} value={String(s.id)}>{s.title || 'Sin título'}</option>
                                    ))}
                                    {!isDefaultScript && !activeSavedScriptId ? (
                                        <option value="__other__">{activeScriptTitle} (actual, no guardado)</option>
                                    ) : null}
                                </select>
                            </div>
                        </div>
                        {/* Barra de herramientas de Historia movida al header, debajo del bloque de usuario */}

                        {podcastMode && (
                            <div className="absolute top-2 right-2 bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 px-2 md:px-4 py-1 md:py-2 rounded-full font-bold flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 animate-pulse z-10 text-[10px] md:text-sm max-w-[min(96%,280px)] sm:max-w-none text-left">
                                <span className="flex items-center gap-1 md:gap-2"><Icon name="car" className="w-3 h-3 md:w-5 md:h-5 shrink-0" /> Modo Podcast</span>
                                {historiaPlaylistAllScripts && savedScripts.length > 0 ? <span className="text-indigo-100/90 font-semibold normal-case">+ Todos los guiones (siguiente al terminar)</span> : null}
                            </div>
                        )}

                        {mode === 'interview' ? (
                            (() => {
                                const q = MULLER_ORAL_B1_QUESTIONS[oralQIdx % MULLER_ORAL_B1_QUESTIONS.length];
                                const modelDe = q.model || '';
                                return (
                            <div className="max-w-4xl w-full flex flex-col items-center justify-center animate-in zoom-in duration-500 p-4">
                                <div className="bg-emerald-900 text-emerald-200 border border-emerald-500 px-3 md:px-6 py-1 md:py-2 rounded-full font-bold flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm"><Icon name="message-square" className="w-4 h-4 md:w-5 md:h-5" /> Mündliche Prüfung Teil 2 · {oralQIdx + 1}/{MULLER_ORAL_B1_QUESTIONS.length}</div>
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Tiempo por respuesta</span>
                                    {[60, 90, 120].map((s) => (
                                        <button key={s} type="button" onClick={() => { setOralSecs(s); setOralDeadline(Date.now() + s * 1000); setOralClock(0); }} className={`px-2 py-1 rounded-lg text-xs font-bold border ${oralSecs === s ? 'bg-emerald-700 border-emerald-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>{s}s</button>
                                    ))}
                                </div>
                                <div className={`w-full max-w-xl mb-4 rounded-2xl border px-4 py-3 text-center font-bold text-2xl md:text-4xl tabular-nums ${oralLeftSec !== null && oralLeftSec <= 15 ? 'border-amber-500 bg-amber-950/40 text-amber-200' : 'border-emerald-600/50 bg-black/30 text-emerald-200'}`}>
                                    {oralLeftSec !== null ? `${Math.floor(oralLeftSec / 60)}:${String(oralLeftSec % 60).padStart(2, '0')}` : '—'}
                                </div>
                                <h2 className="text-base md:text-2xl text-gray-300 font-bold mb-2 uppercase tracking-widest text-center">Prüfer/in fragt:</h2>
                                <h1 className="text-lg md:text-3xl font-medium text-white text-center mb-2 px-2 leading-snug border-l-4 border-emerald-500 pl-3 bg-emerald-950/30 py-3 rounded-r-xl">"{q.de}"</h1>
                                <p className="text-sm text-gray-500 italic mb-6 text-center max-w-2xl">({q.es})</p>
                                <div className="flex flex-col items-center gap-3 md:gap-4 w-full bg-black/40 p-4 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
                                    <button type="button" onClick={() => { const u = new SpeechSynthesisUtterance(q.de); u.lang = 'de-DE'; window.__mullerApplyPreferredDeVoice(u); u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }} className="w-full max-w-md py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm border border-white/10 flex items-center justify-center gap-2"><Icon name="volume-2" className="w-5 h-5" /> Escuchar pregunta</button>
                                    <button type="button" onMouseDown={micMouseDownGuard(() => handleVoiceStart(modelDe))} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => handleVoiceStart(modelDe))} onTouchEnd={handleVoiceStop} className={`rounded-full p-8 md:p-12 text-white transition transform hover:scale-105 shadow-xl select-none touch-manipulation ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'}`}><Icon name="mic" className="w-14 h-14 md:w-20 md:h-20" /></button>
                                    <p className="text-gray-400 font-bold mt-1 text-center text-xs md:text-sm">Mantén pulsado para responder (se compara con una frase modelo B1)</p>
                                    {spokenText && (
                                        <div className="text-center w-full mt-4 md:mt-6">
                                            <p className="text-yellow-300 font-medium text-base md:text-2xl mb-3 md:mb-4">"{spokenText}"</p>
                                            {pronunciationFeedback.length > 0 && (
                                                <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-3 md:my-4 bg-black/50 p-2 md:p-4 rounded-xl border border-white/10">
                                                    {pronunciationFeedback.map((item, idx) => (
                                                        <span key={idx} className={`text-xs md:text-lg font-bold px-1 md:px-2 py-0.5 md:py-1 rounded ${item.correct ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30 line-through decoration-red-500'}`}>{item.word}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                                <button type="button" onClick={() => { setOralQIdx((i) => (i + 1) % MULLER_ORAL_B1_QUESTIONS.length); setSpokenText(''); setOralDeadline(Date.now() + oralSecs * 1000); setOralClock(0); }} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm">Siguiente pregunta</button>
                                                <button type="button" onClick={() => { setMode('dialogue'); setOralDeadline(null); setSpokenText(''); saveProgress({ activityByDay: mergeActivityPoints(20) }); }} className="bg-white text-black px-4 py-2 rounded-xl font-black text-sm hover:bg-gray-200">Salir del simulacro</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                                );
                            })()
                        ) : mode === 'roleplay_wait' ? (
                            <div className="max-w-4xl w-full flex flex-col items-center justify-center gap-4 md:gap-6 animate-in zoom-in duration-300 p-4">
                                <div className="bg-red-600 text-white px-3 md:px-6 py-1 md:py-2 rounded-full font-bold flex items-center gap-2 text-xs md:text-sm"><Icon name="mic-off" className="w-4 h-4 md:w-5 md:h-5" /> {roleplayChar === 'Todos' ? "Modo Lectura" : "Tu turno (Roleplay)"}</div>
                                <h1 className="text-xl md:text-5xl font-medium text-white text-center leading-snug break-words w-full max-w-full px-1">
                                    {renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}
                                    {guionData[getActualSceneIndex()].isRedemittel && <span className="inline-flex items-center justify-center ml-2 md:ml-3 mb-1 md:mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 rounded shadow-lg animate-pulse whitespace-nowrap"><Icon name="flame" className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" /> ÚTIL</span>}
                                </h1>
                                {!showCurrentTranslation ? (
                                    <button onClick={() => setShowCurrentTranslation(true)} className="text-gray-500 hover:text-white transition text-xs md:text-sm font-bold flex items-center gap-1 mt-2 border border-gray-700 rounded-full px-2 md:px-3 py-0.5 md:py-1"><Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" /> Ver Traducción</button>
                                ) : (
                                    <div className="bg-white/10 text-gray-300 italic px-3 md:px-6 py-1 md:py-2 rounded-lg border border-white/20 mt-2 text-base md:text-xl animate-in slide-in-from-top-2 text-center">"{guionData[getActualSceneIndex()].translation}"</div>
                                )}
                                <div className="flex flex-col items-center gap-3 md:gap-4 w-full mt-3 md:mt-4 bg-black/40 p-4 md:p-6 rounded-xl border border-white/10">
                                    <div className="flex gap-4 md:gap-8 justify-center items-center">
                                        <button onClick={() => { window.speechSynthesis.cancel(); window.speechSynthesis.speak(playSceneAudio(sanitizeHistoriaSpeechText(guionData[getActualSceneIndex()].text), guionData[getActualSceneIndex()].speaker)); }} className="flex flex-col items-center text-gray-400 hover:text-white transition">
                                            <div className="bg-gray-800 p-2 md:p-4 rounded-full mb-1 md:mb-2"><Icon name="volume-2" className="w-5 h-5 md:w-8 md:h-8" /></div><span className="text-[10px] md:text-sm font-bold">1. Escuchar</span>
                                        </button>
                                        <button type="button" onMouseDown={micMouseDownGuard(() => handleVoiceStart())} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => handleVoiceStart())} onTouchEnd={handleVoiceStop} className={`flex flex-col items-center transition transform select-none touch-manipulation ${isListening ? 'text-red-400 scale-110' : 'text-blue-400 hover:text-blue-300'}`}>
                                            <div className={`p-2 md:p-4 rounded-full mb-1 md:mb-2 shadow-xl ${isListening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-blue-600 text-white'}`}><Icon name="mic" className="w-5 h-5 md:w-8 md:h-8" /></div><span className="text-[10px] md:text-sm font-bold">2. Mantener</span>
                                        </button>
                                    </div>
                                    {spokenText && (
                                        <div className="text-center w-full mt-4 md:mt-6">
                                            <p className="text-yellow-300 font-mono text-base md:text-xl mb-2">"{spokenText}"</p>
                                            {pronunciationFeedback.length > 0 && (
                                                <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-3 md:my-4 bg-black/50 p-2 md:p-4 rounded-xl border border-white/10">
                                                    {pronunciationFeedback.map((item, idx) => (
                                                        <span key={idx} className={`text-xs md:text-lg font-bold px-1 md:px-2 py-0.5 md:py-1 rounded ${item.correct ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30 line-through decoration-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>{item.word}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {grammarPolizeiMsg && <p className="text-red-400 font-bold mb-3 md:mb-4 bg-red-900/30 p-1 md:p-2 rounded text-xs md:text-sm">{grammarPolizeiMsg}</p>}
                                            {pronunciationScore !== null && (
                                                <div className="flex items-center justify-center gap-2 md:gap-3">
                                                    <div className="w-full bg-gray-800 rounded-full h-2 md:h-4 max-w-md"><div className={`h-2 md:h-4 rounded-full transition-all duration-1000 ${pronunciationScore >= 90 ? 'bg-green-500' : pronunciationScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${pronunciationScore}%`}}></div></div>
                                                    <span className="font-bold text-sm md:text-xl">{pronunciationScore}%</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleNext} className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-xl font-black text-base md:text-lg hover:bg-gray-200 transition shadow-xl mt-2 w-full md:w-auto">Continuar ➔</button>
                            </div>
                        ) : mode === 'dialogue' && puzzleMode ? (
                            <div className="max-w-4xl w-full flex flex-col gap-4 md:gap-6 animate-in fade-in relative mt-6 md:mt-8 items-center p-4">
                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold text-white/70 bg-indigo-900/50 border border-indigo-500/50 px-3 md:px-5 py-1 md:py-2 rounded-full flex items-center gap-2"><Icon name="puzzle" className="w-3 h-3 md:w-4 md:h-4" /> Satzbau Puzzle: {guionData[getActualSceneIndex()].speaker}</span>
                                {!showPuzzleResult ? (
                                    <div className="flex flex-col items-center gap-4 md:gap-8 w-full mt-2 md:mt-4">
                                        <div className="min-h-[80px] md:min-h-[100px] w-full bg-black/40 border-2 border-dashed border-indigo-500/50 rounded-xl p-2 md:p-4 flex flex-wrap gap-1 md:gap-2 items-center justify-center">
                                            {puzzleAnswer.map(pw => <button key={pw.id} onClick={() => { setPuzzleAnswer(puzzleAnswer.filter(w => w.id !== pw.id)); setPuzzleWords([...puzzleWords, pw]); }} className="bg-indigo-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-xl">{pw.text}</button>)}
                                        </div>
                                        <div className="flex flex-wrap gap-2 md:gap-3 justify-center w-full bg-black/20 p-3 md:p-6 rounded-xl">
                                            {puzzleWords.map(pw => <button key={pw.id} onClick={() => { setPuzzleWords(puzzleWords.filter(w => w.id !== pw.id)); setPuzzleAnswer([...puzzleAnswer, pw]); }} className="bg-gray-800 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-xl">{pw.text}</button>)}
                                        </div>
                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center">
                                            <button onClick={() => { setIsPlaying(true); togglePlay(); setIsPlaying(true); }} className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm"><Icon name="volume-2" className="w-3 h-3 md:w-5 md:h-5" /> Pista</button>
                                            <button onClick={() => runSingleSubmitAction('puzzle-check', () => {
                                                const raw = (guionData[getActualSceneIndex()]?.text || '').trim();
                                                const norm = (s) => String(s || '').toLowerCase().replace(/[.,!?;:⬦]/g, ' ').replace(/\s+/g, ' ').trim();
                                                const target = norm(raw.split(/\s+/).filter(Boolean).join(' '));
                                                const built = norm(puzzleAnswer.map((w) => w.text).join(' '));
                                                const ok = !!target && built === target;
                                                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(ok);
                                                setPuzzleLastOk(ok);
                                                setShowPuzzleResult(true);
                                            })} disabled={puzzleWords.length > 0} className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm ${puzzleWords.length === 0 ? 'bg-green-600' : 'bg-gray-800'}`}><Icon name="check-circle" className="w-3 h-3 md:w-5 md:h-5" /> Comprobar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full text-center flex flex-col items-center gap-4 md:gap-6">
                                        {puzzleLastOk ? (
                                            <h1 className="text-xl md:text-4xl font-medium text-white bg-green-900/40 p-4 md:p-6 rounded-xl border border-green-500/30 w-full max-w-full break-words leading-snug">{renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}</h1>
                                        ) : (
                                            <div className="w-full max-w-full space-y-3">
                                                <p className="text-red-200 font-black text-lg md:text-2xl bg-red-950/50 border border-red-500/40 rounded-xl px-4 py-3">Orden incorrecto — compara con la solución:</p>
                                                <h1 className="text-xl md:text-4xl font-medium text-white bg-amber-950/40 p-4 md:p-6 rounded-xl border border-amber-600/30 w-full max-w-full break-words leading-snug">{renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}</h1>
                                            </div>
                                        )}
                                        <button onClick={handleNext} className="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold mt-2 md:mt-4 flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">Siguiente ➔</button>
                                    </div>
                                )}
                            </div>
                        ) : mode === 'dialogue' && diktatMode ? (
                            <div className="max-w-4xl w-full flex flex-col gap-4 md:gap-6 animate-in fade-in relative mt-6 md:mt-8 items-center p-4">
                                {isReviewing && <div className="absolute -top-8 md:-top-12 text-red-500 font-black animate-pulse text-xs md:text-xl">⚠️ REPASO OBLIGATORIO (SRS)</div>}
                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold bg-black/30 px-3 md:px-5 py-1 md:py-2 rounded-full border border-white/10">{guionData[getActualSceneIndex()].speaker} spricht...</span>
                                {!showDiktatResult ? (
                                    <>
                                        <p className="text-base md:text-xl text-blue-200 font-bold mb-1 md:mb-2">✍️ Escribe lo que oyes:</p>
                                        <textarea className="w-full h-24 md:h-32 bg-black/50 border-2 border-blue-500/50 rounded-xl p-3 md:p-4 text-base md:text-2xl text-white outline-none" value={diktatInput} onChange={(e) => setDiktatInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'diktat-check', handleDiktatCheck, { requireCtrlOrMeta: true })} autoFocus />
                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center">
                                            <button onClick={() => { setIsPlaying(true); togglePlay(); setIsPlaying(true); }} className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 flex-1 md:flex-none justify-center text-xs md:text-sm"><Icon name="volume-2" className="w-3 h-3 md:w-5 md:h-5" /> Audio</button>
                                            <button onClick={() => runSingleSubmitAction('diktat-check', handleDiktatCheck)} className="bg-green-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 flex-1 md:flex-none justify-center text-xs md:text-sm"><Icon name="check-circle" className="w-3 h-3 md:w-5 md:h-5" /> Corregir</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full text-center flex flex-col items-center gap-4 md:gap-6">
                                        {renderDiktatDiff(guionData[getActualSceneIndex()].text, diktatInput)}
                                        {diktatMotivationMsg ? (
                                            <p className="text-amber-100/95 text-sm md:text-base font-semibold max-w-lg rounded-2xl border border-amber-500/35 bg-amber-950/50 px-4 py-3 shadow-lg">{diktatMotivationMsg}</p>
                                        ) : null}
                                        <button onClick={handleNext} className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold mt-2 md:mt-4 flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">Siguiente ➔</button>
                                    </div>
                                )}
                            </div>
                        ) : mode === 'dialogue' && historiaAudioOnly && !podcastMode && !puzzleMode && !diktatMode && !isReviewing ? (
                            <div className="max-w-3xl w-full flex flex-col items-center justify-center flex-1 py-8 md:py-16 px-4 gap-8 md:gap-10 animate-in fade-in">
                                <p className="text-violet-300 font-black text-xs uppercase tracking-[0.2em]">Solo audio · manos libres</p>
                                <p className="text-3xl md:text-5xl font-black text-center text-white leading-tight">{guionData[getActualSceneIndex()]?.speaker || '—'}</p>
                                <p className="text-gray-500 text-sm font-mono">Szene {sceneIndex + 1} / {guionData.length} · {activeScriptTitle}</p>
                                <div className="flex items-center justify-center gap-6 md:gap-10 w-full">
                                    <button type="button" onClick={handlePrev} className="muller-icon-nav p-5 md:p-6 rounded-full bg-gray-800 border border-white/10 hover:bg-gray-700 transition text-white" disabled={podcastMode}><Icon name="chevron-left" className="w-8 h-8 md:w-10 md:h-10 text-white" /></button>
                                    <button type="button" onClick={togglePlay} className={`p-8 md:p-12 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.45)] transition text-white ${isPlaying ? 'bg-red-600' : 'bg-blue-600'}`}><Icon name={isPlaying ? 'square' : 'play'} className="w-12 h-12 md:w-16 md:h-16 fill-current text-white" /></button>
                                    <button type="button" onClick={handleNext} className="muller-icon-nav p-5 md:p-6 rounded-full bg-gray-800 border border-white/10 hover:bg-gray-700 transition text-white" disabled={podcastMode}><Icon name="chevron-right" className="w-8 h-8 md:w-10 md:h-10 text-white" /></button>
                                </div>
                                <div className="flex items-center justify-center gap-2 md:gap-3 bg-black/50 px-4 py-2 rounded-xl border border-white/10 w-full max-w-sm">
                                    <Icon name="sliders" className="w-4 h-4 text-gray-400" />
                                    <input type="range" min="0.50" max="1.50" step="0.01" value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
                                    <span className="text-white font-mono text-sm w-12 text-right">x{playbackRate.toFixed(2)}</span>
                                </div>
                                <button type="button" onClick={() => setHistoriaAudioOnly(false)} className="text-sm font-bold text-sky-300 hover:text-white underline underline-offset-4">Mostrar guion completo</button>
                            </div>
                        ) : mode === 'dialogue' && (
                            <div className="max-w-4xl w-full flex flex-col gap-3 md:gap-6 animate-in fade-in relative mt-4 md:mt-8 p-3 md:p-0">
                                {isReviewing && <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-red-500 font-black animate-pulse text-xs md:text-xl w-full text-center">⚠️ REPASO OBLIGATORIO (SRS)</div>}
                                <span className="uppercase tracking-widest text-[10px] md:text-sm font-bold bg-black/30 px-2 md:px-4 py-0.5 md:py-1.5 rounded-full self-start border border-white/10">{guionData[getActualSceneIndex()].speaker}</span>
                                
                                <h1 className={`text-2xl md:text-5xl font-medium text-white shadow-sm transition-all duration-300 leading-snug break-words w-full max-w-full ${blindMode ? 'blur-md hover:blur-none cursor-pointer' : ''}`}>
                                    {renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}
                                    {guionData[getActualSceneIndex()].isRedemittel && <span className="inline-flex items-center justify-center ml-2 md:ml-3 mb-1 md:mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 rounded shadow-lg animate-pulse whitespace-nowrap"><Icon name="flame" className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" /> ÚTIL</span>}
                                </h1>

                                {tempusMode && tempusVerbList.length > 0 && (
                                    <div className="tempus-panel mt-3 md:mt-4 p-2 md:p-3 bg-blue-950/60 border border-blue-500/40 rounded-xl w-full">
                                        <p className="text-blue-300 font-bold text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2"><Icon name="clock" className="w-3 h-3 md:w-4 md:h-4" /> Tempus - Formas verbales:</p>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {tempusVerbList.map((verb, idx) => (
                                                <div key={idx} className="bg-black/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-blue-400/50">
                                                    <span className="font-bold text-blue-200 text-xs md:text-sm">{verb.infinitive}</span>
                                                    <span className="text-blue-300 text-[10px] md:text-xs ml-1 md:ml-2">→ {verb.forms}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {tempusSelectedVerb && (
                                            <div className="mt-3 rounded-lg border border-sky-500/35 bg-sky-950/35 p-3">
                                                <p className="text-[10px] md:text-xs text-sky-300 uppercase tracking-wider font-black">Verbo tocado: {tempusSelectedVerb.touched}</p>
                                                <p className="text-white font-bold text-sm md:text-base mt-1">Infinitivo: {tempusSelectedVerb.infinitive}</p>
                                                <p className="text-sky-100/90 text-xs md:text-sm mt-1 leading-relaxed">{tempusSelectedVerb.forms}</p>
                                                <p className="text-sky-300/90 text-[10px] md:text-xs mt-1">{inferTempusContextLabel(tempusSelectedVerb.touched)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex gap-2 md:gap-4 items-center">
                                    <span className="text-[8px] md:text-xs font-mono text-gray-500 flex flex-wrap gap-1 md:gap-2">
                                        <span className="text-purple-300 underline decoration-purple-500/70">Conector</span>
                                        <span className="text-blue-300 underline decoration-blue-500/70">Dativo</span>
                                        <span className="text-red-300 underline decoration-red-500/70">Acusativo</span>
                                        <span className="text-yellow-500/90 underline decoration-yellow-600/70">Mixta</span>
                                    </span>
                                </div>

                                {!showCurrentTranslation ? (
                                    <button onClick={() => setShowCurrentTranslation(true)} className="text-gray-500 hover:text-white transition text-[10px] md:text-sm font-bold flex items-center gap-1 w-max border border-gray-700 rounded-full px-2 md:px-3 py-0.5 md:py-1 mt-1 md:mt-2"><Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" /> Ver Traducción</button>
                                ) : (
                                    <div className="bg-white/10 text-gray-300 italic px-3 md:px-6 py-1 md:py-2 rounded-lg border border-white/20 w-max max-w-full text-base md:text-xl animate-in slide-in-from-top-2">"{guionData[getActualSceneIndex()].translation}"</div>
                                )}

                                {(declinaMode || artikelSniperMode) && !isPlaying && (
                                    <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 text-pink-400 font-bold animate-pulse text-xs md:text-lg w-full text-center">Piensa la respuesta y pulsa Play o ➔ para continuar.</div>
                                )}
                                
                                {!isPlaying && !podcastMode && (
                                    <div className="absolute right-0 top-0 md:-right-16 md:top-1/2 md:-translate-y-1/2 flex flex-col gap-2 md:gap-4">
                                        <button onClick={showAITutor} className="bg-blue-600 text-white p-1.5 md:p-3 rounded-full border border-blue-400 shadow-lg flex items-center justify-center group" title="Tutor IA">
                                            <Icon name="help-circle" className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>
                                        <button onClick={trySaveGrammarStructure} className="bg-cyan-600 text-white p-1.5 md:p-3 rounded-full border border-cyan-400 shadow-lg flex items-center justify-center group" title="Guardar Gramática">
                                            <Icon name="save" className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>
                                    </div>
                                )}

                                {showTutor && (
                                    <div className="absolute inset-0 z-50 bg-black/95 p-4 md:p-8 flex flex-col justify-center items-center rounded-2xl">
                                        <div className="bg-slate-900 border-2 border-blue-500 p-4 md:p-8 rounded-2xl max-w-2xl w-full shadow-[0_0_30px_rgba(59,130,246,0.5)] overflow-y-auto max-h-[80vh]">
                                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                                <h2 className="text-xl md:text-3xl font-black text-blue-400 flex items-center gap-2 md:gap-3"><Icon name="brain" className="w-6 h-6 md:w-8 md:h-8" /> Tutor IA</h2>
                                                <button onClick={() => setShowTutor(false)} className="text-gray-400 hover:text-white"><Icon name="x" className="w-6 h-6 md:w-8 md:h-8" /></button>
                                            </div>
                                            <div className="text-base md:text-xl text-white space-y-3 md:space-y-6 leading-relaxed whitespace-pre-wrap font-medium">
                                                {tutorMessage}
                                            </div>
                                            <button onClick={() => setShowTutor(false)} className="mt-6 md:mt-8 w-full bg-blue-600 hover:bg-blue-500 py-2 md:py-4 rounded-xl font-bold text-base md:text-xl">Entstanden (Entendido)</button>
                                        </div>
                                    </div>
                                )}

                                {showGrammarPrompt && (
                                    <div className="absolute inset-0 z-50 bg-black/90 p-4 flex flex-col justify-center items-center rounded-2xl animate-in zoom-in">
                                        <div className="bg-cyan-950 border-2 border-cyan-500 p-4 md:p-8 rounded-2xl max-w-lg w-full shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                            <h2 className="text-lg md:text-2xl font-black text-cyan-400 flex items-center gap-2 md:gap-3 mb-3 md:mb-4"><Icon name="save" className="w-5 h-5 md:w-6 md:h-6" /> Guardar Manual</h2>
                                            <p className="text-cyan-100 mb-4 md:mb-6 text-xs md:text-sm">No he detectado ninguna regla automática en esta frase. ¿Qué gramática quieres guardar en tus Flashcards?</p>
                                            <p className="text-gray-400 italic mb-2 text-[10px] md:text-xs">Frase actual: "{guionData[getActualSceneIndex()].text}"</p>
                                            <input type="text" placeholder="Ej: Nebensatz con weil" className="w-full bg-black/50 border border-cyan-800 p-2 md:p-3 rounded-lg text-white outline-none focus:border-cyan-400 mb-4 md:mb-6 text-xs md:text-sm" value={customGrammarInput} onChange={(e)=>setCustomGrammarInput(e.target.value)} autoFocus />
                                            <div className="flex gap-3 md:gap-4">
                                                <button onClick={()=>setShowGrammarPrompt(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 md:py-3 rounded-xl font-bold text-xs md:text-base">Cancelar</button>
                                                <button onClick={handleCustomGrammarSave} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2 md:py-3 rounded-xl font-bold shadow-lg text-xs md:text-base">Guardar ➔</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                  )}
              </div>

              {/* REPRODUCTOR CONTROLES INFERIORES */}
              {activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !practiceActive && (
                  <div className="muller-historia-player-bar bg-gray-950 px-2 py-1 md:px-3 md:py-1.5 flex flex-row flex-wrap items-center justify-center md:justify-between gap-x-3 md:gap-x-5 gap-y-1.5 md:gap-y-2 border-t border-gray-800 z-20">
                      <div className="flex flex-col text-[9px] md:text-[10px] text-gray-400 w-auto text-left leading-tight mr-1">
                        <span className="font-bold text-white text-[10px] md:text-xs truncate max-w-[140px] md:max-w-[180px]">{activeScriptTitle}</span>
                        <span>Szene {isReviewing ? reviewIndexPointer + 1 : sceneIndex + 1} von {isReviewing ? userStats.failedDiktatScenes.length : guionData.length} {isReviewing && "(Repaso)"}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 md:gap-3 w-auto px-0.5">
                        <button onClick={handlePrev} className={`muller-icon-nav p-1 md:p-1.5 bg-gray-900 rounded-full transition text-white border border-gray-700 shadow-md ${isReviewing || podcastMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} disabled={podcastMode}><Icon name="chevron-left" className="w-3 h-3 md:w-4 md:h-4 text-white" /></button>
                        <button onClick={togglePlay} className={`p-1.5 md:p-2.5 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isPlaying ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {isPlaying ? <Icon name="square" className="w-3.5 h-3.5 md:w-5 md:h-5 fill-current" /> : <Icon name="play" className="w-3.5 h-3.5 md:w-5 md:h-5 ml-0.5 fill-current" />}
                        </button>
                        <button onClick={handleNext} className={`muller-icon-nav p-1 md:p-1.5 bg-gray-900 rounded-full transition text-white border border-gray-700 shadow-md ${podcastMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} disabled={podcastMode}><Icon name="chevron-right" className="w-3 h-3 md:w-4 md:h-4 text-white" /></button>
                        <button type="button" onClick={() => { try { if (window.__mullerAudiobook && typeof window.__mullerAudiobook.toggle === 'function') window.__mullerAudiobook.toggle(); } catch (e) {} }} className={`p-1 md:p-1.5 rounded-full transition text-white border border-gray-700 shadow-md ${audiobookPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-700 hover:bg-amber-600'}`} title={audiobookPlaying ? 'Detener audiolibro' : 'Audiolibro: reproduce todo el guión'}>
                            <Icon name={audiobookPlaying ? 'square' : 'headphones'} className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </button>
                      </div>
                      <button type="button" onClick={exportScriptPDF} className="flex bg-red-700 hover:bg-red-600 border border-red-500 px-2 py-0.5 md:py-1 rounded-lg text-white font-bold items-center gap-1 shadow-lg transition text-[9px] md:text-[10px] shrink-0 mx-0.5" title="PDF con alemán, traducción al español, vocabulario y análisis"><Icon name="file-down" className="w-2.5 h-2.5 md:w-3 md:h-3" /> PDF</button>
                      <div className="flex items-center justify-center gap-1.5 md:gap-2 bg-black/50 px-1.5 md:px-2 py-0.5 rounded-lg border border-gray-800 w-auto ml-0.5 sm:mr-4 md:mr-6">
                          <Icon name="sliders" className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400" />
                          <input type="range" min="0.50" max="1.50" step="0.01" value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))} className="w-14 md:w-20 accent-blue-500 cursor-pointer"/>
                          <span className="text-white font-mono font-bold text-[9px] md:text-[10px] w-8 md:w-9 text-right">x{playbackRate.toFixed(2)}</span>
                      </div>
                  </div>
              )}

              {pwaDeferredPrompt && (
                  <div className="muller-pwa-banner">
                      <span className="text-sm text-gray-100 pr-2 leading-snug"><strong className="text-white">Instalar Müller</strong> — se abre pantalla completa como app. En Chrome/Edge: &quot;Añadir a pantalla de inicio&quot;. En Safari (iPhone/iPad): compartir → &quot;Añadir a pantalla de inicio&quot;.</span>
                      <div className="flex items-center gap-2 ml-auto">
                          <button type="button" className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 font-bold text-sm text-white" onClick={async () => {
                              try {
                                  await pwaDeferredPrompt.prompt();
                              } catch (e) {}
                              setPwaDeferredPrompt(null);
                          }}>Instalar</button>
                          <button type="button" className="text-xs text-gray-400 hover:text-white underline" onClick={() => setPwaDeferredPrompt(null)}>Ahora no</button>
                      </div>
                  </div>
              )}
              {pdfStudyFullscreen && pdfStudyDoc ? (
                  <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col">
                      <div className="flex items-center justify-between gap-3 px-3 md:px-5 py-3 border-b border-white/10 bg-slate-950/95">
                          <div className="min-w-0">
                              <p className="text-xs md:text-sm font-black text-cyan-100 truncate">PDF Coach · {pdfStudyDoc.name || 'Libro PDF'}</p>
                              <p className="text-[10px] md:text-xs text-cyan-300/80">Página {activePdfPageData.page || 1}/{pdfStudyDoc.totalPages || (pdfStudyDoc.pages || []).length || 1}</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <button
                                  type="button"
                                  onClick={() => setPdfStudyInkNonce((k) => k + 1)}
                                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/45 bg-amber-900/45 hover:bg-amber-800/60 text-[11px] font-bold text-amber-100"
                              >
                                  Nuevo lienzo
                              </button>
                              <button
                                  type="button"
                                  onClick={closePdfStudyFullscreen}
                                  className="px-3 py-1.5 rounded-lg border border-rose-500/45 bg-rose-900/50 hover:bg-rose-800/60 text-[11px] font-black text-white"
                              >
                                  Cerrar ✕
                              </button>
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 md:p-5 grid grid-cols-1 xl:grid-cols-2 gap-4 bg-gradient-to-b from-slate-950 to-slate-900">
                          <section className="rounded-2xl border border-cyan-500/25 bg-black/35 p-3 md:p-4 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setPdfStudyPageIdx((i) => Math.max(0, i - 1))}
                                      disabled={pdfStudyPageIdx <= 0}
                                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white"
                                  >
                                      ← Página
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setPdfStudyPageIdx((i) => Math.min(Math.max(0, (pdfStudyDoc.pages || []).length - 1), i + 1))}
                                      disabled={pdfStudyPageIdx >= Math.max(0, (pdfStudyDoc.pages || []).length - 1)}
                                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white"
                                  >
                                      Página →
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => runPdfPageOcr(activePdfPageData.page || 1)}
                                      disabled={pdfStudyOcrBusy}
                                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-900/45 hover:bg-amber-800/55 disabled:opacity-45 text-xs font-bold text-amber-100"
                                  >
                                      {pdfStudyOcrBusy ? 'OCR⬦' : 'OCR página'}
                                  </button>
                              </div>
                              {pdfStudyBlobUrl ? (
                                  <div className="rounded-xl border border-white/10 overflow-hidden bg-black/45">
                                      <iframe
                                          title="PDF estudio fullscreen"
                                          src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`}
                                          className="w-full h-[52vh] md:h-[64vh] border-0"
                                      />
                                  </div>
                              ) : (
                                  <div className="rounded-xl border border-amber-600/35 bg-amber-950/35 p-3">
                                      <p className="text-xs text-amber-100">Vista PDF no disponible en esta sesión. Vuelve a subir el PDF para ver el documento completo aquí.</p>
                                  </div>
                              )}
                              <textarea
                                  value={activePdfPageData.text || ''}
                                  readOnly
                                  className="w-full h-32 bg-black/45 border border-cyan-500/25 rounded-xl p-3 text-xs text-cyan-50"
                                  placeholder="Texto detectado de esta página."
                              />
                          </section>
                          <section className="rounded-2xl border border-rose-500/25 bg-black/35 p-3 md:p-4 space-y-3">
                              <p className="text-xs font-black text-rose-200 uppercase tracking-wider">Notas de estudio por página (stylus + teclado)</p>
                              <TabletWritingCanvas
                                  padKey={pdfStudyCanvasPadKey}
                                  grid={true}
                                  strokeW={4}
                                  compareTarget={activePdfPageData.text || ''}
                                  snapshotData={activePdfPageNotes.drawing}
                                  snapshotPadKey={pdfStudyCanvasPadKey}
                                  onSnapshotChange={(dataUrl) => updatePdfPageNotes(activePdfPageData.page || 1, { drawing: dataUrl || '' })}
                                  onOcrCompared={() => {}}
                              />
                              <label className="block text-[11px] font-bold text-rose-200 uppercase tracking-wider">
                                  Notas rápidas (teclado)
                                  <textarea
                                      value={activePdfPageNotes.typed || ''}
                                      onChange={(e) => updatePdfPageNotes(activePdfPageData.page || 1, { typed: e.target.value })}
                                      placeholder="Ejemplos, dudas, vocabulario clave, errores típicos⬦"
                                      className="mt-1 w-full min-h-[120px] bg-black/45 border border-rose-500/30 rounded-xl p-3 text-xs text-white normal-case"
                                  />
                              </label>
                          </section>
                      </div>
                  </div>
              ) : null}
            </div>
          );
        }

        // ========== COMPONENTES FLOTANTES (Sincronización y Permiso Micrófono) ==========
        function FloatingButtons() {
            const [lastBackupIso, setLastBackupIso] = React.useState(() => localStorage.getItem('muller_last_backup_iso'));

            const requestMicPermission = async () => {
                try {
                    const ok = await window.mullerRequestMicPermission && window.mullerRequestMicPermission({ autoPrompt: true, showToast: true });
                    if (!ok) return;
                    window.__mullerToast && window.__mullerToast('Micrófono concedido. Ya puedes usar reconocimiento de voz.', 'success');
                } catch (err) {
                    window.__mullerToast && window.__mullerToast('No se pudo obtener permiso del micrófono.', 'error');
                }
            };

            const exportData = React.useCallback(() => {
                const allLocalData = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!key) continue;
                    allLocalData[key] = localStorage.getItem(key);
                }
                const backupTimestamp = new Date().toISOString();
                localStorage.setItem('muller_last_backup_iso', backupTimestamp);
                setLastBackupIso(backupTimestamp);
                const dataToExport = {
                    allLocalStorage: allLocalData,
                    version: '4.0',
                    exportDate: backupTimestamp
                };
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `muller_progreso_${new Date().toISOString().slice(0,19)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                window.__mullerToast && window.__mullerToast('Backup total exportado. Guárdalo para sincronizar.', 'success');
            }, []);

            React.useEffect(() => {
                const onFull = () => exportData();
                window.addEventListener('muller-export-full-backup', onFull);
                return () => window.removeEventListener('muller-export-full-backup', onFull);
            }, [exportData]);

            const importData = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.type === 'muller_partial_v1' && data.part === 'srs') {
                            localStorage.setItem('muller_vocab_srs_v1', JSON.stringify(data.muller_vocab_srs_v1 || {}));
                            window.__mullerToast && window.__mullerToast('SRS importado. Recargando⬦', 'success');
                            window.location.reload();
                            return;
                        }
                        if (data.type === 'muller_partial_v1' && data.part === 'decks') {
                            const cur = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                            const merged = { ...cur, difficultVocab: data.difficultVocab || cur.difficultVocab, normalVocab: data.normalVocab || cur.normalVocab, difficultGrammar: data.difficultGrammar || cur.difficultGrammar };
                            localStorage.setItem('mullerStats', JSON.stringify(merged));
                            window.__mullerToast && window.__mullerToast('Mazos importados. Recargando⬦', 'success');
                            window.location.reload();
                            return;
                        }
                        if (data.allLocalStorage && typeof data.allLocalStorage === 'object') {
                            localStorage.clear();
                            Object.entries(data.allLocalStorage).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            setLastBackupIso(localStorage.getItem('muller_last_backup_iso'));
                        } else if (data.allMullerData && typeof data.allMullerData === 'object') {
                            Object.entries(data.allMullerData).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            setLastBackupIso(localStorage.getItem('muller_last_backup_iso'));
                        } else {
                            if (data.userStats) localStorage.setItem('mullerStats', JSON.stringify(data.userStats));
                            if (data.savedScripts) localStorage.setItem('mullerScripts', JSON.stringify(data.savedScripts));
                            if (data.customVocabLessons) localStorage.setItem('mullerCustomVocab', JSON.stringify(data.customVocabLessons));
                        }
                        window.__mullerToast && window.__mullerToast('Datos importados correctamente. Recargando⬦', 'success');
                        window.location.reload();
                    } catch(err) { window.__mullerToast && window.__mullerToast('Archivo inválido.', 'error'); }
                };
                reader.readAsText(file);
            };

            const exportSrsOnly = () => {
                try {
                    const raw = localStorage.getItem('muller_vocab_srs_v1');
                    const map = raw ? JSON.parse(raw) : {};
                    const payload = { type: 'muller_partial_v1', part: 'srs', muller_vocab_srs_v1: map, exportDate: new Date().toISOString() };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `muller_srs_only_${new Date().toISOString().slice(0, 19)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    window.__mullerToast && window.__mullerToast('Exportado solo SRS.', 'success');
                } catch (err) { window.__mullerToast && window.__mullerToast('No se pudo exportar SRS.', 'error'); }
            };

            const exportDecksOnly = () => {
                try {
                    const stats = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                    const payload = {
                        type: 'muller_partial_v1',
                        part: 'decks',
                        exportDate: new Date().toISOString(),
                        difficultVocab: stats.difficultVocab || [],
                        normalVocab: stats.normalVocab || [],
                        difficultGrammar: stats.difficultGrammar || []
                    };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `muller_mazos_${new Date().toISOString().slice(0, 19)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    window.__mullerToast && window.__mullerToast('Exportados mazos (difícil/normal/gramática).', 'success');
                } catch (err) { window.__mullerToast && window.__mullerToast('No se pudo exportar mazos.', 'error'); }
            };

            const showSyncHelp = () => {
                alert(
                    "🔄 Sincronización TOTAL gratis:\n\n" +
                    "1) En tu dispositivo actual pulsa Exportar.\n" +
                    "2) Sube el archivo .json a Google Drive.\n" +
                    "3) En otro dispositivo descarga ese .json.\n" +
                    "4) Pulsa Importar en la app.\n" +
                    "5) Recarga la página.\n\n" +
                    "Esto copia TODO el estado guardado de la aplicación."
                );
            };

            React.useEffect(() => {
                const onImport = () => {
                    const el = document.getElementById('muller-backup-file-input');
                    if (el) el.click();
                };
                const onSrs = () => exportSrsOnly();
                const onDecks = () => exportDecksOnly();
                const onHelp = () => showSyncHelp();
                const onMic = () => requestMicPermission();
                window.addEventListener('muller-open-backup-import', onImport);
                window.addEventListener('muller-export-srs-only', onSrs);
                window.addEventListener('muller-export-decks-only', onDecks);
                window.addEventListener('muller-show-sync-help', onHelp);
                window.addEventListener('muller-request-mic', onMic);
                return () => {
                    window.removeEventListener('muller-open-backup-import', onImport);
                    window.removeEventListener('muller-export-srs-only', onSrs);
                    window.removeEventListener('muller-export-decks-only', onDecks);
                    window.removeEventListener('muller-show-sync-help', onHelp);
                    window.removeEventListener('muller-request-mic', onMic);
                };
            }, [exportDecksOnly, exportSrsOnly]);

            React.useEffect(() => {
                let enable = false;
                try { enable = localStorage.getItem(MULLER_MIC_PERMISSION_PREF_KEY) !== '0'; } catch (e) {}
                if (!enable) return undefined;
                const t = window.setTimeout(() => { requestMicPermission(); }, 600);
                return () => window.clearTimeout(t);
            }, []);

            return (
                <>
                    <input id="muller-backup-file-input" type="file" accept=".json" onChange={importData} className="hidden" />
                </>
            );
        }

      const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <MullerErrorBoundary>
                <>
                    <App />
                    <FloatingButtons />
                    <AdvancedPracticePanelFinal />
                </>
            </MullerErrorBoundary>
        );
