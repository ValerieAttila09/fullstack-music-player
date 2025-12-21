import { supabase } from '@/lib/utils/supabase/supabase.server';

export const authClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      return { data: { user: data.user }, error: null };
    },
  },
  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name?: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { data: null, error };
      }

      return { data: { user: data.user }, error: null };
    },
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data: data.session ? { user: data.session.user } : null, error };
  },
  onAuthStateChange: (callback: (user: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  },
};