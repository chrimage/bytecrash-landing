# Deploying the ByteCrash Landing Page to Cloudflare Pages

This guide provides step-by-step instructions for deploying the `bytecrash-landing` static website from its GitHub repository to Cloudflare Pages. Cloudflare Pages offers a seamless way to host static sites with automatic deployments triggered by Git commits.

## Prerequisites

*   A Cloudflare account.
*   The `bytecrash-landing` project pushed to a GitHub repository.

## Connection Steps

1.  **Log into Cloudflare:** Access your Cloudflare dashboard at [https://dash.cloudflare.com/](https://dash.cloudflare.com/).
2.  **Navigate to Pages:** In the sidebar, go to **Workers & Pages** > **Pages**.
3.  **Connect to Git:** Click on the "Create a project" button and select the "Connect to Git" option.
4.  **Authorize GitHub Access:** Follow the prompts to authorize Cloudflare to access your GitHub account. You might need to select specific repositories or grant access to all. Ensure you grant access to the `bytecrash-landing` repository.
5.  **Select Repository:** Once authorized, choose the `bytecrash-landing` repository from the list.
6.  **Configure Build & Deployment:**
    *   **Production branch:** Select the branch you want to deploy automatically (e.g., `main` or `master`).
    *   **Build command:** Leave this field **empty**. Since this is a simple static site with only HTML, CSS, and JavaScript files at the root, no build step is required.
    *   **Build output directory:** Set this to `/` (or leave it blank if that's the default behavior for root deployment). This tells Cloudflare that your website files (`index.html`, `style.css`, `script.js`) are located in the root directory of the repository.
    *   **Environment variables:** Not needed for this project.
7.  **Save and Deploy:** Click "Save and Deploy". Cloudflare will pull the code from your selected branch, skip the build step (as configured), and deploy the files from the root directory.

## Automatic Deployments

Once connected, Cloudflare Pages will automatically trigger a new deployment every time you push a commit to the production branch you configured (e.g., `main`). This means your live website will always reflect the latest changes in your repository without manual intervention.

You can also configure preview deployments for other branches, allowing you to test changes before merging them into the production branch.

## Accessing Your Site

After the first deployment is complete (usually takes a minute or two), Cloudflare will provide you with a unique `.pages.dev` subdomain where your site is live (e.g., `bytecrash-landing-xyz.pages.dev`). You can also configure custom domains later through the Cloudflare Pages settings.