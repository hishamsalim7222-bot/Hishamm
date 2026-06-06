'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, CheckCircle } from 'lucide-react';

interface PaymentDialogProps {
  amount: number;
  tripId: string;
  onPaymentSuccess?: () => void;
}

export function PaymentDialog({
  amount,
  tripId,
  onPaymentSuccess,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار طريقة الدفع',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'نجاح',
        description: `تم الدفع بنجاح عبر ${paymentMethod}`,
      });

      setOpen(false);
      setPaymentMethod('');
      onPaymentSuccess?.();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gold-gradient text-primary-foreground font-bold">
          <CreditCard className="ml-2 h-4 w-4" />
          دفع {amount} ل.س
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>اختر طريقة الدفع</DialogTitle>
          <DialogDescription>
            الدفع الآمن والسريع لرحلتك
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Amount Display */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">المبلغ المستحق</p>
                <p className="text-3xl font-bold text-primary">{amount} ل.س</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-right block">طريقة الدفع</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">بطاقة ائتمان</SelectItem>
                <SelectItem value="wallet">المحفظة الرقمية</SelectItem>
                <SelectItem value="bank">التحويل البنكي</SelectItem>
                <SelectItem value="cash">الدفع نقداً</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full gold-gradient text-primary-foreground font-bold h-12"
          >
            {isLoading ? (
              'جاري معالجة الدفع...'
            ) : (
              <>
                <CheckCircle className="ml-2 h-4 w-4" />
                تأكيد الدفع
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}