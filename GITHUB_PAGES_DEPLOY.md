# 🚀 Deploy to GitHub Pages - Step by Step

## Prerequisites

- GitHub account
- Git installed on your computer
- Your code ready to push

## Step 1: Update Repository Name

**IMPORTANT**: Edit `vite.config.ts` and change the base path to match your GitHub repository name:

```typescript
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: '/YOUR-REPO-NAME/', // ⚠️ Change this!
});
```

For example:
- If your repo is `bangalore-guide`, use: `base: '/bangalore-guide/'`
- If your repo is `local-culture-guide`, use: `base: '/local-culture-guide/'`

## Step 2: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Local Culture Guide"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "local-culture-guide")
3. **Don't** initialize with README (we already have files)
4. Copy the repository URL

## Step 4: Link to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

Replace:
- `YOUR-USERNAME` with your GitHub username
- `YOUR-REPO-NAME` with your repository name

## Step 5: Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
1. Build your app for production
2. Create a `gh-pages` branch
3. Push the built files to GitHub Pages

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

## Step 7: Wait & Visit

GitHub Pages will deploy in 1-2 minutes.

Your site will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## 🎉 You're Live!

Your Local Culture Guide is now publicly accessible!

---

## Updating Your Site

Whenever you make changes:

```bash
# 1. Commit your changes
git add .
git commit -m "Update: description of changes"
git push

# 2. Deploy to GitHub Pages
npm run deploy
```

---

## Troubleshooting

### Issue: 404 Page Not Found

**Solution**: Make sure the `base` in `vite.config.ts` matches your repo name exactly.

```typescript
base: '/your-exact-repo-name/', // Must match!
```

Then rebuild and redeploy:
```bash
npm run deploy
```

### Issue: Assets Not Loading

**Solution**: Check that `base` path is correct and includes trailing slash:
```typescript
base: '/repo-name/', // ✅ Correct
base: '/repo-name'   // ❌ Wrong (missing slash)
```

### Issue: Deploy Command Fails

**Solution**: Make sure gh-pages is installed:
```bash
npm install --save-dev gh-pages
```

### Issue: Permission Denied

**Solution**: Set up GitHub authentication:
```bash
# Use GitHub CLI
gh auth login

# Or use SSH keys
# Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

---

## Custom Domain (Optional)

### Add Custom Domain

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In your repo, go to **Settings** → **Pages**
3. Enter your custom domain
4. Update DNS records at your domain provider:

```
Type: CNAME
Name: www
Value: YOUR-USERNAME.github.io
```

```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

5. Wait for DNS propagation (up to 24 hours)

---

## Example: Complete Deployment

```bash
# 1. Update vite.config.ts
# Change base to '/bangalore-guide/'

# 2. Initialize and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/myusername/bangalore-guide.git
git push -u origin main

# 3. Deploy to GitHub Pages
npm run deploy

# 4. Enable Pages in GitHub Settings
# Settings → Pages → Source: gh-pages branch

# 5. Visit your site!
# https://myusername.github.io/bangalore-guide/
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to GitHub Pages |
| `git push` | Push code to GitHub |
| `npm run preview` | Preview production build locally |

---

## Need Help?

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- Check `DEPLOYMENT.md` for other hosting options

---

**Your Local Culture Guide is ready to share with the world! 🌍✨**
