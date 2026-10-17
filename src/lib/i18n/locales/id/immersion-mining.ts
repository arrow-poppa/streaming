// Dictionary & Anki settings, the immersion hotkeys and their player messages.
export default {
  "audio card": "kartu audio",
  "last card": "kartu terakhir",
  "new card": "kartu baru",
  "Still adding the previous card…": "Masih menambahkan kartu sebelumnya…",
  "Updated card in {deck}": "Kartu di {deck} diperbarui",
  "Added to {deck}": "Ditambahkan ke {deck}",
  "{n}s recorded": "{n} dtk direkam",
  "Recording → {target}. Press again to stop.": "Merekam → {target}. Tekan lagi untuk berhenti.",
  "the video went back since the recording started": "video mundur sejak perekaman dimulai",
  "too short": "terlalu pendek",
  "longer than the {n}s limit": "lebih panjang dari batas {n} dtk",
  "Recording discarded: {reason}": "Rekaman dibuang: {reason}",
  "Stopped · {n}s recorded · adding card…": "Berhenti · {n} dtk direkam · menambahkan kartu…",
  "Anki cards from the player need the mpv player in the desktop app.":
    "Kartu Anki dari pemutar memerlukan pemutar mpv di aplikasi desktop.",
  "No subtitle on screen. Use a Record shortcut for parts without subtitles.":
    "Tidak ada subtitel di layar. Gunakan pintasan Rekam untuk bagian tanpa subtitel.",
  "Subtitle dictionary": "Kamus subtitel",
  "Hover a word in the subtitles to look it up in your Yomitan dictionaries, hear it and add it to Anki. Uses Manatan's dictionary engine.":
    "Arahkan kursor ke kata di subtitel untuk mencarinya di kamus Yomitan Anda, mendengarnya, dan menambahkannya ke Anki. Memakai mesin kamus Manatan.",
  "Look up words in subtitles": "Cari kata di subtitel",
  "Works with Harbor's subtitles and with styled (ASS) subtitles drawn by mpv. Image subtitles (PGS) have no text to look up.":
    "Berfungsi dengan subtitel Harbor dan subtitel bergaya (ASS) yang digambar mpv. Subtitel gambar (PGS) tidak memiliki teks untuk dicari.",
  "Pause while the popup is open": "Jeda selama popup terbuka",
  "Resumes when the popup closes.": "Lanjut saat popup ditutup.",
  "Keep the popup open when the mouse leaves": "Biarkan popup terbuka saat kursor keluar",
  "The popup (and the pause) stays until you click outside it or press Escape.":
    "Popup (dan jeda) tetap ada sampai Anda mengklik di luarnya atau menekan Escape.",
  "Look up with": "Cari dengan",
  "Hover looks words up as the mouse passes over them. With a key, hold it while hovering (or press it on a word) and plain hovering does nothing. Clicking a word always looks it up.":
    "Arahkan mencari kata saat kursor melewatinya. Dengan tombol, tahan tombol itu sambil mengarahkan (atau tekan di atas kata), dan sekadar mengarahkan tidak melakukan apa pun. Mengklik kata selalu mencarinya.",
  "Hover": "Arahkan",
  "Hold Shift": "Tahan Shift",
  "Hold Ctrl": "Tahan Ctrl",
  "Hold Alt": "Tahan Alt",
  "Scan delay (in milliseconds)": "Jeda pencarian (milidetik)",
  "Wait before looking up the word under the mouse when no key is required. Lower is faster; higher avoids lookups while the mouse just passes over the subtitle.":
    "Waktu tunggu sebelum mencari kata di bawah kursor jika tidak perlu tombol. Lebih rendah lebih cepat; lebih tinggi menghindari pencarian saat kursor hanya melintas di atas subtitel.",
  "Keep subtitles above the seek bar": "Letakkan subtitel di atas bilah pencarian",
  "The seek bar covers the lowest subtitle line, so lift the subtitles above it while you look words up.":
    "Bilah pencarian menutupi baris subtitel terbawah, jadi naikkan subtitel di atasnya saat Anda mencari kata.",
  "Same setting as Player → Subtitles.": "Pengaturan yang sama dengan Pemutar → Subtitel.",
  "Subtitle height": "Tinggi subtitel",
  "Distance from the bottom of the video.": "Jarak dari bawah video.",
  "Subtitle language": "Bahasa subtitel",
  "Picks the deinflection rules used for lookups.": "Memilih aturan deinfleksi untuk pencarian.",
  "Loading dictionaries…": "Memuat kamus…",
  "No dictionaries yet. Import Yomitan .zip files such as JMdict or Jitendex.":
    "Belum ada kamus. Impor file .zip Yomitan seperti JMdict atau Jitendex.",
  "Importing {name}…": "Mengimpor {name}…",
  "Import dictionary (.zip)": "Impor kamus (.zip)",
  "AI Explanation": "Penjelasan AI",
  "Generate a contextual explanation of the looked-up word with your own AI provider. Requests go directly from this device to any OpenAI-compatible endpoint (OpenRouter, OpenAI, DeepSeek, Groq, a local server…).":
    "Buat penjelasan kontekstual untuk kata yang dicari dengan penyedia AI Anda sendiri. Permintaan langsung dikirim dari perangkat ini ke endpoint apa pun yang kompatibel dengan OpenAI (OpenRouter, OpenAI, DeepSeek, Groq, server lokal…).",
  "AI explanation in the popup": "Penjelasan AI di popup",
  "Shows the explanation above the dictionary entries.":
    "Menampilkan penjelasan di atas entri kamus.",
  "Custom endpoint": "Endpoint khusus",
  "Full URL, used exactly as entered. No path is appended.":
    "URL lengkap, dipakai persis seperti yang dimasukkan. Tidak ada path yang ditambahkan.",
  "Stored on this device only.": "Hanya disimpan di perangkat ini.",
  "Model ID sent to the provider.": "ID model yang dikirim ke penyedia.",
  "OpenRouter provider routing": "Perutean penyedia OpenRouter",
  "Prioritize listed providers": "Utamakan penyedia yang tercantum",
  "Only listed providers": "Hanya penyedia yang tercantum",
  "Ignore listed providers": "Abaikan penyedia yang tercantum",
  "OpenRouter provider slugs": "Slug penyedia OpenRouter",
  "Separated by commas or line breaks.": "Dipisahkan koma atau baris baru.",
  "Allow OpenRouter fallbacks": "Izinkan cadangan OpenRouter",
  "Thinking mode": "Mode berpikir",
  "Thinking intensity": "Intensitas berpikir",
  "Custom thinking value": "Nilai berpikir khusus",
  "A word, a token count, or a JSON object.": "Sebuah kata, jumlah token, atau objek JSON.",
  "Custom request body JSON": "JSON isi permintaan khusus",
  "A JSON object merged over the generated request.":
    "Objek JSON yang digabungkan di atas permintaan yang dibuat.",
  "Auto generate on lookup": "Buat otomatis saat mencari",
  "When off, the box appears without sending a request and you generate it manually.":
    "Jika mati, kotak muncul tanpa mengirim permintaan dan Anda membuatnya secara manual.",
  "Real time response": "Respons waktu nyata",
  "Stream the explanation into the popup as it is written.":
    "Mengalirkan penjelasan ke popup selagi ditulis.",
  "Cancel unfinished requests": "Batalkan permintaan yang belum selesai",
  "Drop an explanation still being generated when the popup closes or another word is looked up.":
    "Membuang penjelasan yang masih dibuat saat popup ditutup atau kata lain dicari.",
  "Fallback for unknown words": "Cadangan untuk kata tak dikenal",
  "Open the popup for words no dictionary contains, with only the AI explanation, so they can still go to Anki.":
    "Membuka popup untuk kata yang tidak ada di kamus mana pun, hanya dengan penjelasan AI, agar tetap bisa masuk ke Anki.",
  "Custom prompt": "Prompt khusus",
  "Use {{target}} for the word and {{sentence}} for its context.":
    "Gunakan {{target}} untuk kata dan {{sentence}} untuk konteksnya.",
  "System prompt": "Prompt sistem",
  "Optional instructions sent before the user prompt. Leave empty to send none.":
    "Instruksi opsional yang dikirim sebelum prompt pengguna. Kosongkan agar tidak mengirim apa pun.",
  "Temperature": "Temperatur",
  "Between 0 and 2. Lower is more deterministic.":
    "Antara 0 dan 2. Lebih rendah lebih deterministik.",
  "Word audio": "Audio kata",
  "Plays and mines pronunciations from a local-audio-yomichan database (Forvo, NHK16, Shinmeikai8, JPod101). Pick android.db, or entries.db next to its *_files folders. The Flatpak build can only read android.db.":
    "Memutar dan mengambil pelafalan dari database local-audio-yomichan (Forvo, NHK16, Shinmeikai8, JPod101). Pilih android.db, atau entries.db di samping folder *_files. Versi Flatpak hanya bisa membaca android.db.",
  "No database selected": "Tidak ada database yang dipilih",
  "Choose database": "Pilih database",
  "Connected to Anki": "Terhubung ke Anki",
  "Anki": "Anki",
  "Adds cards through AnkiConnect with the word, sentence, definitions, a screenshot, the sentence audio and the word audio. Anki must be open with the AnkiConnect add-on.":
    "Menambahkan kartu melalui AnkiConnect dengan kata, kalimat, definisi, tangkapan layar, audio kalimat, dan audio kata. Anki harus terbuka dengan add-on AnkiConnect.",
  "AnkiConnect address": "Alamat AnkiConnect",
  "Deck": "Dek",
  "Choose…": "Pilih…",
  "Connect first": "Hubungkan dulu",
  "Note type": "Jenis catatan",
  "Fields": "Bidang",
  "Auto-fill": "Isi otomatis",
  "Separated by spaces.": "Dipisahkan spasi.",
  "Sentence audio padding": "Bantalan audio kalimat",
  "Seconds added before and after the subtitle line.":
    "Detik yang ditambahkan sebelum dan sesudah baris subtitel.",
  "Animated clip format": "Format klip animasi",
  "For fields set to the animated clip. AVIF is smallest; WebP and GIF play in older Anki versions. Falls back to WebP, then GIF, if an encoder is missing.":
    "Untuk bidang yang diatur ke klip animasi. AVIF paling kecil; WebP dan GIF bisa diputar di versi Anki lama. Beralih ke WebP, lalu GIF, jika encoder tidak ada.",
  "Animated clip size": "Ukuran klip animasi",
  "Width in pixels and frames per second. Clips stop after 12 seconds.":
    "Lebar dalam piksel dan bingkai per detik. Klip berhenti setelah 12 detik.",
  "Allow duplicate cards": "Izinkan kartu duplikat",
  "When off, words already in the deck are refused.":
    "Jika mati, kata yang sudah ada di dek ditolak.",
  "Immersion": "Imersi",
  "Cards straight from the player, without looking a word up: from the subtitle on screen, or from a stretch you record with two presses of the same key (works without subtitles). Set the keys in Settings → Hotkeys → Immersion. mpv only.":
    "Kartu langsung dari pemutar, tanpa mencari kata: dari subtitel di layar, atau dari potongan yang Anda rekam dengan dua kali menekan tombol yang sama (berfungsi tanpa subtitel). Atur tombolnya di Pengaturan → Pintasan → Imersi. Hanya mpv.",
  "Sentence cards": "Kartu kalimat",
  "Pick a deck and note type above": "Pilih dek dan jenis catatan di atas",
  "Map a field to Sentence audio above": "Petakan sebuah bidang ke Audio kalimat di atas",
  "Audio cards": "Kartu audio",
  "Audio card deck": "Dek kartu audio",
  "Audio card note type": "Jenis catatan kartu audio",
  "Audio field": "Bidang audio",
  "Gets the audio of the line or of the recording.": "Menerima audio baris atau rekaman.",
  "Pick a note type first": "Pilih jenis catatan dulu",
  "Sentence field (optional)": "Bidang kalimat (opsional)",
  "Gets the subtitle text, when there is one.": "Menerima teks subtitel, jika ada.",
  "(empty)": "(kosong)",
  "Update last card window": "Rentang Perbarui kartu terakhir",
  "Update last card only touches a card added this many minutes ago or less.":
    "Perbarui kartu terakhir hanya mengubah kartu yang ditambahkan paling lama sekian menit lalu.",
  "Longest recording": "Rekaman terpanjang",
  "A recording longer than this is discarded. Animated clips still stop after 12 seconds.":
    "Rekaman yang lebih panjang dari ini dibuang. Klip animasi tetap berhenti setelah 12 detik.",
  "Subtitle dictionary lookups, word audio and Anki mining run in the Harbor desktop app.":
    "Pencarian kamus subtitel, audio kata, dan penambangan Anki berjalan di aplikasi desktop Harbor.",
  "Download the desktop app to look up words while you watch.":
    "Unduh aplikasi desktop untuk mencari kata sambil menonton.",
  "Long seek": "Lompatan panjang",
  "The jump of the Long seek back and Long seek forward shortcuts.":
    "Jarak lompatan pintasan Lompat mundur panjang dan Lompat maju panjang.",
  "Slow speed": "Kecepatan lambat",
  "The speed the Toggle slow speed shortcut switches to from normal speed.":
    "Kecepatan tujuan pintasan Alihkan kecepatan lambat dari kecepatan normal.",
  "Word": "Kata",
  "Word with furigana": "Kata dengan furigana",
  "Definitions (all)": "Definisi (semua)",
  "Definition (first dictionary)": "Definisi (kamus pertama)",
  "Sentence": "Kalimat",
  "Sentence (word in bold)": "Kalimat (kata ditebalkan)",
  "Sentence (word as cloze)": "Kalimat (kata sebagai cloze)",
  "Sentence audio": "Audio kalimat",
  "Word audio (local)": "Audio kata (lokal)",
  "Animated clip of the line (AVIF/WebP/GIF)": "Klip animasi baris (AVIF/WebP/GIF)",
  "Frequency": "Frekuensi",
  "Pitch accent": "Aksen nada",
  "Title / episode": "Judul / episode",
  "AI explanation": "Penjelasan AI",
  "Text selected in the popup (else first definition)":
    "Teks yang dipilih di popup (jika tidak, definisi pertama)",
  "Not a valid JSON object.": "Bukan objek JSON yang valid.",
  "Toggle subtitles on/off": "Aktifkan/matikan subtitel",
  "Hide every subtitle (primary and secondary), or bring the last primary track back.":
    "Sembunyikan semua subtitel (utama dan sekunder), atau kembalikan trek utama terakhir.",
  "Next subtitle line": "Baris subtitel berikutnya",
  "Jump to the start of the next subtitle line.": "Lompat ke awal baris subtitel berikutnya.",
  "Previous subtitle line": "Baris subtitel sebelumnya",
  "Jump to the start of the previous subtitle line (the current one if it just started).":
    "Lompat ke awal baris subtitel sebelumnya (baris saat ini jika baru dimulai).",
  "Toggle slow speed": "Alihkan kecepatan lambat",
  "Switch between normal speed and the slow speed set under Behavior (0.5x by default).":
    "Beralih antara kecepatan normal dan kecepatan lambat yang diatur di Perilaku (bawaan 0,5x).",
  "Anki: card from the subtitle": "Anki: kartu dari subtitel",
  "Anki: update last card": "Anki: perbarui kartu terakhir",
  "Anki: audio card": "Anki: kartu audio",
  "Add an audio-only card from the line on screen, using the audio card deck. mpv only.":
    "Menambahkan kartu khusus audio dari baris di layar, memakai dek kartu audio. Hanya mpv.",
  "Record → new card": "Rekam → kartu baru",
  "Record → update last card": "Rekam → perbarui kartu terakhir",
  "Record → audio card": "Rekam → kartu audio",
  "Press once to start recording, again to stop and add an audio card with that stretch. Works without subtitles. mpv only.":
    "Tekan sekali untuk mulai merekam, lalu lagi untuk berhenti dan menambahkan kartu audio dengan potongan itu. Berfungsi tanpa subtitel. Hanya mpv.",
  "Long seek back": "Lompat mundur panjang",
  "Jump back by the Long seek step set under Behavior (30 seconds by default).":
    "Mundur sejauh lompatan panjang yang diatur di Perilaku (bawaan 30 detik).",
  "Long seek forward": "Lompat maju panjang",
  "Jump forward by the Long seek step set under Behavior (30 seconds by default).":
    "Maju sejauh lompatan panjang yang diatur di Perilaku (bawaan 30 detik).",
  "Greek": "Yunani",
  "Latin": "Latin",
  "Replay current subtitle": "Ulangi subtitel saat ini",
  "Go back to the start of the line on screen and play it again, or of the last line shown when there is none.":
    "Kembali ke awal baris di layar dan memutarnya lagi, atau baris terakhir yang tampil jika tidak ada.",
  "Card from the subtitle, Update last card and the Record → card keys use the deck, note type and fields of the Anki section above. With a word selected in the subtitles (highlighted while picking a word, or in an open popup) every mapped field is filled, word and definitions included; without one only the sentence, sentence audio, screenshot or clip and title fields are.":
    "Pintasan Kartu dari subtitel, Perbarui kartu terakhir, dan Rekam → kartu memakai dek, jenis catatan, dan bidang dari bagian Anki di atas. Jika ada kata yang dipilih di subtitel (disorot saat memilih kata, atau di popup yang terbuka), semua bidang yang dipetakan diisi, termasuk kata dan definisinya; jika tidak, hanya kalimat, audio kalimat, tangkapan layar atau klip, dan judul.",
  "Add a card from the line on screen with its sentence, audio and picture, using the deck and fields under Dictionary & Anki. With a word selected in the subtitles, the word and its definitions go on the card too. mpv only.":
    "Menambahkan kartu dari baris di layar dengan kalimat, audio, dan gambarnya, memakai dek dan bidang di Kamus & Anki. Jika ada kata yang dipilih di subtitel, kata dan definisinya juga masuk ke kartu. Hanya mpv.",
  "Put the line on screen (sentence, audio, picture) into the newest card of the deck, if it was added in the last few minutes. With a word selected, the word and its definitions too. mpv only.":
    "Memasukkan baris di layar (kalimat, audio, gambar) ke kartu terbaru di dek, jika ditambahkan dalam beberapa menit terakhir. Jika ada kata yang dipilih, kata dan definisinya juga. Hanya mpv.",
  "Press once to start recording, again to stop and add a card with that stretch. Works without subtitles. With a word selected when you stop, the word and its definitions go on the card too. mpv only.":
    "Tekan sekali untuk mulai merekam, lalu lagi untuk berhenti dan menambahkan kartu dengan potongan itu. Berfungsi tanpa subtitel. Jika ada kata yang dipilih saat berhenti, kata dan definisinya juga masuk ke kartu. Hanya mpv.",
  "Press once to start recording, again to stop and put that stretch into the newest card. Works without subtitles. With a word selected when you stop, the word and its definitions too. mpv only.":
    "Tekan sekali untuk mulai merekam, lalu lagi untuk berhenti dan memasukkan potongan itu ke kartu terbaru. Berfungsi tanpa subtitel. Jika ada kata yang dipilih saat berhenti, kata dan definisinya juga. Hanya mpv.",
  "Added {word} to {deck}": "{word} ditambahkan ke {deck}",
  "Updated card in {deck} with {word}": "Kartu di {deck} diperbarui dengan {word}",
};
