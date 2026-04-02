def test_viewer_cannot_post(client, viewer_headers):
    payload = {"amount": 50, "type": "income", "category": "Gift"}
    res = client.post("/api/v1/transactions", json=payload, headers=viewer_headers)
    assert res.status_code == 403

def test_analyst_cannot_post(client, analyst_headers):
    payload = {"amount": 50, "type": "income", "category": "Gift"}
    res = client.post("/api/v1/transactions", json=payload, headers=analyst_headers)
    assert res.status_code == 403

def test_viewer_can_get_summary(client, viewer_headers):
    res = client.get("/api/v1/summary", headers=viewer_headers)
    assert res.status_code == 200

def test_viewer_cannot_filter_transactions(client, viewer_headers, admin_headers):
    # Add a mock transaction first
    client.post("/api/v1/transactions", json={"amount": 100, "type": "income", "category": "Test"}, headers=admin_headers)

    # plain GET is allowed
    res_plain = client.get("/api/v1/transactions", headers=viewer_headers)
    assert res_plain.status_code == 200

    # With filter params should be blocked
    res_filtered = client.get("/api/v1/transactions?type=income", headers=viewer_headers)
    assert res_filtered.status_code == 403
    assert res_filtered.json()["detail"] == "Viewers are not allowed to use filters"

    # Pagination params only are allowed
    res_paginated = client.get("/api/v1/transactions?page=1&limit=5", headers=viewer_headers)
    assert res_paginated.status_code == 200
