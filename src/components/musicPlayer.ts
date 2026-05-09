import type { Music } from '../types/music'

// ============================================================
// init =======================================================
export async function initMusicPlayer() {
  
  loadPlaylistData("/src/assets/data/music.json");
  loadMusic(currentMusicIndex);

  //btn
  btnPlay.addEventListener('click', btnPlayTogglePlayPause);
  btnPrev.addEventListener('click', btnPrevMusicPrev);
  btnNext.addEventListener('click', btnNextMusicNext);
  btnRepeat.addEventListener('click', () => btnRepeatMusicRepeat());

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
const progress = document.querySelector('.card__progress') as HTMLDivElement;
const progressContainer = document.querySelector('.card__progress-container') as HTMLDivElement;
const image = document.querySelector('#card__image') as HTMLImageElement;
const currentTimeEl = document.querySelector('#current-time') as HTMLSpanElement;
const durationEl = document.querySelector('#duration') as HTMLSpanElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;

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

function playMusic(){
  audio.play();
  btnPlay.textContent =  '⏸';
  if (!card) return;
  image.classList.add('animation__card__image');
}

function pauseMusic(){
  audio.pause()
  btnPlay.textContent =  '▶';
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
  currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
  loadMusic(currentMusicIndex);
}

// ===========================================================
// btnRepeatMusicRepeat ======================================
let repeatMusic = false;

function btnRepeatMusicRepeat(){
  repeatMusic = !repeatMusic;
  btnRepeat.textContent = repeatMusic ? '🔂' : '🔁';
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