-- Migration to add 'category' to packages table
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'International';

-- Assign correct categories based on existing names
UPDATE public.packages SET category = 'Domestic' WHERE name ILIKE '%Andaman%';
UPDATE public.packages SET category = 'Domestic' WHERE name ILIKE '%Kashmir%';
UPDATE public.packages SET category = 'Domestic' WHERE name ILIKE '%Shimla%';
UPDATE public.packages SET category = 'Domestic' WHERE name ILIKE '%Uttarakhand%';
UPDATE public.packages SET category = 'Domestic' WHERE name ILIKE '%Ayodhya%';

-- Ensure others are set to International explicitly
UPDATE public.packages SET category = 'International' WHERE category IS NULL OR (name NOT ILIKE '%Andaman%' AND name NOT ILIKE '%Kashmir%' AND name NOT ILIKE '%Shimla%' AND name NOT ILIKE '%Uttarakhand%' AND name NOT ILIKE '%Ayodhya%');
