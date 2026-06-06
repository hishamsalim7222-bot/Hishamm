'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/lib/firebase/services';
import { Logo } from '@/components/ui/logo';
import { ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await loginUser(loginEmail, loginPassword);
      toast({
        title: 'نجاح',
        description: 'تم تسجيل الدخول بنجاح',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminUsername || !adminPassword) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    // For now, admin login is handled locally
    // In production, this should be verified against Firebase
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      toast({
        title: 'نجاح',
        description: 'تم تسجيل الدخول كمسؤول',
      });
      router.push('/admin');
    } else {
      toast({
        title: 'خطأ',
        description: 'بيانات المسؤول غير صحيحة',
        variant: 'destructive',
      });
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
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user">العميل / السائق</TabsTrigger>
              <TabsTrigger value="admin">المسؤول</TabsTrigger>
            </TabsList>

            {/* User Login Tab */}
            <TabsContent value="user" className="space-y-6">
              <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-headline font-bold">تسجيل الدخول</h2>
                <p className="text-muted-foreground">ادخل بيانات حسابك للمتابعة</p>
              </div>

              <form onSubmit={handleUserLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pr-10 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-gradient text-primary-foreground font-bold h-12 rounded-xl"
                >
                  {loading ? 'جاري التحميل...' : 'دخول'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="text-primary hover:underline font-bold">
                  إنشاء حساب
                </Link>
              </div>
            </TabsContent>

            {/* Admin Login Tab */}
            <TabsContent value="admin" className="space-y-6">
              <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-headline font-bold">لوحة التحكم</h2>
                <p className="text-muted-foreground text-sm text-accent">للمسؤولين فقط</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-right block">اسم المستخدم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="اسم المستخدم"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-gradient text-primary-foreground font-bold h-12 rounded-xl"
                >
                  {loading ? 'جاري التحميل...' : 'دخول'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p>تطبيق سهم للنقل © 2024</p>
            <p className="mt-2">جميع البيانات محمية وآمنة</p>
          </div>
        </div>
      </div>
    </div>
  );
}