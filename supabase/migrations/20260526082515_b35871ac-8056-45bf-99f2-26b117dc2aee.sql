
-- Config table (singleton)
CREATE TABLE public.landing_config (
  id INT PRIMARY KEY DEFAULT 1,
  app_icon_url TEXT,
  app_name TEXT DEFAULT 'My App',
  download_url TEXT DEFAULT '#',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
INSERT INTO public.landing_config (id) VALUES (1);

-- Images table
CREATE TABLE public.landing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_images ENABLE ROW LEVEL SECURITY;

-- Public read; public write (admin page is unauthenticated by request)
CREATE POLICY "public read config" ON public.landing_config FOR SELECT USING (true);
CREATE POLICY "public write config" ON public.landing_config FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public read images" ON public.landing_images FOR SELECT USING (true);
CREATE POLICY "public write images" ON public.landing_images FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('landing', 'landing', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read landing bucket" ON storage.objects FOR SELECT USING (bucket_id = 'landing');
CREATE POLICY "public upload landing bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'landing');
CREATE POLICY "public update landing bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'landing');
CREATE POLICY "public delete landing bucket" ON storage.objects FOR DELETE USING (bucket_id = 'landing');
