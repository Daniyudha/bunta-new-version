-- SQL script to check for invalid JSON data in farmers table members field
-- Run this script against the SQLite database to identify corrupted records

-- Check total number of farmers
SELECT COUNT(*) as total_farmers FROM farmers;

-- Check farmers with potentially invalid JSON in members field
SELECT
    id,
    name,
    "group",
    chairman,
    members,
    CASE
        WHEN members IS NULL THEN 'NULL'
        WHEN members = '' THEN 'EMPTY_STRING'
        WHEN json_valid(members) = 0 THEN 'INVALID_JSON'
        ELSE 'VALID_JSON'
    END as json_status,
    CASE
        WHEN json_valid(members) = 1 THEN json_type(members)
        ELSE 'N/A'
    END as json_type,
    createdAt,
    updatedAt
FROM farmers
ORDER BY json_status, createdAt DESC;

-- Count by JSON status
SELECT
    CASE
        WHEN members IS NULL THEN 'NULL'
        WHEN members = '' THEN 'EMPTY_STRING'
        WHEN json_valid(members) = 0 THEN 'INVALID_JSON'
        ELSE 'VALID_JSON'
    END as json_status,
    COUNT(*) as count
FROM farmers
GROUP BY json_status;

-- Show detailed info for invalid JSON records
SELECT
    id,
    name,
    "group",
    chairman,
    members,
    createdAt,
    updatedAt
FROM farmers
WHERE members IS NOT NULL
  AND members != ''
  AND json_valid(members) = 0;