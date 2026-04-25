        window.MULLER_RUTA_LEVELS = [
            {
                id: 'a0-1',
                title: 'Nivel 0 · Base absoluta',
                badge: 'A0',
                lessons: [
                    {
                        id: 'a0-1-l1',
                        title: 'Sonidos + presentaciones mínimas',
                        topic: 'presentacion',
                        rewardCoins: 12,
                        rewardXp: 18,
                        grammarTip: 'En alemán, la frase base suele ir con verbo en 2ª posición: Ich bin Ana.',
                        phrases: [
                            { de: 'Ich bin Ana.', es: 'Soy Ana.' },
                            { de: 'Ich komme aus Sevilla.', es: 'Vengo de Sevilla.' },
                            { de: 'Ich lerne Deutsch.', es: 'Aprendo alemán.' }
                        ],
                        fill: { prompt: 'Completa: Ich ___ Ana.', answer: 'bin', hint: 'Verbo «sein», 1ª persona.' },
                        speak: { target: 'Ich bin Ana.' }
                    },
                    {
                        id: 'a0-1-l2',
                        title: 'Clase y objetos básicos',
                        topic: 'clase',
                        rewardCoins: 12,
                        rewardXp: 18,
                        grammarTip: 'Memoriza sustantivo + artículo como bloque: der Tisch, die Tür, das Buch.',
                        phrases: [
                            { de: 'Das ist ein Buch.', es: 'Eso es un libro.' },
                            { de: 'Die Tür ist offen.', es: 'La puerta está abierta.' },
                            { de: 'Der Tisch ist groß.', es: 'La mesa es grande.' }
                        ],
                        fill: { prompt: 'Completa: Das ist ___ Buch.', answer: 'ein', hint: 'Artículo indefinido neutro.' },
                        speak: { target: 'Das ist ein Buch.' }
                    }
                ]
            },
            {
                id: 'a1-1',
                title: 'Nivel 1 · Primeros pasos',
                badge: 'A1.1',
                lessons: [
                    {
                        id: 'a1-1-l1',
                        title: 'Saludos y presentación',
                        topic: 'presentacion',
                        rewardCoins: 15,
                        rewardXp: 20,
                        grammarTip: 'En frases declarativas el verbo conjugado va en 2.ª posición: sujeto – verbo – resto.',
                        phrases: [
                            { de: 'Guten Tag! Ich heiße Maria.', es: '¡Buenos días! Me llamo María.' },
                            { de: 'Wie geht es dir?', es: '¿Cómo estás?' },
                            { de: 'Ich komme aus Spanien.', es: 'Vengo de España.' },
                        ],
                        fill: { prompt: 'Completa: Ich ___ aus Spanien.', answer: 'komme', hint: 'Verbo «kommen» en 1.ª persona singular.' },
                        speak: { target: 'Ich komme aus Spanien.' },
                    },
                    {
                        id: 'a1-1-l2',
                        title: 'Artículos básicos',
                        topic: 'hogar',
                        rewardCoins: 15,
                        rewardXp: 22,
                        grammarTip: 'der (m), die (f), das (n). Muchos plurales llevan «die».',
                        phrases: [
                            { de: 'Das Buch ist neu.', es: 'El libro es nuevo.' },
                            { de: 'Die Frau liest.', es: 'La mujer lee.' },
                            { de: 'Der Mann wartet.', es: 'El hombre espera.' },
                        ],
                        fill: { prompt: '___ Buch liegt hier. (neutro)', answer: 'Das', hint: 'Artículo neutro.' },
                        speak: { target: 'Das Buch ist neu.' },
                    },
                ],
            },
            {
                id: 'a1-2',
                title: 'Nivel 2 · Rutina',
                badge: 'A1.2',
                lessons: [
                    {
                        id: 'a1-2-l1',
                        title: 'Hora y días',
                        topic: 'rutina',
                        rewardCoins: 18,
                        rewardXp: 24,
                        grammarTip: '«Um acht Uhr» = a las ocho. Los días llevan mayúscula: Montag, Dienstag…',
                        phrases: [
                            { de: 'Ich stehe um sieben Uhr auf.', es: 'Me levanto a las siete.' },
                            { de: 'Am Montag gehe ich zur Arbeit.', es: 'El lunes voy al trabajo.' },
                            { de: 'Das Wochenende ist kurz.', es: 'El fin de semana es corto.' },
                        ],
                        fill: { prompt: 'Ich stehe ___ sieben Uhr auf.', answer: 'um', hint: 'Preposición para «a las» con hora.' },
                        speak: { target: 'Am Montag gehe ich zur Arbeit.' },
                    },
                    {
                        id: 'a1-2-l2',
                        title: 'Comida simple',
                        topic: 'alimentos',
                        rewardCoins: 18,
                        rewardXp: 25,
                        grammarTip: '«Ich möchte» + Akkusativ del objeto: Ich möchte einen Kaffee.',
                        phrases: [
                            { de: 'Ich esse gern Brot.', es: 'Me gusta comer pan.' },
                            { de: 'Ich trinke Wasser.', es: 'Bebo agua.' },
                            { de: 'Was isst du gern?', es: '¿Qué te gusta comer?' },
                        ],
                        fill: { prompt: 'Ich möchte ___ Kaffee. (masculino acusativo)', answer: 'einen', hint: 'Artículo acusativo masculino.' },
                        speak: { target: 'Ich esse gern Brot.' },
                    },
                ],
            },
            {
                id: 'a2-1',
                title: 'Nivel 3 · Conectar frases',
                badge: 'A2.1',
                lessons: [
                    {
                        id: 'a2-1-l1',
                        title: '«Weil» y verbo al final',
                        topic: 'conectores',
                        rewardCoins: 22,
                        rewardXp: 30,
                        grammarTip: 'Tras «weil/dass/obwohl» el verbo conjugado va al final de la suboración.',
                        phrases: [
                            { de: 'Ich lerne Deutsch, weil ich reisen möchte.', es: 'Estudio alemán porque quiero viajar.' },
                            { de: 'Weil es regnet, bleibe ich zu Hause.', es: 'Como llueve, me quedo en casa.' },
                        ],
                        fill: { prompt: 'Ich bleibe zu Hause, weil ich krank ___.', answer: 'bin', hint: 'Verbo «sein» al final (1.ª persona).' },
                        speak: { target: 'Ich lerne Deutsch, weil ich reisen möchte.' },
                    },
                    {
                        id: 'a2-1-l2',
                        title: 'Perfekt básico',
                        topic: 'gramatica',
                        rewardCoins: 22,
                        rewardXp: 32,
                        grammarTip: 'Perfekt: habe/hat + participio al final (regulares: ge- + stem + -t).',
                        phrases: [
                            { de: 'Ich habe gestern gearbeitet.', es: 'Ayer he trabajado.' },
                            { de: 'Sie hat das schon gemacht.', es: 'Ella ya lo ha hecho.' },
                        ],
                        fill: { prompt: 'Ich habe gestern viel ___. (arbeiten)', answer: 'gearbeitet', hint: 'Participio de «arbeiten».' },
                        speak: { target: 'Ich habe gestern gearbeitet.' },
                    },
                ],
            },
        ];

        window.MULLER_GRAMMAR_REF = [
            {
                level: 'A1',
                title: 'Fundamentos',
                blocks: [
                    { t: 'Orden de la frase (V2)', b: 'En la frase principal afirmativa, el verbo flexionado ocupa la segunda posición: «Heute gehe ich ins Kino.»' },
                    { t: 'Artículos y género', b: 'Memoriza sustantivo + artículo (der/die/das). El plural suele ser «die». Compara: der Tisch, die Lampe, das Fenster.' },
                    { t: 'Presente regular', b: 'Sufijos típicos: -e, -st, -t, -en. Irregulares comunes: sein, haben, werden.' },
                ],
            },
            {
                level: 'A2',
                title: 'Oraciones compuestas',
                blocks: [
                    { t: 'Subordinadas con «dass/weil/obwohl»', b: 'El verbo conjugado va al final: «Ich weiß, dass du kommst.»' },
                    { t: 'Perfekt', b: 'Auxiliar haben/sein + participio II. Muchos verbos de movimiento usan «sein» (sein, bleiben, passieren… contexto).' },
                    { t: 'Preposiciones y Kasus', b: 'Aprende bloques: «mit» + Dat., «für» + Akk., preposiciones de lugar «Wo?/Wohin?» con Dat./Akk.' },
                ],
            },
            {
                level: 'B1',
                title: 'Matices',
                blocks: [
                    { t: 'Konjunktiv II (politez)', b: '«Ich hätte gern…», «Könnten Sie…?» para peticiones suaves.' },
                    { t: 'Pasiva y alternativas', b: '«Es wird gemacht» / «Man macht» — reconocer sujeto impersonal.' },
                    { t: 'Conectores', b: '«trotzdem», «deshalb», «außerdem» — practica posición del verbo en cada tipo.' },
                ],
            },
            {
                level: 'B2',
                title: 'Estructuras avanzadas',
                blocks: [
                    { t: 'Conectores complejos', b: 'Introduce «während», «sobald», «falls», «hingegen». Ajusta el orden verbal según subordinada/principal.' },
                    { t: 'Nominalización y registro', b: 'Convierte acciones en sustantivos cuando el registro lo pide: «die Entscheidung treffen».' },
                    { t: 'Pasiva y enfoque informativo', b: 'Alterna activa/pasiva según el foco de la frase: proceso vs agente.' },
                ],
            },
            {
                level: 'C1',
                title: 'Precisión y estilo',
                blocks: [
                    { t: 'Conectores de argumentación', b: 'Usa «demzufolge», «folglich», «infolgedessen», «nichtsdestotrotz» con control de registro.' },
                    { t: 'Subordinación compleja', b: 'Encadena ideas con subordinadas sin perder claridad ni control de verbos al final.' },
                    { t: 'Matiz léxico', b: 'Elige verbo y conector por intención comunicativa (formal, neutral, académico).' },
                ],
            },
        ];

 window.MULLER_PLACEMENT_QUESTIONS = [
  // A1 (7 preguntas)
  { level: 'A1', q: 'Ich ___ aus Spanien.', opts: ['bin', 'habe', 'werde'], ok: 0 },
  { level: 'A1', q: '___ Buch liegt auf dem Tisch.', opts: ['Der', 'Die', 'Das'], ok: 2 },
  { level: 'A1', q: 'Wie ___ du?', opts: ['heißen', 'heißt', 'heiße'], ok: 1 },
  { level: 'A1', q: 'Wir ___ müde.', opts: ['sind', 'seid', 'ist'], ok: 0 },
  { level: 'A1', q: '___ ist dein Name?', opts: ['Was', 'Wie', 'Wo'], ok: 1 },
  { level: 'A1', q: 'Ich ___ gern Pizza.', opts: ['esse', 'isst', 'esst'], ok: 0 },
  { level: 'A1', q: 'Er ___ einen Hund.', opts: ['habe', 'hast', 'hat'], ok: 2 },

  // A2 (8 preguntas)
  { level: 'A2', q: 'Letzte Woche ___ wir im Kino.', opts: ['waren', 'sind', 'haben'], ok: 0 },
  { level: 'A2', q: 'Ich freue mich ___ das Wochenende.', opts: ['auf', 'über', 'für'], ok: 0 },
  { level: 'A2', q: 'Er ___ jeden Tag um 7 Uhr ___.', opts: ['steht ... auf', 'aufsteht', 'stehst ... auf'], ok: 0 },
  { level: 'A2', q: 'Das ist der Mann, ___ ich kenne.', opts: ['der', 'den', 'dem'], ok: 1 },
  { level: 'A2', q: 'Ich habe mein Buch ___.', opts: ['vergessen', 'vergesse', 'vergisst'], ok: 0 },
  { level: 'A2', q: '___ du mir helfen?', opts: ['Kannst', 'Kann', 'Können'], ok: 0 },
  { level: 'A2', q: 'Wir sind ___ Berlin gefahren.', opts: ['in', 'nach', 'zu'], ok: 1 },
  { level: 'A2', q: 'Er ___ krank, deshalb bleibt er zu Hause.', opts: ['ist', 'hat', 'wird'], ok: 0 },

  // B1 (8 preguntas)
  { level: 'B1', q: 'Wenn ich mehr Zeit ___, würde ich reisen.', opts: ['hätte', 'habe', 'gehabt'], ok: 0 },
  { level: 'B1', q: 'Das ist der Mann, mit ___ ich gesprochen habe.', opts: ['dem', 'der', 'den'], ok: 0 },
  { level: 'B1', q: 'Ich ___ gestern meine Oma ___.', opts: ['habe ... besucht', 'bin ... besucht', 'habe ... besuchen'], ok: 0 },
  { level: 'B1', q: '___ es regnet, bleiben wir drinnen.', opts: ['Wenn', 'Weil', 'Dass'], ok: 1 },
  { level: 'B1', q: 'Er ___ schon seit drei Jahren in Berlin.', opts: ['lebt', 'wohnt', 'arbeitet'], ok: 0 },
  { level: 'B1', q: 'Ich wünsche mir, dass du ___.', opts: ['kommst', 'kommst', 'kommen'], ok: 0 },
  { level: 'B1', q: 'Das Haus ___ 1990 ___.', opts: ['wurde ... gebaut', 'wird ... gebaut', 'ist ... gebaut'], ok: 0 },
  { level: 'B1', q: '___ du mich ___, wäre ich früher gekommen.', opts: ['Hättest ... angerufen', 'Hast ... angerufen', 'Würdest ... anrufen'], ok: 0 },

  // B2 (7 preguntas)
  { level: 'B2', q: 'Es ist wichtig, dass der Antrag rechtzeitig ___.', opts: ['eingereicht wird', 'eingereicht wurde', 'einreicht'], ok: 0 },
  { level: 'B2', q: '___ der hohen Kosten wurde das Projekt gestoppt.', opts: ['Wegen', 'Trotz', 'Aufgrund'], ok: 0 },
  { level: 'B2', q: 'Hätte ich das gewusst, ___ ich anders gehandelt.', opts: ['hätte', 'wäre', 'würde'], ok: 0 },
  { level: 'B2', q: 'Die Diskussion, ___ wir gestern geführt haben, war sehr interessant.', opts: ['die', 'der', 'das'], ok: 0 },
  { level: 'B2', q: 'Er gilt ___ einer der besten Experten.', opts: ['als', 'für', 'wie'], ok: 0 },
  { level: 'B2', q: '___ ich mich rechtzeitig beworben habe, wurde ich nicht eingeladen.', opts: ['Obwohl', 'Weil', 'Da'], ok: 0 },
  { level: 'B2', q: 'Die Maßnahmen ___ nur langsam ___.', opts: ['werden ... umgesetzt', 'wurden ... umgesetzt', 'sind ... umgesetzt'], ok: 0 },
];
