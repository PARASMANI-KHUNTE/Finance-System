# Finance Tracking System: Testing Guide

This guide provides a structured approach and sample data to fully test the capabilities of both the Frontend UI and Backend Logic of your Editorial Finance application.

Ensure both your Backend (`uvicorn app.main:app`) and Frontend (`npm run dev`) servers are actively running. Open your browser to **http://localhost:5173**.



## 🎭 1. Testing Role-Based Access Control (RBAC)
The overarching logic relies heavily on the `X-Role` being simulated. The UI is capable of enforcing views, while the backend rigorously enforces the actual data security.

### Test Flow:
1. Locate the **Simulate Role** section at the bottom of the left sidebar.
2. Select **Admin**.
   - **Expected Result:** You should see the "Add Transaction" button on the Dashboard, and the "Edit" / "Delete" trashcans in the History table.
3. Select **Viewer**.
   - **Expected Result:** The "Add Transaction" button vanishes. If you go to the History page, action buttons turn into disabled dots. The system prevents a Viewer from accessing critical write features.

---

## 💸 2. Testing Transactions CRUD (Admin Role)
Switch back to **Admin** to test data persistence.

### Step A: Add Income
Go to the **Dashboard** and click **"Add Transaction"** (visible for Admin role). Fill in the following data:
- **Type**: Income
- **Amount**: `4500.00`
- **Category**: `Base Salary`
- **Date**: Any date in the current month
- **Description**: `Monthly Paycheck from Corp`
- **Action**: Click "Save Record".
- **Expected Result**: The Total Balance and Total Income cards instantly jump to `$4,500`.

### Step B: Add Expenses
Click **"Add Transaction"** again and log these test expenses to populate the system:

1. **Rent:** 
   - Type: Expense | Amount: `1200.00` | Category: `Housing` 
2. **Groceries:** 
   - Type: Expense | Amount: `250.00` | Category: `Food` 
3. **Subscriptions:** 
   - Type: Expense | Amount: `45.00` | Category: `Entertainment` 

- **Expected Result**: Your Dashboard should now display `$1,495` under Total Expenses. The Expense Allocation Progress chart should correctly calculate Housing as the largest bar, scaling the others proportionally.

---

## 🗄️ 3. Testing Datatable & Filtering
Navigate to the **History** tab via the sidebar.

1. **Search Test:** 
   - Enter `Base Salary` or `Corp` into the search bar.
   - **Expected Result**: Only the Income record appears.
2. **Advanced Filtering:** 
   - Clear the search. Click the funnel **Filter** icon.
   - Change "Type" to `Expense`.
   - **Expected Result**: Only your Rent, Groceries, and Subscriptions appear.
3. **Pagination & Editing:** 
   - Click the pencil **"Edit"** icon next to the Groceries record.
   - Update the amount to `300.00` and save.
   - **Expected Result**: The record updates immediately in the table. If you jump back to the Dashboard, the total balance will be reduced by `$50` to reflect the change.

---

## 📈 4. Testing Analytics & Edge Cases
Navigate to the **Analytics** tab.

1. **Bar Chart Visibility:** 
   - You should see a cluster for the current month representing the $4500 income (Green) vs the $1545 expenses (Blue). 
   - *Tip:* If you want to see the charts look incredibly dynamic, go back to the History page and Add an Expense for `Last Month` (e.g., modifying the date input field manually). The Analytics graph will instantly plot the two months side-by-side.

### Validations Safety Check
To guarantee the Pydantic backend models and frontend safeguards are working:
1. Try adding a Transaction where Amount = `-100`. 
   - **Expected Result:** The frontend throws an error (`Amount must be greater than 0`) and outright prevents submission. 
2. Try switching to **Viewer** mode and opening the History filter dropdown.
   - **Expected Result:** The filter funnel button is greyed out. Viewers cannot filter history endpoints; this is safely restricted by the backend dependency tree.
