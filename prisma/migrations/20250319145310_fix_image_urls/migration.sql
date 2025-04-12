-- Update Student table to fix image URLs
UPDATE "Student"
SET image = (
    CASE 
        WHEN image LIKE '{%' THEN 
            (image::json->>'url')::text
        ELSE 
            image
    END
)
WHERE image IS NOT NULL;

-- Update Teacher table to fix image URLs
UPDATE "Teacher"
SET image = (
    CASE 
        WHEN image LIKE '{%' THEN 
            (image::json->>'url')::text
        ELSE 
            image
    END
)
WHERE image IS NOT NULL; 