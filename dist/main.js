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
audio.addEventListener('ended', () => {
    currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
    loadMusic(currentMusicIndex);
});
const progressContainer = document.querySelector('.card__progress-container');
progressContainer.addEventListener('click', (e) => {
    // Largura total da barra
    const width = progressContainer.clientWidth;
    // Posição do clique dentro da barra
    const clickX = e.offsetX;
    // Garante que a duração do áudio esteja definida
    if (!audio.duration)
        return;
    // Calcula o tempo correspondente ao clique e atualiza o áudio
    audio.currentTime = (clickX / width) * audio.duration;
});
export {};
//# sourceMappingURL=main.js.map