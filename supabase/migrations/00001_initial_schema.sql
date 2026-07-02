-- 00001_initial_schema.sql
-- Create packages table
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    duration TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    highlights TEXT[],
    included TEXT[],
    excluded TEXT[],
    gallery TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create itineraries table
CREATE TABLE public.itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies for packages
CREATE POLICY "Packages are viewable by everyone" ON public.packages
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert packages" ON public.packages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update packages" ON public.packages
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete packages" ON public.packages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for itineraries
CREATE POLICY "Itineraries are viewable by everyone" ON public.itineraries
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert itineraries" ON public.itineraries
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update itineraries" ON public.itineraries
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete itineraries" ON public.itineraries
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for inquiries
CREATE POLICY "Anyone can insert an inquiry" ON public.inquiries
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view inquiries" ON public.inquiries
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update inquiries" ON public.inquiries
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete inquiries" ON public.inquiries
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for settings
CREATE POLICY "Settings are viewable by everyone" ON public.settings
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.settings
    FOR ALL USING (auth.role() = 'authenticated');
