# Sequence Diagram — DropVault

## Main Flow: End-to-End Drop Purchase (Seller Creates Drop → Customer Purchases → Order Confirmation)

This sequence diagram illustrates the complete lifecycle of a **drop-based purchase** on the DropVault platform — from a seller scheduling a product drop, to a customer purchasing during a live drop, through to order confirmation and notifications.

---

```mermaid
sequenceDiagram
    actor S as Seller
    actor C as Customer
    participant FE as Frontend (React)
    participant API as API Gateway
    participant Auth as Auth Service
    participant SS as Seller Service
    participant PS as Product Service
    participant DS as Drop Service
    participant OS as Order Service
    participant NS as Notification Service
    participant DB as MySQL
    participant Cache as Redis
    participant WSocket as WebSocket Server

    Note over S, WSocket: Phase 1 — Seller Creates Product and Schedules Drop

    S ->> FE: Create Product
    FE ->> API: POST /api/products
    API ->> Auth: Validate JWT
    Auth -->> API: Token valid (role: SELLER)
    API ->> PS: createProduct(productDto)
    PS ->> DB: INSERT INTO products (status=DRAFT)
    DB -->> PS: Product created (productId)
    PS -->> API: Product created
    API -->> FE: 201 Created
    FE -->> S: Product saved as draft

    S ->> FE: Schedule Drop
    FE ->> API: POST /api/drops
    API ->> Auth: Validate JWT
    Auth -->> API: Token valid (role: SELLER)
    API ->> DS: scheduleDrop(dropDto)
    DS ->> DB: INSERT INTO drops (status=UPCOMING)
    DB -->> DS: Drop scheduled
    DS ->> Cache: Cache upcoming drop
    DS ->> WSocket: Broadcast upcoming drop
    DS -->> API: Drop scheduled
    API -->> FE: 201 Created
    FE -->> S: Drop scheduled successfully

    Note over C, WSocket: Phase 2 — Customer Browses Upcoming Drops

    C ->> FE: View Drops
    FE ->> API: GET /api/drops/upcoming
    API ->> DB: SELECT upcoming drops
    DB -->> API: Drop list
    API -->> FE: Drop data
    FE -->> C: Display upcoming drops

    Note over DS, WSocket: Phase 3 — Drop Goes Live (System Trigger)

    DS ->> DS: Check drop start time
    DS ->> DB: UPDATE drop status = LIVE
    DS ->> Cache: Update drop cache
    DS ->> WSocket: Broadcast drop live event
    WSocket -->> FE: Drop status update
    FE -->> C: "Drop is now live"

    Note over C, WSocket: Phase 4 — Customer Places Order During Live Drop

    C ->> FE: Add to cart & confirm purchase
    FE ->> API: POST /api/orders
    API ->> Auth: Validate JWT
    Auth -->> API: Token valid (role: CUSTOMER)
    API ->> OS: createOrder(orderDto)
    OS ->> OS: Validate drop status (must be LIVE)
    OS ->> Cache: Check remaining stock
    Cache -->> OS: Stock available
    OS ->> DB: BEGIN TRANSACTION
    OS ->> DB: INSERT INTO orders (status=PENDING)
    OS ->> DB: UPDATE drops SET remaining_stock = remaining_stock - qty
    DB -->> OS: Order created
    OS ->> DB: COMMIT TRANSACTION
    OS -->> API: Order confirmed
    API -->> FE: 201 Created
    FE -->> C: "Order placed successfully"

    OS ->> WSocket: Broadcast stock update
    WSocket -->> FE: Live stock refresh

    Note over OS, WSocket: Phase 5 — Drop Completion

    DS ->> DS: Check drop end time or stock exhausted
    DS ->> DB: UPDATE drop status = ENDED
    DS ->> WSocket: Broadcast drop ended event
    WSocket -->> FE: Drop ended
    FE -->> C: "Drop has ended"

    Note over OS, WSocket: Phase 6 — Notifications

    OS ->> NS: notifyOrderConfirmation(orderId)
    NS ->> DB: INSERT notification (customer)
    NS ->> WSocket: Emit notification
    WSocket -->> FE: Order confirmation notification
    FE -->> C: "Your order is confirmed"

    DS ->> NS: notifyDropSummary(dropId)
    NS ->> DB: INSERT notification (seller)
    NS ->> WSocket: Emit notification
    WSocket -->> FE: Seller notification
    FE -->> S: "Drop completed. View summary."
```
---
## Flow Summary
| Phase                          | Description                                                                             | Key Patterns Used   |
| ------------------------------ | --------------------------------------------------------------------------------------- | ------------------- |
| **1. Product & Drop Creation** | Seller creates product and schedules a drop after authentication and role validation.   | RBAC, Service Layer |
| **2. Drop Discovery**          | Customers browse upcoming drops retrieved from cache and database.                      | Cache-Aside Pattern |
| **3. Drop Activation**         | System automatically activates drop at scheduled time and broadcasts updates.           | Scheduler, Observer |
| **4. Live Purchase**           | Customer places order during live drop with stock validation and transactional updates. | Transaction Script  |
| **5. Drop Completion**         | Drop ends due to time expiry or stock exhaustion.                                       | State Pattern       |
| **6. Notifications**           | Customers and sellers receive real-time notifications and updates.                      | Observer Pattern    |
