// src/hooks/getLibraryData.tsx
import { useState, useEffect } from 'react';
import { MediaItem } from '@rntp/player';

export interface Album {
    title: string;
    anyo: number;
    image_uri: string;
}

const TRACKS_URL = 'https://objectstorage.eu-madrid-1.oraclecloud.com/n/axjusglp02os/b/jc-audio-bucket/o/data%2Fsongs_data.json';
const ALBUMS_URL = 'https://objectstorage.eu-madrid-1.oraclecloud.com/n/axjusglp02os/b/jc-audio-bucket/o/data%2Falbums_data.json';

let cachedTracks: MediaItem[] = [];
let cachedAlbums: Album[] = [];
let isTracksLoaded = false;
let isAlbumsLoaded = false;

// Oyentes para avisar a React de cambios
const trackListeners = new Set<(tracks: MediaItem[]) => void>();
const albumListeners = new Set<(albums: Album[]) => void>();

export async function getRemoteTracks(): Promise<MediaItem[]> {
    if (isTracksLoaded) return cachedTracks;

    try {
        const res = await fetch(TRACKS_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data: MediaItem[] = await res.json();
        
        cachedTracks = data;
        isTracksLoaded = true;

        // Notificar a todas las pantallas abiertas
        trackListeners.forEach(listener => listener(data));
        return data;
    } catch (err) {
        console.error('Error cargando canciones:', err);
        return [];
    }
}

export async function getRemoteAlbums(): Promise<Album[]> {
    if (isAlbumsLoaded) return cachedAlbums;

    try {
        const res = await fetch(ALBUMS_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data: Album[] = await res.json();

        cachedAlbums = data;
        isAlbumsLoaded = true;

        // Notificar a todas las pantallas abiertas
        albumListeners.forEach(listener => listener(data));
        return data;
    } catch (err) {
        console.error('Error cargando álbumes:', err);
        return [];
    }
}

// Hook Reactivo para Canciones
export function useTracks() {
    const [tracks, setTracks] = useState<MediaItem[]>(cachedTracks);
    const [loading, setLoading] = useState<boolean>(!isTracksLoaded);

    useEffect(() => {
        if (isTracksLoaded) {
            setTracks(cachedTracks);
            setLoading(false);
            return;
        }

        const listener = (newTracks: MediaItem[]) => {
            setTracks(newTracks);
            setLoading(false);
        };

        trackListeners.add(listener);
        getRemoteTracks();

        return () => {
            trackListeners.delete(listener);
        };
    }, []);

    return { tracks, loading };
}

// Hook Reactivo para Álbumes
export function useAlbums() {
    const [albums, setAlbums] = useState<Album[]>(cachedAlbums);
    const [loading, setLoading] = useState<boolean>(!isAlbumsLoaded);

    useEffect(() => {
        if (isAlbumsLoaded) {
            setAlbums(cachedAlbums);
            setLoading(false);
            return;
        }

        const listener = (newAlbums: Album[]) => {
            setAlbums(newAlbums);
            setLoading(false);
        };

        albumListeners.add(listener);
        getRemoteAlbums();

        return () => {
            albumListeners.delete(listener);
        };
    }, []);

    return { albums, loading };
}

export async function preloadLibraryData(): Promise<{ tracks: MediaItem[]; albums: Album[] }> {
    const [tracks, albums] = await Promise.all([
        getRemoteTracks(),
        getRemoteAlbums(),
    ]);

    return { tracks, albums };
}