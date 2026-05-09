const musicTitle = document.querySelector('#card__title');
const author = document.querySelector('#card__author');
const audio = document.getElementById('card__audio');
const btnPlay = document.querySelector('.card__btn-play');
const btnPrev = document.querySelector('.card__btn-prev');
const btnNext = document.querySelector('.card__btn-next');
const progress = document.querySelector('.card__progress');
const cardImage = document.getElementById('card__image'); // ✅ declaração da imagem
const playlist = [
    { title: "Ambiente Elétrica", author: "Alex Morgan", image: "src/assets/image/image.png", src: "src/assets/audio/music.mp3" },
    { title: "Upbeat Exciting Background Music Free", author: "JoyInSound", image: "src/assets/image/image2.png", src: "src/assets/audio/music2.mp3" },
    { title: "Lofi Vlog Vlogs Music", author: "Tunetank", image: "src/assets/image/image3.png", src: "src/assets/audio/music3.mp3" }
];
let currentMusicIndex = 0;
// ---------- FUNÇÕES ----------
function loadMusic(index) {
    const music = playlist[index];
    if (!music)
        return;
    audio.src = music.src;
    musicTitle.textContent = music.title;
    author.textContent = music.author;
    cardImage.src = music.image;
    audio.play();
    btnPlay.textContent = '⏸';
    // Atualiza background quando a imagem terminar de carregar
    cardImage.onload = () => updateCardBackground();
}
function getDominantColor(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return '#000';
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) { // passo 4 pixels
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
    return `rgb(${r},${g},${b})`;
}
function updateCardBackground() {
    const dominantColor = getDominantColor(cardImage);
    document.body.style.background = `
    radial-gradient(
      circle at center,
      rgba(${dominantColor.match(/\d+/g).join(',')}, 0.15) 30%,  /* centro ainda mais suave */
      rgba(18, 18, 18, 0.25) 70%,                                   /* transição sutil */
      #121212 100%                                                  /* bordas escuras */
    )
  `;
}
// ---------- CONTROLES ----------
btnPlay.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btnPlay.textContent = '⏸';
    }
    else {
        audio.pause();
        btnPlay.textContent = '▶';
    }
});
btnPrev.addEventListener('click', () => {
    currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
    loadMusic(currentMusicIndex);
});
btnNext.addEventListener('click', () => {
    currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
    loadMusic(currentMusicIndex);
});
// progress bar
const progressContainer = document.querySelector('.card__progress-container');
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    audio.currentTime = (e.offsetX / width) * audio.duration;
});
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
});
// tempo
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
audio.addEventListener('loadedmetadata', () => durationEl.textContent = formatTime(audio.duration));
audio.addEventListener('timeupdate', () => currentTimeEl.textContent = formatTime(audio.currentTime));
// volume
const volumeSlider = document.getElementById('volume');
audio.volume = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', () => audio.volume = parseFloat(volumeSlider.value));
audio.addEventListener('volumechange', () => volumeSlider.value = audio.volume.toString());
// repeat
const btnRepeat = document.querySelector('.card__btn-repeat');
let repeatOne = false;
btnRepeat.addEventListener('click', () => {
    repeatOne = !repeatOne;
    btnRepeat.textContent = repeatOne ? '🔂' : '🔁';
    btnRepeat.style.color = repeatOne ? 'var(--color-accent)' : '#fff';
});
audio.addEventListener('ended', () => {
    if (repeatOne) {
        audio.currentTime = 0;
        audio.play();
    }
    else {
        currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
        loadMusic(currentMusicIndex);
    }
});
// inicializa
loadMusic(currentMusicIndex);
export {};
//# sourceMappingURL=main.js.map