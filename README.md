<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Taikasatukirja - AI Powered Story Generator

An interactive AI-powered story generator built with React, TypeScript, and Google Gemini AI.

🌐 **Live Demo:** [kids.voon.fi](https://kids.voon.fi)

## 🔒 Security

**IMPORTANT:** API keys are NEVER stored in code or repository.  
All sensitive keys are managed through **Vercel Environment Variables only**.

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

## 🚀 Run Locally

**Prerequisites:** Node.js (v18 or higher)

**Note:** This app is designed for Vercel deployment. Local development requires API key setup in Vercel or temporary environment variables.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click **"Add New Project"**

4. Import your repository: `cenk2025/kids`

5. Configure your project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. Add Environment Variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key

7. Click **"Deploy"**

8. After deployment, go to **Settings → Domains** and add your custom domain:
   - Add domain: `kids.voon.fi`
   - Follow DNS configuration instructions

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variable:
   ```bash
   vercel env add GEMINI_API_KEY
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```

## 🔧 Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Google Gemini AI** - AI Story Generation
- **jsPDF** - PDF Export

## 📝 License

Private Project
