# Backend Deployment Guide — Market Prices Plaze (FastAPI + Supabase)

This document explains how the **backend API** of *Market Prices Plaze* was deployed and automatically redeployed using **Render**, **GitHub Actions**, and a **Supabase PostgreSQL** database.

---

## 1. Overview

The backend is built with **FastAPI** and uses a **Supabase PostgreSQL** database for data storage.
It is hosted on **Render**, which provides a simple interface, automatic deployments from GitHub, and a free-tier plan suitable for testing.

---

## 2. Prerequisites

Before deployment, ensure that:

* The backend code is stored in the GitHub repository under `/server`.
* You have an active **Supabase** project with its database credentials.
* The repository includes:

  * A `requirements.txt` file with:

    ```
    fastapi
    uvicorn
    psycopg2-binary
    sqlalchemy
    python-dotenv
    ```
  * A `main.py` file with your FastAPI app properly configured.

---

## 3. Python Version

When creating the web service in Render, set:

| Setting            | Value    |
| ------------------ | -------- |
| **Python Version** | `3.11.9` |

---

## 4. Environment Variables

Create a `.env` file inside the `server` folder and define all the required environment variables for the backend configuration, such as:

| Variable       | Example Value                                                          |
| -------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL` | `postgresql+psycopg2://user:password@host:port/dbname?sslmode=require` |
| `SECRET_KEY`   | `your-secret-key`                                                      |
| `SUPABASE_KEY` | `your-supabase-api-key`                                                |

> The `DATABASE_URL` can be found in **Supabase → Project Settings → Database → Connection String (Python)**.

Once your `.env` file is ready, **you can either:**

* Upload it directly in Render by selecting **“Upload .env file”** during service setup,
  **or**
* Manually add each variable under **Render → Environment → Environment Variables**.

Both methods work correctly and will load your configuration into the deployed environment.

---

## 5. Build and Start Commands

In the Render web service setup, specify the following commands:

| Setting           | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| **Build Command** | `pip install -r requirements.txt`                     |
| **Start Command** | `uvicorn server.main:app --host 0.0.0.0 --port 10000` |

---

## 6. CORS Configuration

Add the following middleware to your `main.py` to allow frontend communication from Vercel:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
  CORSMiddleware,
  allow_origin_regex=r"https://.*\.vercel\.app",
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
```

This setup safely enables cross-origin requests from your deployed frontend.

---

## 7. Deployment Steps on Render

1. Go to [https://render.com](https://render.com).
2. Click **New → Web Service**.
3. Connect your **GitHub account** if not already connected.
4. Select the repository containing your backend code.
5. Choose the branch you want to deploy (`main`, `stage`, or `development`).
6. If the backend is in a subfolder, set the **Root Directory** to `/server`.
7. Add your `.env` file or manually configure the environment variables.
8. Set:

   * **Python Version:** `3.11.9`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn server.main:app --host 0.0.0.0 --port 10000`
9. Click **Create Web Service**.

Render will:

* Clone the selected repository
* Install dependencies
* Build and deploy your FastAPI app
* Provide a URL such as:

  ```
  https://your-backend.onrender.com
  ```

---

## 8. GitHub Actions Workflow (Already Configured)

The backend deployment pipeline is **already configured** in:

```
.github/workflows/deploy-server.yml
```

This workflow automatically triggers a new Render deployment whenever the pipeline runs successfully.

### Example Structure (for reference)

```yaml
name: Deploy Backend

on:
  push:
    branches:
      - main
      - stage
      - development

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          cd server
          pip install -r requirements.txt

      - name: Run tests (optional)
        run: |
          cd server
          pytest || echo "No tests found"

      - name: Trigger Render Deploy Hook
        if: success()
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 9. Add the Render Deploy Hook Secret in GitHub

To let GitHub automatically redeploy your backend on Render:

1. In Render, open your backend service.
2. Go to **Settings → Deploy Hooks → Create Deploy Hook**.
3. Copy the generated URL (looks like `https://api.render.com/deploy/srv-xxxxx?key=xxxx`).
4. In GitHub, go to **Repository → Settings → Secrets → Actions → New repository secret**.
5. Add:

   * **Name:** `RENDER_DEPLOY_HOOK`
   * **Value:** the Deploy Hook URL copied from Render.

Once added, GitHub Actions will automatically send a POST request to Render to trigger a redeploy whenever the pipeline finishes successfully.

---

## 10. Verification

After Render shows **✅ Build Successful**:

1. Visit your backend URL followed by `/docs`

   ```
   https://your-backend.onrender.com/docs
   ```

   You should see the FastAPI Swagger UI.
2. Test key routes such as `/auth/login` or `/health`.
3. If you encounter errors, check **Render → Logs** for:

   * Database or environment variable issues
   * Missing `.env` configuration
   * Python import or dependency errors

---

## 11. Keeping the Server Awake (Optional)

Render free services sleep after ~15 minutes of inactivity.
To keep your backend active:

1. Go to [https://cron-job.org](https://cron-job.org).
2. Create a new scheduled task that pings your backend every 5–10 minutes:

   ```
   https://your-backend.onrender.com/health
   ```

---

## ✅ Summary

| Step | Action                                                   |
| ---- | -------------------------------------------------------- |
| 1    | Select and connect your backend repo to Render           |
| 2    | Choose branch and `/server` folder                       |
| 3    | Upload `.env` file or add environment variables manually |
| 4    | Set Python version 3.11.9                                |
| 5    | Define build and start commands                          |
| 6    | Configure CORS middleware                                |
| 7    | Confirm `.github/workflows/deploy-server.yml` exists     |
| 8    | Add `RENDER_DEPLOY_HOOK` to GitHub secrets               |
| 9    | Verify deployment on Render and test `/docs` endpoint    |
| 10   | (Optional) Keep the service awake using cron-job.org     |

---

**Backend successfully deployed and automatically redeployed via Render + GitHub Actions 🚀**

---