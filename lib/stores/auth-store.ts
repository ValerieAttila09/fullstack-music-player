import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authClient } from '@/lib/auth-client';
import { AuthState } from '@/types/interfaces';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: async () => {
        await authClient.signOut();
        set({ user: null });
      },
      initialize: () => {
        // Check initial session
        authClient.getSession().then(({ data }) => {
          if (data?.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email || '',
                fullName: data.user.user_metadata?.full_name,
                avatarUrl: data.user.user_metadata?.avatar_url,
              }
            });
          }
          set({ isLoading: false });
        });

        // Listen for auth changes
        authClient.onAuthStateChange((user) => {
          if (user) {
            set({
              user: {
                id: user.id,
                email: user.email || '',
                fullName: user.user_metadata?.full_name,
                avatarUrl: user.user_metadata?.avatar_url,
              }
            });
          } else {
            set({ user: null });
          }
          set({ isLoading: false });
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);