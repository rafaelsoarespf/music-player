const audio = document.getElementById('card__audio') as HTMLAudioElement;
const btnPlay = document.querySelector('.card__btn-play') as HTMLButtonElement;
const btnPrev = document.querySelector('.card__btn-prev') as HTMLButtonElement;
const btnNext = document.querySelector('.card__btn-next') as HTMLButtonElement;
const progress = document.querySelector('.card__progress') as HTMLDivElement;

// button play
btnPlay.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    btnPlay.textContent = '⏸';
  } else {
    audio.pause();
    btnPlay.textContent = '▶';
  }
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return; 
  const percent: number = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
});