\echo 'Delete and recreate whattoeat db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE whattoeat;
CREATE DATABASE whattoeat;
\connect whattoeat

\i whattoeat-schema.sql
\i whattoeat-seed.sql


\echo 'Delete and recreate whattoeat_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE whattoeat_test;
CREATE DATABASE whattoeat_test;
\connect whattoeat_test

\i whattoeat-schema.sql