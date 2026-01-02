# 🔐 Vercel Environment Variables Yapılandırması

## Gemini API Key için Environment Variable

### 📋 Vercel Dashboard'da Yapılandırma

1. **Vercel Dashboard'a gidin:**
   - [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Projenizi seçin:**
   - `kids` veya `kids-voon-fi` projesine tıklayın

3. **Settings → Environment Variables:**
   - Sol menüden **"Settings"** sekmesine tıklayın
   - **"Environment Variables"** seçeneğini seçin

4. **Yeni Environment Variable Ekleyin:**

   ```
   ┌─────────────────────────────────────────────────┐
   │ Add New Environment Variable                    │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │ Name:                                           │
   │ ┌─────────────────────────────────────────────┐ │
   │ │ GEMINI_API_KEY                              │ │
   │ └─────────────────────────────────────────────┘ │
   │                                                 │
   │ Value:                                          │
   │ ┌─────────────────────────────────────────────┐ │
   │ │ AIzaSy...........................           │ │
   │ └─────────────────────────────────────────────┘ │
   │                                                 │
   │ Environments:                                   │
   │ ☑ Production                                    │
   │ ☑ Preview                                       │
   │ ☑ Development                                   │
   │                                                 │
   │           [Cancel]  [Add]                       │
   └─────────────────────────────────────────────────┘
   ```

5. **Değerleri girin:**
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Gemini API anahtarınız (örn: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
   - **Environments:** Hepsini seçin (Production, Preview, Development)

6. **"Add" butonuna tıklayın**

---

## 🔑 Gemini API Key Nasıl Alınır?

1. **Google AI Studio'ya gidin:**
   - [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Google hesabınızla giriş yapın**

3. **"Create API Key" butonuna tıklayın**

4. **API Key'i kopyalayın ve güvenli bir yere kaydedin**

---

## ⚙️ Environment Variable Detayları

### Variable Name
```
GEMINI_API_KEY
```

### Variable Value
```
AIzaSy...........................
```
(Gerçek API anahtarınızı buraya yapıştırın)

### Environments (Ortamlar)

| Ortam | Açıklama | Seçilmeli mi? |
|-------|----------|---------------|
| **Production** | Canlı site (kids.voon.fi) | ✅ Evet |
| **Preview** | Pull request önizlemeleri | ✅ Evet |
| **Development** | Vercel CLI ile local development | ✅ Evet |

**ÖNEMLİ:** Her üç ortamı da seçin!

---

## 🔄 Mevcut Deployment'ı Güncelleme

Eğer environment variable'ı ekledikten sonra site çalışmıyorsa:

1. **Vercel Dashboard → Deployments** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. **"Redeploy"** butonuna tıklayın

---

## 🧪 Environment Variable'ı Test Etme

### Local'de Test:

1. `.env.local` dosyasını oluşturun:
   ```bash
   echo "GEMINI_API_KEY=your_actual_api_key" > .env.local
   ```

2. Development server'ı başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcıda test edin: [http://localhost:3000](http://localhost:3000)

### Vercel'de Test:

1. Deployment tamamlandıktan sonra sitenizi ziyaret edin
2. Bir hikaye oluşturmayı deneyin
3. Eğer hata alırsanız:
   - Vercel Dashboard → Deployments → Build Logs kontrol edin
   - Environment variable'ın doğru eklendiğinden emin olun

---

## 📸 Ekran Görüntüsü Referansı

Vercel Environment Variables sayfası şöyle görünecek:

```
Settings > Environment Variables

┌──────────────────────────────────────────────────────┐
│  Environment Variables                                │
│                                                       │
│  [+ Add New]                                          │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ GEMINI_API_KEY                                 │  │
│  │ Production, Preview, Development               │  │
│  │ Added: Just now                                │  │
│  │                                    [Edit] [×]  │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## ⚠️ Güvenlik Notları

1. **API anahtarınızı asla Git'e commit etmeyin**
   - `.env.local` dosyası `.gitignore`'da var
   - Sadece `.env.example` dosyası Git'e eklenebilir

2. **API anahtarınızı kimseyle paylaşmayın**

3. **Vercel otomatik olarak environment variable'ları şifreler**

4. **API key'inizi düzenli olarak rotate edin**

---

## ✅ Kontrol Listesi

- [ ] Gemini API key aldım
- [ ] Vercel'de environment variable ekledim
- [ ] Üç ortamı da seçtim (Production, Preview, Development)
- [ ] Deployment'ı yeniden başlattım (gerekirse)
- [ ] Site çalışıyor ve hikaye oluşturabiliyor

---

## 🆘 Sorun Giderme

### "API key is missing" hatası:
- Environment variable adının tam olarak `GEMINI_API_KEY` olduğundan emin olun
- Vercel'de redeploy yapın

### "Invalid API key" hatası:
- API key'in doğru kopyalandığından emin olun
- Başında/sonunda boşluk olmadığından emin olun
- Google AI Studio'da yeni bir key oluşturup deneyin

### Build başarılı ama site çalışmıyor:
- Browser console'u kontrol edin (F12)
- Vercel deployment logs'unu kontrol edin

---

Başarılar! 🚀
