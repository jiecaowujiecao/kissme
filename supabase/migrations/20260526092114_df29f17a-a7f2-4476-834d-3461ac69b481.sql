
-- Tables: drop overly-permissive write policies, keep public read
DROP POLICY IF EXISTS "public write config" ON public.landing_config;
DROP POLICY IF EXISTS "public write images" ON public.landing_images;

-- Re-assert: public read remains (already present, but ensure)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='landing_config' AND policyname='public read config'
  ) THEN
    CREATE POLICY "public read config" ON public.landing_config FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='landing_images' AND policyname='public read images'
  ) THEN
    CREATE POLICY "public read images" ON public.landing_images FOR SELECT TO public USING (true);
  END IF;
END $$;

-- Storage: remove any public SELECT/INSERT/UPDATE/DELETE policies on the 'landing' bucket
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (qual LIKE '%landing%' OR with_check LIKE '%landing%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Bucket stays public so public URLs work for download, but listing is now blocked
-- (no SELECT policy on storage.objects for the landing bucket).
