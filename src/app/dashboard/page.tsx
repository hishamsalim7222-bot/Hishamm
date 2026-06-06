'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/ui/logo';
import { logoutUser, getPendingRequests, createTripRequest } from '@/lib/firebase/services';
import { MapPin, Search, Plus, LogOut, Clock, DollarSign, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Request as TripRequest } from '@/types/backend';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [trips, setTrips] = useState<(TripRequest & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile?.role !== 'client') {
      router.push('/login');
    }
  }, [profile, router]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getPendingRequests();
        setTrips(data);
      } catch (error: any) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    fetchTrips();
  }, [toast]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupLocation || !destination) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await createTripRequest({
        clientId: user?.uid || '',
        clientName: profile?.fullName || '',
        pickup: pickupLocation,
        destination,
        status: 'pending',
      });

      toast({
        title: 'نجاح',
        description: 'تم إنشاء طلب الرحلة بنجاح',
      });

      setPickupLocation('');
      setDestination('');
      setActiveTab('active');
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Logo showText={false} />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showText={true} />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm">{profile?.fullName}</p>
              <p className="text-xs text-muted-foreground">عميل</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="browse">البحث عن رحلات</TabsTrigger>
            <TabsTrigger value="request">طلب رحلة جديدة</TabsTrigger>
            <TabsTrigger value="history">سجل الرحلات</TabsTrigger>
          </TabsList>

          {/* Browse Trips Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">الرحلات المتاحة</h2>
              <p className="text-muted-foreground">اختر من الرحلات المتاحة وتواصل مع السائقين</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">رحلة متاحة</CardTitle>
                          <CardDescription>من {trip.pickup} إلى {trip.destination}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="inline-block bg-primary/10 px-3 py-1 rounded-full">
                            <span className="text-sm font-bold text-primary">متاح</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">نقطة الانطلاق</p>
                          <p className="font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {trip.pickup}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">الوجهة</p>
                          <p className="font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {trip.destination}
                          </p>
                        </div>
                      </div>

                      <Button className="w-full gold-gradient text-primary-foreground font-bold">
                        التفاصيل
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">لا توجد رحلات متاحة حالياً</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Request Trip Tab */}
          <TabsContent value="request" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">طلب رحلة جديدة</h2>
              <p className="text-muted-foreground">حدد موقع الانطلاق والوجهة وسيقبل أحد السائقين طلبك</p>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>تفاصيل الرحلة</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTrip} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="text-right block">نقطة الانطلاق</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="pickup"
                        placeholder="أدخل موقع الانطلاق"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="pr-10 text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-right block">الوجهة</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="أدخل موقع الوجهة"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="pr-10 text-right"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gold-gradient text-primary-foreground font-bold h-12 rounded-xl"
                  >
                    {isLoading ? 'جاري الإنشاء...' : 'إنشاء طلب الرحلة'}
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">سجل الرحلات</h2>
              <p className="text-muted-foreground">عرض جميع رحلاتك السابقة والحالية</p>
            </div>

            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد رحلات سابقة</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}