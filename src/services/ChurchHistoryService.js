import BaseAPI from './BaseAPI';

/**
 * Church history is a singleton page. API contract:
 * GET /church-history (public) -> { title?, thumbnail?, excerpt?, content? }
 * PUT /church-history (auth)   -> body: { title?, thumbnail?, excerpt?, content? }
 * content = JSON string of blocks: [{ type: 'text', html }, { type: 'image', images: [{ url, key }] }]
 */
export const ChurchHistoryService = {
  async get() {
    const response = await BaseAPI.publicClient.get('/church-history');
    return response.data;
  },

  async update(data) {
    const response = await BaseAPI.authClient.put('/church-history', data);
    return response.data;
  },
};
