'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/ui/logo';
import { getLocations, addLocation, getTripRequests, logoutUser } from '@/lib/firebase/services';
import { useToast } from '@/hooks/use-toast';
import { Location, Request as TripRequest } from '@/types/backend';
import { Plus, LogOut, MapPin, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locations, setLocations] = useState<(Location & { id: string })[]>([]);
  const [trips, setTrips] = useState<(TripRequest & { id: string })[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [locationType, setLocationType] = useState<'city' | 'village'>('city');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsData = await getLocations();
        setLocations(locationsData);

        const tripsData = await getTripRequests();
        setTrips(tripsData);
      } catch (error: any) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLocation) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم الموقع',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await addLocation({
        name: newLocation,
        type: locationType,
      });

      toast({
        title: 'نجاح',
        description: 'تم إضافة الموقع بنجاح',
      });

      setNewLocation('');

      // Refresh locations
      const updatedLocations = await getLocations();
      setLocations(updatedLocations);
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
      localStorage.removeItem('adminAuth');
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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showText={true} />
            <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-semibold">مسؤول</span>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="locations">المواقع</TabsTrigger>
            <TabsTrigger value="trips">الرحلات</TabsTrigger>
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الرحلات</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trips.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">رحلة نشطة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المواقع المدعومة</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{locations.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">مدينة وقرية</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الطلبات المعلقة</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trips.filter(t => t.status === 'pending').length}</div>
                  <p className="text-xs text-muted-foreground mt-1">بانتظار القبول</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">إدارة المواقع</h2>
              <p className="text-muted-foreground">أضف أو حذف المدن والقرى المدعومة</p>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>إضافة موقع جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddLocation} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-right block">اسم الموقع</Label>
                    <Input
                      id="location"
                      placeholder="مثال: دمشق"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-right block">النوع</Label>
                    <div className="flex gap-4 justify-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={locationType === 'city'}
                          onChange={() => setLocationType('city')}
                          className="cursor-pointer"
                        />
                        <span>مدينة</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={locationType === 'village'}
                          onChange={() => setLocationType('village')}
                          className="cursor-pointer"
                        />
                        <span>قرية</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gold-gradient text-primary-foreground font-bold"
                  >
                    {isLoading ? 'جاري الإضافة...' : 'إضافة موقع'}
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">المواقع الحالية</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <Card key={location.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{location.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {location.type === 'city' ? 'مدينة' : 'قرية'}
                          </p>
                        </div>
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">إدارة الرحلات</h2>
              <p className="text-muted-foreground">مراقبة جميع الرحلات والطلبات</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4">العميل</th>
                    <th className="text-right py-3 px-4">من</th>
                    <th className="text-right py-3 px-4">إلى</th>
                    <th className="text-right py-3 px-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id} className="border-b border-border hover:bg-card/50 transition">
                      <td className="py-3 px-4">{trip.clientName}</td>
                      <td className="py-3 px-4">{trip.pickup}</td>
                      <td className="py-3 px-4">{trip.destination}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          trip.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-700'
                            : trip.status === 'accepted'
                            ? 'bg-blue-500/20 text-blue-700'
                            : trip.status === 'completed'
                            ? 'bg-green-500/20 text-green-700'
                            : 'bg-red-500/20 text-red-700'
                        }`}>
                          {trip.status === 'pending' && 'معلق'}
                          {trip.status === 'accepted' && 'مقبول'}
                          {trip.status === 'completed' && 'مكتمل'}
                          {trip.status === 'cancelled' && 'ملغى'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
              <p className="text-muted-foreground">مراقبة والتحقق من بيانات المستخدمين</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قريباً</CardTitle>
                <CardDescription>سيتم إضافة ميزة إدارة المستخدمين قريباً</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}