import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authClient } from '@/lib/auth-client';
import { AuthState, User } from '@/types/interfaces';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user: User | null) => set({ user }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      // Fungsi baru untuk membersihkan state saja
      clearAuth: () => set({ user: null, isLoading: false }),
      logout: async () => {
        await authClient.signOut();
        set({ user: null });
      },
      initialize: () => {
        const mapUser = (supabaseUser: any) => ({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          fullName: supabaseUser.user_metadata?.full_name,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
        });

        // Check initial session
        authClient.getSession().then(({ data }) => {
          if (data?.user) {
            set({ user: mapUser(data.user) });
          }
          set({ isLoading: false });
        });

        authClient.onAuthStateChange((user) => {
          if (user) {
            set({ user: mapUser(user) });
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