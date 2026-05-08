const audio = document.getElementById('card__audio');
const btnPlay = document.querySelector('.card__btn-play');
const btnPrev = document.querySelector('.card__btn-prev');
const btnNext = document.querySelector('.card__btn-next');
const progress = document.querySelector('.card__progress');
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
export {};
//# sourceMappingURL=main.js.map