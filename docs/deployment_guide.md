# Deployment Guide

This guide provides instructions on how to deploy this React-based web application to two popular hosting platforms: Google Cloud Run and Vercel.

## Prerequisites

Before you begin, ensure you have the following tools installed and accounts set up:

- **Node.js**: Required for local development and some build tools.
- **Docker**: Required for containerizing the app for Cloud Run.
- **Google Cloud SDK (gcloud CLI)**: For interacting with Google Cloud.
- **Google Cloud Platform (GCP) Account**: With billing enabled.
- **GitHub Account**: To host your code repository.
- **Vercel Account**: Linked to your GitHub account.

---

## 1. Deploying to Google Cloud Run

Google Cloud Run is a serverless platform that allows you to run stateless containers. We will containerize our application using Docker and deploy it.

### Step 1: Containerize the Application

Since this is a static single-page application (SPA), we will use Nginx to serve the files.

**1. Create a `Dockerfile`**

Create a file named `Dockerfile` in the root of your project with the following content:

```dockerfile
# Use a lightweight Nginx image as the base
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all the application files (HTML, TSX, etc.) to the Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
```

**2. Create an `nginx.conf` file**

This configuration file tells Nginx how to handle requests, including routing for our single-page app. Create a file named `nginx.conf` in the root of your project:

```nginx
server {
    listen 80;
    server_name localhost;

    # Root directory for the static files
    root /usr/share/nginx/html;
    index index.html;

    # Route all requests to index.html to enable client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Add headers to prevent caching issues
    location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

**3. Create a `.dockerignore` file**

To keep our Docker image small, we'll ignore unnecessary files. Create `.dockerignore`:

```
.git
.gitignore
docs
Dockerfile
nginx.conf
vercel.json
```

### Step 2: Build and Push the Image to Artifact Registry

1.  **Authenticate with GCP:**
    ```bash
    gcloud auth login
    gcloud config set project YOUR_GCP_PROJECT_ID
    ```

2.  **Enable necessary APIs:**
    ```bash
    gcloud services enable run.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    ```

3.  **Create an Artifact Registry repository:**
    ```bash
    gcloud artifacts repositories create c-guide-repo \
      --repository-format=docker \
      --location=us-central1 \
      --description="Docker repository for C-Guide app"
    ```
    *(Replace `us-central1` with your preferred region.)*

4.  **Configure Docker to authenticate with Artifact Registry:**
    ```bash
    gcloud auth configure-docker us-central1-docker.pkg.dev
    ```

5.  **Build and tag your Docker image:**
    ```bash
    docker build -t us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/c-guide-repo/c-guide-app:latest .
    ```
    *(Remember to replace `YOUR_GCP_PROJECT_ID`.)*

6.  **Push the image to Artifact Registry:**
    ```bash
    docker push us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/c-guide-repo/c-guide-app:latest
    ```

### Step 3: Deploy to Cloud Run

Deploy the container image using the `gcloud` CLI.

```bash
gcloud run deploy c-guide-service \
  --image=us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/c-guide-repo/c-guide-app:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=80
```

-   `--allow-unauthenticated`: Makes your web app publicly accessible.
-   `--port=80`: Specifies the port the container is listening on.

After a few moments, the command will output the URL of your deployed service. Your app is now live!

---

## 2. Deploying to Vercel via GitHub

Vercel is a platform for frontend developers, providing an excellent workflow for deploying static sites and serverless functions directly from a Git repository.

### Step 1: Create a Vercel Configuration File

To ensure Vercel correctly identifies your project as a collection of static files without a build step, create a file named `vercel.json` in the root of your project with the following content:

```json
{
  "builds": [
    {
      "src": "*",
      "use": "@vercel/static"
    }
  ]
}
```

This file explicitly tells Vercel to take all files (`*`) and serve them as static assets, which is exactly what our project requires.

### Step 2: Push Project to GitHub

1.  Initialize a Git repository if you haven't already and commit your new `vercel.json` file:
    ```bash
    git init
    git add .
    git commit -m "Add vercel.json for deployment"
    ```

2.  Create a new repository on GitHub.

3.  Link your local repository to the remote one and push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

### Step 3: Import Project on Vercel

1.  Sign up or log in to [Vercel](https://vercel.com) using your GitHub account.
2.  From your Vercel dashboard, click "**Add New...**" -> "**Project**".
3.  Find your GitHub repository and click "**Import**".

### Step 4: Configure and Deploy

Because you added the `vercel.json` file, Vercel should automatically configure the project correctly.

1.  **Framework Preset**: Vercel should detect the configuration and might not ask for a preset. If it does, select "**Other**".

2.  **Build and Output Settings**:
    -   The `vercel.json` file handles this, so these fields should be left empty if they appear.

3.  **Environment Variables**:
    -   This is the **most important step** for connecting to the Gemini API.
    -   Expand the "Environment Variables" section.
    -   Add a new variable:
        -   **Name**: `API_KEY`
        -   **Value**: Paste your Google Gemini API key here.

4.  **Deploy**: Click the "**Deploy**" button.

Vercel will now deploy your site using the static file configuration. Once complete, you'll be given a public URL.

### Automatic Deployments

Vercel automatically sets up a CI/CD pipeline:
-   **Production**: Every time you `git push` to your `main` branch, Vercel will automatically redeploy the latest version to your production URL.
-   **Previews**: When you create a pull request on GitHub, Vercel will create a unique preview deployment so you can see your changes live before merging.
