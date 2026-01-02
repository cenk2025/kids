# 🔒 Güvenlik: API Key Yönetimi

## ✅ Güvenlik Politikası

**KURAL:** Gemini API key **SADECE** Vercel'de environment variable olarak saklanır.
**ASLA** kodda, Git repository'de veya local dosyalarda bulunmaz.

---

## 🚫 API Key ASLA Şuralarda Olmamalı:

- ❌ Kodda hardcoded (örn: `const apiKey = "AIza..."`)
- ❌ Git repository'de
- ❌ `.env` dosyasında (Git'e commit edilebilir)
- ❌ `.env.local` dosyasında (local'de test için bile)
- ❌ Herhangi bir commit'te
- ❌ GitHub'da
- ❌ Public olarak erişilebilir yerlerde

---

## ✅ API Key SADECE Şurada Olmalı:

- ✅ **Vercel Dashboard → Settings → Environment Variables**

```
Name: GEMINI_API_KEY
Value: [Gerçek API key]
Environments: Production, Preview, Development
```

---

## 🛡️ Güvenlik Kontrolleri

### 1. Git History Kontrolü

API key'in geçmişte commit edilmediğinden emin olun:

```bash
# Git history'de API key arama
git log -p | grep -i "AIza"
git log -p | grep -i "api_key"
git log -p | grep -i "gemini"
```

**Sonuç:** Hiçbir şey bulunmamalı!

### 2. .gitignore Kontrolü

`.gitignore` dosyasında şunlar olmalı:

```
*.local          # .env.local dosyalarını ignore eder
.env.local       # Ekstra güvenlik için
.env.*.local     # Tüm local env dosyaları
```

### 3. Repository Kontrolü

```bash
# Mevcut dosyalarda API key arama
grep -r "AIza" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "api.*key.*=" . --exclude-dir=node_modules --exclude-dir=.git
```

**Sonuç:** Sadece dokümantasyon ve örnek metinlerde bulunmalı!

---

## 🔧 Local Development (API Key Olmadan)

### Seçenek 1: Mock API (Önerilen)

Local development için mock data kullanın:

```typescript
// services/geminiService.ts
export const getAIClient = () => {
  const apiKey = 
    (import.meta as any).env?.VITE_GEMINI_API_KEY || 
    (import.meta as any).env?.GEMINI_API_KEY ||
    (process.env as any).GEMINI_API_KEY || 
    (process.env as any).API_KEY;
  
  // Local development için mock mode
  if (!apiKey && import.meta.env.DEV) {
    console.warn('⚠️ No API key found. Using mock mode for development.');
    return null; // Mock client döndür
  }
  
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured.');
  }
  
  return new GoogleGenAI({ apiKey });
};
```

### Seçenek 2: Temporary Local Key (Dikkatli!)

**SADECE** local test için geçici olarak:

```bash
# Terminal'de environment variable olarak set et (Git'e gitmez)
export GEMINI_API_KEY="your_temp_key_here"
npm run dev
```

**UYARI:** 
- Bu key'i asla commit etmeyin
- Terminal kapandığında silinir
- Her seferinde yeniden set etmeniz gerekir

### Seçenek 3: AI Studio Environment

Google AI Studio'da çalıştırın (window.aistudio kullanır).

---

## 📋 Vercel Environment Variable Yapılandırması

### Adım Adım:

1. **Vercel Dashboard'a gidin:**
   - [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Projenizi seçin:**
   - kids veya kids-voon-fi

3. **Settings → Environment Variables:**
   - **Add New** butonuna tıklayın

4. **Variable Ekleyin:**
   ```
   Name: GEMINI_API_KEY
   Value: AIzaSy........................... (gerçek key)
   Environments: ✅ Production
                 ✅ Preview
                 ✅ Development
   ```

5. **Save** ve **Redeploy**

---

## 🔍 API Key Sızıntısı Kontrolü

### GitHub'da Kontrol:

```bash
# Repository'de API key var mı?
git log --all --full-history --source --all -- '*env*'
git log --all --full-history -S "AIza"
```

### Eğer API Key Sızdıysa:

1. **Hemen API Key'i İptal Edin:**
   - [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sızan key'i silin

2. **Yeni API Key Oluşturun:**
   - Yeni key oluşturun
   - Sadece Vercel'de environment variable olarak ekleyin

3. **Git History'yi Temizleyin (İleri Seviye):**
   ```bash
   # Dikkat: Bu işlem tehlikelidir!
   # Sadece gerekirse ve yedek aldıktan sonra yapın
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```

4. **Force Push (Dikkatli!):**
   ```bash
   git push origin --force --all
   ```

---

## ✅ Güvenlik Kontrol Listesi

Deployment öncesi kontrol edin:

- [ ] API key kodda yok
- [ ] API key `.env.local` dosyasında yok
- [ ] `.env.local` `.gitignore`'da var
- [ ] Git history'de API key yok
- [ ] GitHub repository'de API key yok
- [ ] API key sadece Vercel'de var
- [ ] Vercel'de 3 environment seçili
- [ ] API key geçerli ve aktif
- [ ] Billing ayarlanmış

---

## 📚 Dokümantasyon Güncellemeleri

### README.md
```markdown
## 🔒 Security

API keys are NEVER stored in code or repository.
All sensitive keys are managed through Vercel Environment Variables.
```

### .env.example
```bash
# DO NOT put real API keys here!
# This file is for documentation only.
# Set GEMINI_API_KEY in Vercel Dashboard → Settings → Environment Variables

GEMINI_API_KEY=your_api_key_here
```

---

## 🚨 Acil Durum Prosedürü

### API Key Sızdıysa:

1. **Hemen İptal Et** (5 dakika içinde)
2. **Yeni Key Oluştur** (10 dakika içinde)
3. **Vercel'i Güncelle** (15 dakika içinde)
4. **Git History Temizle** (gerekirse)
5. **Güvenlik İncelemesi Yap**

### İletişim:
- Google Cloud Security: [https://cloud.google.com/security](https://cloud.google.com/security)
- Vercel Support: [https://vercel.com/support](https://vercel.com/support)

---

## 📖 Ek Kaynaklar

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Git Secrets](https://github.com/awslabs/git-secrets)
- [.gitignore Best Practices](https://git-scm.com/docs/gitignore)

---

## ✨ Özet

### ✅ YAPILMASI GEREKENLER:
- API key'i Vercel environment variables'da sakla
- `.gitignore`'da `.env.local` olduğundan emin ol
- Düzenli güvenlik kontrolleri yap

### ❌ YAPILMAMASI GEREKENLER:
- API key'i koda yazma
- API key'i Git'e commit etme
- API key'i public yerlerde paylaşma

---

**Güvenlik Seviyesi:** 🔒🔒🔒 Yüksek
**Son Kontrol:** 2 Ocak 2026
**Durum:** ✅ Güvenli
