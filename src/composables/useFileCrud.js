import { ref } from 'vue';
import * as FileService from '@/services/FileService';

/**
 * Thin composable around unified file API for reuse in admin or public views.
 */
export function useFileCrud() {
  const loading = ref(false);
  const error = ref(null);

  async function upload(file) {
    loading.value = true;
    error.value = null;
    try {
      return await FileService.uploadFile(file);
    } catch (e) {
      error.value = e.response?.data?.detail || e.message || 'Upload failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function list(params) {
    loading.value = true;
    error.value = null;
    try {
      return await FileService.listFiles(params);
    } catch (e) {
      error.value = e.response?.data?.detail || e.message || 'List failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id) {
    loading.value = true;
    error.value = null;
    try {
      await FileService.deleteFile(id);
    } catch (e) {
      error.value = e.response?.data?.detail || e.message || 'Delete failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, upload, list, remove, getById: FileService.getFileById };
}
