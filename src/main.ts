const musicTitle = document.querySelector('#card__title') as HTMLHeadingElement;
const audio = document.getElementById('card__audio') as HTMLAudioElement;
const btnPlay = document.querySelector('.card__btn-play') as HTMLButtonElement;
const btnPrev = document.querySelector('.card__btn-prev') as HTMLButtonElement;
const btnNext = document.querySelector('.card__btn-next') as HTMLButtonElement;
const progress = document.querySelector('.card__progress') as HTMLDivElement;


interface Music {
  title: string;
  src: string;
}

const playlist: Music[] = [
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


function loadMusic(index: number) {
  const music = playlist[index];
  if (!music) return;

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