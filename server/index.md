# 🧪 Testing

This section documents the **Smoke Test** for the backend module.
It identifies the five most critical API flows that must be validated after each deployment to ensure the system remains functional and stable.

---

## 🚀 Smoke Test – Critical Flows

| ID       | Flow Tested                        | Why It’s Critical                                                                                                                               | How to Run                                  | Type of Test                           | Implemented   |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------- | ------------- |
| **F-06** | **User Login**                     | Ensures that users can authenticate and receive a valid token. Without working authentication, no user can access the system’s protected areas. | `pytest -k "test_login_success"`            | **Integration**                        | ✅ Implemented |
| **F-01** | **Price Consultation**             | Core functionality of the system. Verifies that users can request current product prices by location and market.                                | `pytest -k "test_get_latest_price_success"` | **Integration**                        | ✅ Implemented |
| **F-05** | **User Registration**              | Critical for onboarding new users and allowing them to later log in. Must validate correct data handling and error messages.                    | *Not implemented in this MVP*               | **Planned Integration**                | ❌             |
| **F-03** | **Price Prediction API**           | Essential for future analytics and forecasting. Ensures that predictive models respond correctly when deployed.                                 | *Not implemented in this MVP*               | **Planned Integration / API Contract** | ❌             |
| **F-24** | **Market Activation/Deactivation** | Important for data integrity — ensures only active markets appear in user queries.                                                              | *Not implemented in this MVP*               | **Planned Integration**                | ❌             |

---

## ⚙️ How to Run Implemented Tests

To validate the smoke test flows implemented in this MVP:

1️⃣ **Go to the project folder**

```bash
cd C:\path\to\equipo-1-ings-202520\server
```

2️⃣ **Install dependencies**

```bash
pip install -r requirements.txt
```

3️⃣ **Run all backend tests**

```bash
pytest -v
```

This executes the existing smoke test files:

* `tests/test_login.py`
* `tests/test_prices.py`

---

## 🧾 Example Output

```bash
collected 12 items

test_login.py::test_login_success PASSED
test_login.py::test_login_invalid_password PASSED
test_login.py::test_login_invalid_email_format PASSED
test_login.py::test_logout_success PASSED
test_login.py::test_full_auth_flow PASSED
test_prices.py::test_get_options_success PASSED
test_prices.py::test_get_latest_price_success[Aguacate Común] PASSED
test_prices.py::test_get_latest_price_success[Papa Capira] PASSED
test_prices.py::test_get_latest_price_success[Tomate Chonto Regional] PASSED
test_prices.py::test_get_latest_price_product_not_found PASSED
test_prices.py::test_get_latest_price_market_not_found PASSED
test_prices.py::test_get_latest_price_random_product PASSED

===================================================== 12 passed, 8 warnings in 13.47s ======================================================
```

---

## 💡 Notes

* The smoke test currently includes **two implemented flows** (Login and Price Consultation).
* The remaining three (Registration, Prediction, Market Management) are **documented** but **not implemented** in this MVP.
* Tests use **FastAPI’s TestClient** to simulate full API requests and validate integration behavior.
* Warnings related to `regex` or `datetime.utcnow()` are safe to ignore.
* The smoke test should be run after every deployment to confirm that the system’s key features remain operational.



