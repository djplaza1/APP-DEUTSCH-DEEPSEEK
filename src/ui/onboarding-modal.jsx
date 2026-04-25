function OnboardingModal(props) {
    const {
        showOnboarding,
        onboardingStep,
        finishOnboarding,
        onboardingNever,
        setOnboardingNever,
        setOnboardingStep,
    } = props;
    return (
        showOnboarding && onboardingStep >= 1 && onboardingStep <= 5 && (() => {
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
              })()
    );
}
window.OnboardingModal = OnboardingModal;
