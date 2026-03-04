import BaseAPI from './BaseAPI';

class SectionService {
  constructor() {
    this.endpoint = '/sections';
  }

  getSections(params = {}) {
    return BaseAPI.publicClient.get(this.endpoint, { params });
  }

  getSectionsByChapter(chapterId, params = {}) {
    return this.getSections({ ...params, chapter_id: chapterId });
  }

  getSection(sectionId) {
    return BaseAPI.publicClient.get(`${this.endpoint}/${sectionId}`);
  }

  createSection(payload) {
    return BaseAPI.authClient.post(this.endpoint, payload);
  }

  updateSection(sectionId, payload) {
    return BaseAPI.authClient.put(`${this.endpoint}/${sectionId}`, payload);
  }

  deleteSection(sectionId) {
    return BaseAPI.authClient.delete(`${this.endpoint}/${sectionId}`);
  }
}

export default new SectionService();
