import ConfirmDialog from "@/components/common/ConfirmDialog";
import ImageCropUploader from "@/components/ui-custom/ImageCropUploader";
import { toast } from "sonner"

export default function Home() {
  const handleDelete = () => {
    console.log("Đã xác nhận xóa!");
    toast.success("Đã xác nhận xóa!");
  };

  return (
    <div>
      <ImageCropUploader />
      <ConfirmDialog
        title="Bạn có chắc chắn muốn xóa?"
        description="Thao tác này không thể hoàn tác. Tài khoản và dữ liệu sẽ bị xóa vĩnh viễn."
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        onConfirm={handleDelete}
      />
    </div>
  );
}
