SELECT author, title, subtitle, description, document, documentwithid, documentWithWeights FROM books LIMIT 100;

SELECT author, title, subtitle, description FROM books WHERE to_tsvector(title) @@ to_tsquery('emperor');

SELECT author, title, subtitle, description 
FROM books 
WHERE to_tsvector(title || ' ' || description) @@ to_tsquery('emperor');

-- EXPLAIN ANALYSE
SELECT author, title, subtitle, description 
FROM books 
WHERE to_tsvector(title || ' ' || subtitle ||  ' ' || description) @@ to_tsquery('sapiente');

-- Add new document column with ts vector.
ALTER TABLE books ADD COLUMN document tsvector;
UPDATE books set document = to_tsvector(title || ' ' || subtitle ||  ' ' || description);

-- EXPLAIN ANALYSE 
SELECT author, title, subtitle, description 
FROM books 
WHERE document @@ to_tsquery('emperor');

-- Add new document column with ts vector and add gin index to it.
ALTER TABLE books ADD COLUMN documentWithId tsvector;
UPDATE books set documentWithId = to_tsvector(title || ' ' || subtitle ||  ' ' || COALESCE(description, ''));
CREATE INDEX documenIdx ON books USING GIN (documentWithId);


-- EXPLAIN ANALYSE 
SELECT author, title, subtitle, description 
FROM books 
WHERE documentWithId @@ to_tsquery('emperor');


-- With ranking
SELECT author, title, subtitle, description 
FROM books 
WHERE documentWithId @@ plainto_tsquery('meditation')
ORDER BY ts_rank_cd(documentwithid, plainto_tsquery('meditation'));

-- With ranking weights
ALTER TABLE books
ADD COLUMN documentWithWeights tsvector;

UPDATE books SET documentWithWeights =
    setweight(to_tsvector(coalesce(title,'')), 'A') ||
    setweight(to_tsvector(coalesce(subtitle,'')), 'B') ||
    setweight(to_tsvector(coalesce(description,'')), 'C');

CREATE INDEX documenIdx ON books USING GIN (documentWithWeights);

-- EXPLAIN ANALYSE 
SELECT id, title, subtitle, description, ts_rank(documentWithWeights, plainto_tsquery('emperor:*'))
FROM books 
WHERE documentWithWeights @@ to_tsquery('emperor:*')
ORDER BY ts_rank(documentWithWeights, plainto_tsquery('emperor:*')) DESC;

-- With trigger to update weights.

CREATE FUNCTION books_tsvector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.documentWithWeights :=
    setweight(to_tsvector('english', coalesce(NEW.title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.subtitle,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description,'')), 'C');
  RETURN NEW;
END
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON books FOR EACH ROW EXECUTE PROCEDURE books_tsvector_trigger()
;
SELECT title FROM books WHERE id = '07c465c9-ed5b-4d22-a6fb-22aa503ab28b';
-- The emperor handbook

UPDATE books SET title = 'The book handbook' WHERE id = '07c465c9-ed5b-4d22-a6fb-22aa503ab28b';


-- Auto generated column.
ALTER TABLE books
ADD COLUMN documentWithWeightsAutoGenerated tsvector GENERATED ALWAYS 
AS (
  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
  setweight(to_tsvector('english', coalesce(subtitle,'')), 'B') ||
  setweight(to_tsvector('english', coalesce(description,'')), 'C')
) STORED;

EXPLAIN ANALYSE
SELECT id, title, subtitle, description, ts_rank(documentWithWeightsAutoGenerated, plainto_tsquery('emperor:*'))
FROM books 
WHERE documentWithWeightsAutoGenerated @@ to_tsquery('emperor:*')
ORDER BY ts_rank(documentWithWeightsAutoGenerated, plainto_tsquery('emperor:*')) DESC;

select *
from pg_indexes
where tablename = 'books';

CREATE INDEX document_with_weights_auto_generated_index ON books USING GIN (documentWithWeightsAutoGenerated);