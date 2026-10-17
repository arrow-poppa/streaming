// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "аудиокарточка",
  "last card": "последняя карточка",
  "new card": "новая карточка",
  "Still adding the previous card…": "Предыдущая карточка ещё добавляется…",
  "Updated card in {deck}": "Карточка обновлена в {deck}",
  "Added to {deck}": "Добавлено в {deck}",
  "{n}s recorded": "Записано {n} с",
  "Recording → {target}. Press again to stop.":
    "Запись → {target}. Нажмите ещё раз, чтобы остановить.",
  "the video went back since the recording started": "видео перемотали назад после начала записи",
  "too short": "слишком коротко",
  "longer than the {n}s limit": "длиннее лимита в {n} с",
  "Recording discarded: {reason}": "Запись отменена: {reason}",
  "Stopped · {n}s recorded · adding card…": "Остановлено · записано {n} с · добавляю карточку…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "Для карточек Anki из плеера нужен плеер mpv в настольном приложении.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "На экране нет субтитров. Для фрагментов без субтитров используйте сочетание «Запись».",
  "Subtitle dictionary": "Словарь субтитров",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "Наведите на слово в субтитрах, чтобы найти его в словарях Yomitan, прослушать и добавить в Anki. Использует словарный движок Manatan.",
  "Look up words in subtitles": "Искать слова в субтитрах",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Работает с субтитрами Harbor и со стилизованными субтитрами (ASS), которые рисует mpv. У графических субтитров (PGS) нет текста для поиска.",
  "Pause while the popup is open": "Пауза, пока открыто окно",
  "Resumes when the popup closes.": "Воспроизведение продолжится, когда окно закроется.",
  "Keep the popup open when the mouse leaves": "Не закрывать окно, когда уходит мышь",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "Окно (и пауза) остаётся, пока вы не щёлкнете вне его или не нажмёте Escape.",
  "Look up with": "Искать по",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "При наведении слова ищутся, когда над ними проходит мышь. С клавишей удерживайте её при наведении (или нажмите её на слове), и простое наведение ничего не делает. Щелчок по слову всегда запускает поиск.",
  "Hover": "Наведению",
  "Hold Shift": "Удержанию Shift",
  "Hold Ctrl": "Удержанию Ctrl",
  "Hold Alt": "Удержанию Alt",
  "Scan delay (in milliseconds)": "Задержка поиска (в миллисекундах)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "Ожидание перед поиском слова под мышью, когда клавиша не нужна. Меньше — быстрее; больше — меньше лишних поисков, когда мышь просто проходит над субтитрами.",
  "Keep subtitles above the seek bar": "Держать субтитры над полосой перемотки",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "Полоса перемотки закрывает нижнюю строку субтитров, поэтому поднимайте субтитры над ней, пока ищете слова.",
  "Same setting as Player → Subtitles.": "Та же настройка, что Плеер → Субтитры.",
  "Subtitle height": "Высота субтитров",
  "Distance from the bottom of the video.": "Расстояние от нижнего края видео.",
  "Subtitle language": "Язык субтитров",
  "Picks the deinflection rules used for lookups.":
    "Выбирает правила снятия словоизменения при поиске.",
  "Loading dictionaries…": "Загрузка словарей…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "Словарей пока нет. Импортируйте файлы .zip Yomitan, например JMdict или Jitendex.",
  "Importing {name}…": "Импорт {name}…",
  "Import dictionary (.zip)": "Импортировать словарь (.zip)",
  "AI Explanation": "Объяснение ИИ",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "Создавайте объяснение найденного слова в контексте через своего поставщика ИИ. Запросы идут прямо с этого устройства на любой OpenAI-совместимый endpoint (OpenRouter, OpenAI, DeepSeek, Groq, локальный сервер…).",
  "AI explanation in the popup": "Объяснение ИИ в окне",
  "Shows the explanation above the dictionary entries.":
    "Показывает объяснение над словарными статьями.",
  "Custom endpoint": "Свой endpoint",
  "Full URL, used exactly as entered. No path is appended.":
    "Полный URL, используется в точности как введён. Путь не добавляется.",
  "Stored on this device only.": "Хранится только на этом устройстве.",
  "Model ID sent to the provider.": "ID модели, отправляемый поставщику.",
  "OpenRouter provider routing": "Маршрутизация поставщиков OpenRouter",
  "Prioritize listed providers": "Предпочитать перечисленных поставщиков",
  "Only listed providers": "Только перечисленные поставщики",
  "Ignore listed providers": "Игнорировать перечисленных поставщиков",
  "OpenRouter provider slugs": "Слаги поставщиков OpenRouter",
  "Separated by commas or line breaks.": "Через запятую или с новой строки.",
  "Allow OpenRouter fallbacks": "Разрешить запасные варианты OpenRouter",
  "Thinking mode": "Режим рассуждения",
  "Thinking intensity": "Интенсивность рассуждения",
  "Custom thinking value": "Своё значение рассуждения",
  "A word, a token count, or a JSON object.": "Слово, число токенов или объект JSON.",
  "Custom request body JSON": "Свой JSON тела запроса",
  "A JSON object merged over the generated request.":
    "Объект JSON, накладываемый поверх созданного запроса.",
  "Auto generate on lookup": "Создавать автоматически при поиске",
  "When off, the box appears without sending a request and you generate it manually.":
    "Если выключено, блок появляется без отправки запроса, и вы создаёте объяснение вручную.",
  "Real time response": "Ответ в реальном времени",
  "Stream the explanation into the popup as it is written.":
    "Выводит объяснение в окно по мере написания.",
  "Cancel unfinished requests": "Отменять незавершённые запросы",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "Отбрасывает ещё создаваемое объяснение, когда окно закрывается или ищется другое слово.",
  "Fallback for unknown words": "Запасной вариант для неизвестных слов",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "Открывает окно для слов, которых нет ни в одном словаре, только с объяснением ИИ, чтобы их всё равно можно было добавить в Anki.",
  "Custom prompt": "Свой промпт",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "Используйте {{target}} для слова и {{sentence}} для его контекста.",
  "System prompt": "Системный промпт",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "Необязательные инструкции, отправляемые перед промптом пользователя. Оставьте пустым, чтобы ничего не отправлять.",
  "Temperature": "Температура",
  "Between 0 and 2. Lower is more deterministic.": "От 0 до 2. Ниже — более детерминированно.",
  "Word audio": "Аудио слова",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "Воспроизводит и добавляет произношения из базы local-audio-yomichan (Forvo, NHK16, Shinmeikai8, JPod101). Выберите android.db или entries.db рядом с папками *_files. Версия Flatpak умеет читать только android.db.",
  "No database selected": "База не выбрана",
  "Choose database": "Выбрать базу",
  "Connected to Anki": "Подключено к Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "Добавляет карточки через AnkiConnect со словом, предложением, определениями, снимком экрана, аудио предложения и аудио слова. Anki должно быть открыто с дополнением AnkiConnect.",
  "AnkiConnect address": "Адрес AnkiConnect",
  "Deck": "Колода",
  "Choose…": "Выберите…",
  "Connect first": "Сначала подключитесь",
  "Note type": "Тип записи",
  "Fields": "Поля",
  "Auto-fill": "Заполнить автоматически",
  "Separated by spaces.": "Через пробел.",
  "Sentence audio padding": "Запас для аудио предложения",
  "Seconds added before and after the subtitle line.":
    "Секунды, добавляемые до и после строки субтитров.",
  "Animated clip format": "Формат анимированного клипа",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "Для полей с анимированным клипом. AVIF самый компактный; WebP и GIF воспроизводятся в старых версиях Anki. Если кодека нет, используется WebP, затем GIF.",
  "Animated clip size": "Размер анимированного клипа",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "Ширина в пикселях и кадры в секунду. Клипы обрываются через 12 секунд.",
  "Allow duplicate cards": "Разрешить дубликаты карточек",
  "When off, words already in the deck are refused.":
    "Если выключено, слова, уже имеющиеся в колоде, отклоняются.",
  "Immersion": "Погружение",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "Карточки прямо из плеера, без поиска слова: из субтитров на экране или из фрагмента, записанного двумя нажатиями одной клавиши (работает без субтитров). Назначьте клавиши в Настройки → Горячие клавиши → Погружение. Только mpv.",
  "Sentence cards": "Карточки с предложением",
  "Pick a deck and note type above": "Выберите колоду и тип записи выше",
  "Map a field to Sentence audio above": "Назначьте выше поле для аудио предложения",
  "Audio cards": "Аудиокарточки",
  "Audio card deck": "Колода аудиокарточек",
  "Audio card note type": "Тип записи аудиокарточек",
  "Audio field": "Поле аудио",
  "Gets the audio of the line or of the recording.": "Получает аудио строки или записи.",
  "Pick a note type first": "Сначала выберите тип записи",
  "Sentence field (optional)": "Поле предложения (необязательно)",
  "Gets the subtitle text, when there is one.": "Получает текст субтитров, если он есть.",
  "(empty)": "(пусто)",
  "Update last card window": "Окно для «Обновить последнюю карточку»",
  "Update last card only touches a card added this many minutes ago or less.":
    "«Обновить последнюю карточку» меняет только карточку, добавленную не больше этого числа минут назад.",
  "Longest recording": "Самая длинная запись",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "Более длинная запись отменяется. Анимированные клипы всё равно обрываются через 12 секунд.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "Поиск в словаре субтитров, аудио слов и добавление в Anki работают в настольном приложении Harbor.",
  "Download the desktop app to look up words while you watch.":
    "Скачайте настольное приложение, чтобы искать слова во время просмотра.",
  "Long seek": "Длинный переход",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "Шаг сочетаний «Длинный переход назад» и «Длинный переход вперёд».",
  "Slow speed": "Медленная скорость",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "Скорость, на которую сочетание «Переключить медленную скорость» переходит с обычной.",
  "Word": "Слово",
  "Word with furigana": "Слово с фуриганой",
  "Definitions (all)": "Определения (все)",
  "Definition (first dictionary)": "Определение (первый словарь)",
  "Sentence": "Предложение",
  "Sentence (word in bold)": "Предложение (слово жирным)",
  "Sentence (word as cloze)": "Предложение (слово как пропуск)",
  "Sentence audio": "Аудио предложения",
  "Word audio (local)": "Аудио слова (локальное)",
  "Animated clip of the line (AVIF/WebP/GIF)": "Анимированный клип строки (AVIF/WebP/GIF)",
  "Frequency": "Частотность",
  "Pitch accent": "Тональное ударение",
  "Title / episode": "Название / эпизод",
  "AI explanation": "Объяснение ИИ",
  "Text selected in the popup (else first definition)":
    "Текст, выделенный в окне (иначе первое определение)",
  "Not a valid JSON object.": "Это не корректный объект JSON.",
  "Toggle subtitles on/off": "Включить/выключить субтитры",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "Скрывает все субтитры (основные и дополнительные) или возвращает последнюю основную дорожку.",
  "Next subtitle line": "Следующая строка субтитров",
  "Jump to the start of the next subtitle line.": "Переходит к началу следующей строки субтитров.",
  "Previous subtitle line": "Предыдущая строка субтитров",
  "Jump to the start of the previous subtitle line.":
    "Переходит к началу предыдущей строки субтитров.",
  "Toggle slow speed": "Переключить медленную скорость",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "Переключает между обычной скоростью и медленной, заданной в разделе «Поведение» (по умолчанию 0,5x).",
  "Anki: card from the subtitle": "Anki: карточка из субтитров",
  "Anki: update last card": "Anki: обновить последнюю карточку",
  "Anki: audio card": "Anki: аудиокарточка",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "Добавляет карточку только с аудио из строки на экране, используя колоду аудиокарточек. Только mpv.",
  "Record → new card": "Запись → новая карточка",
  "Record → update last card": "Запись → обновить последнюю карточку",
  "Record → audio card": "Запись → аудиокарточка",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "Нажмите один раз, чтобы начать запись, и ещё раз, чтобы остановить и добавить аудиокарточку с этим фрагментом. Работает без субтитров. Только mpv.",
  "Long seek back": "Длинный переход назад",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "Перематывает назад на длинный шаг, заданный в разделе «Поведение» (по умолчанию 30 секунд).",
  "Long seek forward": "Длинный переход вперёд",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "Перематывает вперёд на длинный шаг, заданный в разделе «Поведение» (по умолчанию 30 секунд).",
  "Greek": "Греческий",
  "Latin": "Латынь",
  "Replay current subtitle": "Повторить текущие субтитры",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "Возвращается к началу строки на экране и проигрывает её снова, а если её нет — последней показанной.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "Сочетания «Карточка из субтитров», «Обновить последнюю карточку» и «Запись → карточка» используют колоду, тип записи и поля из раздела Anki выше. Если в субтитрах выбрано слово (выделено при выборе слова или показано в открытом окне), заполняются все назначенные поля, включая слово и определения; без него — только предложение, аудио предложения, снимок или клип и название.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "Добавляет карточку из строки на экране с предложением, аудио и изображением, используя колоду и поля из раздела «Словарь и Anki». Если в субтитрах выбрано слово, в карточку попадают и слово с определениями. Только mpv.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "Помещает строку с экрана (предложение, аудио, изображение) в самую новую карточку колоды, если она добавлена в последние минуты. Если выбрано слово — также слово и определения. Только mpv.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "Нажмите один раз, чтобы начать запись, и ещё раз, чтобы остановить и добавить карточку с этим фрагментом. Работает без субтитров. Если при остановке выбрано слово, в карточку попадают и слово с определениями. Только mpv.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "Нажмите один раз, чтобы начать запись, и ещё раз, чтобы остановить и поместить фрагмент в самую новую карточку. Работает без субтитров. Если при остановке выбрано слово — также слово и определения. Только mpv.",
  "Added {word} to {deck}": "{word} добавлено в {deck}",
  "Updated card in {deck} with {word}": "Карточка в {deck} обновлена словом {word}",
  "Bigger dictionary popup": "Увеличить окно словаря",
  "Make the subtitle dictionary popup 10% bigger. Saved as the Popup size setting.":
    "Увеличивает окно словаря субтитров на 10%. Сохраняется в настройке «Размер окна».",
  "Smaller dictionary popup": "Уменьшить окно словаря",
  "Make the subtitle dictionary popup 10% smaller. Saved as the Popup size setting.":
    "Уменьшает окно словаря субтитров на 10%. Сохраняется в настройке «Размер окна».",
  "Dictionary popup size: {n}%": "Размер окна словаря: {n}%",
  "Popup size": "Размер окна",
  "Scales the whole popup: text, buttons and width. Bigger sizes help on a TV. The Bigger/Smaller dictionary popup hotkeys change it too.":
    "Масштабирует всё окно: текст, кнопки и ширину. Крупный размер удобен на телевизоре. Горячие клавиши «Увеличить/Уменьшить окно словаря» тоже его меняют.",
};
