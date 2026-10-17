// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "오디오 카드",
  "last card": "마지막 카드",
  "new card": "새 카드",
  "Still adding the previous card…": "이전 카드를 아직 추가하는 중…",
  "Updated card in {deck}": "{deck}의 카드를 업데이트했습니다",
  "Added to {deck}": "{deck}에 추가했습니다",
  "{n}s recorded": "{n}초 녹음됨",
  "Recording → {target}. Press again to stop.": "녹음 중 → {target}. 다시 누르면 멈춥니다.",
  "the video went back since the recording started": "녹음이 시작된 뒤 영상이 뒤로 이동했습니다",
  "too short": "너무 짧음",
  "longer than the {n}s limit": "{n}초 제한보다 김",
  "Recording discarded: {reason}": "녹음을 버렸습니다: {reason}",
  "Stopped · {n}s recorded · adding card…": "멈춤 · {n}초 녹음됨 · 카드 추가 중…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "플레이어에서 Anki 카드를 만들려면 데스크톱 앱의 mpv 플레이어가 필요합니다.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "화면에 자막이 없습니다. 자막 없는 구간에는 녹음 단축키를 사용하세요.",
  "Subtitle dictionary": "자막 사전",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "자막의 단어에 마우스를 올리면 Yomitan 사전에서 찾아보고, 들어 보고, Anki에 추가할 수 있습니다. Manatan의 사전 엔진을 사용합니다.",
  "Look up words in subtitles": "자막에서 단어 찾기",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Harbor 자막과 mpv가 그리는 스타일 자막(ASS)에서 작동합니다. 이미지 자막(PGS)에는 찾을 텍스트가 없습니다.",
  "Pause while the popup is open": "팝업이 열려 있는 동안 일시정지",
  "Resumes when the popup closes.": "팝업이 닫히면 다시 재생합니다.",
  "Keep the popup open when the mouse leaves": "마우스가 벗어나도 팝업 유지",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "팝업(과 일시정지)은 바깥을 클릭하거나 Escape를 누를 때까지 유지됩니다.",
  "Look up with": "찾기 방식",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "마우스 올리기는 마우스가 지나가는 단어를 찾습니다. 키를 쓰면 마우스를 올린 채 키를 누르고 있어야 하며(또는 단어 위에서 누르기), 그냥 올리기만 해서는 아무 일도 일어나지 않습니다. 단어를 클릭하면 항상 찾습니다.",
  "Hover": "마우스 올리기",
  "Hold Shift": "Shift 누르기",
  "Hold Ctrl": "Ctrl 누르기",
  "Hold Alt": "Alt 누르기",
  "Scan delay (in milliseconds)": "찾기 지연(밀리초)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "키가 필요 없을 때 마우스 아래 단어를 찾기 전 기다리는 시간입니다. 낮을수록 빠르고, 높을수록 마우스가 자막 위를 지나가기만 할 때 찾지 않습니다.",
  "Keep subtitles above the seek bar": "자막을 탐색 막대 위에 유지",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "탐색 막대가 맨 아래 자막 줄을 가리므로 단어를 찾는 동안 자막을 그 위로 올립니다.",
  "Same setting as Player → Subtitles.": "플레이어 → 자막과 같은 설정입니다.",
  "Subtitle height": "자막 높이",
  "Distance from the bottom of the video.": "영상 아래쪽에서의 거리입니다.",
  "Subtitle language": "자막 언어",
  "Picks the deinflection rules used for lookups.": "찾기에 쓰는 활용 해제 규칙을 고릅니다.",
  "Loading dictionaries…": "사전을 불러오는 중…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "아직 사전이 없습니다. JMdict나 Jitendex 같은 Yomitan .zip 파일을 가져오세요.",
  "Importing {name}…": "{name} 가져오는 중…",
  "Import dictionary (.zip)": "사전 가져오기(.zip)",
  "AI Explanation": "AI 설명",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "찾은 단어의 문맥 설명을 직접 쓰는 AI 제공자로 생성합니다. 요청은 이 기기에서 OpenAI 호환 엔드포인트(OpenRouter, OpenAI, DeepSeek, Groq, 로컬 서버…)로 바로 전송됩니다.",
  "AI explanation in the popup": "팝업의 AI 설명",
  "Shows the explanation above the dictionary entries.": "사전 항목 위에 설명을 표시합니다.",
  "Custom endpoint": "사용자 지정 엔드포인트",
  "Full URL, used exactly as entered. No path is appended.":
    "입력한 그대로 사용하는 전체 URL입니다. 경로를 덧붙이지 않습니다.",
  "Stored on this device only.": "이 기기에만 저장됩니다.",
  "Model ID sent to the provider.": "제공자에게 보내는 모델 ID입니다.",
  "OpenRouter provider routing": "OpenRouter 제공자 라우팅",
  "Prioritize listed providers": "목록의 제공자 우선",
  "Only listed providers": "목록의 제공자만",
  "Ignore listed providers": "목록의 제공자 제외",
  "OpenRouter provider slugs": "OpenRouter 제공자 슬러그",
  "Separated by commas or line breaks.": "쉼표나 줄바꿈으로 구분합니다.",
  "Allow OpenRouter fallbacks": "OpenRouter 대체 허용",
  "Thinking mode": "사고 모드",
  "Thinking intensity": "사고 강도",
  "Custom thinking value": "사용자 지정 사고 값",
  "A word, a token count, or a JSON object.": "단어, 토큰 수 또는 JSON 객체.",
  "Custom request body JSON": "사용자 지정 요청 본문 JSON",
  "A JSON object merged over the generated request.": "생성된 요청 위에 병합되는 JSON 객체입니다.",
  "Auto generate on lookup": "찾을 때 자동 생성",
  "When off, the box appears without sending a request and you generate it manually.":
    "끄면 요청을 보내지 않은 채 상자가 나타나고 직접 생성합니다.",
  "Real time response": "실시간 응답",
  "Stream the explanation into the popup as it is written.":
    "설명이 작성되는 대로 팝업에 스트리밍합니다.",
  "Cancel unfinished requests": "끝나지 않은 요청 취소",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "팝업이 닫히거나 다른 단어를 찾을 때 생성 중인 설명을 버립니다.",
  "Fallback for unknown words": "모르는 단어 대체",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "어느 사전에도 없는 단어도 AI 설명만으로 팝업을 열어 Anki에 보낼 수 있게 합니다.",
  "Custom prompt": "사용자 지정 프롬프트",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "단어에는 {{target}}, 문맥에는 {{sentence}}를 사용하세요.",
  "System prompt": "시스템 프롬프트",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "사용자 프롬프트 앞에 보내는 선택 지시입니다. 보내지 않으려면 비워 두세요.",
  "Temperature": "온도",
  "Between 0 and 2. Lower is more deterministic.": "0에서 2 사이. 낮을수록 더 결정적입니다.",
  "Word audio": "단어 오디오",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "local-audio-yomichan 데이터베이스(Forvo, NHK16, Shinmeikai8, JPod101)에서 발음을 재생하고 카드에 넣습니다. android.db, 또는 *_files 폴더 옆의 entries.db를 고르세요. Flatpak 버전은 android.db만 읽을 수 있습니다.",
  "No database selected": "선택한 데이터베이스 없음",
  "Choose database": "데이터베이스 선택",
  "Connected to Anki": "Anki에 연결됨",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "AnkiConnect로 단어, 문장, 정의, 스크린샷, 문장 오디오, 단어 오디오가 담긴 카드를 추가합니다. AnkiConnect 애드온과 함께 Anki가 열려 있어야 합니다.",
  "AnkiConnect address": "AnkiConnect 주소",
  "Deck": "덱",
  "Choose…": "선택…",
  "Connect first": "먼저 연결하세요",
  "Note type": "노트 유형",
  "Fields": "필드",
  "Auto-fill": "자동 채우기",
  "Separated by spaces.": "공백으로 구분합니다.",
  "Sentence audio padding": "문장 오디오 여백",
  "Seconds added before and after the subtitle line.": "자막 줄 앞뒤에 더하는 초입니다.",
  "Animated clip format": "애니메이션 클립 형식",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "애니메이션 클립으로 설정한 필드용입니다. AVIF가 가장 작고, WebP와 GIF는 이전 Anki에서도 재생됩니다. 인코더가 없으면 WebP, 그다음 GIF로 바꿉니다.",
  "Animated clip size": "애니메이션 클립 크기",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "픽셀 단위 너비와 초당 프레임. 클립은 12초 후에 멈춥니다.",
  "Allow duplicate cards": "중복 카드 허용",
  "When off, words already in the deck are refused.": "끄면 덱에 이미 있는 단어는 거부됩니다.",
  "Immersion": "몰입",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "단어를 찾지 않고 플레이어에서 바로 카드를 만듭니다. 화면의 자막에서, 또는 같은 키를 두 번 눌러 녹음한 구간에서 만들 수 있습니다(자막 없이도 가능). 키는 설정 → 단축키 → 몰입에서 정하세요. mpv 전용.",
  "Sentence cards": "문장 카드",
  "Pick a deck and note type above": "위에서 덱과 노트 유형을 고르세요",
  "Map a field to Sentence audio above": "위에서 필드를 문장 오디오에 연결하세요",
  "Audio cards": "오디오 카드",
  "Audio card deck": "오디오 카드 덱",
  "Audio card note type": "오디오 카드 노트 유형",
  "Audio field": "오디오 필드",
  "Gets the audio of the line or of the recording.": "줄이나 녹음의 오디오가 들어갑니다.",
  "Pick a note type first": "먼저 노트 유형을 고르세요",
  "Sentence field (optional)": "문장 필드(선택)",
  "Gets the subtitle text, when there is one.": "자막이 있으면 그 텍스트가 들어갑니다.",
  "(empty)": "(비어 있음)",
  "Update last card window": "마지막 카드 업데이트 기간",
  "Update last card only touches a card added this many minutes ago or less.":
    "마지막 카드 업데이트는 이 분 이내에 추가된 카드만 바꿉니다.",
  "Longest recording": "최대 녹음 길이",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "이보다 긴 녹음은 버립니다. 애니메이션 클립은 여전히 12초 후에 멈춥니다.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "자막 사전 찾기, 단어 오디오, Anki 마이닝은 Harbor 데스크톱 앱에서 작동합니다.",
  "Download the desktop app to look up words while you watch.":
    "보면서 단어를 찾으려면 데스크톱 앱을 내려받으세요.",
  "Long seek": "긴 탐색",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "긴 뒤로 탐색과 긴 앞으로 탐색 단축키의 이동 폭입니다.",
  "Slow speed": "느린 속도",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "느린 속도 전환 단축키가 보통 속도에서 바꾸는 속도입니다.",
  "Word": "단어",
  "Word with furigana": "후리가나가 있는 단어",
  "Definitions (all)": "정의(전체)",
  "Definition (first dictionary)": "정의(첫 번째 사전)",
  "Sentence": "문장",
  "Sentence (word in bold)": "문장(단어 굵게)",
  "Sentence (word as cloze)": "문장(단어를 빈칸으로)",
  "Sentence audio": "문장 오디오",
  "Word audio (local)": "단어 오디오(로컬)",
  "Animated clip of the line (AVIF/WebP/GIF)": "줄의 애니메이션 클립(AVIF/WebP/GIF)",
  "Frequency": "빈도",
  "Pitch accent": "고저 악센트",
  "Title / episode": "제목 / 에피소드",
  "AI explanation": "AI 설명",
  "Text selected in the popup (else first definition)": "팝업에서 선택한 텍스트(없으면 첫 정의)",
  "Not a valid JSON object.": "올바른 JSON 객체가 아닙니다.",
  "Toggle subtitles on/off": "자막 켜기/끄기",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "모든 자막(기본과 보조)을 숨기거나 마지막 기본 트랙을 되돌립니다.",
  "Next subtitle line": "다음 자막 줄",
  "Jump to the start of the next subtitle line.": "다음 자막 줄의 시작으로 이동합니다.",
  "Previous subtitle line": "이전 자막 줄",
  "Jump to the start of the previous subtitle line.": "이전 자막 줄의 시작으로 이동합니다.",
  "Toggle slow speed": "느린 속도 전환",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "보통 속도와 동작에서 정한 느린 속도(기본 0.5x) 사이를 전환합니다.",
  "Anki: card from the subtitle": "Anki: 자막에서 카드",
  "Anki: update last card": "Anki: 마지막 카드 업데이트",
  "Anki: audio card": "Anki: 오디오 카드",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "화면의 줄로 오디오만 담긴 카드를 오디오 카드 덱에 추가합니다. mpv 전용.",
  "Record → new card": "녹음 → 새 카드",
  "Record → update last card": "녹음 → 마지막 카드 업데이트",
  "Record → audio card": "녹음 → 오디오 카드",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "한 번 누르면 녹음을 시작하고, 다시 누르면 멈추고 그 구간으로 오디오 카드를 추가합니다. 자막 없이도 됩니다. mpv 전용.",
  "Long seek back": "긴 뒤로 탐색",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "동작에서 정한 긴 탐색 폭만큼 뒤로 갑니다(기본 30초).",
  "Long seek forward": "긴 앞으로 탐색",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "동작에서 정한 긴 탐색 폭만큼 앞으로 갑니다(기본 30초).",
  "Greek": "그리스어",
  "Latin": "라틴어",
  "Replay current subtitle": "현재 자막 다시 재생",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "화면의 줄 처음으로 돌아가 다시 재생합니다. 줄이 없으면 마지막으로 표시된 줄로 돌아갑니다.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "자막에서 카드, 마지막 카드 업데이트, 녹음 → 카드 키는 위 Anki 섹션의 덱, 노트 유형, 필드를 사용합니다. 자막에서 단어를 선택했을 때(단어 고르기에서 강조되었거나 열린 팝업에 표시된 단어) 단어와 정의를 포함한 모든 연결된 필드를 채우고, 선택하지 않았을 때는 문장, 문장 오디오, 스크린샷 또는 클립, 제목만 채웁니다.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "화면의 줄로 문장, 오디오, 이미지가 담긴 카드를 사전 및 Anki의 덱과 필드로 추가합니다. 자막에서 단어를 선택했다면 단어와 정의도 카드에 들어갑니다. mpv 전용.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "화면의 줄(문장, 오디오, 이미지)을 몇 분 안에 추가된 덱의 최신 카드에 넣습니다. 단어를 선택했다면 단어와 정의도 넣습니다. mpv 전용.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "한 번 누르면 녹음을 시작하고, 다시 누르면 멈추고 그 구간으로 카드를 추가합니다. 자막 없이도 됩니다. 멈출 때 단어를 선택했다면 단어와 정의도 카드에 들어갑니다. mpv 전용.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "한 번 누르면 녹음을 시작하고, 다시 누르면 멈추고 그 구간을 최신 카드에 넣습니다. 자막 없이도 됩니다. 멈출 때 단어를 선택했다면 단어와 정의도 넣습니다. mpv 전용.",
  "Added {word} to {deck}": "{word}을(를) {deck}에 추가했습니다",
  "Updated card in {deck} with {word}": "{deck}의 카드를 {word}(으)로 업데이트했습니다",
  "Bigger dictionary popup": "사전 팝업 크게",
  "Make the subtitle dictionary popup 10% bigger. Saved as the Popup size setting.":
    "자막 사전 팝업을 10% 크게 합니다. 팝업 크기 설정에 저장됩니다.",
  "Smaller dictionary popup": "사전 팝업 작게",
  "Make the subtitle dictionary popup 10% smaller. Saved as the Popup size setting.":
    "자막 사전 팝업을 10% 작게 합니다. 팝업 크기 설정에 저장됩니다.",
  "Dictionary popup size: {n}%": "사전 팝업 크기: {n}%",
  "Popup size": "팝업 크기",
  "Scales the whole popup: text, buttons and width. Bigger sizes help on a TV. The Bigger/Smaller dictionary popup hotkeys change it too.":
    "팝업 전체(글자, 버튼, 너비)의 크기를 조절합니다. TV에서는 크게 하면 보기 좋습니다. 사전 팝업 크게/작게 단축키로도 바꿀 수 있습니다.",
  "Speed step": "속도 단계",
  "How much the Speed down and Speed up shortcuts change the speed per press.":
    "속도 낮추기/높이기 단축키를 한 번 누를 때 바뀌는 속도입니다.",
  "Slow playback by the Speed step set under Behavior (0.25x by default).":
    "동작에서 정한 속도 단계만큼 재생을 느리게 합니다(기본 0.25x).",
  "Speed playback up by the Speed step set under Behavior (0.25x by default).":
    "동작에서 정한 속도 단계만큼 재생을 빠르게 합니다(기본 0.25x).",
};
