// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "音频卡片",
  "last card": "上一张卡片",
  "new card": "新卡片",
  "Still adding the previous card…": "仍在添加上一张卡片…",
  "Updated card in {deck}": "已更新 {deck} 中的卡片",
  "Added to {deck}": "已添加到 {deck}",
  "{n}s recorded": "已录制 {n} 秒",
  "Recording → {target}. Press again to stop.": "正在录制 → {target}。再按一次停止。",
  "the video went back since the recording started": "录制开始后视频被倒回",
  "too short": "太短",
  "longer than the {n}s limit": "超过 {n} 秒的上限",
  "Recording discarded: {reason}": "已放弃录制：{reason}",
  "Stopped · {n}s recorded · adding card…": "已停止 · 已录制 {n} 秒 · 正在添加卡片…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "在播放器中制作 Anki 卡片需要桌面应用中的 mpv 播放器。",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "屏幕上没有字幕。没有字幕的部分请使用录制快捷键。",
  "Subtitle dictionary": "字幕词典",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "将鼠标悬停在字幕中的单词上，即可在 Yomitan 词典中查询、收听发音并添加到 Anki。使用 Manatan 的词典引擎。",
  "Look up words in subtitles": "在字幕中查词",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "适用于 Harbor 的字幕和 mpv 绘制的样式字幕（ASS）。图像字幕（PGS）没有可查询的文本。",
  "Pause while the popup is open": "弹窗打开时暂停",
  "Resumes when the popup closes.": "弹窗关闭后继续播放。",
  "Keep the popup open when the mouse leaves": "鼠标移开时保持弹窗打开",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "弹窗（以及暂停）会一直保留，直到你点击外部或按 Escape。",
  "Look up with": "查词方式",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "悬停会在鼠标经过单词时查询。使用按键时，需在悬停时按住它（或在单词上按下），仅悬停不会有任何作用。点击单词始终会查询。",
  "Hover": "悬停",
  "Hold Shift": "按住 Shift",
  "Hold Ctrl": "按住 Ctrl",
  "Hold Alt": "按住 Alt",
  "Scan delay (in milliseconds)": "查词延迟（毫秒）",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "不需要按键时，查询鼠标下单词前的等待时间。越低越快；越高越能避免鼠标只是经过字幕时触发查询。",
  "Keep subtitles above the seek bar": "让字幕保持在进度条上方",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "进度条会遮住最下面一行字幕，因此在查词时把字幕抬到它上方。",
  "Same setting as Player → Subtitles.": "与 播放器 → 字幕 的设置相同。",
  "Subtitle height": "字幕高度",
  "Distance from the bottom of the video.": "距视频底部的距离。",
  "Subtitle language": "字幕语言",
  "Picks the deinflection rules used for lookups.": "选择查词时使用的词形还原规则。",
  "Loading dictionaries…": "正在加载词典…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "还没有词典。请导入 JMdict 或 Jitendex 等 Yomitan .zip 文件。",
  "Importing {name}…": "正在导入 {name}…",
  "Import dictionary (.zip)": "导入词典（.zip）",
  "AI Explanation": "AI 解释",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "用你自己的 AI 服务商为所查单词生成结合上下文的解释。请求从本设备直接发送到任何兼容 OpenAI 的端点（OpenRouter、OpenAI、DeepSeek、Groq、本地服务器…）。",
  "AI explanation in the popup": "在弹窗中显示 AI 解释",
  "Shows the explanation above the dictionary entries.": "在词典条目上方显示解释。",
  "Custom endpoint": "自定义端点",
  "Full URL, used exactly as entered. No path is appended.":
    "完整 URL，按输入原样使用，不追加任何路径。",
  "Stored on this device only.": "仅保存在本设备上。",
  "Model ID sent to the provider.": "发送给服务商的模型 ID。",
  "OpenRouter provider routing": "OpenRouter 服务商路由",
  "Prioritize listed providers": "优先使用列出的服务商",
  "Only listed providers": "仅使用列出的服务商",
  "Ignore listed providers": "忽略列出的服务商",
  "OpenRouter provider slugs": "OpenRouter 服务商标识",
  "Separated by commas or line breaks.": "用逗号或换行分隔。",
  "Allow OpenRouter fallbacks": "允许 OpenRouter 备用",
  "Thinking mode": "思考模式",
  "Thinking intensity": "思考强度",
  "Custom thinking value": "自定义思考值",
  "A word, a token count, or a JSON object.": "一个词、一个 token 数或一个 JSON 对象。",
  "Custom request body JSON": "自定义请求体 JSON",
  "A JSON object merged over the generated request.": "合并到生成请求之上的 JSON 对象。",
  "Auto generate on lookup": "查词时自动生成",
  "When off, the box appears without sending a request and you generate it manually.":
    "关闭后，方框出现时不会发送请求，需要你手动生成。",
  "Real time response": "实时响应",
  "Stream the explanation into the popup as it is written.": "边生成边把解释流式显示到弹窗中。",
  "Cancel unfinished requests": "取消未完成的请求",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "弹窗关闭或查询其他单词时，丢弃仍在生成的解释。",
  "Fallback for unknown words": "未知单词的备用方案",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "对任何词典都没有的单词，也只用 AI 解释打开弹窗，以便仍能加入 Anki。",
  "Custom prompt": "自定义提示词",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "用 {{target}} 表示单词，用 {{sentence}} 表示其上下文。",
  "System prompt": "系统提示词",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "在用户提示词之前发送的可选指令。留空则不发送。",
  "Temperature": "温度",
  "Between 0 and 2. Lower is more deterministic.": "介于 0 到 2 之间。越低越确定。",
  "Word audio": "单词音频",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "从 local-audio-yomichan 数据库（Forvo、NHK16、Shinmeikai8、JPod101）播放并提取发音。请选择 android.db，或位于 *_files 文件夹旁的 entries.db。Flatpak 版只能读取 android.db。",
  "No database selected": "未选择数据库",
  "Choose database": "选择数据库",
  "Connected to Anki": "已连接到 Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "通过 AnkiConnect 添加包含单词、句子、释义、截图、句子音频和单词音频的卡片。Anki 必须已打开并安装 AnkiConnect 插件。",
  "AnkiConnect address": "AnkiConnect 地址",
  "Deck": "牌组",
  "Choose…": "选择…",
  "Connect first": "请先连接",
  "Note type": "笔记类型",
  "Fields": "字段",
  "Auto-fill": "自动填写",
  "Separated by spaces.": "用空格分隔。",
  "Sentence audio padding": "句子音频留白",
  "Seconds added before and after the subtitle line.": "在字幕行前后添加的秒数。",
  "Animated clip format": "动态片段格式",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "用于设置为动态片段的字段。AVIF 最小；WebP 和 GIF 可在旧版 Anki 中播放。缺少编码器时依次改用 WebP、GIF。",
  "Animated clip size": "动态片段尺寸",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "宽度（像素）和每秒帧数。片段在 12 秒后停止。",
  "Allow duplicate cards": "允许重复卡片",
  "When off, words already in the deck are refused.": "关闭时，牌组中已有的单词会被拒绝。",
  "Immersion": "沉浸",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "无需查词，直接从播放器制作卡片：来自屏幕上的字幕，或来自你按两次同一按键录制的片段（没有字幕也可以）。在 设置 → 快捷键 → 沉浸 中设置按键。仅限 mpv。",
  "Sentence cards": "句子卡片",
  "Pick a deck and note type above": "请在上方选择牌组和笔记类型",
  "Map a field to Sentence audio above": "请在上方把一个字段映射到句子音频",
  "Audio cards": "音频卡片",
  "Audio card deck": "音频卡片牌组",
  "Audio card note type": "音频卡片笔记类型",
  "Audio field": "音频字段",
  "Gets the audio of the line or of the recording.": "接收这一行或录制内容的音频。",
  "Pick a note type first": "请先选择笔记类型",
  "Sentence field (optional)": "句子字段（可选）",
  "Gets the subtitle text, when there is one.": "有字幕时接收字幕文本。",
  "(empty)": "（空）",
  "Update last card window": "“更新上一张卡片”的时间范围",
  "Update last card only touches a card added this many minutes ago or less.":
    "“更新上一张卡片”只会修改在这么多分钟内添加的卡片。",
  "Longest recording": "最长录制",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "超过此长度的录制会被放弃。动态片段仍会在 12 秒后停止。",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "字幕词典查询、单词音频和 Anki 制卡需在 Harbor 桌面应用中使用。",
  "Download the desktop app to look up words while you watch.": "下载桌面应用，即可边看边查词。",
  "Long seek": "长跳转",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "“长距离后退”和“长距离前进”快捷键的跳转幅度。",
  "Slow speed": "慢速",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "“切换慢速”快捷键从正常速度切换到的速度。",
  "Word": "单词",
  "Word with furigana": "带假名注音的单词",
  "Definitions (all)": "释义（全部）",
  "Definition (first dictionary)": "释义（第一个词典）",
  "Sentence": "句子",
  "Sentence (word in bold)": "句子（单词加粗）",
  "Sentence (word as cloze)": "句子（单词挖空）",
  "Sentence audio": "句子音频",
  "Word audio (local)": "单词音频（本地）",
  "Animated clip of the line (AVIF/WebP/GIF)": "该行的动态片段（AVIF/WebP/GIF）",
  "Frequency": "词频",
  "Pitch accent": "音高重音",
  "Title / episode": "标题 / 剧集",
  "AI explanation": "AI 解释",
  "Text selected in the popup (else first definition)": "在弹窗中选中的文本（否则为第一条释义）",
  "Not a valid JSON object.": "不是有效的 JSON 对象。",
  "Toggle subtitles on/off": "开启/关闭字幕",
  "Hide every subtitle (primary and secondary), or show the primary again. Hidden subtitles still work for line seeking, replay and Anki cards.":
    "隐藏所有字幕（主字幕和副字幕），或重新显示主字幕。隐藏时仍可用于跳转字幕行、重播和制作 Anki 卡片。",
  "Next subtitle line": "下一行字幕",
  "Jump to the start of the next subtitle line.": "跳到下一行字幕的开头。",
  "Previous subtitle line": "上一行字幕",
  "Jump to the start of the previous subtitle line.": "跳到上一行字幕的开头。",
  "Toggle slow speed": "切换慢速",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "在正常速度和“行为”中设置的慢速（默认 0.5x）之间切换。",
  "Anki: card from the subtitle": "Anki：从字幕制卡",
  "Anki: update last card": "Anki：更新上一张卡片",
  "Anki: audio card": "Anki：音频卡片",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "用屏幕上的这一行添加只有音频的卡片，使用音频卡片牌组。仅限 mpv。",
  "Record → new card": "录制 → 新卡片",
  "Record → update last card": "录制 → 更新上一张卡片",
  "Record → audio card": "录制 → 音频卡片",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "按一次开始录制，再按一次停止并用该片段添加音频卡片。没有字幕也可以。仅限 mpv。",
  "Long seek back": "长距离后退",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "按“行为”中设置的长跳转幅度后退（默认 30 秒）。",
  "Long seek forward": "长距离前进",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "按“行为”中设置的长跳转幅度前进（默认 30 秒）。",
  "Greek": "希腊语",
  "Latin": "拉丁语",
  "Replay current subtitle": "重播当前字幕",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "回到屏幕上这一行的开头并再次播放；若没有字幕，则回到最后显示的一行。",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "“从字幕制卡”“更新上一张卡片”和“录制 → 卡片”按键使用上方 Anki 部分的牌组、笔记类型和字段。在字幕中选中单词时（选词时高亮，或显示在已打开的弹窗中），会填写所有已映射的字段，包括单词和释义；未选中时只填写句子、句子音频、截图或片段以及标题。",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "用屏幕上的这一行添加带句子、音频和图片的卡片，使用“词典与 Anki”中的牌组和字段。在字幕中选中单词时，单词及其释义也会加入卡片。仅限 mpv。",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "把屏幕上的这一行（句子、音频、图片）放入牌组中最新的卡片（需在最近几分钟内添加）。选中单词时，也会加入单词及其释义。仅限 mpv。",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "按一次开始录制，再按一次停止并用该片段添加卡片。没有字幕也可以。停止时若选中了单词，单词及其释义也会加入卡片。仅限 mpv。",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "按一次开始录制，再按一次停止并把该片段放入最新的卡片。没有字幕也可以。停止时若选中了单词，也会加入单词及其释义。仅限 mpv。",
  "Added {word} to {deck}": "已将 {word} 添加到 {deck}",
  "Updated card in {deck} with {word}": "已用 {word} 更新 {deck} 中的卡片",
  "Bigger dictionary popup": "放大词典弹窗",
  "Make the subtitle dictionary popup 10% bigger. Saved as the Popup size setting.":
    "将字幕词典弹窗放大 10%。保存为“弹窗大小”设置。",
  "Smaller dictionary popup": "缩小词典弹窗",
  "Make the subtitle dictionary popup 10% smaller. Saved as the Popup size setting.":
    "将字幕词典弹窗缩小 10%。保存为“弹窗大小”设置。",
  "Dictionary popup size: {n}%": "词典弹窗大小：{n}%",
  "Popup size": "弹窗大小",
  "Scales the whole popup: text, buttons and width. Bigger sizes help on a TV. The Bigger/Smaller dictionary popup hotkeys change it too.":
    "缩放整个弹窗：文字、按钮和宽度。在电视上用较大的尺寸更清楚。“放大/缩小词典弹窗”快捷键也会改变它。",
  "Speed step": "速度步长",
  "How much the Speed down and Speed up shortcuts change the speed per press.":
    "每按一次“减速”和“加速”快捷键时速度变化的幅度。",
  "Slow playback by the Speed step set under Behavior (0.25x by default).":
    "按“行为”中设置的速度步长减慢播放（默认 0.25x）。",
  "Speed playback up by the Speed step set under Behavior (0.25x by default).":
    "按“行为”中设置的速度步长加快播放（默认 0.25x）。",
};
