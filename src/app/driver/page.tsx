'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/ui/logo';
import { logoutUser, subscribeToPendingRequests, updateTripRequest, getLocations } from '@/lib/firebase/services';
import { MapPin, CheckCircle, Clock, LogOut, Phone, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Request as TripRequest, Location } from '@/types/backend';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');
  const [pendingRequests, setPendingRequests] = useState<(TripRequest & { id: string })[]>([]);
  const [acceptedTrips, setAcceptedTrips] = useState<(TripRequest & { id: string })[]>([]);
  const [locations, setLocations] = useState<(Location & { id: string })[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile?.role !== 'driver') {
      router.push('/login');
    }
  }, [profile, router]);

  useEffect(() => {
    const unsubscribe = subscribeToPendingRequests((requests) => {
      setPendingRequests(requests);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error: any) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive',
        });
      }
    };

    fetchLocations();
  }, [toast]);

  const handleAcceptTrip = async (tripId: string) => {
    try {
      setIsLoading(true);
      await updateTripRequest(tripId, {
        driverId: user?.uid,
        status: 'accepted',
      });

      toast({
        title: 'نجاح',
        description: 'تم قبول الرحلة بنجاح',
      });

      // Move to accepted trips
      const trip = pendingRequests.find(t => t.id === tripId);
      if (trip) {
        setPendingRequests(pendingRequests.filter(t => t.id !== tripId));
        setAcceptedTrips([...acceptedTrips, { ...trip, status: 'accepted' }]);
      }
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
              <div className="flex items-center gap-2 text-xs">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>{profile?.rating?.toFixed(1) || 'N/A'}</span>
              </div>
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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="available" className="relative">
              طلبات متاحة
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-accent text-accent-foreground">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">رحلاتي النشطة</TabsTrigger>
          </TabsList>

          {/* Available Requests Tab */}
          <TabsContent value="available" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">الطلبات المتاحة</h2>
              <p className="text-muted-foreground">اختر من الطلبات المتاحة واقبل الرحلات</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{request.clientName}</CardTitle>
                          <CardDescription>طلب رحلة جديد</CardDescription>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          جديد
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">من</p>
                            <p className="font-semibold">{request.pickup}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">إلى</p>
                            <p className="font-semibold">{request.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        {request.clientDetails && (
                          <p className="text-sm text-muted-foreground mb-3">ملاحظات: {request.clientDetails}</p>
                        )}
                        <Button
                          onClick={() => handleAcceptTrip(request.id)}
                          disabled={isLoading}
                          className="w-full gold-gradient text-primary-foreground font-bold"
                        >
                          {isLoading ? 'جاري القبول...' : 'قبول الرحلة'}
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">لا توجد طلبات متاحة حالياً</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Active Trips Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">رحلاتي النشطة</h2>
              <p className="text-muted-foreground">إدارة الرحلات التي قبلتها</p>
            </div>

            {acceptedTrips.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {acceptedTrips.map((trip) => (
                  <Card key={trip.id} className="border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{trip.clientName}</CardTitle>
                        <Badge className="bg-primary/10 text-primary">قيد التنفيذ</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>{trip.pickup} → {trip.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>تم القبول للتو</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Phone className="ml-2 h-4 w-4" />
                        اتصل بالعميل
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد رحلات نشطة حالياً</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}