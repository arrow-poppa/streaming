// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "scheda audio",
  "last card": "ultima scheda",
  "new card": "nuova scheda",
  "Still adding the previous card…": "Sto ancora aggiungendo la scheda precedente…",
  "Updated card in {deck}": "Scheda aggiornata in {deck}",
  "Added to {deck}": "Aggiunta a {deck}",
  "{n}s recorded": "{n}s registrati",
  "Recording → {target}. Press again to stop.":
    "Registrazione → {target}. Premi di nuovo per fermare.",
  "the video went back since the recording started":
    "il video è tornato indietro dall’inizio della registrazione",
  "too short": "troppo breve",
  "longer than the {n}s limit": "supera il limite di {n}s",
  "Recording discarded: {reason}": "Registrazione scartata: {reason}",
  "Stopped · {n}s recorded · adding card…": "Fermata · {n}s registrati · aggiungo la scheda…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "Le schede Anki dal player richiedono il player mpv nell’app desktop.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "Nessun sottotitolo sullo schermo. Usa una scorciatoia Registra per le parti senza sottotitoli.",
  "Subtitle dictionary": "Dizionario dei sottotitoli",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "Passa il mouse su una parola dei sottotitoli per cercarla nei tuoi dizionari Yomitan, ascoltarla e aggiungerla ad Anki. Usa il motore di dizionari di Manatan.",
  "Look up words in subtitles": "Cerca parole nei sottotitoli",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Funziona con i sottotitoli di Harbor e con i sottotitoli con stile (ASS) disegnati da mpv. I sottotitoli immagine (PGS) non hanno testo da cercare.",
  "Pause while the popup is open": "Metti in pausa mentre il popup è aperto",
  "Resumes when the popup closes.": "Riprende quando il popup si chiude.",
  "Keep the popup open when the mouse leaves": "Tieni aperto il popup quando il mouse esce",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "Il popup (e la pausa) resta finché non fai clic fuori o premi Esc.",
  "Look up with": "Cerca con",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "Il passaggio del mouse cerca le parole mentre il mouse ci passa sopra. Con un tasto, tienilo premuto mentre passi il mouse (o premilo su una parola) e il semplice passaggio non fa nulla. Un clic su una parola la cerca sempre.",
  "Hover": "Passaggio del mouse",
  "Hold Shift": "Tieni premuto Maiusc",
  "Hold Ctrl": "Tieni premuto Ctrl",
  "Hold Alt": "Tieni premuto Alt",
  "Scan delay (in milliseconds)": "Ritardo di ricerca (in millisecondi)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "Attesa prima di cercare la parola sotto il mouse quando non serve alcun tasto. Più basso è più veloce; più alto evita ricerche quando il mouse passa soltanto sul sottotitolo.",
  "Keep subtitles above the seek bar": "Tieni i sottotitoli sopra la barra di avanzamento",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "La barra di avanzamento copre la riga più bassa del sottotitolo, quindi alza i sottotitoli sopra di essa mentre cerchi parole.",
  "Same setting as Player → Subtitles.": "Stessa impostazione di Player → Sottotitoli.",
  "Subtitle height": "Altezza dei sottotitoli",
  "Distance from the bottom of the video.": "Distanza dal fondo del video.",
  "Subtitle language": "Lingua dei sottotitoli",
  "Picks the deinflection rules used for lookups.":
    "Sceglie le regole di deflessione usate nelle ricerche.",
  "Loading dictionaries…": "Caricamento dei dizionari…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "Ancora nessun dizionario. Importa file .zip di Yomitan come JMdict o Jitendex.",
  "Importing {name}…": "Importazione di {name}…",
  "Import dictionary (.zip)": "Importa dizionario (.zip)",
  "AI Explanation": "Spiegazione IA",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "Genera una spiegazione contestuale della parola cercata con il tuo provider di IA. Le richieste vanno direttamente da questo dispositivo a qualsiasi endpoint compatibile con OpenAI (OpenRouter, OpenAI, DeepSeek, Groq, un server locale…).",
  "AI explanation in the popup": "Spiegazione IA nel popup",
  "Shows the explanation above the dictionary entries.":
    "Mostra la spiegazione sopra le voci del dizionario.",
  "Custom endpoint": "Endpoint personalizzato",
  "Full URL, used exactly as entered. No path is appended.":
    "URL completo, usato esattamente come scritto. Non viene aggiunto alcun percorso.",
  "Stored on this device only.": "Salvata solo su questo dispositivo.",
  "Model ID sent to the provider.": "ID del modello inviato al provider.",
  "OpenRouter provider routing": "Instradamento dei provider OpenRouter",
  "Prioritize listed providers": "Dai priorità ai provider elencati",
  "Only listed providers": "Solo i provider elencati",
  "Ignore listed providers": "Ignora i provider elencati",
  "OpenRouter provider slugs": "Slug dei provider OpenRouter",
  "Separated by commas or line breaks.": "Separati da virgole o a capo.",
  "Allow OpenRouter fallbacks": "Consenti i fallback di OpenRouter",
  "Thinking mode": "Modalità di ragionamento",
  "Thinking intensity": "Intensità del ragionamento",
  "Custom thinking value": "Valore di ragionamento personalizzato",
  "A word, a token count, or a JSON object.": "Una parola, un numero di token o un oggetto JSON.",
  "Custom request body JSON": "JSON personalizzato del corpo della richiesta",
  "A JSON object merged over the generated request.":
    "Un oggetto JSON unito sopra la richiesta generata.",
  "Auto generate on lookup": "Genera automaticamente alla ricerca",
  "When off, the box appears without sending a request and you generate it manually.":
    "Se disattivato, il riquadro appare senza inviare richieste e la generi manualmente.",
  "Real time response": "Risposta in tempo reale",
  "Stream the explanation into the popup as it is written.":
    "Trasmette la spiegazione nel popup mentre viene scritta.",
  "Cancel unfinished requests": "Annulla le richieste non concluse",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "Scarta una spiegazione ancora in generazione quando il popup si chiude o si cerca un’altra parola.",
  "Fallback for unknown words": "Ripiego per parole sconosciute",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "Apre il popup per le parole che nessun dizionario contiene, con la sola spiegazione IA, così possono comunque andare in Anki.",
  "Custom prompt": "Prompt personalizzato",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "Usa {{target}} per la parola e {{sentence}} per il suo contesto.",
  "System prompt": "Prompt di sistema",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "Istruzioni facoltative inviate prima del prompt dell’utente. Lascia vuoto per non inviarne.",
  "Temperature": "Temperatura",
  "Between 0 and 2. Lower is more deterministic.": "Tra 0 e 2. Più basso è più deterministico.",
  "Word audio": "Audio della parola",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "Riproduce ed estrae pronunce da un database local-audio-yomichan (Forvo, NHK16, Shinmeikai8, JPod101). Scegli android.db, oppure entries.db accanto alle cartelle *_files. La versione Flatpak può leggere solo android.db.",
  "No database selected": "Nessun database selezionato",
  "Choose database": "Scegli database",
  "Connected to Anki": "Connesso ad Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "Aggiunge schede tramite AnkiConnect con la parola, la frase, le definizioni, uno screenshot, l’audio della frase e l’audio della parola. Anki deve essere aperto con il componente aggiuntivo AnkiConnect.",
  "AnkiConnect address": "Indirizzo di AnkiConnect",
  "Deck": "Mazzo",
  "Choose…": "Scegli…",
  "Connect first": "Connettiti prima",
  "Note type": "Tipo di nota",
  "Fields": "Campi",
  "Auto-fill": "Compila automaticamente",
  "Separated by spaces.": "Separati da spazi.",
  "Sentence audio padding": "Margine dell’audio della frase",
  "Seconds added before and after the subtitle line.":
    "Secondi aggiunti prima e dopo la riga del sottotitolo.",
  "Animated clip format": "Formato della clip animata",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "Per i campi impostati sulla clip animata. AVIF è il più leggero; WebP e GIF funzionano nelle versioni meno recenti di Anki. Ripiega su WebP, poi GIF, se manca un encoder.",
  "Animated clip size": "Dimensione della clip animata",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "Larghezza in pixel e fotogrammi al secondo. Le clip si fermano dopo 12 secondi.",
  "Allow duplicate cards": "Consenti schede duplicate",
  "When off, words already in the deck are refused.":
    "Se disattivato, le parole già presenti nel mazzo vengono rifiutate.",
  "Immersion": "Immersione",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "Schede direttamente dal player, senza cercare una parola: dal sottotitolo sullo schermo, o da un tratto che registri con due pressioni dello stesso tasto (funziona senza sottotitoli). Imposta i tasti in Impostazioni → Scorciatoie → Immersione. Solo mpv.",
  "Sentence cards": "Schede di frase",
  "Pick a deck and note type above": "Scegli sopra un mazzo e un tipo di nota",
  "Map a field to Sentence audio above": "Associa sopra un campo all’Audio della frase",
  "Audio cards": "Schede audio",
  "Audio card deck": "Mazzo delle schede audio",
  "Audio card note type": "Tipo di nota delle schede audio",
  "Audio field": "Campo audio",
  "Gets the audio of the line or of the recording.":
    "Riceve l’audio della riga o della registrazione.",
  "Pick a note type first": "Scegli prima un tipo di nota",
  "Sentence field (optional)": "Campo della frase (facoltativo)",
  "Gets the subtitle text, when there is one.": "Riceve il testo del sottotitolo, se c’è.",
  "(empty)": "(vuoto)",
  "Update last card window": "Finestra di Aggiorna l’ultima scheda",
  "Update last card only touches a card added this many minutes ago or less.":
    "Aggiorna l’ultima scheda modifica solo una scheda aggiunta al massimo questo numero di minuti fa.",
  "Longest recording": "Registrazione più lunga",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "Una registrazione più lunga di così viene scartata. Le clip animate si fermano comunque dopo 12 secondi.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "Le ricerche nel dizionario dei sottotitoli, l’audio delle parole e l’estrazione per Anki funzionano nell’app desktop di Harbor.",
  "Download the desktop app to look up words while you watch.":
    "Scarica l’app desktop per cercare parole mentre guardi.",
  "Long seek": "Salto lungo",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "Il salto delle scorciatoie Salto lungo indietro e Salto lungo avanti.",
  "Slow speed": "Velocità lenta",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "La velocità a cui passa la scorciatoia Attiva/disattiva velocità lenta dalla velocità normale.",
  "Word": "Parola",
  "Word with furigana": "Parola con furigana",
  "Definitions (all)": "Definizioni (tutte)",
  "Definition (first dictionary)": "Definizione (primo dizionario)",
  "Sentence": "Frase",
  "Sentence (word in bold)": "Frase (parola in grassetto)",
  "Sentence (word as cloze)": "Frase (parola come cloze)",
  "Sentence audio": "Audio della frase",
  "Word audio (local)": "Audio della parola (locale)",
  "Animated clip of the line (AVIF/WebP/GIF)": "Clip animata della riga (AVIF/WebP/GIF)",
  "Frequency": "Frequenza",
  "Pitch accent": "Accento tonale",
  "Title / episode": "Titolo / episodio",
  "AI explanation": "Spiegazione IA",
  "Text selected in the popup (else first definition)":
    "Testo selezionato nel popup (altrimenti la prima definizione)",
  "Not a valid JSON object.": "Non è un oggetto JSON valido.",
  "Toggle subtitles on/off": "Attiva/disattiva sottotitoli",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "Nasconde tutti i sottotitoli (principale e secondario), o ripristina l’ultima traccia principale.",
  "Next subtitle line": "Riga di sottotitolo successiva",
  "Jump to the start of the next subtitle line.":
    "Salta all’inizio della riga di sottotitolo successiva.",
  "Previous subtitle line": "Riga di sottotitolo precedente",
  "Jump to the start of the previous subtitle line.":
    "Salta all’inizio della riga di sottotitolo precedente.",
  "Toggle slow speed": "Attiva/disattiva velocità lenta",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "Alterna tra la velocità normale e la velocità lenta impostata in Comportamento (0,5x per impostazione predefinita).",
  "Anki: card from the subtitle": "Anki: scheda dal sottotitolo",
  "Anki: update last card": "Anki: aggiorna l’ultima scheda",
  "Anki: audio card": "Anki: scheda audio",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "Aggiunge una scheda solo audio dalla riga sullo schermo, usando il mazzo delle schede audio. Solo mpv.",
  "Record → new card": "Registra → nuova scheda",
  "Record → update last card": "Registra → aggiorna l’ultima scheda",
  "Record → audio card": "Registra → scheda audio",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "Premi una volta per iniziare a registrare e di nuovo per fermare e aggiungere una scheda audio con quel tratto. Funziona senza sottotitoli. Solo mpv.",
  "Long seek back": "Salto lungo indietro",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "Torna indietro del passo di Salto lungo impostato in Comportamento (30 secondi per impostazione predefinita).",
  "Long seek forward": "Salto lungo avanti",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "Va avanti del passo di Salto lungo impostato in Comportamento (30 secondi per impostazione predefinita).",
  "Greek": "Greco",
  "Latin": "Latino",
  "Replay current subtitle": "Ripeti il sottotitolo attuale",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "Torna all’inizio della riga sullo schermo e la riproduce di nuovo, o dell’ultima mostrata se non ce n’è nessuna.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "Le scorciatoie Scheda dal sottotitolo, Aggiorna l’ultima scheda e Registra → scheda usano il mazzo, il tipo di nota e i campi della sezione Anki sopra. Con una parola selezionata nel sottotitolo (evidenziata scegliendo una parola, o in un popup aperto) vengono compilati tutti i campi associati, parola e definizioni comprese; senza, solo frase, audio della frase, screenshot o clip e titolo.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "Aggiunge una scheda dalla riga sullo schermo con frase, audio e immagine, usando il mazzo e i campi di Dizionario e Anki. Con una parola selezionata nel sottotitolo, anche la parola e le sue definizioni vanno nella scheda. Solo mpv.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "Inserisce la riga sullo schermo (frase, audio, immagine) nella scheda più recente del mazzo, se è stata aggiunta negli ultimi minuti. Con una parola selezionata, anche la parola e le definizioni. Solo mpv.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "Premi una volta per iniziare a registrare e di nuovo per fermare e aggiungere una scheda con quel tratto. Funziona senza sottotitoli. Con una parola selezionata quando fermi, anche la parola e le definizioni vanno nella scheda. Solo mpv.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "Premi una volta per iniziare a registrare e di nuovo per fermare e inserire quel tratto nella scheda più recente. Funziona senza sottotitoli. Con una parola selezionata quando fermi, anche la parola e le definizioni. Solo mpv.",
  "Added {word} to {deck}": "{word} aggiunta a {deck}",
  "Updated card in {deck} with {word}": "Scheda in {deck} aggiornata con {word}",
};
