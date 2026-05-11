import type { Music } from '../types/music';
export declare function loadPlaylistData(url: string): Promise<void>;
export declare function getMusic(index: number): Music | null;
export declare function getCurrentMusic(): Music | null;
export declare function setCurrentIndex(index: number): void;
export declare function nextMusic(): number;
export declare function prevMusic(): number;
export declare function toggleShuffle(): boolean;
export declare function isShuffleEnabled(): boolean;
export declare function toggleRepeat(): boolean;
export declare function isRepeatEnabled(): boolean;
//# sourceMappingURL=musicService.d.ts.map