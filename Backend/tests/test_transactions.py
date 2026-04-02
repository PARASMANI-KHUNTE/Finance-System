def test_create_transaction_success(client, admin_headers):
    payload = {
        "amount": 150.50,
        "type": "income",
        "category": "Salary",
        "date": "2024-03-01T12:00:00Z",
        "notes": "March Salary"
    }
    response = client.post("/api/v1/transactions", json=payload, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 150.50
    assert data["type"] == "income"
    assert data["id"] is not None

def test_create_transaction_invalid_amount(client, admin_headers):
    # Amount must be strictly greater than 0
    payload = {
        "amount": -50.0,
        "type": "expense",
        "category": "Groceries"
    }
    response = client.post("/api/v1/transactions", json=payload, headers=admin_headers)
    assert response.status_code == 422 # Pydantic validation error

def test_get_transactions_paginated(client, admin_headers):
    # Create 3 transactions
    for i in range(3):
        client.post("/api/v1/transactions", json={"amount": 10, "type": "income", "category": "Gift"}, headers=admin_headers)

    res = client.get("/api/v1/transactions?page=1&limit=2", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["data"]) == 2
    assert data["total"] == 3
    assert data["page"] == 1
    assert data["limit"] == 2
