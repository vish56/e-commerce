# BUG LOG – ECOMMERCE

## [Date]

### Issue:
Admin orders returning 404

### Root Cause:
Missing path('', views.getOrders) in orders/urls.py

### Fix:
Added endpoint + IsAdminUser

---

## [Date]

### Issue:
Order list showing _id undefined

### Root Cause:
Mongo-based frontend code used; Django uses id

### Fix:
Replaced _id with id

---

## [Date]

### Issue:
User name/email not appearing in order detail

### Root Cause:
OrderSerializer not nesting UserSerializer

### Fix:
Added nested UserSerializer in OrderSerializer
"""
Bug Investigation: Missing Order Items in Some Orders

Observation:
Some orders displayed without orderItems in admin/order detail view.

Investigation:
Checked database directly using Django shell.
Confirmed missing OrderItem records for older orders.

Root Cause:
Historical test data created before order item creation logic stabilized.

Resolution:
Verified new orders create OrderItem records properly.
Planned cleanup of corrupted test data.

Lesson:
Always verify data at database level before assuming logic failure.
"""
Database Cleanup Log:

Removed corrupted historical orders that had no related OrderItem entries.

Deleted Orders:
IDs 42–53

Verification:
Confirmed new orders correctly create OrderItem records.
System integrity restored.

Lesson:
Data corruption can mimic logic bugs.
Always verify relational consistency before modifying code.
Preventive Improvement:

Hardened models to avoid future data inconsistency.
Added value validators to avoid negative stock and price.
Improved string representations for safer logging.

No active bug fixed — preventive structural strengthening.

Migration Prompt Loop Observed.

Cause:
Attempted to remove null=True from ForeignKey fields with existing DB rows.

Resolution:
Reverted FK fields to allow null for now.
Maintained model validation improvements.
Preventive Improvements:
Removed unsafe .get() usage.
Improved error response classification.
Removed debug prints from auth logging.
Enhanced stock validation messaging.

Preventive Hardening:
Removed raw exception exposure in registration.
Improved login validation.
Added duplicate user prevention.

Preventive Hardening:
Eliminated potential float precision errors in rating.
Protected pagination from empty-page crash.
Standardized object fetching via get_object_or_404.
"""
BUG LOG – 13 Feb 2026

BUG 1:
Homepage showing 404 for products.

CAUSE:
Missing proxy in frontend package.json.

FIX:
Added:
"proxy": "http://127.0.0.1:8000"

---

BUG 2:
Redux import error – listTopProducts not exported.

CAUSE:
Action missing in productActions.js.

FIX:
Implemented full Redux flow for top products.

---

BUG 3:
ESLint error – Import in body of module.

CAUSE:
Improper import placement.

FIX:
Moved all imports to top of file.

---

BUG 4:
Homepage 500 error.

CAUSE:
pageNumber defaulted to empty string.
Backend failed on int('') conversion.

FIX:
Changed default pageNumber = 1.

---

LESSON:
Most production bugs are integration bugs,
not logic bugs.
"""
"""
GIT STRUCTURE ISSUE

Problem:
git add . from backend folder did not stage frontend changes.

Cause:
Working inside subdirectory, not repository root.

Fix:
Moved to root directory and staged properly.

Lesson:
Always confirm repository root before major commit.
"""
# BUGS LOG

---

## 🐛 Cart Persisted After Logout

Issue:
Cart items remained visible after logout.

Cause:
localStorage was not cleared fully.
Redux state reset without storage sync.

Fix:
- Introduced CART_RESET
- Cleared cartItems, shippingAddress, paymentMethod
- Synced Redux + localStorage

Status: Resolved

---

## 🐛 Remove Button Invisible

Issue:
Trash icon not visible in cart.

Cause:
Font Awesome CDN not loaded.

Fix:
- Replaced with react-icons
- Installed react-icons package

Status: Resolved

---

## 🐛 Redux State Mismatch

Issue:
State and localStorage out of sync.

Fix:
Ensured all cart actions update localStorage.

Status: Resolved

---

## 🐛 Peer Dependency Conflict (react-icons install)

Issue:
ERESOLVE conflict between redux versions.

Fix:
Installed with --legacy-peer-deps.

Status: Resolved