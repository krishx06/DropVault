# ER Diagram — DropVault

## Overview

This Entity-Relationship diagram represents the database schema for **DropVault**, a drop-based e-commerce platform designed for sneaker and streetwear releases.  
All entities, attributes, data types, and relationships are defined to model real-world marketplace workflows such as role-based access control, seller onboarding, drop scheduling, and real-time commerce behavior.

---

```mermaid
erDiagram

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar username
        enum role "ADMIN | SELLER | CUSTOMER"
        boolean is_active
        boolean is_verified
        timestamp created_at
        timestamp updated_at
    }

    SELLER_PROFILES {
        uuid id PK
        uuid user_id FK, UK
        varchar brand_name
        text description
        enum status "PENDING | APPROVED | REJECTED"
        timestamp created_at
        timestamp reviewed_at
    }

    PRODUCTS {
        uuid id PK
        uuid seller_id FK
        varchar name
        text description
        decimal price
        enum status "DRAFT | UPCOMING | LIVE | SOLD_OUT | ARCHIVED"
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        varchar image_url
        boolean is_primary
        timestamp created_at
    }

    DROPS {
        uuid id PK
        uuid product_id FK
        timestamp start_time
        timestamp end_time
        enum status "UPCOMING | LIVE | ENDED"
        integer total_stock
        integer remaining_stock
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        enum status "PENDING | CONFIRMED | CANCELLED"
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal price_at_purchase
    }

    REVIEWS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        integer rating
        text comment
        enum status "VISIBLE | HIDDEN | REMOVED"
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type "DROP_LIVE | DROP_ENDING | ORDER_UPDATE | SYSTEM"
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        json details
        timestamp created_at
    }

    %% ===== RELATIONSHIPS =====

    USERS ||--o| SELLER_PROFILES : "has"
    USERS ||--o{ PRODUCTS : "creates"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"

    SELLER_PROFILES ||--o{ PRODUCTS : "owns"

    PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
    PRODUCTS ||--|| DROPS : "launched via"
    PRODUCTS ||--o{ ORDER_ITEMS : "included in"
    PRODUCTS ||--o{ REVIEWS : "receives"

    DROPS ||--o{ ORDERS : "results in"

    ORDERS ||--o{ ORDER_ITEMS : "contains"

    USERS ||--o{ REVIEWS : "submits"

```
---

## Table Summary
| Table             | Description                                  | Key Relationships                  |
| ----------------- | -------------------------------------------- | ---------------------------------- |
| `USERS`           | All platform users (admin, seller, customer) | → Seller Profile, Products, Orders |
| `SELLER_PROFILES` | Seller onboarding and approval details       | ← User (1:1), → Products           |
| `PRODUCTS`        | Items listed for drops                       | ← Seller, → Drop, Images           |
| `PRODUCT_IMAGES`  | Images associated with products              | ← Product                          |
| `DROPS`           | Time-bound product release window            | ← Product                          |
| `ORDERS`          | Customer purchase records                    | ← User, → Order Items              |
| `ORDER_ITEMS`     | Junction table for products within orders    | ← Order, Product                   |
| `REVIEWS`         | Customer feedback on products                | ← User, Product                    |
| `NOTIFICATIONS`   | System and user-triggered notifications      | ← User                             |
| `AUDIT_LOGS`      | Action logs for system transparency          | ← User                             |

---
## Key Indexes
| Table             | Index                      | Purpose                         |
| ----------------- | -------------------------- | ------------------------------- |
| `USERS`           | `(email)`                  | Fast authentication lookup      |
| `SELLER_PROFILES` | `(status)`                 | Pending seller approval queries |
| `PRODUCTS`        | `(seller_id, status)`      | Seller product management       |
| `DROPS`           | `(status, start_time)`     | Fetch upcoming and live drops   |
| `ORDERS`          | `(user_id, status)`        | User order history              |
| `ORDER_ITEMS`     | `(order_id)`               | Order composition lookup        |
| `REVIEWS`         | `(product_id, status)`     | Moderated review display        |
| `NOTIFICATIONS`   | `(user_id, is_read)`       | Unread notifications            |
| `AUDIT_LOGS`      | `(entity_type, entity_id)` | Entity audit trail              |
