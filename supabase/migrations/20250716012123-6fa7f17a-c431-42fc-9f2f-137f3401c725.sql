-- Remove duplicate Telugu topic (keep "Telugu Vocabulary", remove "Telugu Vocab")
DELETE FROM public.topics WHERE name = 'Telugu Vocab';