import BaseAPI from './BaseAPI';

/**
 * Structure pages (រចនាសម្ព័ន្ធព្រះសហគមន៍).
 * Public: GET /structure-pages, GET /structure-pages/:slug
 * Admin: /structure-pages/manage...
 */
export const StructurePageService = {
  async listPublic() {
    const { data } = await BaseAPI.publicClient.get('/structure-pages');
    return data;
  },

  async getBySlug(slug) {
    const { data } = await BaseAPI.publicClient.get(`/structure-pages/${encodeURIComponent(slug)}`);
    return data;
  },

  async listAdmin() {
    const { data } = await BaseAPI.authClient.get('/structure-pages/manage');
    return data;
  },

  async getAdmin(slug) {
    const { data } = await BaseAPI.authClient.get(
      `/structure-pages/manage/${encodeURIComponent(slug)}`
    );
    return data;
  },

  async create(payload) {
    const { data } = await BaseAPI.authClient.post('/structure-pages/manage', payload);
    return data;
  },

  async update(slug, payload) {
    const { data } = await BaseAPI.authClient.put(
      `/structure-pages/manage/${encodeURIComponent(slug)}`,
      payload
    );
    return data;
  },

  async remove(slug) {
    await BaseAPI.authClient.delete(`/structure-pages/manage/${encodeURIComponent(slug)}`);
  },
};
