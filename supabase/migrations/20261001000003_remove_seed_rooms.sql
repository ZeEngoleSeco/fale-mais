-- Remove all seed/demo rooms that were inserted without a real host_id
-- These rooms have NULL host_id (seeded before auth was integrated)
DELETE FROM public.rooms
WHERE host_id IS NULL;
