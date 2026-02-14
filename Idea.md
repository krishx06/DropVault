# DropVault — Project Idea & Design Rationale

---

## 1. Motivation Behind the Project

Most academic e-commerce projects focus on frontend implementation and basic CRUD operations. While these projects demonstrate UI skills, they fail to capture the **engineering challenges faced by real-world platforms**, especially in domains where inventory is limited and demand is high.

Sneaker and streetwear commerce provides a strong real-world example where:
- Products are released in limited quantities
- Demand peaks within short time windows
- Inventory scarcity is intentional
- System reliability is critical during traffic spikes

DropVault is designed to move beyond a generic “online store” and instead model **how such platforms actually operate**.

---

## 2. Core Idea

DropVault is a **drop-first e-commerce platform**.

Instead of assuming:
- unlimited inventory
- always-available products
- static product listings

the platform is built around the concept of **time-bound product drops**, where availability is controlled by system state and timing rather than simple stock counters.

The idea is to treat drops as **first-class system entities**, not just attributes of a product.

---

## 3. What Makes DropVault Different

### 3.1 Drop-Centric Design

In DropVault:
- Products are not always purchasable
- Availability depends on drop state (upcoming, live, ended)
- Time becomes a core part of the business logic

This introduces real-world concerns such as:
- scheduling
- state transitions
- consistency across users

---

### 3.2 Role-Based System Thinking

DropVault is designed as a **multi-actor system**, not a single-user application.

Each role exists for a reason:
- Customers consume drops
- Sellers create and manage drops
- Administrators control platform quality and access

This separation allows the system to model:
- approvals
- moderation
- governance
- operational workflows

---

### 3.3 Backend-First Philosophy

The project intentionally prioritizes:
- data modeling
- API design
- state management
- system correctness

over UI complexity.

This reflects how production systems are typically built, where frontend is a consumer of well-defined backend contracts rather than the driver of architecture.

---

## 4. Design Principles

The following principles guide the project:

- **State over Screens**  
  System state (drop lifecycle) matters more than UI views.

- **Explicit Roles and Permissions**  
  Every action in the system is tied to a role with clear boundaries.

- **No Hidden Magic**  
  All behaviors are driven by explicit logic, not assumptions.

- **Extendability**  
  The initial system is intentionally simple but designed to be extended with features such as cart reservation, moderation, and analytics.

---

## 5. Initial Scope & Key Features (v1)

The first version of DropVault focuses on delivering a **fully functional, end-to-end drop-based e-commerce workflow** while keeping the scope realistic and implementation-focused.

### 5.1 Core Functional Scope

The v1 implementation of DropVault will include:

#### Customer Features
- View all products (active, upcoming, archived)
- Browse upcoming and live drops
- View drop countdown timers
- Purchase products during live drops
- View order history and order status
- Submit product reviews after purchase

#### Seller Features
- Seller registration and approval flow
- Create product listings (draft state)
- Schedule drops with start/end time and stock quantity
- Monitor drop status and remaining inventory
- View orders generated from drops

#### Admin Features
- Approve or reject seller onboarding requests
- Moderate product listings
- Moderate user reviews
- Manage user access and roles
- View platform activity logs

---

### 5.2 System-Level Capabilities

- Drop lifecycle management (Upcoming → Live → Ended)
- Role-based access control (Customer, Seller, Admin)
- Transactional stock deduction to prevent overselling
- Real-time drop status and stock updates via WebSockets
- Time-driven system behavior (scheduled drop activation)

---

### 5.3 Explicit Non-Goals (v1)

The following features are intentionally **out of scope for the first version** and may be considered future enhancements:

- Payment gateway integration
- Advanced inventory reservation and queuing
- AI-based recommendations or dynamic pricing
- Logistics and shipping integrations

These decisions help maintain focus on **system correctness and architecture** rather than feature volume.


---

## 6. Why Sneaker and Streetwear Commerce

Sneaker and streetwear drops provide:
- Clear scarcity-driven mechanics
- Real examples of system stress
- Well-understood user behavior patterns
- Strong alignment with drop-based workflows

This domain makes it easier to justify design decisions and explain system behavior during reviews and interviews.

---

## 7. Expected Engineering Takeaways

By building DropVault, the project aims to demonstrate understanding of:
- backend architecture and layering
- role-based access control
- time-driven system behavior
- real-time update mechanisms
- cloud deployment fundamentals
- DevOps workflows

The emphasis is on **how systems are designed**, not just whether features exist.

---

## 8. Summary

DropVault is designed as a **learning-driven, system-focused project** that mirrors real-world commerce challenges.

It is not intended to be a feature-complete marketplace, but rather a **strong foundation** that showcases:
- engineering judgment
- architectural clarity
- production-oriented thinking
