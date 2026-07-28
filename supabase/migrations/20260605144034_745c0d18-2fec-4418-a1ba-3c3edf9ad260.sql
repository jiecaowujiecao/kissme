
DROP POLICY IF EXISTS "landing public read" ON storage.objects;
CREATE POLICY "landing public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'landing');
