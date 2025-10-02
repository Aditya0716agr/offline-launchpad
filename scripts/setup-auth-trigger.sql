-- Set up the auth trigger for automatic profile creation
-- Run this AFTER creating your first user in Supabase Auth

-- Create trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'Auth trigger setup completed! 🎉' as message;
