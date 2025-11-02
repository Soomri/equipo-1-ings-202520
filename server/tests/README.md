
# 🧪 How to Run the Tests

Follow these steps to install dependencies and execute all automated tests for the backend.
These tests verify the **Login (F-06)** and **Price Query (F-01)** features included in the MVP.

---

## 1️⃣ Open the project folder

Open **PowerShell** or **Command Prompt** and navigate to your local repository:

```bash
cd C:\path\to\equipo-1-ings-202520
```

---

## 2️⃣ Go into the backend folder

```bash
cd server
```

---

## 3️⃣ Install dependencies

Make sure the file `requirements.txt` exists in the project (either in the root or in `/server`),
then run:

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Run the tests

Once the dependencies are installed, simply run:

```bash
pytest -v
```

This command will automatically execute all the test files located in the `/tests` directory,
including:

* `tests/test_login.py`
* `tests/test_prices.py`

---

## ✅ Expected result

If everything is set up correctly, you should see output like this:

```
collected 10 items

tests/test_login.py::test_login_success PASSED
tests/test_login.py::test_login_invalid_password PASSED
tests/test_login.py::test_login_invalid_email_format PASSED
tests/test_login.py::test_logout_success PASSED
tests/test_login.py::test_full_auth_flow PASSED
tests/test_prices.py::test_get_latest_price_success PASSED
tests/test_prices.py::test_get_latest_price_product_not_found PASSED
tests/test_prices.py::test_get_latest_price_market_not_found PASSED
tests/test_prices.py::test_get_latest_price_inactive_market PASSED
tests/test_prices.py::test_get_options_success PASSED

====================== 10 passed, 8 warnings in 9.7s ======================
```

---

## ⚙️ Notes

* Warnings about `regex` or `datetime.utcnow()` are **safe to ignore** — they do **not** affect test results.
* No database seeding is required for now; tests work with the existing data (`Aguacate Común`).
* If more products or markets are added later, the same tests will still run successfully.

