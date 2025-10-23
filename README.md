# BIST Signal Finder Frontend

Modern, minimal ve şık bir React frontend uygulaması. BIST hisse senedi analizi için geliştirilmiş backend API'si ile entegre çalışır.

## 🚀 Özellikler

- **Modern UI/UX**: Material-UI ile tasarlanmış minimal ve şık arayüz
- **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- **Real-time Data**: Canlı veri güncellemeleri
- **Interactive Dashboard**: Kapsamlı analiz dashboard'u
- **TypeScript**: Tip güvenli kod yapısı

## 📊 Sayfalar

### Dashboard
- Genel istatistikler
- API durumu
- Analiz durumu
- Son analiz bilgileri

### Sinyaller
- Mükemmel sinyal veren hisseler
- Detaylı fiyat bilgileri
- Alım sinyalleri listesi
- Analiz başlatma/durdurma

### Formasyonlar
- Tespit edilen formasyonlar
- Risk/ödül analizi
- Güvenilirlik skorları
- Detaylı formasyon bilgileri

### En İyi Seçimler
- En yüksek potansiyelli 2 hisse
- Seçim kriterleri
- Skorlama sistemi
- Seçim nedenleri

## 🛠️ Teknolojiler

- **React 18** - Modern React hooks
- **TypeScript** - Tip güvenliği
- **Material-UI** - UI bileşenleri
- **Axios** - HTTP istekleri
- **Recharts** - Grafik görselleştirme

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# Production build
npm run build
```

## 🔧 Yapılandırma

API base URL'i `src/services/api.ts` dosyasında yapılandırılabilir:

```typescript
const API_BASE = 'http://localhost:8080';
```

## 📱 Responsive Tasarım

- **Mobile First**: Mobil cihazlar için optimize edilmiş
- **Tablet Support**: Tablet görünümü için özel düzenlemeler
- **Desktop**: Geniş ekranlar için maksimum verimlilik

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: #2563eb (Mavi)
- **Secondary**: #10b981 (Yeşil)
- **Success**: #10b981
- **Warning**: #f59e0b
- **Error**: #ef4444

### Tipografi
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

## 🔄 API Entegrasyonu

### Endpoints
- `GET /api/signals` - Tüm sinyaller
- `GET /api/formations` - Formasyonlar
- `GET /api/top-picks` - En iyi seçimler
- `POST /api/analysis/start` - Analiz başlat
- `GET /api/analysis/status` - Analiz durumu

### Hata Yönetimi
- Otomatik hata yakalama
- Kullanıcı dostu hata mesajları
- Retry mekanizması

## 📈 Performans

- **Lazy Loading**: Sayfa bazında kod bölme
- **Memoization**: Gereksiz render'ları önleme
- **Optimized Images**: Optimize edilmiş görseller
- **Bundle Size**: Minimal bundle boyutu

## 🔒 Güvenlik

- **CORS**: Cross-origin istek yönetimi
- **Input Validation**: Giriş doğrulama
- **XSS Protection**: XSS saldırı koruması

## 🧪 Test

```bash
# Testleri çalıştır
npm test

# Coverage raporu
npm run test:coverage
```

## 📦 Build

```bash
# Production build
npm run build

# Build analizi
npm run analyze
```

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# dist/ klasörünü Netlify'a yükle
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: [email@example.com]
- **GitHub**: [@username]
- **LinkedIn**: [linkedin.com/in/username]

---

**Not**: Bu uygulama BIST hisse senedi analizi için geliştirilmiştir. Yatırım kararları alırken profesyonel finansal danışmanlık alınması önerilir.