# 🔧 Sorun Giderme Rehberi - Hikaye Oluşturma Sorunu

## ❌ Sorun: Hikayeler Oluşturulmuyor

### Olası Nedenler ve Çözümler

---

## 1️⃣ Environment Variable Kontrolleri

### Vercel Dashboard'da Kontrol Edin:

1. **Vercel Dashboard'a gidin:** [vercel.com/dashboard](https://vercel.com/dashboard)
2. Projenizi seçin (kids veya kids-voon-fi)
3. **Settings → Environment Variables** sekmesine gidin
4. Aşağıdakileri kontrol edin:

#### ✅ Doğru Yapılandırma:
```
Name: GEMINI_API_KEY
Value: AIzaSy........................... (gerçek API key)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### ❌ Yaygın Hatalar:

**Hata 1: Yanlış İsim**
```
❌ VITE_GEMINI_API_KEY  (Vercel'de kullanmayın)
✅ GEMINI_API_KEY       (Doğru)
```

**Hata 2: Eksik Ortamlar**
```
❌ Sadece Production seçili
✅ Production, Preview, Development hepsi seçili
```

**Hata 3: Boş veya Placeholder Değer**
```
❌ PLACEHOLDER_API_KEY
❌ your_api_key_here
✅ AIzaSy... (gerçek API key)
```

---

## 2️⃣ API Key Geçerliliği

### API Key'inizi Test Edin:

1. **Google AI Studio'ya gidin:** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. API key'inizin **aktif** olduğundan emin olun
3. Gerekirse **yeni bir API key oluşturun**

### API Key Gereksinimleri:
- ✅ Google Cloud projesi aktif olmalı
- ✅ Gemini API etkinleştirilmiş olmalı
- ✅ Billing (faturalandırma) ayarlanmış olmalı
- ✅ API key'in kısıtlamaları doğru yapılandırılmış olmalı

---

## 3️⃣ Vercel'de Redeploy

Environment variable ekledikten veya değiştirdikten sonra **mutlaka redeploy yapın**:

### Redeploy Adımları:

1. **Vercel Dashboard → Deployments** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. **"Redeploy"** butonuna tıklayın
5. Deployment tamamlanmasını bekleyin (1-2 dakika)

**ÖNEMLİ:** Environment variable değişiklikleri sadece yeni deployment'larda geçerli olur!

---

## 4️⃣ Browser Console'u Kontrol Edin

### Hata Mesajlarını Görün:

1. Vercel'deki sitenizi açın (kids.voon.fi veya vercel URL)
2. **F12** tuşuna basın (veya sağ tık → Inspect)
3. **Console** sekmesine gidin
4. Bir hikaye oluşturmayı deneyin
5. Hata mesajlarını okuyun

### Yaygın Hata Mesajları:

#### Hata: "GEMINI_API_KEY is not configured"
**Çözüm:** Environment variable eksik veya yanlış yapılandırılmış
- Vercel'de `GEMINI_API_KEY` ekleyin
- Redeploy yapın

#### Hata: "API key not valid" veya "403 Forbidden"
**Çözüm:** API key geçersiz veya yetkisiz
- Yeni API key oluşturun
- Billing ayarlarını kontrol edin
- API kısıtlamalarını kontrol edin

#### Hata: "Failed to fetch" veya "Network error"
**Çözüm:** Ağ bağlantısı sorunu
- İnternet bağlantınızı kontrol edin
- Firewall/VPN ayarlarını kontrol edin

---

## 5️⃣ Vercel Build Logs Kontrol

### Build Hatalarını Görün:

1. **Vercel Dashboard → Deployments** sekmesine gidin
2. En son deployment'a tıklayın
3. **"Building"** veya **"Build Logs"** bölümünü açın
4. Hata mesajlarını arayın

### Yaygın Build Hataları:

#### "Module not found" veya "Cannot find module"
**Çözüm:** Dependencies eksik
```bash
# Local'de test edin:
npm install
npm run build
```

#### "Environment variable undefined"
**Çözüm:** Vite config sorunu
- `vite.config.ts` dosyasının güncel olduğundan emin olun
- Redeploy yapın

---

## 6️⃣ Local Test

### Local'de Çalışıyor mu?

Local'de test ederek sorunun Vercel'e özgü olup olmadığını anlayın:

```bash
# .env.local dosyası oluşturun
echo "GEMINI_API_KEY=your_actual_api_key" > .env.local

# Development server'ı başlatın
npm run dev

# Tarayıcıda test edin
# http://localhost:3000
```

**Sonuç:**
- ✅ **Local'de çalışıyor, Vercel'de çalışmıyor:** Environment variable sorunu
- ❌ **Local'de de çalışmıyor:** API key veya kod sorunu

---

## 7️⃣ API Quota Kontrol

### Gemini API Limitlerini Kontrol Edin:

1. **Google Cloud Console'a gidin:** [console.cloud.google.com](https://console.cloud.google.com)
2. Projenizi seçin
3. **APIs & Services → Dashboard** sekmesine gidin
4. **Gemini API** kullanımını kontrol edin

### Limitler:
- Free tier: Günlük limit var
- Paid tier: Daha yüksek limitler
- Limit aşıldıysa: 24 saat bekleyin veya paid tier'a geçin

---

## 8️⃣ Model İsimleri Kontrol

Bazı Gemini modelleri henüz genel kullanıma açık olmayabilir:

### Mevcut Modeller:
- ✅ `gemini-2.0-flash-exp` (Önerilen)
- ✅ `gemini-1.5-flash`
- ✅ `gemini-1.5-pro`
- ⚠️ `gemini-3-pro-preview` (Preview, sınırlı erişim)

Eğer `gemini-3-pro-preview` hata veriyorsa, `gemini-2.0-flash-exp` kullanın.

---

## 9️⃣ Adım Adım Debug

### Sistematik Kontrol:

1. ✅ **Vercel'de GEMINI_API_KEY var mı?**
   - Settings → Environment Variables kontrol edin

2. ✅ **API key doğru mu?**
   - AI Studio'da test edin

3. ✅ **Redeploy yapıldı mı?**
   - Environment variable ekledikten sonra redeploy yapın

4. ✅ **Build başarılı mı?**
   - Deployments → Build Logs kontrol edin

5. ✅ **Browser console temiz mi?**
   - F12 → Console'da hata var mı?

6. ✅ **Local'de çalışıyor mu?**
   - npm run dev ile test edin

---

## 🆘 Hala Çalışmıyor mu?

### Son Çare Adımlar:

1. **Yeni API Key Oluşturun:**
   - [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Eski key'i silin, yeni key oluşturun

2. **Vercel'de Environment Variable'ı Güncelleyin:**
   - Eski değeri silin
   - Yeni API key'i ekleyin
   - Redeploy yapın

3. **Cache'i Temizleyin:**
   - Vercel Dashboard → Settings → General
   - "Clear Cache" butonuna tıklayın
   - Redeploy yapın

4. **Projeyi Yeniden Deploy Edin:**
   - GitHub'dan son kodu çekin
   - Vercel'de yeniden import edin

---

## ✅ Başarı Kontrol Listesi

Hikaye oluşturma çalışıyorsa:

- ✅ Ana sayfada hikaye konusu girebiliyorum
- ✅ "Luo tarina" butonuna tıklayınca loading gösteriyor
- ✅ Hikaye metni oluşuyor
- ✅ Görseller yükleniyor
- ✅ Ses narasyonu çalışıyor (opsiyonel)
- ✅ Sayfa geçişleri çalışıyor
- ✅ PDF indirme çalışıyor

---

## 📞 İletişim

Sorun devam ederse:
1. Browser console'daki hata mesajını kaydedin
2. Vercel build logs'unu kaydedin
3. API key'in ilk/son 4 karakterini not edin (tamamını paylaşmayın!)

---

**Son Güncelleme:** 2 Ocak 2026
