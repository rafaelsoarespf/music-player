// ===========================================================
// variables =================================================
let playlist = [];
let currentMusicIndex = 0;
let shuffle = false;
let repeat = false;
// ===========================================================
// loadPlaylistData ==========================================
export async function loadPlaylistData(url) {
    const res = await fetch(url);
    playlist = await res.json();
}
// ===========================================================
// getPlaylist ===============================================
export function getPlaylist() {
    return playlist;
}
// ===========================================================
// CurrentMusic ==============================================
export function getCurrentMusic() {
    return playlist[currentMusicIndex] || null;
}
// ===========================================================
// setCurrentIndex ===========================================
export function getCurrentIndex() {
    return currentMusicIndex;
}
export function setCurrentIndex(index) {
    if (index < 0 || index >= playlist.length)
        return;
    currentMusicIndex = index;
}
// ===========================================================
// nextMusic =================================================
export function nextMusic() {
    if (!playlist.length)
        return -1;
    if (shuffle) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentMusicIndex && playlist.length > 1);
        currentMusicIndex = nextIndex;
    }
    else {
        currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
    }
    return currentMusicIndex;
}
// ===========================================================
// prevMusic =================================================
export function prevMusic() {
    if (!playlist.length)
        return -1;
    currentMusicIndex = (currentMusicIndex - 1 + playlist.length) % playlist.length;
    return currentMusicIndex;
}
// ===========================================================
// Shuffle ===================================================
export function toggleShuffle() {
    shuffle = !shuffle;
    return shuffle;
}
export function isShuffleEnabled() {
    return shuffle;
}
// ===========================================================
// Repeat ====================================================
export function toggleRepeat() {
    repeat = !repeat;
    return repeat;
}
export function isRepeatEnabled() {
    return repeat;
}
//# sourceMappingURL=musicService.js.map