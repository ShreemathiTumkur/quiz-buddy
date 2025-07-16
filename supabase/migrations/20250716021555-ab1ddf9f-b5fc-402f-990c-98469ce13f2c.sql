-- Remove Telugu Vocabulary topic and its questions
DELETE FROM questions WHERE topic_id = '7586e575-a554-49dc-80a7-ccf0db5d164f';
DELETE FROM topics WHERE id = '7586e575-a554-49dc-80a7-ccf0db5d164f';