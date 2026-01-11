import BaseAPI from './BaseAPI';

class ChapterService {
  constructor() {
    this.endpoint = '/chapters';
  }

  /**
   * List chapters with optional filters
   * Corresponds to GET /chapters
   * @param {Object} params - { skip, limit, bible_id, language, order_by }
   */
  getChapters(params = {}) {
    return BaseAPI.publicClient.get(this.endpoint, { params });
  }

  /**
   * Get chapters by Bible ID
   * @param {string} bibleId
   * @param {Object} params
   */
  getChaptersByBible(bibleId, params = {}) {
    return this.getChapters({ ...params, bible_id: bibleId });
  }

  /**
   * Get a single chapter by ID
   * Corresponds to GET /chapters/{chapter_id}
   * @param {string} chapterId
   */
  getChapter(chapterId) {
    return BaseAPI.publicClient.get(`${this.endpoint}/${chapterId}`);
  }

  /**
   * Create a new chapter
   * Corresponds to POST /chapters
   * @param {Object} payload - ChapterCreate schema
   */
  createChapter(payload) {
    return BaseAPI.authClient.post(this.endpoint, payload);
  }

  /**
   * Update an existing chapter
   * Corresponds to PUT /chapters/{chapter_id}
   * @param {string} chapterId
   * @param {Object} payload - ChapterUpdate schema
   */
  updateChapter(chapterId, payload) {
    return BaseAPI.authClient.put(`${this.endpoint}/${chapterId}`, payload);
  }

  /**
   * Delete a chapter
   * Corresponds to DELETE /chapters/{chapter_id}
   * @param {string} chapterId
   */
  deleteChapter(chapterId) {
    return BaseAPI.authClient.delete(`${this.endpoint}/${chapterId}`);
  }
}

export default new ChapterService();