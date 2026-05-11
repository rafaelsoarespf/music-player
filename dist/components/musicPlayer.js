import * as MusicService from '../services/musicService.js';
// ============================================================
// init =======================================================
export async function initMusicPlayer() {
    await MusicService.loadPlaylistData('/src/assets/data/music.json');
    loadMusic(MusicService.getCurrentMusic());
    audio.pause();
    //sound wave
    initSoundWave(audioEl, waveContainer);
    //btn
    btnPlay.addEventListener('click', btnPlayTogglePlayPause);
    btnPrev.addEventListener('click', btnPrevMusicPrev);
    btnNext.addEventListener('click', btnNextMusicNext);
    btnRepeat.addEventListener('click', btnRepeatMusicRepeat);
    btnShuffle.addEventListener('click', toggleShuffle);
    //play and pause
    audio.addEventListener('play', () => updatePlayPauseButtonState(true));
    audio.addEventListener('pause', () => updatePlayPauseButtonState(false));
    // Volume
    volumeSlider.addEventListener('input', volumeSliderUpdate);
    //Progress Bar
    audio.addEventListener('timeupdate', updateProgressBar);
    progressContainer.addEventListener('click', progressBarSeek);
    //Time
    audio.addEventListener('loadedmetadata', updateTimeDisplay);
    audio.addEventListener('timeupdate', updateTimeDisplay);
    //Music End 
    audio.addEventListener('ended', musicEnd);
}
// ============================================================
// variables ==================================================
const card = document.querySelector('#card');
const musicTitle = document.querySelector('#card__title');
const author = document.querySelector('#card__author');
const audio = document.querySelector('#card__audio');
const btnPlay = document.querySelector('.card__btn-play');
const btnPrev = document.querySelector('.card__btn-prev');
const btnNext = document.querySelector('.card__btn-next');
const btnRepeat = document.querySelector('.card__btn-repeat');
const btnShuffle = document.querySelector('.card__btn-shuffle');
const progress = document.querySelector('.card__progress');
const progressContainer = document.querySelector('.card__progress-container');
const image = document.querySelector('#card__image');
const currentTimeEl = document.querySelector('#current-time');
const durationEl = document.querySelector('#duration');
const volumeSlider = document.getElementById('volume');
const audioEl = document.getElementById('card__audio');
const waveContainer = document.getElementById('card__sound-wave');
// ===========================================================
// loadMusic =================================================
function loadMusic(music) {
    if (!music)
        return;
    audio.src = music.src;
    musicTitle.textContent = music.title;
    author.textContent = music.author;
    image.src = music.image;
    image.onload = () => backgroundColorImage();
    audio.play();
}
// ===========================================================
// play / pause ==============================================
function btnPlayTogglePlayPause() {
    audio.paused ? audio.play() : audio.pause();
}
//false -> pause and true -> play
function updatePlayPauseButtonState(isPlaying) {
    const icon = btnPlay.querySelector('i');
    if (!icon)
        return;
    icon.classList.toggle('fa-pause', isPlaying);
    icon.classList.toggle('fa-play', !isPlaying);
    image.classList.toggle('animation__card__image', isPlaying);
}
// ===========================================================
// function btnPrevMusicPrev() ===============================
function btnPrevMusicPrev() {
    MusicService.prevMusic();
    loadMusic(MusicService.getCurrentMusic());
}
// ===========================================================
// btnNextMusicNext ==========================================
function btnNextMusicNext() {
    MusicService.nextMusic();
    loadMusic(MusicService.getCurrentMusic());
}
// ===========================================================
// Shuffle ===================================================
function toggleShuffle() {
    const icon = btnShuffle.querySelector('i');
    if (!icon)
        return;
    icon.style.color = MusicService.toggleShuffle()
        ? 'var(--color-accent)' : '';
}
// ===========================================================
// btnRepeatMusicRepeat ======================================
function btnRepeatMusicRepeat() {
    const icon = btnRepeat.querySelector('i');
    if (!icon)
        return;
    icon.style.color = MusicService.toggleRepeat()
        ? 'var(--color-accent)' : '';
}
// ===========================================================
// volumeSliderUpdateVolume ==================================
function volumeSliderUpdate() {
    audio.volume = parseFloat(volumeSlider.value);
}
// ===========================================================
// musicEnd ============================================
function musicEnd() {
    if (MusicService.isRepeatEnabled()) {
        audio.currentTime = 0;
        audio.play();
        return;
    }
    MusicService.nextMusic();
    loadMusic(MusicService.getCurrentMusic());
}
// ===========================================================
// ProgressBar ===============================================
function updateProgressBar() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
}
function progressBarSeek(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
}
// ===========================================================
// Time - updateTimeDisplay ==================================
function updateTimeDisplay() {
    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds))
            return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
}
// ===========================================================
// Sound Wave ================================================
function initSoundWave(audioElement, container) {
    if (!audioElement || !container)
        return;
    const numBars = 30;
    const bars = [];
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'card__sound-wave-bar';
        container.appendChild(bar);
        bars.push(bar);
    }
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    // animation
    function animateWave() {
        requestAnimationFrame(animateWave);
        analyser.getByteFrequencyData(dataArray);
        bars.forEach((bar, i) => {
            const dataIndex = Math.floor(i * bufferLength / numBars);
            const value = dataArray[dataIndex];
            if (!value)
                return;
            const minHeight = 3;
            const maxHeight = 90;
            const barHeight = Math.max(minHeight, Math.min(value / 3, maxHeight));
            bar.style.height = `${barHeight}px`;
        });
    }
    animateWave();
}
// ===========================================================
// Background ================================================
function backgroundColorImage() {
    const dominantColor = getDominantColorImage(image);
    document.body.style.background = `radial-gradient(circle at center,rgba(${dominantColor.match(/\d+/g).join(',')}, 0.15) 30%,rgba(18, 18, 18, 0.25) 70%,#121212 100%)`;
}
function getDominantColorImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return '#000';
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) {
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
//# sourceMappingURL=musicPlayer.js.map