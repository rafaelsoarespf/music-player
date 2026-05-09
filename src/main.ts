const musicTitle = document.querySelector('#card__title') as HTMLHeadingElement;
const author = document.querySelector('#card__author') as HTMLParagraphElement;
const audio = document.getElementById('card__audio') as HTMLAudioElement;
const btnPlay = document.querySelector('.card__btn-play') as HTMLButtonElement;
const btnPrev = document.querySelector('.card__btn-prev') as HTMLButtonElement;
const btnNext = document.querySelector('.card__btn-next') as HTMLButtonElement;
const progress = document.querySelector('.card__progress') as HTMLDivElement;

interface Music {
  title: string;
  author: string;
  image: string;
  src: string;
}

const playlist: Music[] = [
  { title: "Ambiente Elétrica", author:"Alex Morgan", image:"src/assets/image/image.png",  src: "src/assets/audio/music.mp3" },
  { title: "Upbeat Exciting Background Music Free", author:"JoyInSound", image:"src/assets/image/image2.png", src: "src/assets/audio/music2.mp3" },
  { title: "Lofi Vlog Vlogs Music", author:"Tunetank", image:"src/assets//image/image3.png", src:"src/assets/audio/music3.mp3" }
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
  musicTitle.textContent = music.title;
  author.textContent = music.author;
  const cardImage = document.getElementById('card__image') as HTMLImageElement;
  cardImage.src = music.image;
  audio.play();
  btnPlay.textContent = '⏸';
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

//button repeat
const btnRepeat = document.querySelector('.card__btn-repeat') as HTMLButtonElement;
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
  loadMusic(currentMusicIndex);
  updateRepeatButton();
}

function updateRepeatButton() {
  if (repeatOne) {
    btnRepeat.textContent = '🔂'; // repeat-one ativo
    btnRepeat.style.color = 'var(--color-accent)';
  } else {
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
  } else {
    playNextMusic();
  }
});


loadMusic(currentMusicIndex);