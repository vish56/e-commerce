# ARCHITECTURE – ECOMMERCE SYSTEM

## Authentication Flow
React Login → Redux Action → Axios → /api/users/login/
→ JWT issued → Stored in localStorage
→ Axios attaches Bearer token

## Order Creation Flow
Cart → PlaceOrderScreen
→ createOrder()
→ /api/orders/add/
→ Order + OrderItems + ShippingAddress saved

## Admin Order List Flow
AdminOrderScreen
→ listOrders()
→ /api/orders/
→ IsAdminUser permission
→ Returns nested OrderSerializer

## Database Relationships
User → Order (FK)
Order → OrderItem (related_name=orderItems)
Order → ShippingAddress (OneToOne)

"""
Architecture Insight: Data Integrity vs Logic Failure

Key Realization:
Not every UI issue is a code bug.
Sometimes it is corrupted or incomplete data.

Layer Validation Process Used:
1. Frontend rendering check
2. Serializer structure validation
3. Database query verification
4. Fresh data test

Important Concept:
Relational consistency must be verified at database level.

Upgrade in Thinking:
Shifted from reactive debugging
to systematic layered debugging.
"""
Architecture Upgrade: Data Integrity Enforcement

Previously:
Database allowed null and negative values.

Now:
Validators prevent negative pricing and stock.
Defaults ensure no null critical monetary values.
Ordering defined at model level.

Insight:
Strong backend systems enforce constraints at model layer,
not only at view layer.
Schema Enforcement Strategy:

Not all structural tightening should be applied immediately.
Database constraints must align with migration planning.

Chosen Approach:
Preserve relational integrity through logic layer,
delay strict DB enforcement to controlled migration phase.
Architecture Upgrade: Transaction Safety & Validation Separation

Applied atomic transactions for order creation.
Used select_for_update to prevent race conditions.
Distinguished client errors (400) from server errors (500).
Applied get_object_or_404 for safer object access.

Principle:
Money-related operations must be atomic and safe.

Authentication Flow Improvement:

Login optimized to avoid double DB hit.
Email normalization enforced.
Registration wrapped in transaction.
Error classification separated (400 vs 401 vs 500).

Principle:
Authentication endpoints must not leak internal errors.

Architecture Enhancement: Review & Rating Integrity

Ensured atomic update of:
- Review creation
- Product rating recalculation
- numReviews update

Applied Decimal precision control to avoid float drift.

Principle:
Aggregate fields must be transaction-safe.

"""
ARCHITECTURE LEARNING – 13 Feb 2026

1. Full Stack Debugging Flow Practiced

Frontend Error (500)
→ Checked Network tab
→ Verified backend endpoint manually
→ Compared expected vs actual query params
→ Identified int('') backend crash
→ Corrected Redux default parameter

Lesson:
Small type mismatches across layers cause system-wide failure.

---

2. Redux Integration Pattern for New Feature

Feature: Top Rated Products Carousel

Steps:
- Define constants
- Create action (async thunk)
- Create reducer
- Register reducer in store
- Connect component via useSelector + dispatch
- Render UI

Principle:
Every new feature must follow Redux flow symmetry.

---

3. Proxy Configuration Principle

Frontend dev server (3000)
Backend server (8000)

Without proxy:
Requests hit wrong origin → 404

Rule:
Always define proxy during local development.

---

4. Defensive Backend Design Lesson

Backend should not trust query params blindly.

Current backend:
int(request.query_params.get('page'))

Improvement idea:
Use try/except around int conversion to avoid 500.

Production systems must guard all external input.
"""
