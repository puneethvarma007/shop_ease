# Excel Templates for Bulk Uploads

Use these formats to prepare your data correctly. All IDs must be UUIDs from your database. Do not use names like "kids" for section/category IDs.

## Offers Template (columns and meaning)
- title (text, required)
- description (text)
- original_price (number)
- offer_price (number)
- discount_percentage (integer)
- image_url (text)
- store_id (UUID, required)
- section_id (UUID or empty). Leave empty or use "main" to map as store-wide
- category_id (UUID)
- valid_from (YYYY-MM-DD)
- valid_until (YYYY-MM-DD)
- is_active (true/false)

CSV header example:
"title","description","original_price","offer_price","discount_percentage","image_url","store_id","section_id","category_id","valid_from","valid_until","is_active"


## Sales Template (columns and meaning)
- store_id (UUID, required)
- sale_date (YYYY-MM-DD, required)
- total_amount (number, required)
- customer_count (integer)
- items_sold (integer)

CSV header example:
"store_id","sale_date","total_amount","customer_count","items_sold"


## Notes
- UUIDs are 36-char strings like: 3f50beda-cd35-4d52-9416-513450bc52a6
- In the offers template, if you put section_id as "main" it will be treated as store-wide (null in DB)
- Dates can be Excel dates or ISO strings; backend normalizes to YYYY-MM-DD
- Extra columns are ignored

