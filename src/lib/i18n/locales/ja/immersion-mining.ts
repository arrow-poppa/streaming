// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "音声カード",
  "last card": "最後のカード",
  "new card": "新しいカード",
  "Still adding the previous card…": "前のカードを追加中です…",
  "Updated card in {deck}": "{deck} のカードを更新しました",
  "Added to {deck}": "{deck} に追加しました",
  "{n}s recorded": "{n}秒を録音",
  "Recording → {target}. Press again to stop.": "録音中 → {target}。もう一度押すと停止します。",
  "the video went back since the recording started": "録音開始後に動画が巻き戻されました",
  "too short": "短すぎます",
  "longer than the {n}s limit": "上限の{n}秒を超えています",
  "Recording discarded: {reason}": "録音を破棄しました: {reason}",
  "Stopped · {n}s recorded · adding card…": "停止 · {n}秒を録音 · カードを追加中…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "プレーヤーからの Anki カードには、デスクトップアプリの mpv プレーヤーが必要です。",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "画面に字幕がありません。字幕のない部分には録音のショートカットを使ってください。",
  "Subtitle dictionary": "字幕辞書",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "字幕の単語にカーソルを合わせると、Yomitan 辞書で調べたり、発音を聞いたり、Anki に追加したりできます。Manatan の辞書エンジンを使用します。",
  "Look up words in subtitles": "字幕の単語を調べる",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Harbor の字幕と、mpv が描画するスタイル付き字幕（ASS）で使えます。画像字幕（PGS）には調べるテキストがありません。",
  "Pause while the popup is open": "ポップアップ表示中は一時停止",
  "Resumes when the popup closes.": "ポップアップを閉じると再開します。",
  "Keep the popup open when the mouse leaves": "マウスが離れてもポップアップを開いたままにする",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "ポップアップ（と一時停止）は、外側をクリックするか Escape を押すまで続きます。",
  "Look up with": "調べ方",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "ホバーでは、マウスが通過した単語を調べます。キーを使う場合は、ホバー中にキーを押し続ける（または単語の上で押す）必要があり、ホバーだけでは何も起きません。単語をクリックすると常に調べます。",
  "Hover": "ホバー",
  "Hold Shift": "Shift を押しながら",
  "Hold Ctrl": "Ctrl を押しながら",
  "Hold Alt": "Alt を押しながら",
  "Scan delay (in milliseconds)": "検索の遅延（ミリ秒）",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "キーが不要なとき、マウスの下の単語を調べるまでの待ち時間です。短いほど速く、長いほどマウスが字幕を通過するだけのときの検索を防ぎます。",
  "Keep subtitles above the seek bar": "字幕をシークバーの上に表示",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "シークバーが字幕の一番下の行を隠すので、単語を調べている間は字幕をその上に持ち上げます。",
  "Same setting as Player → Subtitles.": "プレーヤー → 字幕 と同じ設定です。",
  "Subtitle height": "字幕の高さ",
  "Distance from the bottom of the video.": "動画の下端からの距離です。",
  "Subtitle language": "字幕の言語",
  "Picks the deinflection rules used for lookups.": "検索に使う活用解除のルールを選びます。",
  "Loading dictionaries…": "辞書を読み込み中…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "辞書はまだありません。JMdict や Jitendex などの Yomitan .zip ファイルをインポートしてください。",
  "Importing {name}…": "{name} をインポート中…",
  "Import dictionary (.zip)": "辞書をインポート（.zip）",
  "AI Explanation": "AI 解説",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "調べた単語の文脈に沿った解説を、自分の AI プロバイダーで生成します。リクエストはこのデバイスから OpenAI 互換のエンドポイント（OpenRouter、OpenAI、DeepSeek、Groq、ローカルサーバーなど）へ直接送られます。",
  "AI explanation in the popup": "ポップアップに AI 解説",
  "Shows the explanation above the dictionary entries.": "辞書の項目の上に解説を表示します。",
  "Custom endpoint": "カスタムエンドポイント",
  "Full URL, used exactly as entered. No path is appended.":
    "入力したとおりに使う完全な URL です。パスは追加されません。",
  "Stored on this device only.": "このデバイスにのみ保存されます。",
  "Model ID sent to the provider.": "プロバイダーに送るモデル ID です。",
  "OpenRouter provider routing": "OpenRouter のプロバイダールーティング",
  "Prioritize listed providers": "一覧のプロバイダーを優先",
  "Only listed providers": "一覧のプロバイダーのみ",
  "Ignore listed providers": "一覧のプロバイダーを除外",
  "OpenRouter provider slugs": "OpenRouter のプロバイダースラッグ",
  "Separated by commas or line breaks.": "カンマまたは改行で区切ります。",
  "Allow OpenRouter fallbacks": "OpenRouter のフォールバックを許可",
  "Thinking mode": "思考モード",
  "Thinking intensity": "思考の強さ",
  "Custom thinking value": "カスタム思考値",
  "A word, a token count, or a JSON object.": "単語、トークン数、または JSON オブジェクト。",
  "Custom request body JSON": "カスタムのリクエスト本文 JSON",
  "A JSON object merged over the generated request.":
    "生成されたリクエストに上書きでマージされる JSON オブジェクトです。",
  "Auto generate on lookup": "検索時に自動生成",
  "When off, the box appears without sending a request and you generate it manually.":
    "オフの場合、ボックスはリクエストを送らずに表示され、手動で生成します。",
  "Real time response": "リアルタイム応答",
  "Stream the explanation into the popup as it is written.":
    "書かれた順に解説をポップアップへストリーミングします。",
  "Cancel unfinished requests": "未完了のリクエストをキャンセル",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "ポップアップを閉じたときや別の単語を調べたときに、生成中の解説を破棄します。",
  "Fallback for unknown words": "未知の単語のフォールバック",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "どの辞書にもない単語でも AI 解説だけでポップアップを開き、Anki に送れるようにします。",
  "Custom prompt": "カスタムプロンプト",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "単語には {{target}}、その文脈には {{sentence}} を使います。",
  "System prompt": "システムプロンプト",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "ユーザープロンプトの前に送る任意の指示です。何も送らない場合は空のままにします。",
  "Temperature": "温度",
  "Between 0 and 2. Lower is more deterministic.": "0〜2 の範囲。低いほど決定的になります。",
  "Word audio": "単語の音声",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "local-audio-yomichan データベース（Forvo、NHK16、Shinmeikai8、JPod101）から発音を再生・追加します。android.db、または *_files フォルダーの隣にある entries.db を選んでください。Flatpak 版は android.db のみ読めます。",
  "No database selected": "データベースが選択されていません",
  "Choose database": "データベースを選択",
  "Connected to Anki": "Anki に接続しました",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "AnkiConnect を通じて、単語、例文、定義、スクリーンショット、例文の音声、単語の音声を含むカードを追加します。AnkiConnect アドオンを入れた Anki を開いておく必要があります。",
  "AnkiConnect address": "AnkiConnect のアドレス",
  "Deck": "デッキ",
  "Choose…": "選択…",
  "Connect first": "先に接続してください",
  "Note type": "ノートタイプ",
  "Fields": "フィールド",
  "Auto-fill": "自動入力",
  "Separated by spaces.": "スペースで区切ります。",
  "Sentence audio padding": "例文音声の余白",
  "Seconds added before and after the subtitle line.": "字幕の行の前後に追加する秒数です。",
  "Animated clip format": "アニメーションクリップの形式",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "アニメーションクリップを設定したフィールド用です。AVIF が最も小さく、WebP と GIF は古い Anki でも再生できます。エンコーダーがない場合は WebP、次に GIF に切り替えます。",
  "Animated clip size": "アニメーションクリップのサイズ",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "幅（ピクセル）とフレームレート。クリップは 12 秒で止まります。",
  "Allow duplicate cards": "重複カードを許可",
  "When off, words already in the deck are refused.":
    "オフの場合、デッキにすでにある単語は拒否されます。",
  "Immersion": "イマージョン",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "単語を調べずにプレーヤーから直接カードを作ります。画面の字幕から、または同じキーを 2 回押して録音した区間から作れます（字幕なしでも可）。キーは 設定 → ショートカット → イマージョン で設定します。mpv のみ。",
  "Sentence cards": "例文カード",
  "Pick a deck and note type above": "上でデッキとノートタイプを選んでください",
  "Map a field to Sentence audio above": "上でフィールドを「例文の音声」に割り当ててください",
  "Audio cards": "音声カード",
  "Audio card deck": "音声カードのデッキ",
  "Audio card note type": "音声カードのノートタイプ",
  "Audio field": "音声フィールド",
  "Gets the audio of the line or of the recording.": "行または録音の音声が入ります。",
  "Pick a note type first": "先にノートタイプを選んでください",
  "Sentence field (optional)": "例文フィールド（任意）",
  "Gets the subtitle text, when there is one.": "字幕がある場合はそのテキストが入ります。",
  "(empty)": "（空）",
  "Update last card window": "「最後のカードを更新」の対象期間",
  "Update last card only touches a card added this many minutes ago or less.":
    "「最後のカードを更新」は、この分数以内に追加されたカードだけを変更します。",
  "Longest recording": "録音の最大長",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "これより長い録音は破棄されます。アニメーションクリップは引き続き 12 秒で止まります。",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "字幕辞書の検索、単語の音声、Anki への追加は Harbor デスクトップアプリで動作します。",
  "Download the desktop app to look up words while you watch.":
    "視聴中に単語を調べるにはデスクトップアプリをダウンロードしてください。",
  "Long seek": "長いシーク",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "「長く戻る」「長く進む」ショートカットのジャンプ幅です。",
  "Slow speed": "低速",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "「低速を切り替え」ショートカットが通常速度から切り替える速度です。",
  "Word": "単語",
  "Word with furigana": "ふりがな付きの単語",
  "Definitions (all)": "定義（すべて）",
  "Definition (first dictionary)": "定義（最初の辞書）",
  "Sentence": "例文",
  "Sentence (word in bold)": "例文（単語を太字）",
  "Sentence (word as cloze)": "例文（単語を穴埋め）",
  "Sentence audio": "例文の音声",
  "Word audio (local)": "単語の音声（ローカル）",
  "Animated clip of the line (AVIF/WebP/GIF)": "行のアニメーションクリップ（AVIF/WebP/GIF）",
  "Frequency": "頻度",
  "Pitch accent": "ピッチアクセント",
  "Title / episode": "タイトル / エピソード",
  "AI explanation": "AI 解説",
  "Text selected in the popup (else first definition)":
    "ポップアップで選択したテキスト（なければ最初の定義）",
  "Not a valid JSON object.": "有効な JSON オブジェクトではありません。",
  "Toggle subtitles on/off": "字幕のオン/オフ",
  "Hide every subtitle (primary and secondary), or show the primary again. Hidden subtitles still work for line seeking, replay and Anki cards.":
    "すべての字幕（メインとサブ）を隠すか、メイン字幕をもう一度表示します。隠している間も、行の移動・リプレイ・Anki カードには使えます。",
  "Next subtitle line": "次の字幕行",
  "Jump to the start of the next subtitle line.": "次の字幕行の先頭へ移動します。",
  "Previous subtitle line": "前の字幕行",
  "Jump to the start of the previous subtitle line.": "前の字幕行の先頭へ移動します。",
  "Toggle slow speed": "低速を切り替え",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "通常速度と、動作で設定した低速（既定は 0.5x）を切り替えます。",
  "Anki: card from the subtitle": "Anki: 字幕からカード",
  "Anki: update last card": "Anki: 最後のカードを更新",
  "Anki: audio card": "Anki: 音声カード",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "画面の行から音声だけのカードを、音声カードのデッキに追加します。mpv のみ。",
  "Record → new card": "録音 → 新しいカード",
  "Record → update last card": "録音 → 最後のカードを更新",
  "Record → audio card": "録音 → 音声カード",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "1 回押すと録音を開始し、もう一度押すと停止してその区間で音声カードを追加します。字幕なしでも使えます。mpv のみ。",
  "Long seek back": "長く戻る",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "動作で設定した長いシークの幅だけ戻ります（既定は 30 秒）。",
  "Long seek forward": "長く進む",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "動作で設定した長いシークの幅だけ進みます（既定は 30 秒）。",
  "Greek": "ギリシャ語",
  "Latin": "ラテン語",
  "Replay current subtitle": "現在の字幕をもう一度再生",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "画面の行の先頭に戻ってもう一度再生します。行がない場合は最後に表示された行の先頭に戻ります。",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "「字幕からカード」「最後のカードを更新」「録音 → カード」のキーは、上の Anki セクションのデッキ、ノートタイプ、フィールドを使います。字幕で単語を選んでいる場合（単語を選ぶモードで強調表示中、または開いているポップアップ）は、単語と定義を含むすべての割り当て済みフィールドが入力されます。選んでいない場合は、例文、例文の音声、スクリーンショットまたはクリップ、タイトルだけです。",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "画面の行から、例文・音声・画像付きのカードを、辞書と Anki のデッキとフィールドで追加します。字幕で単語を選んでいる場合は、単語と定義もカードに入ります。mpv のみ。",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "画面の行（例文、音声、画像）を、数分以内に追加されたデッキの最新カードに入れます。単語を選んでいる場合は、単語と定義も入れます。mpv のみ。",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "1 回押すと録音を開始し、もう一度押すと停止してその区間でカードを追加します。字幕なしでも使えます。停止時に単語を選んでいる場合は、単語と定義もカードに入ります。mpv のみ。",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "1 回押すと録音を開始し、もう一度押すと停止してその区間を最新のカードに入れます。字幕なしでも使えます。停止時に単語を選んでいる場合は、単語と定義も入れます。mpv のみ。",
  "Added {word} to {deck}": "{word} を {deck} に追加しました",
  "Updated card in {deck} with {word}": "{deck} のカードを {word} で更新しました",
  "Bigger dictionary popup": "辞書ポップアップを大きく",
  "Make the subtitle dictionary popup 10% bigger. Saved as the Popup size setting.":
    "字幕の辞書ポップアップを 10% 大きくします。「ポップアップのサイズ」設定に保存されます。",
  "Smaller dictionary popup": "辞書ポップアップを小さく",
  "Make the subtitle dictionary popup 10% smaller. Saved as the Popup size setting.":
    "字幕の辞書ポップアップを 10% 小さくします。「ポップアップのサイズ」設定に保存されます。",
  "Dictionary popup size: {n}%": "辞書ポップアップのサイズ: {n}%",
  "Popup size": "ポップアップのサイズ",
  "Scales the whole popup: text, buttons and width. Bigger sizes help on a TV. The Bigger/Smaller dictionary popup hotkeys change it too.":
    "ポップアップ全体（文字・ボタン・幅）を拡大縮小します。テレビでは大きめが見やすくなります。「辞書ポップアップを大きく／小さく」のショートカットでも変更できます。",
  "Speed step": "速度の刻み",
  "How much the Speed down and Speed up shortcuts change the speed per press.":
    "「再生速度を下げる」「再生速度を上げる」ショートカットを 1 回押すごとに変わる速度の量です。",
  "Slow playback by the Speed step set under Behavior (0.25x by default).":
    "「動作」で設定した速度の刻みだけ再生を遅くします（既定は 0.25x）。",
  "Speed playback up by the Speed step set under Behavior (0.25x by default).":
    "「動作」で設定した速度の刻みだけ再生を速くします（既定は 0.25x）。",
};
