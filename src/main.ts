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


audio.addEventListener('ended', () => {
  currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
  loadMusic(currentMusicIndex);
});


// progress bar click ===========================

const progressContainer = document.querySelector('.card__progress-container') as HTMLDivElement;
progressContainer.addEventListener('click', (e: MouseEvent) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  if (!audio.duration) return;
  audio.currentTime = (clickX / width) * audio.duration;
});


// card time ===========================
const currentTimeEl = document.getElementById('current-time') as HTMLSpanElement;
const durationEl = document.getElementById('duration') as HTMLSpanElement;

function formatTime(seconds: number): string {
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
    const percent: number = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
  }
});


// card volume
const volumeSlider = document.getElementById('volume') as HTMLInputElement;

audio.volume = parseFloat(volumeSlider.value);

volumeSlider.addEventListener('input', () => {
  audio.volume = parseFloat(volumeSlider.value);
});

audio.addEventListener('volumechange', () => {
  volumeSlider.value = audio.volume.toString();
});