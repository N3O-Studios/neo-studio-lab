-- Remove pg_cron from public schema if it exists there
-- (In Supabase, pg_cron is pre-installed in the cron schema)
DROP EXTENSION IF EXISTS pg_cron CASCADE;

-- pg_cron is already available in the cron schema in Supabase
-- pg_net should be installed in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;