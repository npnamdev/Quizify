import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner"; // Sử dụng thư viện toast nếu có

type Permission = {
  _id: string;
  name: string;
  group: string;
  description: string;
};

export default function RolePermissionEditor({ roleId }: { roleId: string }) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const [allRes, roleRes] = await Promise.all([
          axios.get("https://api.wedly.info/api/permissions"),
          axios.get(`https://api.wedly.info/api/roles/${roleId}/permissions`)
        ]);

        setAllPermissions(allRes.data.data);
        setRolePermissions(roleRes.data.data.map((perm: any) => perm.name));
      } catch (error) {
        console.error("Error fetching permissions", error);
        toast.error("Lỗi tải quyền");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [roleId]);

  const togglePermission = (perm: string) => {
    setRolePermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const handleUpdatePermissions = async () => {
    setUpdating(true);
    try {
      await axios.put(`https://api.wedly.info/api/roles/${roleId}/permissions`, {
        permissions: rolePermissions,
      });
      toast.success("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Update error", error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chỉnh sửa quyền vai trò</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Phân quyền cho vai trò</DialogTitle>
          <DialogDescription>
            Bật/tắt các quyền bên dưới để điều chỉnh quyền của vai trò này.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải quyền...</p>
        ) : (
          <Accordion type="multiple" className="w-full max-h-[60vh] overflow-y-auto pr-2">
            {Object.entries(
              allPermissions.reduce((acc: Record<string, Permission[]>, perm) => {
                if (!acc[perm.group]) acc[perm.group] = [];
                acc[perm.group].push(perm);
                return acc;
              }, {})
            ).map(([groupName, perms]) => (
              <AccordionItem key={groupName} value={groupName}>
                <AccordionTrigger>{groupName}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {perms.map((perm) => (
                      <div
                        key={perm._id}
                        className="flex flex-col gap-1 border-b pb-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{perm.name}</span>
                          <Switch
                            checked={rolePermissions.includes(perm.name)}
                            onCheckedChange={() => togglePermission(perm.name)}
                          />
                        </div>
                        {perm.description && (
                          <p className="text-xs text-muted-foreground">{perm.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <DialogFooter className="mt-4">
          <Button
            onClick={handleUpdatePermissions}
            disabled={updating || loading}
          >
            {updating ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
