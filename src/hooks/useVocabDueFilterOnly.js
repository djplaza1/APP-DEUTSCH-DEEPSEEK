// Hook para el filtro 'Solo vencidas / nuevas hoy' en Vocabulario
window.useVocabDueFilterOnly = function() {
    const [vocabDueFilterOnly, setVocabDueFilterOnly] = React.useState(false);
    return { vocabDueFilterOnly, setVocabDueFilterOnly };
};
