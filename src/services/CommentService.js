import BaseAPI from './BaseAPI';

/**
 * Article comments API: GET/POST/DELETE /articles/{id}/comments
 */

/**
 * @param {string} articleId
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getComments(articleId) {
  const { data } = await BaseAPI.publicClient.get(`/articles/${articleId}/comments`);
  return data;
}

/**
 * @param {string} articleId
 * @param {{ body: string, parent_id?: string, attachment_ids?: string[] }} payload
 * @returns {Promise<Object>}
 */
export async function createComment(articleId, payload) {
  const { data } = await BaseAPI.authClient.post(`/articles/${articleId}/comments`, payload);
  return data;
}

/**
 * @param {string} articleId
 * @param {string} commentId
 */
export async function deleteComment(articleId, commentId) {
  await BaseAPI.authClient.delete(`/articles/${articleId}/comments/${commentId}`);
}

export const CommentService = {
  getComments,
  createComment,
  deleteComment,
};

export default CommentService;
