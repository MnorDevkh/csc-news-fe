import BaseAPI from './BaseAPI';

class VerseService {
  constructor() {
    this.endpoint = '/verses';
  }

  /**
   * List verses with optional filters
   * Corresponds to GET /verses
   * @param {Object} params - { skip, limit, chapter_id, language, order_by }
   */
  getVerses(params = {}) {
    return BaseAPI.publicClient.get(this.endpoint, { params });
  }

  /**
   * Get a single verse by ID
   * Corresponds to GET /verses/{verse_id}
   * @param {string} verseId
   */
  getVerse(verseId) {
    return BaseAPI.publicClient.get(`${this.endpoint}/${verseId}`);
  }

  /**
   * Create a new verse
   * Corresponds to POST /verses
   * @param {Object} payload - VerseCreate schema
   */
  createVerse(payload) {
    return BaseAPI.authClient.post(this.endpoint, payload);
  }

  /**
   * Update an existing verse
   * Corresponds to PUT /verses/{verse_id}
   * @param {string} verseId
   * @param {Object} payload - VerseUpdate schema
   */
  updateVerse(verseId, payload) {
    return BaseAPI.authClient.put(`${this.endpoint}/${verseId}`, payload);
  }

  /**
   * Delete a verse
   * Corresponds to DELETE /verses/{verse_id}
   * @param {string} verseId
   */
  deleteVerse(verseId) {
    return BaseAPI.authClient.delete(`${this.endpoint}/${verseId}`);
  }
}

export default new VerseService();