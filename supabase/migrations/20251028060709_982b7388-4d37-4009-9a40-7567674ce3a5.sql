-- Add DELETE policy for chat_messages so users can delete their own messages
CREATE POLICY "Users can delete messages from their sessions"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1
  FROM chat_sessions
  WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
));

-- Add UPDATE policy for chat_messages so users can edit their own messages
CREATE POLICY "Users can update messages from their sessions"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1
  FROM chat_sessions
  WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
));