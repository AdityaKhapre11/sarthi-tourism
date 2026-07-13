-- 00002_move_itinerary_to_packages.sql

-- 1. Add itinerary column to packages table
ALTER TABLE public.packages 
ADD COLUMN itinerary JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing data from itineraries to packages.itinerary
WITH sorted_itineraries AS (
    SELECT package_id, day, title, description 
    FROM public.itineraries 
    ORDER BY day ASC
),
aggregated_itineraries AS (
    SELECT 
        package_id,
        jsonb_agg(
            jsonb_build_object(
                'day', day,
                'title', title,
                'description', description
            )
        ) AS itinerary_json
    FROM sorted_itineraries
    GROUP BY package_id
)
UPDATE public.packages
SET itinerary = aggregated_itineraries.itinerary_json
FROM aggregated_itineraries
WHERE public.packages.id = aggregated_itineraries.package_id;

-- 3. Drop the itineraries table
DROP TABLE public.itineraries CASCADE;
