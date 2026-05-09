const musicTitle = document.querySelector('#card__title') as HTMLHeadingElement;
const author = document.querySelector('#card__author') as HTMLParagraphElement;
const audio = document.getElementById('card__audio') as HTMLAudioElement;
const btnPlay = document.querySelector('.card__btn-play') as HTMLButtonElement;
const btnPrev = document.querySelector('.card__btn-prev') as HTMLButtonElement;
const btnNext = document.querySelector('.card__btn-next') as HTMLButtonElement;
const progress = document.querySelector('.card__progress') as HTMLDivElement;
const cardImage = document.getElementById('card__image') as HTMLImageElement;

interface Music {
  title: string;
  author: string;
  image: string;
  src: string;
}

const playlist: Music[] = [
  { title: "Ambiente Elétrica", author:"Alex Morgan", image:"src/assets/image/image.png",  src: "src/assets/audio/music.mp3" },
  { title: "Upbeat Exciting Background Music Free", author:"JoyInSound", image:"src/assets/image/image2.png", src: "src/assets/audio/music2.mp3" },
  { title: "Lofi Vlog Vlogs Music", author:"Tunetank", image:"src/assets/image/image3.png", src:"src/assets/audio/music3.mp3" }
];

let currentMusicIndex = 0;

function loadMusic(index: number) {
  const music = playlist[index];
  if (!music) return;

  audio.src = music.src;
  musicTitle.textContent = music.title;
  author.textContent = music.author;
  cardImage.src = music.image;

  audio.play();
  btnPlay.textContent = '⏸';
  cardImage.onload = () => updateCardBackground();
}

function getDominantColor(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#000';

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 16) {
    r += data[i]!;
    g += data[i+1]!;
    b += data[i+2]!;
    count++;
  }

  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  return `rgb(${r},${g},${b})`;
}

function updateCardBackground() {
  const dominantColor = getDominantColor(cardImage);
  document.body.style.background = `radial-gradient(circle at center,rgba(${dominantColor.match(/\d+/g)!.join(',')}, 0.15) 30%,rgba(18, 18, 18, 0.25) 70%,#121212 100%)`;
}

// 
btnPlay.addEventListener('click', () => {
  if (audio.paused) { audio.play(); btnPlay.textContent = '⏸'; }
  else { audio.pause(); btnPlay.textContent = '▶'; }
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
const progressContainer = document.querySelector('.card__progress-container') as HTMLDivElement;
progressContainer.addEventListener('click', (e: MouseEvent) => {
  const width = progressContainer.clientWidth;
  audio.currentTime = (e.offsetX / width) * audio.duration;
});

audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
});

// time
const currentTimeEl = document.getElementById('current-time') as HTMLSpanElement;
const durationEl = document.getElementById('duration') as HTMLSpanElement;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('loadedmetadata', () => durationEl.textContent = formatTime(audio.duration));
audio.addEventListener('timeupdate', () => currentTimeEl.textContent = formatTime(audio.currentTime));

// volume
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
audio.volume = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', () => audio.volume = parseFloat(volumeSlider.value));
audio.addEventListener('volumechange', () => volumeSlider.value = audio.volume.toString());

// repeat
const btnRepeat = document.querySelector('.card__btn-repeat') as HTMLButtonElement;
let repeatOne = false;

btnRepeat.addEventListener('click', () => {
  repeatOne = !repeatOne;
  btnRepeat.textContent = repeatOne ? '🔂' : '🔁';
  btnRepeat.style.color = repeatOne ? 'var(--color-accent)' : '#fff';
});

audio.addEventListener('ended', () => {
  if (repeatOne) { audio.currentTime = 0; audio.play(); }
  else { currentMusicIndex = (currentMusicIndex + 1) % playlist.length; loadMusic(currentMusicIndex); }
});

loadMusic(currentMusicIndex);