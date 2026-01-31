import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const user = ref(null);
const loading = ref(false);
const error = ref(null);

export function useAuth() {
    const router = useRouter();

    const login = async (email, password) => {
        loading.value = true;
        error.value = null;
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock validation
            if (email === 'admin@gmail.com' && password === '123') {
                user.value = {
                    name: 'Admin User',
                    email: email,
                    role: 'admin',
                    avatar: 'https://i.pravatar.cc/150?u=admin'
                };
                // Save to local storage for persistence (simple version)
                localStorage.setItem('user', JSON.stringify(user.value));
                return true;
            } else {
                throw new Error('អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
            }
        } catch (err) {
            error.value = err.message || 'Login failed';
            return false;
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        user.value = null;
        localStorage.removeItem('user');
        router.push('/login');
    };

    // Restore session
    const initAuth = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        }
    };

    const isAuthenticated = computed(() => !!user.value);

    return {
        user,
        loading,
        error,
        login,
        logout,
        initAuth,
        isAuthenticated
    };
}
