# سهم للنقل - Sahm Transport

**أرقى حلول النقل الذكية في سوريا** 🚗✨

## نظرة عامة

تطبيق متكامل لإدارة خدمات النقل مع ثلاثة أدوار رئيسية:
- 👥 **العملاء**: البحث عن الرحلات وحجزها
- 🚙 **السائقون**: عرض الطلبات وقبول الرحلات
- 👨‍💼 **المسؤولون**: إدارة النظام والتحقق من السائقين

## المميزات الأساسية

✅ **مصادقة آمنة** - دعم البريد الإلكتروني ورقم الهاتف
✅ **سوق الرحلات المباشر** - عرض طلبات مباشرة وفورية
✅ **نظام التقييمات** - تقييم السائقين بعد كل رحلة
✅ **لوحة تحكم الإدارة** - إدارة شاملة للنظام
✅ **تصميم فاخر** - واجهة حديثة باللغة العربية
✅ **دعم الجوال** - تطبيق Android من خلال Capacitor

## التكنولوجيا المستخدمة

- **Frontend**: Next.js 15.5 + React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore, Authentication)
- **Mobile**: Capacitor + Android
- **AI**: Google Genkit
- **Forms**: React Hook Form + Zod

## البدء السريع

### المتطلبات
```bash
Node.js 18+
npm أو yarn
حساب Firebase
```

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/hishamsalim7222-bot/Hishamm.git
cd Hishamm

# تثبيت المتعلقات
npm install

# إعداد متغيرات البيئة
cp .env.local.example .env.local
# ثم أضف بيانات Firebase الخاصة بك
```

### التطوير

```bash
# تشغيل خادم التطوير
npm run dev

# الفتح في المتصفح
open http://localhost:9002
```

## بيانات تسجيل الدخول للاختبار

### حساب المسؤول:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123`

## هيكل المشروع

```
src/
├── app/                      # صفحات التطبيق
│   ├── page.tsx             # الصفحة الرئيسية
│   ├── login/               # صفحة تسجيل الدخول
│   ├── register/            # صفحة التسجيل
│   ├── dashboard/           # لوحة التحكم للعميل
│   ├── driver/              # لوحة السائق
│   └── admin/               # لوحة المسؤول
├── components/              # مكونات React
│   └── ui/                  # مكونات UI الأساسية
├── lib/
│   ├── firebase/
│   │   ├── config.ts        # إعدادات Firebase
│   │   └── services.ts      # خدمات Firestore
│   └── utils.ts             # دوال مساعدة
├── hooks/                   # React Hooks المخصصة
│   └── useAuth.ts          # hook للمصادقة
└── types/
    └── backend.ts           # أنواع البيانات
```

## Firestore Collections

### users
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "role": "client | driver | admin",
  "isVerified": "boolean",
  "rating": "number",
  "totalRatings": "number",
  "createdAt": "timestamp"
}
```

### requests
```json
{
  "clientId": "string",
  "clientName": "string",
  "pickup": "string",
  "destination": "string",
  "status": "pending | accepted | completed | cancelled",
  "driverId": "string",
  "createdAt": "timestamp"
}
```

### locations
```json
{
  "name": "string",
  "type": "city | village",
  "createdAt": "timestamp"
}
```

## الألوان والتصميم

- **اللون الأساسي (ذهبي)**: `#D9B126`
- **اللون الخلفي (بني غامق)**: `#1A1814`
- **لون التنبيهات (برتقالي)**: `#F27940`
- **الخط الرئيسي**: Tajawal (عربي)

## المساهمة

نرحب بمساهماتك! يرجى:

1. عمل Fork للمستودع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت MIT License

## التواصل والدعم

📧 البريد الإلكتروني: support@sahm-transport.com
📱 رقم الدعم: +963 9XX XXX XXXX
🌐 الموقع: www.sahm-transport.com

---

**تم تطويره بـ ❤️ من قبل فريق سهم للنقل**