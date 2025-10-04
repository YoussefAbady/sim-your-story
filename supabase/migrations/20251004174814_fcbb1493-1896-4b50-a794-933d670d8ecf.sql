-- Add unique constraint on session_id for upsert operations
ALTER TABLE session_time ADD CONSTRAINT session_time_session_id_key UNIQUE (session_id);