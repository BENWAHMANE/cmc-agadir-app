import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Loader2, Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface InstitutionImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  image_type: string;
  display_order: number;
  is_active: boolean;
}

export function ImageManager() {
  const [images, setImages] = useState<InstitutionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageType, setImageType] = useState<string>("gallery");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from("institution_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("خطأ في تحميل الصور");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("institution-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("institution-images")
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from("institution_images")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          image_url: publicUrl,
          image_type: imageType,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success("تم رفع الصورة بنجاح");
      setTitle("");
      setDescription("");
      setFile(null);
      setImageType("gallery");
      loadImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("خطأ في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("institution_images")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("تم تحديث حالة الصورة");
      loadImages();
    } catch (error) {
      console.error("Error toggling image:", error);
      toast.error("خطأ في تحديث الصورة");
    }
  };

  const deleteImage = async (id: string, imageUrl: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/institution-images/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("institution-images").remove([filePath]);
      }

      const { error } = await supabase
        .from("institution_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف الصورة بنجاح");
      loadImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("خطأ في حذف الصورة");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">رفع صورة جديدة</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان الصورة"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف الصورة (اختياري)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-type">نوع الصورة</Label>
            <Select value={imageType} onValueChange={setImageType}>
              <SelectTrigger id="image-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">صورة رئيسية (Hero)</SelectItem>
                <SelectItem value="gallery">معرض الصور</SelectItem>
                <SelectItem value="activity">الأنشطة</SelectItem>
                <SelectItem value="facility">المرافق</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">الصورة</Label>
            <Input
              id="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="ml-2 h-4 w-4" />
                رفع الصورة
              </>
            )}
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">الصور المرفوعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h4 className="font-semibold text-foreground">{image.title}</h4>
                {image.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-accent rounded">
                    {image.image_type === "hero" && "رئيسية"}
                    {image.image_type === "gallery" && "معرض"}
                    {image.image_type === "activity" && "نشاط"}
                    {image.image_type === "facility" && "مرفق"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      image.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {image.is_active ? "نشطة" : "غير نشطة"}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(image.id, image.is_active)}
                  >
                    {image.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteImage(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {images.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            لا توجد صور مرفوعة بعد
          </p>
        )}
      </div>
    </div>
  );
}
