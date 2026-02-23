import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8100/api/v1';
const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

/**
 * Map API gallery object to the shape expected by gallery views (thumbnail, itemList, itemCount, date).
 * @param {Object} g - Gallery from API: { id, title, description, cover, images: [{ url, title? }], create_at }
 * @returns {Object} View shape: { id, title, description, thumbnail, itemCount, itemList, date }
 */
function mapGalleryFromApi(g) {
  const images = g.images || [];
  const date = g.create_at
    ? new Date(g.create_at).toISOString().slice(0, 10)
    : null;
  return {
    id: g.id,
    title: g.title || '',
    description: g.description || '',
    thumbnail: g.cover || '',
    itemCount: images.length,
    date: date || 'Recently Added',
    itemList: images.map((img, idx) => ({
      id: idx + 1,
      title: (typeof img === 'object' && img.title) ? img.title : '',
      imageUrl: typeof img === 'object' ? img.url : img
    }))
  };
}

export const MediaService = {
  async getGalleryAlbums() {
    const { data } = await api.get('/galleries/', { params: { skip: 0, limit: 100 } });
    const items = (data.items || []).map(mapGalleryFromApi);
    return items;
  },

  async getGalleryAlbumById(id) {
    const { data } = await api.get(`/galleries/${id}`);
    return mapGalleryFromApi(data);
  }
};
