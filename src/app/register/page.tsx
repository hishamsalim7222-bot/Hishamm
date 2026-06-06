'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/lib/firebase/services';
import { Logo } from '@/components/ui/logo';
import { ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'client' | 'driver',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمات المرور غير متطابقة',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'خطأ',
        description: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData.email, formData.password, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isVerified: false,
      });

      toast({
        title: 'نجاح',
        description: 'تم إنشاء حسابك بنجاح',
      });

      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'خطأ في التسجيل',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b border-border/50 p-6">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition">
          <Logo showText={true} />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="space-y-2 text-center mb-8">
            <h2 className="text-3xl font-headline font-bold">إنشاء حساب جديد</h2>
            <p className="text-muted-foreground">انضم إلى تطبيق سهم للنقل اليوم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-right block">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="محمد أحمد"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pr-10 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right block">رقم الهاتف (اختياري)</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+963 9X XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pr-10 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-right block">اختر دورك</Label>
              <RadioGroup value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'client' | 'driver' }))}>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="cursor-pointer flex-1 text-right">
                    <div className="font-bold">عميل</div>
                    <div className="text-sm text-muted-foreground">ابحث عن رحلات ميسرة</div>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition">
                  <RadioGroupItem value="driver" id="driver" />
                  <Label htmlFor="driver" className="cursor-pointer flex-1 text-right">
                    <div className="font-bold">سائق</div>
                    <div className="text-sm text-muted-foreground">قدم خدمات نقل احترافية</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground font-bold h-12 rounded-xl"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-primary hover:underline font-bold">
              تسجيل الدخول
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p>بالتسجيل، أنت توافق على شروط الخدمة</p>
            <p className="mt-2">جميع بيانات المستخدمين محمية بموجب سياسة الخصوصية</p>
          </div>
        </div>
      </div>
    </div>
  );
}