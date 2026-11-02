# Database Design — Blog Website CMS

## 1. Overview

The CMS will use MySQL to store and manage author authentication data and blog post information.

The initial logical database design contains two core entities:

- `AUTHOR`
- `POST`

The final physical schema will be implemented and verified during database development.

## 2. Entity: AUTHOR

The `AUTHOR` entity stores the information required to identify an author and authenticate their login.

| Column | Purpose |
|---|---|
| `author_id` | Unique identifier for an author |
| `username` | Author's login username |
| `email` | Author's email address |
| `password_hash` | Secure hash of the author's password |
| `created_at` | Date and time the author record was created |

### Primary Key

`author_id`

### Constraints

- Each author must have a unique identifier.
- The username and email should be unique.
- Passwords must be stored as secure hashes, never as plain text.

## 3. Entity: POST

The `POST` entity stores blog posts managed by an author.

| Column | Purpose |
|---|---|
| `post_id` | Unique identifier for a post |
| `author_id` | Identifies the author who owns the post |
| `title` | Title of the blog post |
| `content` | Main content of the post |
| `status` | Indicates whether the post is a draft or published |
| `created_at` | Date and time the post was created |
| `updated_at` | Date and time the post was last updated |
| `published_at` | Date and time the post was published, if applicable |

### Primary Key

`post_id`

### Foreign Key

`author_id` references `AUTHOR.author_id`.

### Constraints

- Every post must have a unique identifier.
- A post must be associated with an existing author.
- The status must use the values defined by the final schema.
- Publication timestamps should reflect the actual publication state.

## 4. Entity Relationship

One author can create multiple posts. Each post belongs to one author.

**Relationship:** `AUTHOR (1) → (N) POST`

The foreign key `POST.author_id` establishes this relationship.

## 5. Data Integrity

The database implementation should enforce primary-key and foreign-key constraints, appropriate required fields, and uniqueness where necessary.

Database queries should use parameterized statements through PHP PDO.

## 6. Security Considerations

- Store passwords using PHP's password-hashing functions.
- Verify passwords using the corresponding password-verification function.
- Use prepared statements for database queries.
- Restrict post-management operations to authenticated and authorized authors.
- Validate input on the server before inserting or updating records.

## 7. Implementation Status

**Status:** Initial logical design.

The exact data types, indexes, deletion behavior, SQL constraints, and final table definitions will be confirmed when the MySQL schema is implemented and tested.
