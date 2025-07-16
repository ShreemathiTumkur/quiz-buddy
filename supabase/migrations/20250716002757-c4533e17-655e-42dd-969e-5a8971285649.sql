-- Remove the duplicate Math topic, keeping only "Math (Age 6)"
DELETE FROM topics WHERE name = 'Math' AND emoji = '🔢';