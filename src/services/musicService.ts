import type { Music } from '../types/music';

// ===========================================================
// variables =================================================
let playlist: Music[] = [];
let currentMusicIndex = 0;
let shuffle = false;
let repeat = false;

// ===========================================================
// loadPlaylistData ==========================================
export async function loadPlaylistData(url: string) {
  const res = await fetch(url);
  playlist = await res.json() as Music[];
}

// ===========================================================
// getPlaylist ===============================================
export function getPlaylist(): Music[] {
  return playlist;
}

// ===========================================================
// CurrentMusic ==============================================
export function getCurrentMusic(): Music | null {
  return playlist[currentMusicIndex] || null;
}

// ===========================================================
// setCurrentIndex ===========================================
export function getCurrentIndex() {
  return currentMusicIndex;
}

export function setCurrentIndex(index: number) {
  if (index < 0 || index >= playlist.length) return;
  currentMusicIndex = index;
}

// ===========================================================
// nextMusic =================================================
export function nextMusic(): number {
  if (!playlist.length) return -1;

  if (shuffle) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } while (nextIndex === currentMusicIndex && playlist.length > 1);
    currentMusicIndex = nextIndex;
  } else {
    currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
  }
  return currentMusicIndex;
}

// ===========================================================
// prevMusic =================================================
export function prevMusic(): number {
  if (!playlist.length) return -1;
  currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
  return currentMusicIndex;
}

// ===========================================================
// Shuffle ===================================================
export function toggleShuffle(): boolean {
  shuffle = !shuffle;
  return shuffle;
}

export function isShuffleEnabled(): boolean {
  return shuffle;
}

// ===========================================================
// Repeat ====================================================
export function toggleRepeat(): boolean {
  repeat = !repeat;
  return repeat;
}

export function isRepeatEnabled(): boolean {
  return repeat;
}




