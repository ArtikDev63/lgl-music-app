// store/usePlayerStore.js
import { create } from 'zustand';
import TrackPlayer, { PlaybackState, Event, usePlaybackState, PlayerCommand, useIsPlaying } from '@rntp/player';

// Función para adaptar tu JSON al formato que exige el móvil
const adaptJsonToMediaItems = (jsonTracks, contextId) => {
  if (!Array.isArray(jsonTracks)) return [];

  return jsonTracks.map((track) => {
    // Generamos un id único obligatorio basado en la url o el título si no viene definido
    const mediaId = track.id_interno || track.title.toLowerCase().replace(/\s+/g, '-');

    return {
      mediaId: mediaId,                         // Requerido por v5
      url: track.song_uri,                      // Requerido por v5
      title: track.title,                       // Requerido por v5
      artist: track.artists,                    // Requerido por v5
      albumTitle: track.album,                  // v5 usa albumTitle
      artworkUrl: track.image_uri,              // v5 usa artworkUrl con camelCase
      duration: Number(track.duration),         // Forzado a número (en segundos)

      extras: { contextId: contextId, imageColor: track.color }
    };
  });
}

let eventListenerList = []

// Creamos el Store de Zustand que React SÍ puede escuchar
const useMusicPlayer = create((set, get) => ({
  activeContextId: "",
  activeTrackId: "",
  isPlaying: false,
  isInitialized: false,
  isShuffle: false,
  currentTrack: "",

  // Funciones para leer el estado actual de forma síncrona si es necesario
  getContextId: () => get().activeContextId,
  getIsPlaying: () => get().isPlaying,
  getActiveTrackId: () => get().activeTrackId,
  getIsShuffle: () => get().isShuffle,
  getCurrentTrack: () => get().currentTrack,
  getCurrentTrackColor: () => get().currentTrackColor,

  initPlaybackListeners: () => {

    console.log("Event Listeners", eventListenerList)

    if(eventListenerList){
      eventListenerList.forEach(t => t.remove());
    }

    // Opcional: Escucha si la canción cambia para actualizar el contexto si hiciera falta
    eventListenerList.push(TrackPlayer.addEventListener(Event.MediaItemTransition, async (event) => {
      const currentTrack = event.item

      if (currentTrack) {
        set({ currentTrack: currentTrack });
      }
    }));

    // eventListenerList.push(TrackPlayer.addEventListener(Event.PlaybackStateChanged, (event) => {
    //   const state = event.state
    //   console.log(state)
    //   if(state === PlaybackState.Ready || state === PlaybackState.Buffering){
    //     if(!get().isPlaying) {
    //             set({ isPlaying: true });
    //         }
    //   }
    // }));
  },

  /**
   * Sincroniza el estado de Zustand con el motor nativo de audio tras un reload 
   */
  syncPlayerState: () => {
    try {
      // 1. Verificamos si el reproductor ya fue configurado nativamente
      // Si no ha sido inicializado en absoluto, tirará error y pasará al catch
      const activeTrack = TrackPlayer.getActiveMediaItem();

      // Inicializamos los oyentes de eventos si no se han puesto ya
      get().initPlaybackListeners();

      if (activeTrack) {

        set({
          activeContextId: activeTrack.extras?.contextId || "all",
          activeTrackId: activeTrack.mediaId || "",
          isPlaying: TrackPlayer.isPlaying(),
          isInitialized: true
        });
        console.log("¡Store sincronizado con el audio de fondo con éxito!");
      }
    } catch (error) {
      // Si no estaba inicializado (primer inicio de la app), lo configuramos aquí
      console.log("Inicializando el Track Player por primera vez...", error);
      try {
        TrackPlayer.setupPlayer();
        // Pon aquí también tus TrackPlayer.updateOptions de las capacidades
        TrackPlayer.setCommands({
            capabilities: [
              PlayerCommand.PlayPause,
              PlayerCommand.Next,
              PlayerCommand.Previous,
              PlayerCommand.Seek,
            ],
            backwardInterval: 15,
            forwardInterval: 30,
        })
        get().initPlaybackListeners(); // <--- También los activamos en el primer inicio
        set({ isInitialized: true });
      } catch (setupError) {
        console.error("Error al configurar el reproductor:", setupError);
      }
    }
  },

  playAlbum: async (tracks, contextId) => {
    try {
      TrackPlayer.stop();
      TrackPlayer.clear();

      const firstTrack = tracks[0];
      const firstTrackNative = adaptJsonToMediaItems([firstTrack], contextId);
      console.log(firstTrack, firstTrackNative)
      // 3. Cargamos y reproducimos la primera canción inmediatamente
      await TrackPlayer.setMediaItems(firstTrackNative); 
      await TrackPlayer.play(); // Arranca instantáneo porque es un array de 1 elemento

      // 4. Inyectamos el resto de la cola FUERA del hilo principal (UI Thread)
      // El setTimeout(..., 0) empuja esta tarea al final de la cola de JS,
      // permitiendo que React dibuje el botón de Pausa primero.
      setTimeout(async () => {
          if (tracks.length > 1) {
              const restOfAlbum = adaptJsonToMediaItems(tracks.slice(1));
              // Se añaden silenciosamente a la cola mientras suena la primera
              await TrackPlayer.addMediaItems(restOfAlbum);
          }
      }, 0);

    } catch (error) {
      console.error("Error al reproducir el álbum:", error);
    }
  },

  playTrack: (tracks, targetTrack, contextId) => {
    try {
      // 1. Buscamos en qué posición del JSON está la canción pulsada
      // Puedes buscar por título o por el id_interno si lo tienes
      const targetIndex = tracks.findIndex(t => t.title === targetTrack.title);
      
      if (targetIndex === -1) return; // Si no la encuentra, salimos
      
      // 2. RECORTAMOS LA LISTA: Tomamos desde la canción pulsada hasta el final del álbum
      const tracksToEnqueue = tracks.slice(targetIndex);

      // 3. Adaptamos únicamente el fragmento recortado de la lista
      const mediaItems = adaptJsonToMediaItems(tracksToEnqueue, contextId);
      if (mediaItems.length === 0) return;

      TrackPlayer.stop()
      TrackPlayer.clear();
      
      // 5. Limpiamos por completo el hardware nativo

      // 6. Cargamos la nueva cola recortada en el TrackPlayer y le damos Play
      TrackPlayer.setMediaItems(mediaItems);
      TrackPlayer.play();
      

    } catch (error) {
      console.error("Error al reproducir la canción seleccionada:", error);
      set({ isPlaying: false });
    }
  },

  togglePlayPause: () => {
    try {
      const currentIsPlaying = get().isPlaying;
      
      if (currentIsPlaying) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }

      // Invertimos el estado de reproducción en Zustand
      set({ isPlaying: !currentIsPlaying });

    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  },

  toggleShuffle: () => {
    try {
      const shuffleMode = get().isShuffle

      TrackPlayer.setShuffleEnabled(!shuffleMode)

      set({ isShuffle: !shuffleMode})
    } catch (error){
      console.error("Error con el shuffle:", error)
    }
  }
}));

// Mantenemos estas exportaciones por compatibilidad si las usas en archivos no-React,
// pero apuntando ahora directamente al estado vivo de Zustand
export const getContextId = () => useMusicPlayer.getState().activeContextId;
export const getIsPlaying = () => useMusicPlayer.getState().isPlaying;
export const playAlbum = (tracks, contextId) => useMusicPlayer.getState().playAlbum(tracks, contextId);
export const togglePlayPause = () => useMusicPlayer.getState().togglePlayPause();
export const getActiveTrackId = () => useMusicPlayer.getState().getActiveTrackId();
export const playTrack = () => useMusicPlayer.getState().playTrack();
export const isShuffle = () => useMusicPlayer.getState().getIsShuffle();
export const toggleShuffle = () => useMusicPlayer.getState().toggleShuffle();
export const currentTrack = () => useMusicPlayer.getState().currentTrack();
export const currentTrackColor = () => useMusicPlayer.getState().currentTrackColor();
export default useMusicPlayer
