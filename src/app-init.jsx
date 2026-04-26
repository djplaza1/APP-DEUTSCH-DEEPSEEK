const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ====== COMPONENTE PRINCIPAL APP ======
function App() {
    const [activeTab, setActiveTab] = useState(window.__mullerTab || 'inicio');
    const [vocabData, setVocabData] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [user, setUser] = useState(null);
    const [quickMode, setQuickMode] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);

    useEffect(() => {
        if (window.__mullerOnUserChange) {
            window.__mullerOnUserChange(setUser);
        }
        if (window.__mullerOnTabChange) {
            window.__mullerOnTabChange(setActiveTab);
        }
    }, []);

    const go = useCallback((tab) => {
        setActiveTab(tab);
        window.__mullerTab = tab;
    }, []);

    const toggleProfile = useCallback(() => setProfileOpen(p => !p), []);
    const toggleOnboarding = useCallback(() => setOnboardingOpen(o => !o), []);

    const content = (() => {
        switch (activeTab) {
            case 'inicio': return React.createElement(InicioPanel, { user, go, toggleProfile, toggleOnboarding, vocabData, setVocabData });
            case 'entrenamiento': return React.createElement(AdvancedPracticePanelFinal, { user, go });
            case 'escritura': return React.createElement(EscrituraPanel, { user, go });
            case 'lectura': return React.createElement(LecturaPanel, { user, go });
            case 'historia': return React.createElement(HistoriaPanel, { user, go });
            case 'vocabulario': return React.createElement(VocabSRS, { user });
            case 'ruta': return React.createElement(RutaPanel, { user, go });
            case 'comunidad': return React.createElement(ComunidadPanel, { user, go });
            case 'biblioteca': return React.createElement(BibliotecaPanel, { go });
            case 'telc': return React.createElement(TelcLevels, { go });
            default: return React.createElement(InicioPanel, { user, go, toggleProfile, toggleOnboarding, vocabData, setVocabData });
        }
    })();

    const tabs = [
        { key: 'inicio', label: 'INICIO', icon: 'home' },
        { key: 'entrenamiento', label: 'EJERCICIOS', icon: 'dumbbell' },
        { key: 'escritura', label: 'ESCRIBIR', icon: 'pen-tool' },
        { key: 'lectura', label: 'LEER', icon: 'book-open' },
        { key: 'historia', label: 'HISTORIAS', icon: 'book-audio' },
        { key: 'vocabulario', label: 'VOCABULARIO', icon: 'book-heart' },
        { key: 'ruta', label: 'RUTA', icon: 'map' },
        { key: 'comunidad', label: 'COMUNIDAD', icon: 'users' },
        { key: 'biblioteca', label: 'BIBLIOTECA', icon: 'library' },
        { key: 'telc', label: 'TELC', icon: 'graduation-cap' },
    ];

    return React.createElement('div', { className: 'h-full flex flex-col', style: { background: '#000', color: '#e2e8f0' } },
        React.createElement('div', { className: 'muller-top-nav flex-shrink-0' },
            React.createElement('div', { className: 'muller-nav-row' },
                tabs.map(t => React.createElement('button', {
                    key: t.key,
                    onClick: () => go(t.key),
                    className: `flex flex-col items-center justify-center rounded-xl py-2 px-2 transition-all ${activeTab === t.key ? 'bg-white/10 border border-white/15 shadow-sm' : 'opacity-60 hover:opacity-85'}`,
                    style: { minWidth: 'var(--muller-nav-tab-w, 68px)' }
                },
                    React.createElement('div', { className: 'nav-tab-icon' },
                        React.createElement(Icon, { name: t.icon, size: 18 })
                    ),
                    React.createElement('span', { className: 'text-[10px] font-semibold tracking-wide mt-1', style: { color: '#94a3b8' } }, t.label)
                ))
            )
        ),
        React.createElement('div', { className: 'flex-1 overflow-y-auto hide-scrollbar', style: { padding: '0 10px 10px' } }, content)
    );
}

// ====== OCULTAR PREBOOT ======
const hidePreboot = () => {
    const el = document.getElementById('muller-preboot');
    if (!el) return;
    el.classList.add('is-hidden');
    window.setTimeout(() => {
        try { if (el && el.parentNode) el.parentNode.removeChild(el); } catch (e) {}
    }, 260);
};

// ====== RENDER ======
document.addEventListener('DOMContentLoaded', () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        React.createElement(MullerErrorBoundary, null,
            React.createElement(React.Fragment, null,
        React.createElement(App, null),
        React.createElement(FloatingButtons, null),
        React.createElement(AdvancedPracticePanelFinal, null)
            )
        )
    );
    window.requestAnimationFrame(() => window.requestAnimationFrame(hidePreboot));
});