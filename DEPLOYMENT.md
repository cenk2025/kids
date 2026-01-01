# 🚀 Vercel Deployment Guide - kids.voon.fi

## ✅ Tamamlanan Adımlar

- ✅ Git repository başlatıldı
- ✅ GitHub'a push edildi: `https://github.com/cenk2025/kids.git`
- ✅ Vercel yapılandırma dosyası oluşturuldu (`vercel.json`)

---

## 📋 Vercel'de Deployment Adımları

### 1️⃣ Vercel'e Giriş Yapın

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Sign Up"** veya **"Log In"** butonuna tıklayın
3. **"Continue with GitHub"** seçeneğini seçin
4. GitHub hesabınızla giriş yapın ve Vercel'e yetki verin

### 2️⃣ Yeni Proje Oluşturun

1. Vercel dashboard'unda **"Add New..."** butonuna tıklayın
2. **"Project"** seçeneğini seçin
3. GitHub repository listesinde **"cenk2025/kids"** repository'sini bulun
4. **"Import"** butonuna tıklayın

### 3️⃣ Proje Yapılandırması

Aşağıdaki ayarları yapın:

**Project Name:**
```
kids-voon-fi
```
(veya istediğiniz bir isim)

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
./
```
(değiştirmeyin, varsayılan olarak kalabilir)

**Build and Output Settings:**
- **Build Command:** `npm run build` (otomatik gelecek)
- **Output Directory:** `dist` (otomatik gelecek)
- **Install Command:** `npm install` (otomatik gelecek)

### 4️⃣ Environment Variables (Çevre Değişkenleri)

**ÖNEMLİ:** Gemini API anahtarınızı eklemeniz gerekiyor!

1. **"Environment Variables"** bölümünü bulun
2. Aşağıdaki değişkeni ekleyin:

**Variable Name:**
```
GEMINI_API_KEY
```

**Value:**
```
[BURAYA GEMINI API ANAHTARINIZI YAPIŞTIRIN]
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

(Hepsini seçin)

3. **"Add"** butonuna tıklayın

### 5️⃣ Deploy!

1. Tüm ayarları kontrol edin
2. **"Deploy"** butonuna tıklayın
3. Deployment işlemi başlayacak (yaklaşık 1-2 dakika sürer)
4. Deployment tamamlandığında **"Visit"** butonuna tıklayarak sitenizi görüntüleyin

---

## 🌐 Custom Domain Yapılandırması (kids.voon.fi)

### 1️⃣ Vercel'de Domain Ekleme

1. Projenizin dashboard'unda **"Settings"** sekmesine gidin
2. Sol menüden **"Domains"** seçeneğini seçin
3. **"Add"** butonuna tıklayın
4. Domain adını girin:
   ```
   kids.voon.fi
   ```
5. **"Add"** butonuna tıklayın

### 2️⃣ DNS Yapılandırması

Vercel size DNS kayıtlarını gösterecek. Domain sağlayıcınızda (örn. Namecheap, GoDaddy, Cloudflare) aşağıdaki kayıtları eklemeniz gerekecek:

**Seçenek 1: CNAME Kaydı (Önerilen)**
```
Type: CNAME
Name: kids
Value: cname.vercel-dns.com
```

**Seçenek 2: A Kaydı**
```
Type: A
Name: kids
Value: 76.76.21.21
```

### 3️⃣ DNS Propagation

- DNS değişikliklerinin yayılması 5 dakika ile 48 saat arasında sürebilir
- Genellikle 10-30 dakika içinde aktif olur
- Kontrol etmek için: [https://dnschecker.org](https://dnschecker.org)

### 4️⃣ SSL Sertifikası

- Vercel otomatik olarak ücretsiz SSL sertifikası sağlar
- Domain aktif olduktan sonra otomatik olarak HTTPS etkinleşir
- Herhangi bir ek yapılandırma gerekmez

---

## 🔄 Gelecekteki Güncellemeler

Kodunuzda değişiklik yaptığınızda:

```bash
git add .
git commit -m "Açıklama mesajı"
git push origin main
```

Vercel otomatik olarak yeni deployment yapacak ve sitenizi güncelleyecek!

---

## 🛠️ Yararlı Komutlar

### Local Test
```bash
npm run dev
```

### Production Build Test
```bash
npm run build
npm run preview
```

### Vercel CLI ile Deploy (Alternatif)
```bash
# Vercel CLI'yi global olarak yükleyin
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production'a deploy
vercel --prod
```

---

## 📞 Sorun Giderme

### Build Hatası Alırsanız:

1. Local'de build'i test edin:
   ```bash
   npm run build
   ```

2. Hata varsa düzeltin ve tekrar push edin

3. Vercel'de **"Deployments"** sekmesinden build loglarını kontrol edin

### Environment Variable Eksikse:

1. Vercel dashboard → Settings → Environment Variables
2. `GEMINI_API_KEY` ekleyin
3. **"Redeploy"** butonuna tıklayın

### Domain Çalışmıyorsa:

1. DNS kayıtlarını kontrol edin
2. DNS propagation'ı bekleyin (10-30 dakika)
3. Vercel'de domain durumunu kontrol edin

---

## ✨ Tamamlandı!

Artık projeniz:
- ✅ GitHub'da: `https://github.com/cenk2025/kids`
- ✅ Vercel'de deploy edilmeye hazır
- ✅ Custom domain için yapılandırılmış: `kids.voon.fi`

Başarılar! 🎉
