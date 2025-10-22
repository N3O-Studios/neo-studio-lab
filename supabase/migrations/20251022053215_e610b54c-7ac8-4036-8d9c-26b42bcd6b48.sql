-- Install pg_cron extension (it will create its own 'cron' schema)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the fetch-news function to run every 7 days (weekly)
-- This will run every Sunday at 2:00 AM UTC
SELECT cron.schedule(
  'fetch-news-weekly',
  '0 2 * * 0',
  $$
  SELECT
    net.http_post(
        url:='https://ywadyvczgtjsitymaejr.supabase.co/functions/v1/fetch-news',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWR5dmN6Z3Rqc2l0eW1hZWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDg0MzIsImV4cCI6MjA3NjYyNDQzMn0.t9E6jkuRcSVTwrbE-S9PRo5PkepbYXOoYRlUZHJ3p1A"}'::jsonb,
        body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);