-- Add user_id directly to chat_messages for stronger security
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Populate user_id for existing messages
UPDATE public.chat_messages
SET user_id = (
  SELECT user_id 
  FROM public.chat_sessions 
  WHERE chat_sessions.id = chat_messages.session_id
)
WHERE user_id IS NULL;

-- Make user_id NOT NULL after populating
ALTER TABLE public.chat_messages
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing chat_messages policies
DROP POLICY IF EXISTS "Users can view messages from their sessions" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create messages in their sessions" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete messages from their sessions" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update messages from their sessions" ON public.chat_messages;

-- Create new stronger policies with direct user_id checks (no admin access)
CREATE POLICY "Users can only view their own messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own messages"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing profiles policies and recreate with explicit denials
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Profiles: Only users can view/update their own profile, no admin access to emails
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Explicitly deny all other access (public, anonymous, or admin overreach)
CREATE POLICY "Deny all other access to profiles"
ON public.profiles
FOR ALL
TO public
USING (false);