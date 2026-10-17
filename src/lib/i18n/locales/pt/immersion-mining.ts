// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "cartão de áudio",
  "last card": "último cartão",
  "new card": "cartão novo",
  "Still adding the previous card…": "Ainda adicionando o cartão anterior…",
  "Updated card in {deck}": "Cartão atualizado em {deck}",
  "Added to {deck}": "Adicionado a {deck}",
  "{n}s recorded": "{n}s gravados",
  "Recording → {target}. Press again to stop.": "Gravando → {target}. Aperte de novo para parar.",
  "the video went back since the recording started": "o vídeo voltou desde o início da gravação",
  "too short": "curta demais",
  "longer than the {n}s limit": "maior que o limite de {n}s",
  "Recording discarded: {reason}": "Gravação descartada: {reason}",
  "Stopped · {n}s recorded · adding card…": "Parou · {n}s gravados · adicionando cartão…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "Cartões do Anki pelo player precisam do player mpv no app para desktop.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "Nenhuma legenda na tela. Use um atalho de Gravar para trechos sem legenda.",
  "Subtitle dictionary": "Dicionário de legendas",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "Passe o mouse sobre uma palavra da legenda para consultá-la nos seus dicionários Yomitan, ouvi-la e adicioná-la ao Anki. Usa o motor de dicionário do Manatan.",
  "Look up words in subtitles": "Consultar palavras nas legendas",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Funciona com as legendas do Harbor e com legendas estilizadas (ASS) desenhadas pelo mpv. Legendas de imagem (PGS) não têm texto para consultar.",
  "Pause while the popup is open": "Pausar enquanto o popup estiver aberto",
  "Resumes when the popup closes.": "Retoma quando o popup fecha.",
  "Keep the popup open when the mouse leaves": "Manter o popup aberto quando o mouse sair",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "O popup (e a pausa) continua até você clicar fora dele ou apertar Esc.",
  "Look up with": "Consultar com",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "Passar o mouse consulta as palavras conforme ele passa por elas. Com uma tecla, segure-a enquanto passa o mouse (ou aperte-a sobre uma palavra) e só passar o mouse não faz nada. Clicar numa palavra sempre a consulta.",
  "Hover": "Passar o mouse",
  "Hold Shift": "Segurar Shift",
  "Hold Ctrl": "Segurar Ctrl",
  "Hold Alt": "Segurar Alt",
  "Scan delay (in milliseconds)": "Atraso da busca (em milissegundos)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "Espera antes de consultar a palavra sob o mouse quando nenhuma tecla é exigida. Menor é mais rápido; maior evita consultas quando o mouse só passa pela legenda.",
  "Keep subtitles above the seek bar": "Manter as legendas acima da barra de progresso",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "A barra de progresso cobre a linha mais baixa da legenda, então suba as legendas acima dela enquanto consulta palavras.",
  "Same setting as Player → Subtitles.": "Mesma configuração de Player → Legendas.",
  "Subtitle height": "Altura da legenda",
  "Distance from the bottom of the video.": "Distância da parte de baixo do vídeo.",
  "Subtitle language": "Idioma da legenda",
  "Picks the deinflection rules used for lookups.":
    "Escolhe as regras de deflexão usadas nas consultas.",
  "Loading dictionaries…": "Carregando dicionários…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "Nenhum dicionário ainda. Importe arquivos .zip do Yomitan, como JMdict ou Jitendex.",
  "Importing {name}…": "Importando {name}…",
  "Import dictionary (.zip)": "Importar dicionário (.zip)",
  "AI Explanation": "Explicação por IA",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "Gere uma explicação contextual da palavra consultada com o seu próprio provedor de IA. As requisições vão direto deste dispositivo para qualquer endpoint compatível com OpenAI (OpenRouter, OpenAI, DeepSeek, Groq, um servidor local…).",
  "AI explanation in the popup": "Explicação por IA no popup",
  "Shows the explanation above the dictionary entries.":
    "Mostra a explicação acima das entradas do dicionário.",
  "Custom endpoint": "Endpoint personalizado",
  "Full URL, used exactly as entered. No path is appended.":
    "URL completa, usada exatamente como digitada. Nenhum caminho é acrescentado.",
  "Stored on this device only.": "Guardada só neste dispositivo.",
  "Model ID sent to the provider.": "ID do modelo enviado ao provedor.",
  "OpenRouter provider routing": "Roteamento de provedores do OpenRouter",
  "Prioritize listed providers": "Priorizar provedores listados",
  "Only listed providers": "Só provedores listados",
  "Ignore listed providers": "Ignorar provedores listados",
  "OpenRouter provider slugs": "Slugs de provedores do OpenRouter",
  "Separated by commas or line breaks.": "Separados por vírgulas ou quebras de linha.",
  "Allow OpenRouter fallbacks": "Permitir fallbacks do OpenRouter",
  "Thinking mode": "Modo de raciocínio",
  "Thinking intensity": "Intensidade do raciocínio",
  "Custom thinking value": "Valor de raciocínio personalizado",
  "A word, a token count, or a JSON object.":
    "Uma palavra, uma quantidade de tokens ou um objeto JSON.",
  "Custom request body JSON": "JSON personalizado do corpo da requisição",
  "A JSON object merged over the generated request.":
    "Um objeto JSON mesclado sobre a requisição gerada.",
  "Auto generate on lookup": "Gerar automaticamente ao consultar",
  "When off, the box appears without sending a request and you generate it manually.":
    "Desligado, a caixa aparece sem enviar requisição e você gera a explicação manualmente.",
  "Real time response": "Resposta em tempo real",
  "Stream the explanation into the popup as it is written.":
    "Transmite a explicação para o popup conforme ela é escrita.",
  "Cancel unfinished requests": "Cancelar requisições inacabadas",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "Descarta uma explicação ainda sendo gerada quando o popup fecha ou outra palavra é consultada.",
  "Fallback for unknown words": "Fallback para palavras desconhecidas",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "Abre o popup para palavras que nenhum dicionário contém, só com a explicação por IA, para que ainda possam ir para o Anki.",
  "Custom prompt": "Prompt personalizado",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "Use {{target}} para a palavra e {{sentence}} para o contexto dela.",
  "System prompt": "Prompt de sistema",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "Instruções opcionais enviadas antes do prompt do usuário. Deixe vazio para não enviar nenhuma.",
  "Temperature": "Temperatura",
  "Between 0 and 2. Lower is more deterministic.": "Entre 0 e 2. Menor é mais determinístico.",
  "Word audio": "Áudio da palavra",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "Toca e minera pronúncias de um banco local-audio-yomichan (Forvo, NHK16, Shinmeikai8, JPod101). Escolha o android.db, ou o entries.db ao lado das pastas *_files. A versão Flatpak só lê o android.db.",
  "No database selected": "Nenhum banco selecionado",
  "Choose database": "Escolher banco",
  "Connected to Anki": "Conectado ao Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "Adiciona cartões pelo AnkiConnect com a palavra, a frase, as definições, uma captura de tela, o áudio da frase e o áudio da palavra. O Anki precisa estar aberto com o complemento AnkiConnect.",
  "AnkiConnect address": "Endereço do AnkiConnect",
  "Deck": "Baralho",
  "Choose…": "Escolher…",
  "Connect first": "Conecte primeiro",
  "Note type": "Tipo de nota",
  "Fields": "Campos",
  "Auto-fill": "Preencher automaticamente",
  "Separated by spaces.": "Separadas por espaços.",
  "Sentence audio padding": "Margem do áudio da frase",
  "Seconds added before and after the subtitle line.":
    "Segundos acrescentados antes e depois da linha da legenda.",
  "Animated clip format": "Formato do clipe animado",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "Para campos definidos como clipe animado. AVIF é o menor; WebP e GIF tocam em versões antigas do Anki. Cai para WebP, depois GIF, se faltar um codificador.",
  "Animated clip size": "Tamanho do clipe animado",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "Largura em pixels e quadros por segundo. Os clipes param depois de 12 segundos.",
  "Allow duplicate cards": "Permitir cartões duplicados",
  "When off, words already in the deck are refused.":
    "Desligado, palavras que já estão no baralho são recusadas.",
  "Immersion": "Imersão",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "Cartões direto do player, sem consultar uma palavra: da legenda na tela, ou de um trecho que você grava com dois toques na mesma tecla (funciona sem legendas). Defina as teclas em Configurações → Atalhos → Imersão. Só no mpv.",
  "Sentence cards": "Cartões de frase",
  "Pick a deck and note type above": "Escolha um baralho e um tipo de nota acima",
  "Map a field to Sentence audio above": "Mapeie um campo para Áudio da frase acima",
  "Audio cards": "Cartões de áudio",
  "Audio card deck": "Baralho do cartão de áudio",
  "Audio card note type": "Tipo de nota do cartão de áudio",
  "Audio field": "Campo de áudio",
  "Gets the audio of the line or of the recording.": "Recebe o áudio da linha ou da gravação.",
  "Pick a note type first": "Escolha um tipo de nota primeiro",
  "Sentence field (optional)": "Campo da frase (opcional)",
  "Gets the subtitle text, when there is one.": "Recebe o texto da legenda, quando houver.",
  "(empty)": "(vazio)",
  "Update last card window": "Janela do Atualizar último cartão",
  "Update last card only touches a card added this many minutes ago or less.":
    "Atualizar último cartão só mexe num cartão adicionado há esta quantidade de minutos ou menos.",
  "Longest recording": "Gravação mais longa",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "Uma gravação maior que isto é descartada. Os clipes animados continuam parando depois de 12 segundos.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "Consultas no dicionário de legendas, áudio de palavras e mineração para o Anki funcionam no app do Harbor para desktop.",
  "Download the desktop app to look up words while you watch.":
    "Baixe o app para desktop para consultar palavras enquanto assiste.",
  "Long seek": "Salto longo",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "O salto dos atalhos Salto longo para trás e Salto longo para frente.",
  "Slow speed": "Velocidade lenta",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "A velocidade para a qual o atalho Alternar velocidade lenta muda a partir da velocidade normal.",
  "Word": "Palavra",
  "Word with furigana": "Palavra com furigana",
  "Definitions (all)": "Definições (todas)",
  "Definition (first dictionary)": "Definição (primeiro dicionário)",
  "Sentence": "Frase",
  "Sentence (word in bold)": "Frase (palavra em negrito)",
  "Sentence (word as cloze)": "Frase (palavra como cloze)",
  "Sentence audio": "Áudio da frase",
  "Word audio (local)": "Áudio da palavra (local)",
  "Animated clip of the line (AVIF/WebP/GIF)": "Clipe animado da linha (AVIF/WebP/GIF)",
  "Frequency": "Frequência",
  "Pitch accent": "Acento tonal",
  "Title / episode": "Título / episódio",
  "AI explanation": "Explicação por IA",
  "Text selected in the popup (else first definition)":
    "Texto selecionado no popup (senão, a primeira definição)",
  "Not a valid JSON object.": "Não é um objeto JSON válido.",
  "Toggle subtitles on/off": "Ligar/desligar legendas",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "Esconde todas as legendas (primária e secundária), ou traz de volta a última faixa primária.",
  "Next subtitle line": "Próxima linha da legenda",
  "Jump to the start of the next subtitle line.": "Pula para o início da próxima linha da legenda.",
  "Previous subtitle line": "Linha anterior da legenda",
  "Jump to the start of the previous subtitle line.":
    "Pula para o início da linha anterior da legenda.",
  "Toggle slow speed": "Alternar velocidade lenta",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "Alterna entre a velocidade normal e a velocidade lenta definida em Comportamento (0,5x por padrão).",
  "Anki: card from the subtitle": "Anki: cartão da legenda",
  "Anki: update last card": "Anki: atualizar último cartão",
  "Anki: audio card": "Anki: cartão de áudio",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "Adiciona um cartão só de áudio da linha na tela, usando o baralho do cartão de áudio. Só no mpv.",
  "Record → new card": "Gravar → cartão novo",
  "Record → update last card": "Gravar → atualizar último cartão",
  "Record → audio card": "Gravar → cartão de áudio",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "Aperte uma vez para começar a gravar e de novo para parar e adicionar um cartão de áudio com esse trecho. Funciona sem legendas. Só no mpv.",
  "Long seek back": "Salto longo para trás",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "Volta pelo passo de Salto longo definido em Comportamento (30 segundos por padrão).",
  "Long seek forward": "Salto longo para frente",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "Avança pelo passo de Salto longo definido em Comportamento (30 segundos por padrão).",
  "Greek": "Grego",
  "Latin": "Latim",
  "Replay current subtitle": "Repetir a legenda atual",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "Volta ao início da fala na tela e toca de novo, ou da última fala mostrada quando não há nenhuma.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "Os atalhos Cartão da legenda, Atualizar último cartão e Gravar → cartão usam o baralho, o tipo de nota e os campos da seção Anki acima. Com uma palavra selecionada na legenda (destacada ao escolher palavra, ou num popup aberto) todos os campos mapeados são preenchidos, inclusive palavra e definições; sem ela, só os campos de frase, áudio da frase, captura de tela ou clipe e título.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "Adiciona um cartão da linha na tela com a frase, o áudio e a imagem, usando o baralho e os campos de Dicionário & Anki. Com uma palavra selecionada na legenda, a palavra e as definições também vão para o cartão. Só no mpv.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "Coloca a linha na tela (frase, áudio, imagem) no cartão mais novo do baralho, se ele foi adicionado nos últimos minutos. Com uma palavra selecionada, também a palavra e as definições. Só no mpv.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "Aperte uma vez para começar a gravar e de novo para parar e adicionar um cartão com esse trecho. Funciona sem legendas. Com uma palavra selecionada ao parar, a palavra e as definições também vão para o cartão. Só no mpv.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "Aperte uma vez para começar a gravar e de novo para parar e colocar esse trecho no cartão mais novo. Funciona sem legendas. Com uma palavra selecionada ao parar, também a palavra e as definições. Só no mpv.",
  "Added {word} to {deck}": "{word} adicionada a {deck}",
  "Updated card in {deck} with {word}": "Cartão em {deck} atualizado com {word}",
};
