const { useState, useEffect, useRef, useCallback, useMemo } = React;

const MissingPanel = ({ name }) => React.createElement(
    'div',
    { className: 'p-4 text-center', style: { color: '#e2e8f0' } },
    React.createElement('h2', { className: 'text-xl font-bold mb-2', style: { color: '#fbbf24' } }, 'Componente pendiente'),
    React.createElement('p', null, `No se encontró ${name} en window.`)
);

const getCmp = (name) => window[name] || ((props) => React.createElement(MissingPanel, { name, ...props }));
const getBoundaryCmp = () => window.MullerErrorBoundary || React.Fragment;

const TabPlaceholder = ({ title, go }) => React.createElement('div', { className: 'p-6 max-w-lg mx-auto text-center' },
    React.createElement('h2', { className: 'text-xl font-bold mb-2', style: { color: '#fbbf24' } }, title),
    React.createElement('p', { className: 'text-sm mb-4', style: { color: '#94a3b8' } }, 'Esta sección depende de estado aún no migrado a app-init. No debería bloquear el resto de la app; lo conectaremos en un siguiente paso.'),
    React.createElement('button', { type: 'button', onClick: () => go('inicio'), className: 'px-4 py-2.5 rounded-xl bg-indigo-700 text-white text-sm font-bold' }, 'Volver al inicio')
);

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
        const InicioPanelCmp = getCmp('InicioPanel');
        const AdvancedPracticePanelFinalCmp = getCmp('AdvancedPracticePanelFinal');
        const EscrituraPanelCmp = getCmp('EscrituraPanel');
        const LecturaPanelCmp = getCmp('LecturaPanel');
        const HistoriaPanelCmp = getCmp('HistoriaPanel');
        const VocabSRSCmp = getCmp('VocabSRS');
        const RutaPanelCmp = getCmp('RutaPanel');
        const ComunidadPanelCmp = getCmp('ComunidadPanel');
        const BibliotecaPanelCmp = getCmp('BibliotecaPanel');
        const TelcLevelsCmp = getCmp('TelcLevels');
        const inicioSafeProps = {
            healthSnapshot: {
                ok: false,
                micOk: false,
                micLabel: 'No disponible',
                voiceCount: 0,
                savedScriptsCount: 0,
                storyScenesCount: 0,
                listeningBusy: false,
            },
            showSelfCheckPanel: false,
            setShowSelfCheckPanel: () => {},
            getSelfCheckItems: () => [],
            vocabSrsDueCount: 0,
            setActiveTab: go,
            setMode: () => {},
            stopAudio: () => {},
            setPracticeActive: () => {},
            setVocabDueFilterOnly: () => {},
            setBxBankLevel: () => {},
            setBxCategory: () => {},
            setShowMullerHub: () => {},
            setMullerHubTab: () => {},
            setTourStep: () => {},
        };

        switch (activeTab) {
            case 'inicio': return React.createElement(InicioPanelCmp, { user, go, toggleProfile, toggleOnboarding, vocabData, setVocabData, ...inicioSafeProps });
            case 'entrenamiento': return React.createElement(AdvancedPracticePanelFinalCmp, { user, go });
            case 'escritura': return React.createElement(EscrituraPanelCmp, { user, go });
            case 'lectura': return React.createElement(LecturaPanelCmp, { user, go });
            case 'historia': return React.createElement(HistoriaPanelCmp, { user, go });
            case 'vocabulario': return React.createElement(VocabSRSCmp, { user });
            case 'ruta': return React.createElement(RutaPanelCmp, { user, go });
            case 'comunidad': return React.createElement(ComunidadPanelCmp, { user, go });
            case 'biblioteca': return React.createElement(BibliotecaPanelCmp, { go });
            case 'guiones': return React.createElement(BibliotecaPanelCmp, { go });
            case 'telc': return React.createElement(TelcLevelsCmp, { go });
            case 'shadowing': return React.createElement(TabPlaceholder, { title: 'Shadowing', go });
            case 'bxbank': return React.createElement(TabPlaceholder, { title: 'Banco B1 / B2', go });
            case 'progreso': return React.createElement(TabPlaceholder, { title: 'Progreso y estadísticas', go });
            case 'lexikon': return React.createElement(TabPlaceholder, { title: 'Lexikon / diccionario', go });
            case 'storybuilder': return React.createElement(TabPlaceholder, { title: 'IA – Story builder', go });
            case 'historiaspro': return React.createElement(TabPlaceholder, { title: 'Historias Pro', go });
            default: return React.createElement(InicioPanelCmp, { user, go, toggleProfile, toggleOnboarding, vocabData, setVocabData, ...inicioSafeProps });
        }
    })();

    const topTabs = [
        { key: 'inicio', label: 'INICIO', icon: 'layout-dashboard' },
        { key: 'ruta', label: 'RUTA', icon: 'map' },
        { key: 'historia', label: 'HISTORIA', icon: 'play' },
        { key: 'lectura', label: 'LECTURA', icon: 'mic' },
        { key: 'shadowing', label: 'SHADOW', icon: 'audio-lines' },
        { key: 'escritura', label: 'ESCRITURA', icon: 'pen-line' },
        { key: 'vocabulario', label: 'VOCAB', icon: 'book-open' },
        { key: 'entrenamiento', label: 'ENTRENA', icon: 'graduation-cap' },
        { key: 'bxbank', label: 'B1/B2', icon: 'target' },
    ];

    const bottomTabs = [
        { key: 'progreso', label: 'Progreso', icon: 'bar-chart' },
        { key: 'guiones', label: 'Biblioteca', icon: 'file-text' },
        { key: 'lexikon', label: 'Lexikon', icon: 'library' },
        { key: 'telc', label: 'TELC', icon: 'clipboard-check' },
        { key: 'storybuilder', label: 'IA', icon: 'sparkles' },
        { key: 'historiaspro', label: 'Pro', icon: 'feather' },
        { key: 'comunidad', label: 'Comunidad', icon: 'trophy' },
    ];

    return React.createElement('div', { className: 'h-full muller-main-fill flex flex-col', style: { background: '#000', color: '#e2e8f0' } },
        React.createElement('div', { className: 'muller-top-nav flex-shrink-0' },
            React.createElement('div', { className: 'muller-nav-row' },
                topTabs.map(t => React.createElement('button', {
                    key: t.key,
                    type: 'button',
                    onClick: () => go(t.key),
                    className: `flex flex-col items-center justify-center rounded-xl py-2 px-2 transition-all ${activeTab === t.key ? 'bg-white/10 border border-white/15 shadow-sm' : 'opacity-60 hover:opacity-85'}`,
                    style: { minWidth: 'var(--muller-nav-tab-w, 68px)' }
                },
                    React.createElement('div', { className: 'nav-tab-icon' },
                        React.createElement(getCmp('Icon'), { name: t.icon, size: 18 })
                    ),
                    React.createElement('span', { className: 'text-[10px] font-semibold tracking-wide mt-1', style: { color: '#94a3b8' } }, t.label)
                ))
            )
        ),
        React.createElement('div', {
            className: 'flex-1 overflow-y-auto hide-scrollbar muller-app-main',
            style: { padding: '0 10px 10px', paddingBottom: 'calc(var(--muller-mobile-bottom-nav-h, 5rem) + max(0.5rem, env(safe-area-inset-bottom, 0px)))' }
        }, content),
        React.createElement('nav', { className: 'muller-mobile-bottom-nav', 'aria-label': 'Navegación inferior' },
            bottomTabs.map(t => React.createElement('button', {
                key: t.key,
                type: 'button',
                onClick: () => go(t.key),
                className: activeTab === t.key ? 'is-active' : ''
            },
                React.createElement(getCmp('Icon'), { name: t.icon, className: 'w-4 h-4' }),
                t.label
            ))
        )
    );
}

