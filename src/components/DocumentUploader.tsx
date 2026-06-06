'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle } from 'lucide-react';

interface DocumentUploaderProps {
  userId: string;
  documentType: string;
  onUploadSuccess?: (url: string) => void;
}

export function DocumentUploader({
  userId,
  documentType,
  onUploadSuccess,
}: DocumentUploaderProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'خطأ',
          description: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار ملف',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockUrl = `https://storage.example.com/${userId}/${documentType}_${Date.now()}`;

      toast({
        title: 'نجاح',
        description: 'تم تحميل الملف بنجاح',
      });

      setOpen(false);
      setSelectedFile(null);
      onUploadSuccess?.(mockUrl);
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
        <Button variant="outline" className="w-full">
          <Upload className="ml-2 h-4 w-4" />
          تحميل {documentType}
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>تحميل {documentType}</DialogTitle>
          <DialogDescription>
            حمّل صورة واضحة من {documentType}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="document" className="text-right block">
              اختر الملف
            </Label>
            <Input
              id="document"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground text-right">
              الملفات المدعومة: صور (JPG, PNG) و PDF (الحد الأقصى 5 ميجابايت)
            </p>
          </div>

          {/* File Preview */}
          {selectedFile && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <p className="text-sm font-semibold">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            className="w-full gold-gradient text-primary-foreground font-bold h-12"
          >
            {isLoading ? (
              'جاري التحميل...'
            ) : (
              <>
                <CheckCircle className="ml-2 h-4 w-4" />
                تأكيد التحميل
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}