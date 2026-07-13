-- 00002_move_itinerary_to_packages.sql

-- 1. Add itinerary column to packages table
ALTER TABLE public.packages 
ADD COLUMN itinerary JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing data from itineraries to packages.itinerary
UPDATE public.packages p
SET itinerary = COALESCE(
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'day', i.day,
                'title', i.title,
                'description', i.description
            ) ORDER BY i.day ASC
        )
        FROM public.itineraries i
        WHERE i.package_id = p.id
    ),
    '[]'::jsonb
);

-- 3. Drop the itineraries table
DROP TABLE public.itineraries;
