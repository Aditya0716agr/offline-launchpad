import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  location: string | null;
  bio: string | null;
  designation?: string | null;
  company?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  twitter_url?: string | null;
  created_at: string;
  updated_at: string;
}

export async function signUp(email: string, password: string, fullName: string, role: 'founder' | 'user' = 'user') {
  // Get the correct redirect URL based on environment
  const getEmailRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/email-confirmation`;
    }
    // Fallback for SSR - you need to replace this with your actual production domain
    return import.meta.env.VITE_SITE_URL 
      ? `${import.meta.env.VITE_SITE_URL}/email-confirmation`
      : 'http://localhost:8080/email-confirmation';
  };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
      emailRedirectTo: getEmailRedirectUrl(),
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error('No user returned from signup');

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    }
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}