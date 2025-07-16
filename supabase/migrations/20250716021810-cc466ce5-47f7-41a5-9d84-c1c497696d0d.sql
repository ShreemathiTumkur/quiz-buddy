-- Clean up database and keep only default topics
DELETE FROM questions;
DELETE FROM topics WHERE name NOT IN ('Volcanoes', 'Math (Age 6)');

-- Update existing topics to make sure they're clean
UPDATE topics SET emoji = '🌋' WHERE name = 'Volcanoes';
UPDATE topics SET emoji = '➕' WHERE name = 'Math (Age 6)';