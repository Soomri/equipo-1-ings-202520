
# Frontend Deployment Guide — Market Prices Plaze (React + Vite)

This document explains how the **frontend** of *Market Prices Plaze* was deployed to **Vercel** and automatically integrated with **GitHub Actions**, following the setup process from the official deployment instructions.

---

## 1. Overview

The frontend was built with **React (Vite)** and deployed to **Vercel**, linked directly to the project’s GitHub repository.
The deployment runs automatically through a **GitHub Actions pipeline** whenever new commits are pushed to the selected branch.

---

## 2. Connect GitHub Repository to Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **Add New Project → Import Git Repository.**
3. Select your GitHub account and the repository containing the frontend.
4. Choose the branch you want to deploy (for example, `development` or `main`).
5. IThe frontend is inside the folder  `/client`, set it as the **Root Directory**.
6. Click **Deploy** to finish linking the project to Vercel.

Once the connection is established, any push to the chosen branch will trigger a new deployment.

---

## 3. Create and Upload the `.env` File

Before deploying, the frontend must know where the backend API is hosted.

1. Create a .env file inside the client folder and define all the required environment variables for the frontend.
2. Add the following line (replace the URL with your own backend Render URL):

   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```
3. You can temporarily commit this file if needed for setup,
   or skip committing it and define the variable directly in Vercel (recommended).

---

## 4. Configure Environment Variable in Vercel

Instead of uploading the `.env` file, you can add the variable manually:

1. Go to your project in Vercel → **Settings → Environment Variables.**
2. Click **Add New Variable** and set:

| Variable Name | Example Value                                                                    |
| ------------- | -------------------------------------------------------------------------------- |
| VITE_API_URL  | [https://your-backend-name.onrender.com](https://your-backend-name.onrender.com) |

3. Enable it for both:

   * ✅ Production
   * ✅ Preview
4. Save changes and redeploy.

---

## 5. Obtain Vercel Credentials

To allow GitHub to deploy automatically, you’ll need three credentials from your Vercel account:

| Credential            | Description                            | Location                              |
| --------------------- | -------------------------------------- | ------------------------------------- |
| **VERCEL_TOKEN**      | Personal token used for authentication | Vercel → Account Settings → Tokens    |
| **VERCEL_ORG_ID**     | Organization ID                        | Vercel → Project → Settings → General |
| **VERCEL_PROJECT_ID** | Project ID                             | Vercel → Project → Settings → General |

---

## 6. Add GitHub Secrets

In your GitHub repository:

1. Navigate to **Settings → Secrets → Actions → New repository secret**.
2. Create the following three secrets using the values obtained from Vercel:

| Secret Name       | Description                   |
| ----------------- | ----------------------------- |
| VERCEL_TOKEN      | Personal authentication token |
| VERCEL_ORG_ID     | Organization ID               |
| VERCEL_PROJECT_ID | Project ID                    |

These secrets are required for the deployment workflow to authenticate with Vercel.

---

## 7. Disable Deployment Protection in Vercel

To make your deployed app publicly accessible:

1. Go to **Vercel → Project → Settings → Deployment Protection.**
2. Turn off any password or authentication requirements.

This ensures that anyone can access the deployed app without logging in.

---

## 8. GitHub Actions Workflow (Already Configured)

The deployment workflow is **already included** in the repository at:

```
.github/workflows/deploy-client.yml
```

This pipeline automatically deploys the frontend whenever code is pushed to the specified branches (`main`, `stage`, or `development`).

### Workflow Overview

The existing configuration performs the following steps:

1. Checks out the repository.
2. Installs dependencies inside the `client` directory.
3. Builds the Vite project.
4. Deploys the output to Vercel using the GitHub secrets.

### File Content (for reference)

```yaml
name: Deploy Frontend to Vercel

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
          cd client
          npm install

      - name: Build project
        run: |
          cd client
          npm run build

      - name: Deploy to Vercel
        run: npx vercel --prod --confirm --token=$VERCEL_TOKEN
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 9. Build Configuration in Vercel

Under **Settings → Build & Development Settings**, verify the following configuration:

| Setting          | Value         |
| ---------------- | ------------- |
| Framework Preset | Vite          |
| Build Command    | npm run build |
| Install Command  | npm install   |
| Output Directory | dist          |

---

## 10. Test the Deployment

Once the GitHub Actions workflow runs successfully:

1. Open your deployed frontend at

   ```
   https://your-project-name.vercel.app
   ```
2. Open the browser console → **Network tab**, and verify that API requests are being sent to:

   ```
   https://your-backend-name.onrender.com
   ```

If the requests succeed, the connection between the frontend and backend is working correctly.

---

✅ **Final Summary**

| Step | Action                                                                   |
| ---- | ------------------------------------------------------------------------ |
| 1    | Connect GitHub repository to Vercel and select branch                    |
| 2    | Create `.env` file or add `VITE_API_URL` variable in Vercel              |
| 3    | Get `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` from Vercel |
| 4    | Add them as GitHub secrets                                               |
| 5    | Confirm `deploy-client.yml` is in `.github/workflows/`                   |
| 6    | Disable Deployment Protection in Vercel                                  |
| 7    | Verify the deployment and API connection                                 |

---

