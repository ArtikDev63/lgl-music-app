// store/useQueueManager.ts
import { create } from 'zustand';
import TrackPlayer, { MediaItem } from '@rntp/player'; // o react-native-track-player

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface QueueManagerState {
    isShuffle: boolean;
    activeQueueId: string | null;
    originalTracks: MediaItem[];
    loadQueue: (tracks: MediaItem[], startIndex: number, queueId: string) => Promise<void>;
    toggleShuffle: () => Promise<void>;
    addToNextInQueue: (track: MediaItem) => Promise<void>;
}

export const useQueueManager = create<QueueManagerState>((set, get) => ({
    isShuffle: false,
    activeQueueId: null,
    originalTracks: [],

    loadQueue: async (tracks: MediaItem[], startIndex: number, queueId: string) => {
        if (!tracks.length) return;

        const { isShuffle } = get();
        const selectedTrack = tracks[isShuffle ? Math.random() * tracks.length : startIndex] ?? tracks[0];

        set({ 
            originalTracks: tracks, 
            activeQueueId: queueId 
        });

        // 1. Limpiamos la cola nativa
        await TrackPlayer.clear();

        if (isShuffle) {
            // SHUFFLE: seleccionada primero + resto barajado
            const remainingTracks = tracks.filter(t => t.url !== selectedTrack.url);
            const shuffledRemaining = shuffleArray(remainingTracks);

            await TrackPlayer.setMediaItem(selectedTrack);
            if (shuffledRemaining.length > 0) {
                await TrackPlayer.addMediaItems(shuffledRemaining);
            }
        } else {
            // MODO NORMAL (Circular estilo Spotify):
            // Seleccionada -> canciones posteriores -> canciones anteriores
            const beforeTracks = tracks.slice(0, startIndex);
            const afterTracks = tracks.slice(startIndex + 1);

            await TrackPlayer.setMediaItem(selectedTrack);
            if (afterTracks.length > 0) {
                await TrackPlayer.addMediaItems(afterTracks);
            }
            if (beforeTracks.length > 0) {
                await TrackPlayer.addMediaItems(beforeTracks);
            }
        }

        await TrackPlayer.play();
    },

    toggleShuffle: async () => {
        const { isShuffle, originalTracks } = get();
        const nextShuffleState = !isShuffle;
        set({ isShuffle: nextShuffleState });

        const queue = await TrackPlayer.getQueue();
        const currentIndex = await TrackPlayer.getActiveMediaItemIndex();

        if (currentIndex === undefined || currentIndex === null || !queue[currentIndex]) {
            return;
        }

        const activeTrack = queue[currentIndex];

        // Limpiar todas las pistas posteriores en el rango [fromIndex, toIndex)
        const fromIndex = currentIndex + 1;
        const toIndex = queue.length;

        if (fromIndex < toIndex) {
            await TrackPlayer.removeMediaItems(fromIndex, toIndex);
        }

        if (nextShuffleState) {
            const otherTracks = originalTracks.filter(t => t.url !== activeTrack.url);
            const shuffled = shuffleArray(otherTracks);
            if (shuffled.length > 0) {
                await TrackPlayer.addMediaItems(shuffled);
            }
        } else {
            const originalIndex = originalTracks.findIndex(t => t.url === activeTrack.url);
            if (originalIndex !== -1) {
                const afterTracks = originalTracks.slice(originalIndex + 1);
                const beforeTracks = originalTracks.slice(0, originalIndex);
                const restoredTracks = [...afterTracks, ...beforeTracks];

                if (restoredTracks.length > 0) {
                    await TrackPlayer.addMediaItems(restoredTracks);
                }
            }
        }
    },

    addToNextInQueue: async (track: MediaItem) => {
        const currentIndex = await TrackPlayer.getActiveMediaItemIndex();

        if (currentIndex !== undefined && currentIndex !== null) {
            // Inserta en currentIndex + 1
            await TrackPlayer.insertMediaItems(currentIndex + 1, [track]);
        } else {
            await TrackPlayer.setMediaItem(track);
            await TrackPlayer.play();
        }
    },
}));