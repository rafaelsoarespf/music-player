const musicTitle = document.querySelector('#card__title');
const audio = document.getElementById('card__audio');
const btnPlay = document.querySelector('.card__btn-play');
const btnPrev = document.querySelector('.card__btn-prev');
const btnNext = document.querySelector('.card__btn-next');
const progress = document.querySelector('.card__progress');
const playlist = [
    { title: "Musica 1", src: "src/assets/audio/music.mp3" },
    { title: "Musica 2", src: "src/assets/audio/music2.mp3" },
    { title: "Musica 3", src: "src/assets/audio/music3.mp3" }
];
let currentMusicIndex = 0;
// button play
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
audio.addEventListener('timeupdate', () => {
    if (!audio.duration)
        return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
});
function loadMusic(index) {
    const music = playlist[index];
    if (!music)
        return;
    audio.src = music.src;
    audio.play();
    btnPlay.textContent = '⏸';
    musicTitle.textContent = music.title;
}
// Button Prev
btnPrev.addEventListener('click', () => {
    currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
    loadMusic(currentMusicIndex);
});
// Button Next
btnNext.addEventListener('click', () => {
    currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
    loadMusic(currentMusicIndex);
});
// progress bar click ===========================
const progressContainer = document.querySelector('.card__progress-container');
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    if (!audio.duration)
        return;
    audio.currentTime = (clickX / width) * audio.duration;
});
// card time ===========================
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
    }
});
// card volume
const volumeSlider = document.getElementById('volume');
audio.volume = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
});
audio.addEventListener('volumechange', () => {
    volumeSlider.value = audio.volume.toString();
});
//button repeat
const btnRepeat = document.querySelector('.card__btn-repeat');
let repeatOne = false;
audio.addEventListener('ended', () => {
    if (repeatOne) {
        audio.currentTime = 0;
        audio.play();
        return; // Sai da função
    }
    playNextMusic();
});
function playNextMusic() {
    currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
    const nextMusic = playlist[currentMusicIndex];
    if (!nextMusic)
        return;
    audio.src = nextMusic.src;
    musicTitle.textContent = nextMusic.title;
    audio.play();
    btnPlay.textContent = '⏸';
    updateRepeatButton();
}
function updateRepeatButton() {
    if (repeatOne) {
        btnRepeat.textContent = '🔂'; // repeat-one ativo
        btnRepeat.style.color = 'var(--color-accent)';
    }
    else {
        btnRepeat.textContent = '🔁'; // repeat normal
        btnRepeat.style.color = '#fff';
    }
}
btnRepeat.addEventListener('click', () => {
    repeatOne = !repeatOne;
    updateRepeatButton(); // atualiza ícone e cor
});
audio.addEventListener('ended', () => {
    if (repeatOne) {
        audio.currentTime = 0;
        audio.play();
    }
    else {
        playNextMusic();
    }
});
export {};
//# sourceMappingURL=main.js.map