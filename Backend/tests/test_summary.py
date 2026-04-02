def test_empty_db_summary(client, admin_headers):
    # Empty DB -> return zeros, not errors
    res = client.get("/api/v1/summary", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_income"] == 0.0
    assert data["total_expense"] == 0.0
    assert data["balance"] == 0.0
    assert data["category_breakdown"] == []
    assert data["monthly_totals"] == []
    assert data["recent_transactions"] == []

def test_summary_calculation(client, admin_headers):
    client.post("/api/v1/transactions", json={"amount": 1000, "type": "income", "category": "Salary", "date": "2024-03-01T10:00:00Z"}, headers=admin_headers)
    client.post("/api/v1/transactions", json={"amount": 200, "type": "expense", "category": "Food", "date": "2024-03-02T10:00:00Z"}, headers=admin_headers)
    client.post("/api/v1/transactions", json={"amount": 50, "type": "expense", "category": "Food", "date": "2024-03-05T10:00:00Z"}, headers=admin_headers)
    
    res = client.get("/api/v1/summary", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    
    assert data["total_income"] == 1000.0
    assert data["total_expense"] == 250.0
    assert data["balance"] == 750.0
    
    cat_bd = {c["category"]: c["total"] for c in data["category_breakdown"]}
    assert cat_bd["Food"] == 250.0
    
    assert len(data["monthly_totals"]) == 1
    assert data["monthly_totals"][0]["month"] == "2024-03"
    assert data["monthly_totals"][0]["income"] == 1000.0
    assert data["monthly_totals"][0]["expense"] == 250.0
