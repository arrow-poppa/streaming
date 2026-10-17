// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "carte audio",
  "last card": "dernière carte",
  "new card": "nouvelle carte",
  "Still adding the previous card…": "Ajout de la carte précédente en cours…",
  "Updated card in {deck}": "Carte mise à jour dans {deck}",
  "Added to {deck}": "Ajoutée à {deck}",
  "{n}s recorded": "{n}s enregistrées",
  "Recording → {target}. Press again to stop.":
    "Enregistrement → {target}. Appuyez à nouveau pour arrêter.",
  "the video went back since the recording started":
    "la vidéo a reculé depuis le début de l’enregistrement",
  "too short": "trop court",
  "longer than the {n}s limit": "dépasse la limite de {n}s",
  "Recording discarded: {reason}": "Enregistrement abandonné : {reason}",
  "Stopped · {n}s recorded · adding card…": "Arrêté · {n}s enregistrées · ajout de la carte…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "Les cartes Anki depuis le lecteur nécessitent le lecteur mpv dans l’application de bureau.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "Aucun sous-titre à l’écran. Utilisez un raccourci Enregistrer pour les passages sans sous-titres.",
  "Subtitle dictionary": "Dictionnaire des sous-titres",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "Survolez un mot des sous-titres pour le chercher dans vos dictionnaires Yomitan, l’écouter et l’ajouter à Anki. Utilise le moteur de dictionnaire de Manatan.",
  "Look up words in subtitles": "Chercher les mots dans les sous-titres",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Fonctionne avec les sous-titres de Harbor et avec les sous-titres stylés (ASS) affichés par mpv. Les sous-titres image (PGS) n’ont pas de texte à chercher.",
  "Pause while the popup is open": "Mettre en pause tant que la fenêtre est ouverte",
  "Resumes when the popup closes.": "Reprend à la fermeture de la fenêtre.",
  "Keep the popup open when the mouse leaves": "Garder la fenêtre ouverte quand la souris s’en va",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "La fenêtre (et la pause) reste jusqu’à un clic à l’extérieur ou un appui sur Échap.",
  "Look up with": "Chercher avec",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "Le survol cherche les mots au passage de la souris. Avec une touche, maintenez-la pendant le survol (ou appuyez dessus sur un mot) et le simple survol ne fait rien. Cliquer sur un mot le cherche toujours.",
  "Hover": "Survol",
  "Hold Shift": "Maintenir Maj",
  "Hold Ctrl": "Maintenir Ctrl",
  "Hold Alt": "Maintenir Alt",
  "Scan delay (in milliseconds)": "Délai de recherche (en millisecondes)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "Attente avant de chercher le mot sous la souris quand aucune touche n’est requise. Plus bas est plus rapide ; plus haut évite les recherches quand la souris ne fait que passer sur le sous-titre.",
  "Keep subtitles above the seek bar": "Garder les sous-titres au-dessus de la barre de lecture",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "La barre de lecture couvre la ligne la plus basse du sous-titre ; remontez donc les sous-titres au-dessus pendant que vous cherchez des mots.",
  "Same setting as Player → Subtitles.": "Même réglage que Lecteur → Sous-titres.",
  "Subtitle height": "Hauteur des sous-titres",
  "Distance from the bottom of the video.": "Distance depuis le bas de la vidéo.",
  "Subtitle language": "Langue des sous-titres",
  "Picks the deinflection rules used for lookups.":
    "Choisit les règles de déflexion utilisées pour les recherches.",
  "Loading dictionaries…": "Chargement des dictionnaires…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "Aucun dictionnaire pour l’instant. Importez des fichiers .zip Yomitan comme JMdict ou Jitendex.",
  "Importing {name}…": "Importation de {name}…",
  "Import dictionary (.zip)": "Importer un dictionnaire (.zip)",
  "AI Explanation": "Explication par IA",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "Générez une explication contextuelle du mot cherché avec votre propre fournisseur d’IA. Les requêtes partent directement de cet appareil vers n’importe quel endpoint compatible OpenAI (OpenRouter, OpenAI, DeepSeek, Groq, un serveur local…).",
  "AI explanation in the popup": "Explication par IA dans la fenêtre",
  "Shows the explanation above the dictionary entries.":
    "Affiche l’explication au-dessus des entrées du dictionnaire.",
  "Custom endpoint": "Endpoint personnalisé",
  "Full URL, used exactly as entered. No path is appended.":
    "URL complète, utilisée telle quelle. Aucun chemin n’est ajouté.",
  "Stored on this device only.": "Enregistrée uniquement sur cet appareil.",
  "Model ID sent to the provider.": "ID du modèle envoyé au fournisseur.",
  "OpenRouter provider routing": "Routage des fournisseurs OpenRouter",
  "Prioritize listed providers": "Prioriser les fournisseurs listés",
  "Only listed providers": "Seulement les fournisseurs listés",
  "Ignore listed providers": "Ignorer les fournisseurs listés",
  "OpenRouter provider slugs": "Slugs des fournisseurs OpenRouter",
  "Separated by commas or line breaks.": "Séparés par des virgules ou des retours à la ligne.",
  "Allow OpenRouter fallbacks": "Autoriser les solutions de repli OpenRouter",
  "Thinking mode": "Mode de réflexion",
  "Thinking intensity": "Intensité de réflexion",
  "Custom thinking value": "Valeur de réflexion personnalisée",
  "A word, a token count, or a JSON object.": "Un mot, un nombre de tokens ou un objet JSON.",
  "Custom request body JSON": "JSON personnalisé du corps de requête",
  "A JSON object merged over the generated request.":
    "Un objet JSON fusionné par-dessus la requête générée.",
  "Auto generate on lookup": "Générer automatiquement à la recherche",
  "When off, the box appears without sending a request and you generate it manually.":
    "Désactivé, la zone apparaît sans envoyer de requête et vous la générez manuellement.",
  "Real time response": "Réponse en temps réel",
  "Stream the explanation into the popup as it is written.":
    "Diffuse l’explication dans la fenêtre au fur et à mesure de son écriture.",
  "Cancel unfinished requests": "Annuler les requêtes inachevées",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "Abandonne une explication encore en cours quand la fenêtre se ferme ou qu’un autre mot est cherché.",
  "Fallback for unknown words": "Repli pour les mots inconnus",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "Ouvre la fenêtre pour les mots qu’aucun dictionnaire ne contient, avec seulement l’explication par IA, pour qu’ils puissent quand même aller dans Anki.",
  "Custom prompt": "Prompt personnalisé",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "Utilisez {{target}} pour le mot et {{sentence}} pour son contexte.",
  "System prompt": "Prompt système",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "Instructions facultatives envoyées avant le prompt de l’utilisateur. Laissez vide pour n’en envoyer aucune.",
  "Temperature": "Température",
  "Between 0 and 2. Lower is more deterministic.": "Entre 0 et 2. Plus bas est plus déterministe.",
  "Word audio": "Audio du mot",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "Lit et extrait des prononciations depuis une base local-audio-yomichan (Forvo, NHK16, Shinmeikai8, JPod101). Choisissez android.db, ou entries.db à côté de ses dossiers *_files. La version Flatpak ne peut lire que android.db.",
  "No database selected": "Aucune base sélectionnée",
  "Choose database": "Choisir la base",
  "Connected to Anki": "Connecté à Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "Ajoute des cartes via AnkiConnect avec le mot, la phrase, les définitions, une capture d’écran, l’audio de la phrase et l’audio du mot. Anki doit être ouvert avec le module AnkiConnect.",
  "AnkiConnect address": "Adresse d’AnkiConnect",
  "Deck": "Paquet",
  "Choose…": "Choisir…",
  "Connect first": "Connectez-vous d’abord",
  "Note type": "Type de note",
  "Fields": "Champs",
  "Auto-fill": "Remplissage automatique",
  "Separated by spaces.": "Séparés par des espaces.",
  "Sentence audio padding": "Marge de l’audio de la phrase",
  "Seconds added before and after the subtitle line.":
    "Secondes ajoutées avant et après la ligne de sous-titre.",
  "Animated clip format": "Format du clip animé",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "Pour les champs définis sur le clip animé. AVIF est le plus léger ; WebP et GIF se lisent dans les anciennes versions d’Anki. Bascule sur WebP, puis GIF, s’il manque un encodeur.",
  "Animated clip size": "Taille du clip animé",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "Largeur en pixels et images par seconde. Les clips s’arrêtent après 12 secondes.",
  "Allow duplicate cards": "Autoriser les cartes en double",
  "When off, words already in the deck are refused.":
    "Désactivé, les mots déjà présents dans le paquet sont refusés.",
  "Immersion": "Immersion",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "Des cartes directement depuis le lecteur, sans chercher de mot : depuis le sous-titre à l’écran, ou depuis un passage enregistré avec deux appuis sur la même touche (fonctionne sans sous-titres). Choisissez les touches dans Paramètres → Raccourcis → Immersion. mpv uniquement.",
  "Sentence cards": "Cartes de phrase",
  "Pick a deck and note type above": "Choisissez un paquet et un type de note ci-dessus",
  "Map a field to Sentence audio above": "Associez un champ à Audio de la phrase ci-dessus",
  "Audio cards": "Cartes audio",
  "Audio card deck": "Paquet des cartes audio",
  "Audio card note type": "Type de note des cartes audio",
  "Audio field": "Champ audio",
  "Gets the audio of the line or of the recording.":
    "Reçoit l’audio de la ligne ou de l’enregistrement.",
  "Pick a note type first": "Choisissez d’abord un type de note",
  "Sentence field (optional)": "Champ de la phrase (facultatif)",
  "Gets the subtitle text, when there is one.": "Reçoit le texte du sous-titre, s’il y en a un.",
  "(empty)": "(vide)",
  "Update last card window": "Fenêtre de Mettre à jour la dernière carte",
  "Update last card only touches a card added this many minutes ago or less.":
    "Mettre à jour la dernière carte ne touche qu’une carte ajoutée il y a ce nombre de minutes ou moins.",
  "Longest recording": "Enregistrement le plus long",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "Un enregistrement plus long est abandonné. Les clips animés s’arrêtent toujours après 12 secondes.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "La recherche dans le dictionnaire des sous-titres, l’audio des mots et l’extraction pour Anki fonctionnent dans l’application de bureau Harbor.",
  "Download the desktop app to look up words while you watch.":
    "Téléchargez l’application de bureau pour chercher des mots pendant que vous regardez.",
  "Long seek": "Saut long",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "Le saut des raccourcis Saut long en arrière et Saut long en avant.",
  "Slow speed": "Vitesse lente",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "La vitesse vers laquelle le raccourci Basculer la vitesse lente passe depuis la vitesse normale.",
  "Word": "Mot",
  "Word with furigana": "Mot avec furigana",
  "Definitions (all)": "Définitions (toutes)",
  "Definition (first dictionary)": "Définition (premier dictionnaire)",
  "Sentence": "Phrase",
  "Sentence (word in bold)": "Phrase (mot en gras)",
  "Sentence (word as cloze)": "Phrase (mot en texte à trous)",
  "Sentence audio": "Audio de la phrase",
  "Word audio (local)": "Audio du mot (local)",
  "Animated clip of the line (AVIF/WebP/GIF)": "Clip animé de la ligne (AVIF/WebP/GIF)",
  "Frequency": "Fréquence",
  "Pitch accent": "Accent tonal",
  "Title / episode": "Titre / épisode",
  "AI explanation": "Explication par IA",
  "Text selected in the popup (else first definition)":
    "Texte sélectionné dans la fenêtre (sinon la première définition)",
  "Not a valid JSON object.": "Ce n’est pas un objet JSON valide.",
  "Toggle subtitles on/off": "Activer/désactiver les sous-titres",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "Masque tous les sous-titres (principal et secondaire), ou rétablit la dernière piste principale.",
  "Next subtitle line": "Ligne de sous-titre suivante",
  "Jump to the start of the next subtitle line.":
    "Saute au début de la ligne de sous-titre suivante.",
  "Previous subtitle line": "Ligne de sous-titre précédente",
  "Jump to the start of the previous subtitle line.":
    "Saute au début de la ligne de sous-titre précédente.",
  "Toggle slow speed": "Basculer la vitesse lente",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "Alterne entre la vitesse normale et la vitesse lente définie dans Comportement (0,5x par défaut).",
  "Anki: card from the subtitle": "Anki : carte depuis le sous-titre",
  "Anki: update last card": "Anki : mettre à jour la dernière carte",
  "Anki: audio card": "Anki : carte audio",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "Ajoute une carte uniquement audio depuis la ligne à l’écran, avec le paquet des cartes audio. mpv uniquement.",
  "Record → new card": "Enregistrer → nouvelle carte",
  "Record → update last card": "Enregistrer → mettre à jour la dernière carte",
  "Record → audio card": "Enregistrer → carte audio",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "Appuyez une fois pour commencer l’enregistrement, puis à nouveau pour l’arrêter et ajouter une carte audio avec ce passage. Fonctionne sans sous-titres. mpv uniquement.",
  "Long seek back": "Saut long en arrière",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "Recule du pas de Saut long défini dans Comportement (30 secondes par défaut).",
  "Long seek forward": "Saut long en avant",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "Avance du pas de Saut long défini dans Comportement (30 secondes par défaut).",
  "Greek": "Grec",
  "Latin": "Latin",
  "Replay current subtitle": "Rejouer le sous-titre actuel",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "Revient au début de la ligne à l’écran et la rejoue, ou de la dernière affichée s’il n’y en a aucune.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "Les raccourcis Carte depuis le sous-titre, Mettre à jour la dernière carte et Enregistrer → carte utilisent le paquet, le type de note et les champs de la section Anki ci-dessus. Avec un mot sélectionné dans le sous-titre (surligné en choisissant un mot, ou dans une fenêtre ouverte), tous les champs associés sont remplis, mot et définitions compris ; sinon seuls les champs phrase, audio de la phrase, capture ou clip et titre le sont.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "Ajoute une carte depuis la ligne à l’écran avec sa phrase, son audio et une image, en utilisant le paquet et les champs de Dictionnaire et Anki. Avec un mot sélectionné dans le sous-titre, le mot et ses définitions vont aussi sur la carte. mpv uniquement.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "Place la ligne à l’écran (phrase, audio, image) dans la carte la plus récente du paquet, si elle a été ajoutée ces dernières minutes. Avec un mot sélectionné, le mot et ses définitions aussi. mpv uniquement.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "Appuyez une fois pour commencer l’enregistrement, puis à nouveau pour l’arrêter et ajouter une carte avec ce passage. Fonctionne sans sous-titres. Avec un mot sélectionné à l’arrêt, le mot et ses définitions vont aussi sur la carte. mpv uniquement.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "Appuyez une fois pour commencer l’enregistrement, puis à nouveau pour l’arrêter et placer ce passage dans la carte la plus récente. Fonctionne sans sous-titres. Avec un mot sélectionné à l’arrêt, le mot et ses définitions aussi. mpv uniquement.",
  "Added {word} to {deck}": "{word} ajouté à {deck}",
  "Updated card in {deck} with {word}": "Carte de {deck} mise à jour avec {word}",
  "Bigger dictionary popup": "Agrandir la fenêtre du dictionnaire",
  "Make the subtitle dictionary popup 10% bigger. Saved as the Popup size setting.":
    "Agrandit de 10 % la fenêtre du dictionnaire des sous-titres. Enregistré dans le réglage Taille de la fenêtre.",
  "Smaller dictionary popup": "Réduire la fenêtre du dictionnaire",
  "Make the subtitle dictionary popup 10% smaller. Saved as the Popup size setting.":
    "Réduit de 10 % la fenêtre du dictionnaire des sous-titres. Enregistré dans le réglage Taille de la fenêtre.",
  "Dictionary popup size: {n}%": "Taille de la fenêtre du dictionnaire : {n} %",
  "Popup size": "Taille de la fenêtre",
  "Scales the whole popup: text, buttons and width. Bigger sizes help on a TV. The Bigger/Smaller dictionary popup hotkeys change it too.":
    "Met à l’échelle toute la fenêtre : texte, boutons et largeur. Les grandes tailles aident sur une TV. Les raccourcis Agrandir/Réduire la fenêtre du dictionnaire la changent aussi.",
  "Speed step": "Pas de vitesse",
  "How much the Speed down and Speed up shortcuts change the speed per press.":
    "De combien les raccourcis Réduire la vitesse et Accélérer changent la vitesse à chaque appui.",
  "Slow playback by the Speed step set under Behavior (0.25x by default).":
    "Ralentit la lecture du Pas de vitesse défini dans Comportement (0,25x par défaut).",
  "Speed playback up by the Speed step set under Behavior (0.25x by default).":
    "Accélère la lecture du Pas de vitesse défini dans Comportement (0,25x par défaut).",
};
