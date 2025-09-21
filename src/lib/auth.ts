import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'founder' | 'user' | 'admin';
  location: string | null;
  bio: string | null;
}

export async function signUp(email: string, password: string, fullName: string, role: 'founder' | 'user' = 'user') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('No user returned from signup');

  // TODO: Create profile after types are generated
  // const { error: profileError } = await supabase
  //   .from('profiles')
  //   .insert({
  //     user_id: data.user.id,
  //     full_name: fullName,
  //     role,
  //   });

  // if (profileError) throw profileError;

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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // TODO: Implement after types are generated
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .single();

  // if (error) return null;
  // return data;
  return null;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  // TODO: Implement after types are generated
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .update(updates)
  //   .eq('user_id', userId);

  // if (error) throw error;
  // return data;
  return null;
}