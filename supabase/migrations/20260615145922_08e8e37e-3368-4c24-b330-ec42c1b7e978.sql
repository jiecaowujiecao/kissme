
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (qual LIKE '%landing%' OR with_check LIKE '%landing%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "landing deny anon insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'landing' AND false);
CREATE POLICY "landing deny anon update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'landing' AND false) WITH CHECK (bucket_id = 'landing' AND false);
CREATE POLICY "landing deny anon delete" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'landing' AND false);
