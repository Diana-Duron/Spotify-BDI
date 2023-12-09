import { Router } from 'express';
import { getUsuarios, getUsuario, registrarUsuario} from '../Controllers/usuarioController.js';
import { getArtistas, getArtista, getAlbumesArtista, getCancionesArtista } from '../Controllers/artistasController.js';
import { getPodcasters } from '../Controllers/podcasterController.js';
import { getPlaylists, getPlaylistById, createPlaylist, deletePlaylist, updatePlaylist, addSongToPlaylist, deleteSongFromPlaylist } from '../Controllers/playlistsController.js';
import { getPodcasts, getPodcast } from '../Controllers/podcastsController.js';
import { getCanciones, getCancionesById } from '../Controllers/cancionesController.js';

const router = Router();

// Routes de usuario
router.get('/usuarios', getUsuarios);
router.get('/usuario/:id', getUsuario);
router.post('/usuario', registrarUsuario);

// Routes de artista
router.get('/artistas', getArtistas);
router.get('/artista/:id', getArtista);
router.get('/artista/:id/albumes', getAlbumesArtista);
router.get('/artista/:id/canciones', getCancionesArtista);

// Routes de podcaster
router.get('/podcasters', getPodcasters);

// Routes de playlist
router.get('/playlists', getPlaylists);
router.get('/playlist/:id', getPlaylistById);
router.post('/playlist', createPlaylist);
router.delete('/playlist/:id', deletePlaylist);
router.put('/playlist/:id', updatePlaylist);
router.post('/playlist/:id/song', addSongToPlaylist);
router.delete('/playlist/:id/song', deleteSongFromPlaylist);

// Routes de podcasts
router.get('/podcasts', getPodcasts);
router.get('/podcast/:id', getPodcast);

// Routes de canciones
router.get('/canciones', getCanciones);
router.get('/cancion/:id', getCancionesById);

export default router;