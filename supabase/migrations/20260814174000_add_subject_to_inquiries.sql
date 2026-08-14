-- Add subject column to inquiries table
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS subject TEXT NOT NULL DEFAULT 'General Inquiry';

-- Remove the default constraint after adding so future inserts must provide it or fail explicitly
ALTER TABLE public.inquiries ALTER COLUMN subject DROP DEFAULT;

-- Rename 'name' to 'full_name' as requested
DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_schema = 'public' and table_name = 'inquiries' and column_name = 'name')
  THEN
      ALTER TABLE public.inquiries RENAME COLUMN name TO full_name;
  END IF;
END $$;
