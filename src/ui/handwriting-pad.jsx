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

          window.HandwritingPad = HandwritingPad;