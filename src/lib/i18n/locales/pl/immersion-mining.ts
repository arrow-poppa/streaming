// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "karta audio",
  "last card": "ostatnia karta",
  "new card": "nowa karta",
  "Still adding the previous card…": "Nadal dodaję poprzednią kartę…",
  "Updated card in {deck}": "Zaktualizowano kartę w {deck}",
  "Added to {deck}": "Dodano do {deck}",
  "{n}s recorded": "Nagrano {n} s",
  "Recording → {target}. Press again to stop.":
    "Nagrywanie → {target}. Naciśnij ponownie, aby zatrzymać.",
  "the video went back since the recording started": "wideo cofnęło się od początku nagrywania",
  "too short": "za krótkie",
  "longer than the {n}s limit": "dłuższe niż limit {n} s",
  "Recording discarded: {reason}": "Nagranie odrzucone: {reason}",
  "Stopped · {n}s recorded · adding card…": "Zatrzymano · nagrano {n} s · dodaję kartę…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "Karty Anki z odtwarzacza wymagają odtwarzacza mpv w aplikacji na komputer.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "Brak napisów na ekranie. Dla fragmentów bez napisów użyj skrótu Nagraj.",
  "Subtitle dictionary": "Słownik napisów",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "Najedź na słowo w napisach, aby sprawdzić je w słownikach Yomitan, odsłuchać i dodać do Anki. Korzysta z silnika słowników Manatan.",
  "Look up words in subtitles": "Sprawdzaj słowa w napisach",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Działa z napisami Harbor i ze stylizowanymi napisami (ASS) rysowanymi przez mpv. Napisy graficzne (PGS) nie mają tekstu do sprawdzenia.",
  "Pause while the popup is open": "Wstrzymuj, gdy okienko jest otwarte",
  "Resumes when the popup closes.": "Wznawia po zamknięciu okienka.",
  "Keep the popup open when the mouse leaves": "Zostaw okienko otwarte, gdy mysz je opuści",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "Okienko (i pauza) zostaje, dopóki nie klikniesz obok lub nie naciśniesz Esc.",
  "Look up with": "Sprawdzaj za pomocą",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "Najechanie sprawdza słowa, gdy mysz nad nimi przechodzi. Z klawiszem przytrzymaj go podczas najeżdżania (albo naciśnij go nad słowem), a samo najechanie nic nie robi. Kliknięcie słowa zawsze je sprawdza.",
  "Hover": "Najechanie",
  "Hold Shift": "Przytrzymaj Shift",
  "Hold Ctrl": "Przytrzymaj Ctrl",
  "Hold Alt": "Przytrzymaj Alt",
  "Scan delay (in milliseconds)": "Opóźnienie wyszukiwania (w milisekundach)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "Czas oczekiwania przed sprawdzeniem słowa pod myszą, gdy klawisz nie jest wymagany. Mniej to szybciej; więcej zapobiega wyszukiwaniu, gdy mysz tylko przechodzi nad napisami.",
  "Keep subtitles above the seek bar": "Trzymaj napisy nad paskiem przewijania",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "Pasek przewijania zasłania najniższy wiersz napisów, więc podnieś napisy nad niego, gdy sprawdzasz słowa.",
  "Same setting as Player → Subtitles.": "To samo ustawienie co Odtwarzacz → Napisy.",
  "Subtitle height": "Wysokość napisów",
  "Distance from the bottom of the video.": "Odległość od dołu wideo.",
  "Subtitle language": "Język napisów",
  "Picks the deinflection rules used for lookups.":
    "Wybiera reguły deflekcji używane przy wyszukiwaniu.",
  "Loading dictionaries…": "Wczytywanie słowników…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "Nie ma jeszcze słowników. Zaimportuj pliki .zip Yomitan, np. JMdict lub Jitendex.",
  "Importing {name}…": "Importowanie {name}…",
  "Import dictionary (.zip)": "Importuj słownik (.zip)",
  "AI Explanation": "Wyjaśnienie AI",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "Generuj wyjaśnienie sprawdzonego słowa w kontekście u własnego dostawcy AI. Zapytania idą z tego urządzenia prosto do dowolnego endpointu zgodnego z OpenAI (OpenRouter, OpenAI, DeepSeek, Groq, lokalny serwer…).",
  "AI explanation in the popup": "Wyjaśnienie AI w okienku",
  "Shows the explanation above the dictionary entries.":
    "Pokazuje wyjaśnienie nad hasłami ze słownika.",
  "Custom endpoint": "Własny endpoint",
  "Full URL, used exactly as entered. No path is appended.":
    "Pełny URL, używany dokładnie tak, jak wpisano. Nie jest dodawana żadna ścieżka.",
  "Stored on this device only.": "Przechowywany tylko na tym urządzeniu.",
  "Model ID sent to the provider.": "ID modelu wysyłane do dostawcy.",
  "OpenRouter provider routing": "Routing dostawców OpenRouter",
  "Prioritize listed providers": "Preferuj wymienionych dostawców",
  "Only listed providers": "Tylko wymienieni dostawcy",
  "Ignore listed providers": "Pomijaj wymienionych dostawców",
  "OpenRouter provider slugs": "Slugi dostawców OpenRouter",
  "Separated by commas or line breaks.": "Oddzielone przecinkami lub nowymi wierszami.",
  "Allow OpenRouter fallbacks": "Zezwalaj na zapasowych dostawców OpenRouter",
  "Thinking mode": "Tryb myślenia",
  "Thinking intensity": "Intensywność myślenia",
  "Custom thinking value": "Własna wartość myślenia",
  "A word, a token count, or a JSON object.": "Słowo, liczba tokenów lub obiekt JSON.",
  "Custom request body JSON": "Własny JSON treści zapytania",
  "A JSON object merged over the generated request.":
    "Obiekt JSON scalany z wygenerowanym zapytaniem.",
  "Auto generate on lookup": "Generuj automatycznie przy wyszukiwaniu",
  "When off, the box appears without sending a request and you generate it manually.":
    "Gdy wyłączone, pole pojawia się bez wysyłania zapytania, a wyjaśnienie generujesz ręcznie.",
  "Real time response": "Odpowiedź w czasie rzeczywistym",
  "Stream the explanation into the popup as it is written.":
    "Przesyła wyjaśnienie do okienka w trakcie pisania.",
  "Cancel unfinished requests": "Anuluj niedokończone zapytania",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "Odrzuca wciąż generowane wyjaśnienie, gdy okienko się zamyka lub sprawdzane jest inne słowo.",
  "Fallback for unknown words": "Zapas dla nieznanych słów",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "Otwiera okienko dla słów, których nie ma w żadnym słowniku, tylko z wyjaśnieniem AI, aby nadal mogły trafić do Anki.",
  "Custom prompt": "Własny prompt",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "Użyj {{target}} dla słowa i {{sentence}} dla jego kontekstu.",
  "System prompt": "Prompt systemowy",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "Opcjonalne instrukcje wysyłane przed promptem użytkownika. Zostaw puste, aby nie wysyłać żadnych.",
  "Temperature": "Temperatura",
  "Between 0 and 2. Lower is more deterministic.":
    "Od 0 do 2. Niżej znaczy bardziej deterministycznie.",
  "Word audio": "Audio słowa",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "Odtwarza i pobiera wymowy z bazy local-audio-yomichan (Forvo, NHK16, Shinmeikai8, JPod101). Wybierz android.db albo entries.db obok folderów *_files. Wersja Flatpak potrafi czytać tylko android.db.",
  "No database selected": "Nie wybrano bazy",
  "Choose database": "Wybierz bazę",
  "Connected to Anki": "Połączono z Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "Dodaje karty przez AnkiConnect ze słowem, zdaniem, definicjami, zrzutem ekranu, audio zdania i audio słowa. Anki musi być otwarte z dodatkiem AnkiConnect.",
  "AnkiConnect address": "Adres AnkiConnect",
  "Deck": "Talia",
  "Choose…": "Wybierz…",
  "Connect first": "Najpierw się połącz",
  "Note type": "Typ notatki",
  "Fields": "Pola",
  "Auto-fill": "Wypełnij automatycznie",
  "Separated by spaces.": "Oddzielone spacjami.",
  "Sentence audio padding": "Margines audio zdania",
  "Seconds added before and after the subtitle line.":
    "Sekundy dodawane przed i po wierszu napisów.",
  "Animated clip format": "Format animowanego klipu",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "Dla pól ustawionych na animowany klip. AVIF jest najmniejszy; WebP i GIF działają w starszych wersjach Anki. Przechodzi na WebP, a potem GIF, gdy brakuje kodera.",
  "Animated clip size": "Rozmiar animowanego klipu",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "Szerokość w pikselach i klatki na sekundę. Klipy kończą się po 12 sekundach.",
  "Allow duplicate cards": "Zezwalaj na duplikaty kart",
  "When off, words already in the deck are refused.":
    "Gdy wyłączone, słowa już obecne w talii są odrzucane.",
  "Immersion": "Immersja",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "Karty prosto z odtwarzacza, bez sprawdzania słowa: z napisów na ekranie albo z fragmentu nagranego dwoma naciśnięciami tego samego klawisza (działa bez napisów). Ustaw klawisze w Ustawienia → Skróty → Immersja. Tylko mpv.",
  "Sentence cards": "Karty ze zdaniem",
  "Pick a deck and note type above": "Wybierz powyżej talię i typ notatki",
  "Map a field to Sentence audio above": "Przypisz powyżej pole do Audio zdania",
  "Audio cards": "Karty audio",
  "Audio card deck": "Talia kart audio",
  "Audio card note type": "Typ notatki kart audio",
  "Audio field": "Pole audio",
  "Gets the audio of the line or of the recording.": "Otrzymuje audio wiersza lub nagrania.",
  "Pick a note type first": "Najpierw wybierz typ notatki",
  "Sentence field (optional)": "Pole zdania (opcjonalne)",
  "Gets the subtitle text, when there is one.": "Otrzymuje tekst napisów, jeśli jest.",
  "(empty)": "(puste)",
  "Update last card window": "Okno dla Zaktualizuj ostatnią kartę",
  "Update last card only touches a card added this many minutes ago or less.":
    "Zaktualizuj ostatnią kartę zmienia tylko kartę dodaną co najwyżej tyle minut temu.",
  "Longest recording": "Najdłuższe nagranie",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "Dłuższe nagranie jest odrzucane. Animowane klipy i tak kończą się po 12 sekundach.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "Sprawdzanie w słowniku napisów, audio słów i eksport do Anki działają w aplikacji Harbor na komputer.",
  "Download the desktop app to look up words while you watch.":
    "Pobierz aplikację na komputer, aby sprawdzać słowa podczas oglądania.",
  "Long seek": "Długi skok",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "Skok skrótów Długi skok wstecz i Długi skok do przodu.",
  "Slow speed": "Wolne tempo",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "Tempo, na które skrót Przełącz wolne tempo zmienia z normalnego.",
  "Word": "Słowo",
  "Word with furigana": "Słowo z furiganą",
  "Definitions (all)": "Definicje (wszystkie)",
  "Definition (first dictionary)": "Definicja (pierwszy słownik)",
  "Sentence": "Zdanie",
  "Sentence (word in bold)": "Zdanie (słowo pogrubione)",
  "Sentence (word as cloze)": "Zdanie (słowo jako luka)",
  "Sentence audio": "Audio zdania",
  "Word audio (local)": "Audio słowa (lokalne)",
  "Animated clip of the line (AVIF/WebP/GIF)": "Animowany klip wiersza (AVIF/WebP/GIF)",
  "Frequency": "Częstość",
  "Pitch accent": "Akcent tonalny",
  "Title / episode": "Tytuł / odcinek",
  "AI explanation": "Wyjaśnienie AI",
  "Text selected in the popup (else first definition)":
    "Tekst zaznaczony w okienku (inaczej pierwsza definicja)",
  "Not a valid JSON object.": "To nie jest poprawny obiekt JSON.",
  "Toggle subtitles on/off": "Włącz/wyłącz napisy",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "Ukrywa wszystkie napisy (główne i dodatkowe) albo przywraca ostatnią główną ścieżkę.",
  "Next subtitle line": "Następny wiersz napisów",
  "Jump to the start of the next subtitle line.":
    "Przeskakuje na początek następnego wiersza napisów.",
  "Previous subtitle line": "Poprzedni wiersz napisów",
  "Jump to the start of the previous subtitle line.":
    "Przeskakuje na początek poprzedniego wiersza napisów.",
  "Toggle slow speed": "Przełącz wolne tempo",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "Przełącza między normalnym tempem a wolnym tempem ustawionym w Zachowaniu (domyślnie 0,5x).",
  "Anki: card from the subtitle": "Anki: karta z napisów",
  "Anki: update last card": "Anki: zaktualizuj ostatnią kartę",
  "Anki: audio card": "Anki: karta audio",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "Dodaje kartę tylko z audio z wiersza na ekranie, korzystając z talii kart audio. Tylko mpv.",
  "Record → new card": "Nagraj → nowa karta",
  "Record → update last card": "Nagraj → zaktualizuj ostatnią kartę",
  "Record → audio card": "Nagraj → karta audio",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "Naciśnij raz, aby zacząć nagrywać, i ponownie, aby zatrzymać i dodać kartę audio z tym fragmentem. Działa bez napisów. Tylko mpv.",
  "Long seek back": "Długi skok wstecz",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "Cofa o długi skok ustawiony w Zachowaniu (domyślnie 30 sekund).",
  "Long seek forward": "Długi skok do przodu",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "Przewija do przodu o długi skok ustawiony w Zachowaniu (domyślnie 30 sekund).",
  "Greek": "Grecki",
  "Latin": "Łacina",
  "Replay current subtitle": "Powtórz bieżące napisy",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "Wraca na początek wiersza na ekranie i odtwarza go ponownie, a gdy go nie ma — ostatniego wyświetlonego.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "Skróty Karta z napisów, Zaktualizuj ostatnią kartę i Nagraj → karta korzystają z talii, typu notatki i pól z sekcji Anki powyżej. Gdy w napisach jest zaznaczone słowo (podświetlone przy wybieraniu słowa lub w otwartym okienku), wypełniane są wszystkie przypisane pola, łącznie ze słowem i definicjami; bez niego tylko zdanie, audio zdania, zrzut ekranu lub klip i tytuł.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "Dodaje kartę z wiersza na ekranie ze zdaniem, audio i obrazem, korzystając z talii i pól z Słownik i Anki. Gdy w napisach jest zaznaczone słowo, na kartę trafiają też słowo i jego definicje. Tylko mpv.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "Wstawia wiersz z ekranu (zdanie, audio, obraz) do najnowszej karty w talii, jeśli dodano ją w ciągu ostatnich minut. Gdy słowo jest zaznaczone, także słowo i definicje. Tylko mpv.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "Naciśnij raz, aby zacząć nagrywać, i ponownie, aby zatrzymać i dodać kartę z tym fragmentem. Działa bez napisów. Gdy przy zatrzymaniu słowo jest zaznaczone, na kartę trafiają też słowo i definicje. Tylko mpv.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "Naciśnij raz, aby zacząć nagrywać, i ponownie, aby zatrzymać i wstawić ten fragment do najnowszej karty. Działa bez napisów. Gdy przy zatrzymaniu słowo jest zaznaczone, także słowo i definicje. Tylko mpv.",
  "Added {word} to {deck}": "Dodano {word} do {deck}",
  "Updated card in {deck} with {word}": "Zaktualizowano kartę w {deck} o {word}",
};
