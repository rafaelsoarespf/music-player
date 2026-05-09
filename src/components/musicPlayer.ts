import type { Music } from '../types/music'

// ============================================================
// init =======================================================
export async function initMusicPlayer() {
  await loadPlaylistData("/src/assets/data/music.json");
  loadMusic(currentMusicIndex);
  pauseMusic();

  //sound wave
  initSoundWave(audioEl, waveContainer);

  //btn
  btnPlay.addEventListener('click', btnPlayTogglePlayPause);
  btnPrev.addEventListener('click', btnPrevMusicPrev);
  btnNext.addEventListener('click', btnNextMusicNext);
  btnRepeat.addEventListener('click', btnRepeatMusicRepeat);
  btnShuffle.addEventListener('click', toggleShuffle);

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
const musicTitle = document.querySelector('#card__title') as HTMLHeadingElement;
const author = document.querySelector('#card__author') as HTMLParagraphElement;
const audio = document.querySelector('#card__audio') as HTMLAudioElement;
const btnPlay = document.querySelector('.card__btn-play') as HTMLButtonElement;
const btnPrev = document.querySelector('.card__btn-prev') as HTMLButtonElement;
const btnNext = document.querySelector('.card__btn-next') as HTMLButtonElement;
const btnRepeat = document.querySelector('.card__btn-repeat') as HTMLButtonElement;
const btnShuffle = document.querySelector('.card__btn-shuffle') as HTMLButtonElement;
const progress = document.querySelector('.card__progress') as HTMLDivElement;
const progressContainer = document.querySelector('.card__progress-container') as HTMLDivElement;
const image = document.querySelector('#card__image') as HTMLImageElement;
const currentTimeEl = document.querySelector('#current-time') as HTMLSpanElement;
const durationEl = document.querySelector('#duration') as HTMLSpanElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const audioEl = document.getElementById('card__audio') as HTMLAudioElement;
const waveContainer = document.getElementById('card__sound-wave') as HTMLDivElement;

let playlist: Music[] = [];
let currentMusicIndex = 0;

// ===========================================================
// loadPlaylistData ==========================================
async function loadPlaylistData(url: string) {
  const res = await fetch(url);
  playlist = await res.json() as Music[];
}

// ===========================================================
// loadMusic =================================================
function loadMusic(index: number) {
  const music = playlist[index];
  if (!music) return;
  audio.src = music.src;
  musicTitle.textContent = music.title;
  author.textContent = music.author;
  image.src = music.image;
  image.onload = () => backgroundColorImage();
  playMusic()
}

// ===========================================================
// btnPlayTogglePlayPause ====================================
function btnPlayTogglePlayPause() {
  audio.paused ? playMusic() : pauseMusic();
}

function playMusic() {
  audio.play();
  btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
  if (!card) return;
  image.classList.add('animation__card__image');
}

function pauseMusic() {
  audio.pause();
  btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
  if (!card) return;
  image.classList.remove('animation__card__image');
}

// ===========================================================
// function btnPrevMusicPrev() ===============================
function btnPrevMusicPrev() {
  currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
  loadMusic(currentMusicIndex);
}

// ===========================================================
// btnNextMusicNext ==========================================
function btnNextMusicNext() {
  if (shuffleMusic) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } while (nextIndex === currentMusicIndex && playlist.length > 1);
    currentMusicIndex = nextIndex;
  } else {
    currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
  }
  loadMusic(currentMusicIndex);
}

// ===========================================================
// Shuffle ===================================================
let shuffleMusic = false;

function toggleShuffle() {
  shuffleMusic = !shuffleMusic;

  const icon = btnShuffle.querySelector('i');
  if (!icon) return;

  icon.style.color = shuffleMusic ? 'var(--color-accent)' : '';
}

// ===========================================================
// btnRepeatMusicRepeat ======================================
let repeatMusic = false;

function btnRepeatMusicRepeat() {
  repeatMusic = !repeatMusic;

  const icon = btnRepeat.querySelector('i');
  if (!icon) return;

  icon.style.color = repeatMusic ? 'var(--color-accent)' : '';
}

// ===========================================================
// volumeSliderUpdateVolume ==================================
function volumeSliderUpdate() {
  audio.volume = parseFloat(volumeSlider.value);
}

// ===========================================================
// musicEnd ============================================
function musicEnd() {
  if (repeatMusic) {
    audio.currentTime = 0;
    playMusic();
  } else {
    btnNextMusicNext();
  }
}

// ===========================================================
// ProgressBar ===============================================
function updateProgressBar() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
}

function progressBarSeek(e: MouseEvent) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

// ===========================================================
// Time - updateTimeDisplay ==================================
function updateTimeDisplay() {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  durationEl.textContent = formatTime(audio.duration);
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

// ===========================================================
// Sound Wave ================================================
function initSoundWave(audioElement: HTMLAudioElement, container: HTMLDivElement) {
  if (!audioElement || !container) return;

  const numBars = 30;
  const bars: HTMLDivElement[] = [];

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
      const value = dataArray[dataIndex]; if (!value) return;
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
  document.body.style.background = `radial-gradient(circle at center,rgba(${dominantColor.match(/\d+/g)!.join(',')}, 0.15) 30%,rgba(18, 18, 18, 0.25) 70%,#121212 100%)`;
}

function getDominantColorImage(img: HTMLImageElement): string {
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
    g += data[i + 1]!;
    b += data[i + 2]!;
    count++;
  }

  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  return `rgb(${r},${g},${b})`;
}
