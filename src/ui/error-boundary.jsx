class MullerErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: '' };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, message: error && error.message ? String(error.message) : 'Error inesperado' };
    }
    componentDidCatch(error, errorInfo) {
        try { console.error('MullerErrorBoundary', error, errorInfo); } catch (e) {}
    }
    handleReload = () => {
        try { window.location.reload(); } catch (e) {}
    };
    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ width: '100%', maxWidth: '540px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '14px', background: 'rgba(15,23,42,0.85)', padding: '1rem 1.1rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Se recuperó un error de la interfaz</h2>
                    <p style={{ margin: '0.55rem 0 0.2rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                        La app evitó una pantalla negra completa. Puedes recargar para continuar.
                    </p>
                    <p style={{ margin: '0.35rem 0 0.9rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                        Detalle: {this.state.message || 'sin detalle'}
                    </p>
                    <button type="button" onClick={this.handleReload} style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.55rem 0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                        Recargar aplicación
                    </button>
                </div>
            </div>
        );
    }
}

window.MullerErrorBoundary = MullerErrorBoundary;
