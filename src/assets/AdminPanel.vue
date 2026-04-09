<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User &amp; access</h1>
        <p class="text-sm text-gray-500 mt-1">Users, roles, and permissions (API-controlled)</p>
      </div>
      <button
        v-if="activeTab === 'users' && canManageUsers"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all"
        @click="openCreateUser"
      >
        <i class="fas fa-plus"></i>
        <span>Add user</span>
      </button>
    </div>

    <div class="mb-6">
      <nav class="flex flex-wrap gap-1 bg-gray-100/80 p-1 rounded-md w-fit" aria-label="Tabs">
        <button
          v-for="tab in visibleTabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'bg-white text-[#1a365d] shadow-sm font-semibold'
              : 'text-gray-500 hover:text-gray-700',
            'px-4 py-2 rounded-md text-sm transition-all duration-200',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-if="loadError" class="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md ring-1 ring-red-100">
      {{ loadError }}
    </div>

    <!-- Users -->
    <div v-show="activeTab === 'users'" class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead>
            <tr class="bg-gray-50/80">
              <th class="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="relative py-3.5 pl-3 pr-6"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="loadingUsers">
              <td colspan="4" class="py-8 text-center text-gray-500 text-sm">Loading…</td>
            </tr>
            <tr v-else-if="!users.length">
              <td colspan="4" class="py-8 text-center text-gray-500 text-sm">No users</td>
            </tr>
            <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50/60 transition-colors">
              <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                <div class="font-semibold text-gray-900">{{ u.full_name || '—' }}</div>
                <div class="text-gray-400 text-xs">{{ u.email }}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{ u.role_name || '—' }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  v-if="u.is_active"
                  class="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                >
                  Active
                </span>
                <span v-else class="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  Inactive
                </span>
              </td>
              <td class="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                <button
                  type="button"
                  class="p-2 text-gray-400 hover:text-[#1a365d] hover:bg-[#1a365d]/5 rounded-md transition-all"
                  @click="openEditUser(u)"
                  title="Edit"
                >
                  <EditOutlined />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Roles -->
    <div v-show="activeTab === 'roles'" class="space-y-4">
      <div
        v-for="r in roles"
        :key="r.id"
        class="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-5"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 capitalize">{{ r.name }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ r.permission_codes.length }} permissions</p>
          </div>
          <button
            type="button"
            class="text-sm font-medium text-blue-600 hover:text-blue-800"
            @click="openRoleEditor(r)"
          >
            Edit permissions
          </button>
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="code in r.permission_codes"
            :key="code"
            class="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
          >
            {{ code }}
          </span>
        </div>
      </div>
    </div>

    <!-- Permissions catalog -->
    <div v-show="activeTab === 'permissions'" class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead>
            <tr class="bg-gray-50/80">
              <th class="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
              <th class="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="p in permissionCatalog" :key="p.id" class="hover:bg-gray-50/60">
              <td class="py-3 pl-6 pr-3 text-sm font-mono text-gray-800">{{ p.code }}</td>
              <td class="px-3 py-3 text-sm text-gray-600">{{ p.label || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User modal -->
    <a-modal
      v-model:open="userModalOpen"
      :title="editingUserId ? 'Edit user' : 'New user'"
      ok-text="Save"
      cancel-text="Cancel"
      :confirm-loading="savingUser"
      @ok="submitUserForm"
    >
      <a-form layout="vertical" class="mt-2">
        <a-form-item label="Email" required>
          <a-input v-model:value="userForm.email" type="email" autocomplete="off" />
        </a-form-item>
        <a-form-item :label="editingUserId ? 'New password (optional)' : 'Password'" :required="!editingUserId">
          <a-input-password v-model:value="userForm.password" autocomplete="new-password" />
        </a-form-item>
        <a-form-item label="Full name">
          <a-input v-model:value="userForm.full_name" />
        </a-form-item>
        <a-form-item label="Role" required>
          <a-select
            v-model:value="userForm.role_id"
            :options="roleSelectOptions"
            style="width: 100%"
            placeholder="Select role"
          />
        </a-form-item>
        <a-form-item label="Active">
          <a-switch v-model:checked="userForm.is_active" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Role permissions modal -->
    <a-modal
      v-model:open="roleModalOpen"
      title="Role permissions"
      ok-text="Save"
      cancel-text="Cancel"
      width="640px"
      :confirm-loading="savingRole"
      @ok="submitRolePermissions"
    >
      <p v-if="editingRole" class="text-sm text-gray-600 mb-3 capitalize">Role: {{ editingRole.name }}</p>
      <a-checkbox-group v-model:value="selectedPermissionIds" class="flex flex-col gap-2 max-h-72 overflow-y-auto">
        <a-checkbox v-for="p in permissionCatalog" :key="p.id" :value="p.id" class="!ml-0">
          <span class="font-mono text-sm">{{ p.code }}</span>
          <span v-if="p.label" class="text-gray-500 text-xs ml-2">— {{ p.label }}</span>
        </a-checkbox>
      </a-checkbox-group>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useAuth } from '@/composables/useAuth';
import * as iam from '@/services/iamApi';

const { hasPermission } = useAuth();

const canManageUsers = computed(() => hasPermission('MANAGE-USERS'));
const canManageRoles = computed(() => hasPermission('MANAGE-ROLES'));
const canViewPermissions = computed(
  () => hasPermission('READ-PERMISSION') || hasPermission('MANAGE-ROLES')
);

const visibleTabs = computed(() => {
  const tabs = [];
  if (canManageUsers.value) tabs.push({ id: 'users', label: 'Users' });
  if (canManageRoles.value) tabs.push({ id: 'roles', label: 'Roles' });
  if (canViewPermissions.value) tabs.push({ id: 'permissions', label: 'Permissions' });
  return tabs;
});

const activeTab = ref('users');

watch(
  visibleTabs,
  (tabs) => {
    if (!tabs.some((t) => t.id === activeTab.value) && tabs.length) {
      activeTab.value = tabs[0].id;
    }
  },
  { immediate: true }
);

const users = ref([]);
const roles = ref([]);
const permissionCatalog = ref([]);
const loadingUsers = ref(false);
const loadError = ref('');

const userModalOpen = ref(false);
const editingUserId = ref(null);
const savingUser = ref(false);
const userForm = ref({
  email: '',
  password: '',
  full_name: '',
  role_id: undefined,
  is_active: true,
});

const roleModalOpen = ref(false);
const editingRole = ref(null);
const selectedPermissionIds = ref([]);
const savingRole = ref(false);

const roleSelectOptions = computed(() =>
  roles.value.map((r) => ({ label: r.name, value: r.id }))
);

async function loadUsers() {
  if (!canManageUsers.value) return;
  loadingUsers.value = true;
  loadError.value = '';
  try {
    users.value = await iam.fetchUsers();
  } catch (e) {
    loadError.value = e.response?.data?.detail || e.message || 'Failed to load users';
  } finally {
    loadingUsers.value = false;
  }
}

async function loadRoles() {
  if (!canManageUsers.value && !canManageRoles.value) return;
  try {
    roles.value = await iam.fetchRoles();
  } catch (e) {
    message.error(e.response?.data?.detail || 'Failed to load roles');
  }
}

async function loadPermissionCatalog() {
  if (!canViewPermissions.value) return;
  try {
    permissionCatalog.value = await iam.fetchPermissions();
  } catch (e) {
    message.error(e.response?.data?.detail || 'Failed to load permissions');
  }
}

function openCreateUser() {
  editingUserId.value = null;
  userForm.value = {
    email: '',
    password: '',
    full_name: '',
    role_id: roleSelectOptions.value[0]?.value,
    is_active: true,
  };
  userModalOpen.value = true;
}

function openEditUser(u) {
  editingUserId.value = u.id;
  userForm.value = {
    email: u.email,
    password: '',
    full_name: u.full_name || '',
    role_id: u.role_id,
    is_active: u.is_active,
  };
  userModalOpen.value = true;
}

async function submitUserForm() {
  const f = userForm.value;
  const reject = () => Promise.reject(new Error('validation'));
  if (!f.email?.trim()) {
    message.warning('Email is required');
    return reject();
  }
  if (!editingUserId.value && (!f.password || f.password.length < 6)) {
    message.warning('Password must be at least 6 characters');
    return reject();
  }
  if (f.role_id == null || f.role_id === '') {
    message.warning('Role is required');
    return reject();
  }
  const roleId = Number(f.role_id);
  savingUser.value = true;
  try {
    if (editingUserId.value) {
      const payload = {
        email: f.email.trim(),
        full_name: f.full_name?.trim() || null,
        role_id: roleId,
        is_active: f.is_active,
      };
      if (f.password) payload.password = f.password;
      await iam.updateUser(editingUserId.value, payload);
      message.success('User updated');
    } else {
      await iam.createUser({
        email: f.email.trim(),
        password: f.password,
        full_name: f.full_name?.trim() || null,
        role_id: roleId,
        is_active: f.is_active,
      });
      message.success('User created');
    }
    userModalOpen.value = false;
    await loadUsers();
  } catch (e) {
    const d = e.response?.data?.detail;
    message.error(typeof d === 'string' ? d : e.message || 'Save failed');
    throw e;
  } finally {
    savingUser.value = false;
  }
}

async function openRoleEditor(r) {
  if (!permissionCatalog.value.length) {
    await loadPermissionCatalog();
  }
  editingRole.value = r;
  selectedPermissionIds.value = permissionCatalog.value
    .filter((p) => r.permission_codes.includes(p.code))
    .map((p) => p.id);
  roleModalOpen.value = true;
}

async function submitRolePermissions() {
  if (!editingRole.value) return;
  savingRole.value = true;
  try {
    await iam.updateRolePermissions(editingRole.value.id, selectedPermissionIds.value);
    message.success('Role updated');
    roleModalOpen.value = false;
    await loadRoles();
  } catch (e) {
    message.error(e.response?.data?.detail || 'Save failed');
    throw e;
  } finally {
    savingRole.value = false;
  }
}

onMounted(async () => {
  await loadRoles();
  await Promise.all([loadUsers(), loadPermissionCatalog()]);
});
</script>
