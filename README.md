# query-mappers

> A lightweight **MyBatis-inspired SQL Mapper** for TypeScript that keeps SQL readable while making it dynamic.

Query Mappers is a SQL template engine designed for developers who prefer writing SQL instead of using an ORM.

It lets you write SQL in XML templates with conditional statements, named parameters, and reusable SQL fragments while remaining completely independent of any database driver.

Unlike ORMs, Query Mappers never hides SQL. It simply builds SQL efficiently and safely.

---

# Why Query Mappers?

Every application eventually contains queries that become difficult to maintain.

For example:

- Reports
- Dashboards
- Complex joins
- Optional search conditions
- Recursive queries
- Database-specific SQL

Embedding these queries inside TypeScript code often leads to long string concatenations and complicated conditional logic.

Query Mappers moves SQL into XML templates while keeping the generated SQL predictable and easy to debug.

---

# Philosophy

Query Mappers is built around a few simple ideas.

## SQL First

Developers should own their SQL.

SQL is often clearer and more expressive than ORM abstractions.

---

## Dynamic, Not Generated

Query Mappers does **not** generate SQL from models.

Instead, it dynamically renders SQL that you have written.

---

## Lightweight

No ORM.

No entity tracking.

No decorators.

No reflection.

No code generation.

Just SQL templates.

---

## Database Independent

The same XML template can be executed on different databases simply by changing the execution adapter.

---

# Features

- XML SQL templates
- Dynamic SQL rendering
- Named parameters
- Conditional SQL
- Automatic parameter binding
- Database-independent placeholders
- SQL fragment reuse
- Lightweight architecture
- Framework independent
- Easy to extend

---

# Installation

```bash
npm install query-mappers
```

---

# Example

## XML

```xml
<select id="findUsers">

SELECT
    id,
    name,
    email
FROM users
WHERE 1 = 1

<isNotNull property="status">
    AND status = #{status}
</isNotNull>

<isNotEmpty property="keyword">
    AND name LIKE #{keyword}
</isNotEmpty>

</select>
```

Input

```ts
{
    status: "ACTIVE",
    keyword: "%john%"
}
```

Generated SQL

```sql
SELECT
    id,
    name,
    email
FROM users
WHERE 1 = 1
AND status = ?
AND name LIKE ?
```

Parameters

```ts
[
    "ACTIVE",
    "%john%"
]
```

---

# Supported Conditions

## isNull

```xml
<isNull property="deletedAt">
    AND deleted_at IS NULL
</isNull>
```

---

## isNotNull

```xml
<isNotNull property="status">
    AND status = #{status}
</isNotNull>
```

---

## isEqual

```xml
<isEqual property="type" value="ADMIN">
    AND role = 'ADMIN'
</isEqual>
```

---

## isNotEqual

```xml
<isNotEqual property="type" value="ADMIN">
    AND role <> 'ADMIN'
</isNotEqual>
```

---

## isEmpty

```xml
<isEmpty property="keyword">
ORDER BY created_at DESC
</isEmpty>
```

---

## isNotEmpty

```xml
<isNotEmpty property="keyword">
AND name LIKE #{keyword}
</isNotEmpty>
```

---

# Named Parameters

Use named parameters instead of positional parameters.

Template

```sql
WHERE id = #{id}
```

Input

```ts
{
    id: 100
}
```

Generated SQL

```sql
WHERE id = ?
```

Parameters

```ts
[
    100
]
```

---

# Dynamic SQL

Instead of writing TypeScript like this:

```ts
let sql = "SELECT * FROM users WHERE 1=1";

if (filter.status) {
    sql += " AND status=?";
}

if (filter.keyword) {
    sql += " AND name LIKE ?";
}
```

Simply write

```xml
SELECT *
FROM users
WHERE 1=1

<isNotNull property="status">
AND status=#{status}
</isNotNull>

<isNotEmpty property="keyword">
AND name LIKE #{keyword}
</isNotEmpty>
```

The library generates the final SQL automatically.

---

# Database Independence

Different databases use different parameter styles.

| Database | Placeholder |
|----------|-------------|
| MySQL | `?` |
| PostgreSQL | `$1` |
| Oracle | `:1` |
| SQL Server | `@p1` |

Query Mappers automatically generates the correct placeholder syntax.

---

# Search Helper

Query Mappers includes utilities for building search filters.

For example

Input

```ts
{
    keyword: "john"
}
```

can automatically become

```ts
{
    keyword: "%john%"
}
```

This eliminates repetitive controller and service logic.

---

# XML Helper

SQL often contains characters that conflict with XML.

For example

```sql
<
>
<=
>=
<>
```

Query Mappers automatically converts these operators into XML-safe content before parsing, allowing SQL templates to remain clean and readable.

---

# Architecture

```
          XML Template
                │
                ▼
          XML Parser
                │
                ▼
         Template Model
                │
                ▼
         SQL Renderer
                │
                ▼
 Statement (SQL + Parameters)
                │
                ▼
      Database Adapter
                │
                ▼
          SQL Database
```

Templates are parsed once and reused for every execution.

---

# Works Great with sql-core

Query Mappers is designed to complement **sql-core**.

A typical application uses:

- **sql-core** for repositories and CRUD
- **Query Mappers** for reports and complex SQL

```
                Application
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    sql-core               Query Mappers
(CRUD & Repository)      (Complex Queries)
        │                         │
        └────────────┬────────────┘
                     ▼
              Database Adapter
                     │
                     ▼
                SQL Database
```

### Use sql-core for

- CRUD
- Repository Pattern
- Search APIs
- Transactions
- Optimistic Locking
- Batch Operations

### Use Query Mappers for

- Reports
- Dashboards
- Complex joins
- Database-specific SQL
- Recursive SQL
- Window functions
- Analytical queries

Together they provide a complete SQL-first data access solution.

---

# Typical Project Structure

```
src
├── repositories
│     ├── CustomerRepository.ts
│     ├── ProductRepository.ts
│     └── OrderRepository.ts
│
├── mappers
│     ├── Reports.xml
│     ├── Dashboard.xml
│     └── Statistics.xml
│
├── services
└── controllers
```

---

# Design Goals

- SQL First
- Lightweight
- Predictable
- Database Independent
- Framework Independent
- Easy to Debug
- Easy to Extend

---

# When Should I Use Query Mappers?

Use Query Mappers when you need:

- Dynamic SQL
- Complex joins
- Reporting
- Dashboard queries
- XML SQL templates
- Database-specific features
- SQL that is easier to maintain outside TypeScript code

---

# Comparison

| Library | Purpose |
|----------|---------|
| Query Mappers | XML SQL Templates |
| MyBatis | XML SQL Templates |
| Knex | Query Builder |
| Prisma | ORM |
| TypeORM | ORM |
| sql-core | Schema-driven CRUD Framework |

---

# License

MIT