// ====== OCULTAR PREBOOT ======
const hidePreboot = () => {
    const el = document.getElementById('muller-preboot');
    if (!el) return;
    el.classList.add('is-hidden');
    window.setTimeout(() => {
        try { if (el && el.parentNode) el.parentNode.removeChild(el); } catch (e) {}
    }, 320);
};
if (typeof window !== 'undefined') window.mullerDismissPreboot = hidePreboot;

// ====== RENDER ======
const bootApp = () => {
    const ErrorBoundaryCmp = getBoundaryCmp();
    const FloatingButtonsCmp = getCmp('FloatingButtons');

    try {
        const rootNode = document.getElementById('root');
        if (!rootNode) return;
        const root = ReactDOM.createRoot(rootNode);
        root.render(
            React.createElement(ErrorBoundaryCmp, null,
                React.createElement(React.Fragment, null,
                    React.createElement(App, null),
                    React.createElement(FloatingButtonsCmp, null)
                )
            )
        );
    } catch (err) {
        try {
            const rootNode = document.getElementById('root');
            if (rootNode) {
                rootNode.innerHTML = '<div style="min-height:100vh;background:#020617;color:#fff;display:flex;align-items:center;justify-content:center;padding:16px;text-align:center;font-family:Outfit,system-ui">Error de arranque. Revisa consola (F12).</div>';
            }
        } catch (e) {}
    } finally { /* preboot: el usuario la cierra con el logo o con window.mullerDismissPreboot */ }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp, { once: true });
} else {
    bootApp();
}