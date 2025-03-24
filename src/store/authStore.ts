import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email: string, password: string) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      try {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email
        });
        if (profileError) throw profileError;
      } catch (error) {
        // If profile creation fails, we should still allow the user to continue
        console.error('Error creating profile:', error);
      }
    }
  },
  signOut: async () => {
    try {
      // First clear the local state
      set({ user: null, session: null });
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signout error:', error);
        // Even if Supabase signout fails, we've already cleared the local state
      }
    } catch (error) {
      console.error('Error during signout:', error);
      // Ensure state is cleared even if there's an error
      set({ user: null, session: null });
    }
  },
  setUser: async (user) => {
    set({ user, loading: false });
    
    if (user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Error checking/creating profile:', error);
      }
    }
  },
}));