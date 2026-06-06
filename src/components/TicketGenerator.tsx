'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FileUp, CheckCircle, Download } from 'lucide-react';
import { Request as TripRequest } from '@/types/backend';

interface TicketGeneratorProps {
  trip: TripRequest & { id: string };
  driverName: string;
  clientName: string;
}

export function TicketGenerator({
  trip,
  driverName,
  clientName,
}: TicketGeneratorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTicket = async () => {
    try {
      setIsGenerating(true);
      // Simulate ticket generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create HTML ticket
      const ticketHTML = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تذكرة رحلة - سهم للنقل</title>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: 'Tajawal', sans-serif; background: #f5f5f5; padding: 20px; }
            .ticket {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #D9B126 0%, #B88A14 100%);
              color: #1A1814;
              padding: 20px;
              text-align: center;
            }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .content { padding: 30px; }
            .field {
              margin-bottom: 20px;
              border-bottom: 1px dashed #DDD;
              padding-bottom: 15px;
            }
            .label { color: #999; font-size: 12px; margin-bottom: 5px; }
            .value { font-size: 16px; font-weight: bold; color: #1A1814; }
            .footer {
              background: #f5f5f5;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            .qr-code { text-align: center; margin: 20px 0; }
            .qr-code img { width: 150px; height: 150px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>🚕 سهم للنقل</h1>
              <p>تذكرة رحلة رسمية</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">رقم التذكرة</div>
                <div class="value">${trip.id.substring(0, 8).toUpperCase()}</div>
              </div>
              <div class="field">
                <div class="label">العميل</div>
                <div class="value">${clientName}</div>
              </div>
              <div class="field">
                <div class="label">السائق</div>
                <div class="value">${driverName}</div>
              </div>
              <div class="field">
                <div class="label">نقطة الانطلاق</div>
                <div class="value">${trip.pickup}</div>
              </div>
              <div class="field">
                <div class="label">الوجهة</div>
                <div class="value">${trip.destination}</div>
              </div>
              <div class="field">
                <div class="label">التاريخ والوقت</div>
                <div class="value">${new Date().toLocaleDateString('ar-SA')} ${new Date().toLocaleTimeString('ar-SA')}</div>
              </div>
              <div class="field">
                <div class="label">الحالة</div>
                <div class="value" style="color: #4CAF50;">✓ مؤكدة</div>
              </div>
              <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${trip.id}" alt="QR Code">
              </div>
            </div>
            <div class="footer">
              <p>شكراً لاختيارك سهم للنقل</p>
              <p>الرفاهية في كل رحلة</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Print ticket
      const printWindow = window.open('', '', 'height=600,width=400');
      if (printWindow) {
        printWindow.document.write(ticketHTML);
        printWindow.document.close();
        printWindow.print();
      }

      toast({
        title: 'نجاح',
        description: 'تم إنشاء التذكرة بنجاح',
      });

      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gold-gradient text-primary-foreground font-bold">
          <Download className="ml-2 h-4 w-4" />
          طباعة التذكرة
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء وطباعة التذكرة</DialogTitle>
          <DialogDescription>
            سيتم إنشاء تذكرة الرحلة بصيغة قابلة للطباعة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">تفاصيل الرحلة:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>من: {trip.pickup}</p>
              <p>إلى: {trip.destination}</p>
              <p>السائق: {driverName}</p>
              <p>العميل: {clientName}</p>
            </div>
          </div>

          <Button
            onClick={generateTicket}
            disabled={isGenerating}
            className="w-full gold-gradient text-primary-foreground font-bold h-12"
          >
            {isGenerating ? (
              'جاري الإنشاء...'
            ) : (
              <>
                <FileUp className="ml-2 h-4 w-4" />
                إنشاء وطباعة التذكرة
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}