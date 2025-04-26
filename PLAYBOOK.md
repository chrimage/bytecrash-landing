Here’s your **Cloudflare Pages playbook** for getting bytecrash.xyz live. Hand this straight off to your AI deployment agent:

---

## 🛠️ 1. Prerequisites

- **Cloudflare API Token**  
  - Permissions:  
    - Zone:Read, Zone:DNS, Pages:Admin (or All on the zone for bytecrash.xyz)  
- **GitHub Personal Access Token**  
  - Permissions: repo:create, repo:push  
- **Local Tools** (agent should install if missing):  
  ```bash
  npm install -g @cloudflare/wrangler gh
  ```  
- **Environment variables** (set in CI or agent’s shell):
  ```bash
  export CF_API_TOKEN=<your-cloudflare-token>
  export CF_ACCOUNT_ID=<your-cloudflare-account-id>
  export GITHUB_TOKEN=<your-github-token>
  export GITHUB_OWNER=<your-github-username-or-org>
  ```

---

## 📁 2. Scaffold & Push Repo

```bash
# 2.1 Create project folder
mkdir bytecrash-landing && cd bytecrash-landing

# 2.2 Initialize Git & GitHub repo
git init
gh auth login --with-token <<<"$GITHUB_TOKEN"
gh repo create "$GITHUB_OWNER/bytecrash-landing" \
  --public --confirm

# 2.3 Add landing-page files
cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>bytecrash.xyz</title>
  <style>
    body { font-family:sans-serif; text-align:center; padding:4rem; background:#111; color:#eee; }
    a { color:#39f; }
  </style>
</head>
<body>
  <h1>👾 Welcome to bytecrash.xyz</h1>
  <p>Your digital playground for self-hosted services, AI agents, VPNs, and more.</p>
  <p>📧 <a href="mailto:hi@bytecrash.xyz">hi@bytecrash.xyz</a></p>
</body>
</html>
EOF

# 2.4 Commit & push
git add index.html
git commit -m "Initial landing page for bytecrash.xyz"
git branch -M main
git remote add origin https://github.com/$GITHUB_OWNER/bytecrash-landing.git
git push -u origin main
```

---

## 🚀 3. Create & Deploy Cloudflare Pages Project

### 3.1 Log in Wrangler

```bash
wrangler login --api-token "$CF_API_TOKEN"
```

### 3.2 Create Pages project

```bash
wrangler pages project create bytecrash-pages \
  --account-id "$CF_ACCOUNT_ID" \
  --production-branch main \
  --framework none \
  --directory .
```

> If that command isn’t available in your Wrangler version, skip to 3.3 and let `pages deploy` auto-create.

### 3.3 Deploy to Pages

```bash
# First deploy (will prompt for project name & branch if not created)
wrangler pages deploy . \
  --project bytecrash-pages \
  --branch main
```

- 🎯 Your site is now live at  
  `https://bytecrash-pages.<hash>.pages.dev`  

---

## 🌐 4. Bind Your Custom Domain

```bash
# 4.1 Bind the apex domain
wrangler pages domain bind bytecrash-pages \
  bytecrash.xyz \
  --account-id "$CF_ACCOUNT_ID"

# 4.2 (Optional) also bind www
wrangler pages domain bind bytecrash-pages \
  www.bytecrash.xyz \
  --account-id "$CF_ACCOUNT_ID"
```

> Cloudflare will auto-manage the required CNAME (with flattening for the apex).

---

## ✅ 5. Verify & Clean Up

1. **DNS**: Check in Cloudflare DNS dashboard that you have:  
   - `bytecrash.xyz → CNAME bytecrash-pages.pages.dev` (flattened)  
   - `www.bytecrash.xyz → CNAME bytecrash-pages.pages.dev`  
2. **SSL**: Ensure “SSL/TLS” is set to **Full (strict)**.  
3. **Access**: Visit `https://bytecrash.xyz` and `https://www.bytecrash.xyz`—both should serve your `index.html`.  
4. **Auto-Deploy**: On every push to `main`, Cloudflare Pages will rebuild & redeploy automatically.

---

🎉 You’re done! Your AI agent can now manage bytecrash.xyz’s content by pushing to GitHub—and Cloudflare Pages + Wrangler will handle the rest. Let me know if you need advanced edge-function hooks or form integrations next!
