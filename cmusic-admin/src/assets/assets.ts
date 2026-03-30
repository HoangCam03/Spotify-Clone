import spotify from './image/icon/spotify.svg';
import songadd from './image/icon/songadd.png';
import listSongs from './image/icon/list_song.svg';
import addAlbum from './image/icon/AddAlbum.png';
import listAlbum from './image/icon/album.png';
import uploadSong from './image/icon/uploadSong.png';
import uploadImage from './image/icon/uploadImage.png';
import doneSong from './image/icon/doneSong.svg';

export const assets = {
  spotify: spotify as string,
  songadd: songadd as string,
  listSongs: listSongs as string,
  addAlbum: addAlbum as string,
  listAlbum: listAlbum as string,
  uploadSong: uploadSong as string,
  uploadImage: uploadImage as string,
  doneSong: doneSong as string,
} as const;
