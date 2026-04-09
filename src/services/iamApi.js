import BaseAPI from '@/services/BaseAPI';

const client = BaseAPI.authClient;

export async function fetchUsers() {
  const { data } = await client.get('/iam/users');
  return data;
}

export async function createUser(payload) {
  const { data } = await client.post('/iam/users', payload);
  return data;
}

export async function updateUser(userId, payload) {
  const { data } = await client.patch(`/iam/users/${userId}`, payload);
  return data;
}

export async function fetchRoles() {
  const { data } = await client.get('/iam/roles');
  return data;
}

export async function updateRolePermissions(roleId, permissionIds) {
  const { data } = await client.patch(`/iam/roles/${roleId}/permissions`, {
    permission_ids: permissionIds,
  });
  return data;
}

export async function fetchPermissions() {
  const { data } = await client.get('/iam/permissions');
  return data;
}
