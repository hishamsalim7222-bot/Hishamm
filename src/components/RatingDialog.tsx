'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createRating } from '@/lib/firebase/services';
import { Star } from 'lucide-react';
import { Request as TripRequest } from '@/types/backend';

interface RatingDialogProps {
  trip: TripRequest & { id: string };
  driverId: string;
  clientId: string;
  onRatingSubmitted?: () => void;
}

export function RatingDialog({
  trip,
  driverId,
  clientId,
  onRatingSubmitted,
}: RatingDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitRating = async () => {
    try {
      setIsLoading(true);
      await createRating({
        driverId,
        clientId,
        requestId: trip.id,
        score,
        comment,
      });

      toast({
        title: 'نجاح',
        description: 'تم تسجيل التقييم بنجاح',
      });

      setOpen(false);
      setScore(5);
      setComment('');
      onRatingSubmitted?.();
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
          تقييم الرحلة
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>تقييم الرحلة</DialogTitle>
          <DialogDescription>
            شارك تجربتك مع السائق لمساعدة المستخدمين الآخرين
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Star Rating */}
          <div className="space-y-3">
            <Label className="text-right block">التقييم</Label>
            <div className="flex gap-2 justify-end">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setScore(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= score
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-right block">
              التعليق (اختياري)
            </Label>
            <Textarea
              id="comment"
              placeholder="شارك رأيك في الخدمة..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-right"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitRating}
            disabled={isLoading}
            className="w-full gold-gradient text-primary-foreground font-bold"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}