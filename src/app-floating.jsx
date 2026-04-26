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
                    window.__mullerToast && window.__mullerToast('SRS importado. Recargando…', 'success');
                    window.location.reload();
                    return;
                }
                if (data.type === 'muller_partial_v1' && data.part === 'decks') {
                    const cur = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                    const merged = { ...cur, difficultVocab: data.difficultVocab || cur.difficultVocab, normalVocab: data.normalVocab || cur.normalVocab, difficultGrammar: data.difficultGrammar || cur.difficultGrammar };
                    localStorage.setItem('mullerStats', JSON.stringify(merged));
                    window.__mullerToast && window.__mullerToast('Mazos importados. Recargando…', 'success');
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
                window.__mullerToast && window.__mullerToast('Datos importados correctamente. Recargando…', 'success');
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