import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

type Permission = {
  _id: string;
  name: string;
  group: string;
  description: string;
};

interface RolePermissionEditorProps {
  roleId: string | number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RolePermissionEditor({ roleId, open, onOpenChange }: RolePermissionEditorProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

useEffect(() => {
  if (!roleId) return;

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const [allRes, roleRes] = await Promise.all([
        axios.get("https://api.wedly.info/api/permissions"),
        axios.get(`https://api.wedly.info/api/roles/${roleId}/permissions`)
      ]);

      setAllPermissions(allRes.data.data);
      setRolePermissions(roleRes.data.data.map((perm: any) => perm._id));
    } catch (error) {
      console.error("Error fetching permissions", error);
      toast.error("Lỗi tải quyền");
    } finally {
      setLoading(false);
    }
  };

  fetchPermissions();
}, [roleId]);

  const togglePermission = (permId: string) => {
    setRolePermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId]
    );
  };

  const handleUpdatePermissions = async () => {
    setUpdating(true);
    try {
      await axios.put(`https://api.wedly.info/api/roles/${roleId}/permissions`, { permissionIds: rolePermissions });
      toast.success("Cập nhật quyền thành công!");
    } catch (error) {
      console.error("Update error", error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-[750px] p-0 m-0">
        <DialogHeader className="h-[60px] flex items-start justify-center border-b px-7">
          <DialogTitle className="text-md font-bold">Phân quyền cho vai trò</DialogTitle>
        </DialogHeader>

        <div className="px-7 h-[440px] overflow-auto py-0">
          {loading ? (
            <p className="text-sm text-muted-foreground">Đang tải quyền...</p>
          ) : (
            <Accordion type="multiple" className="w-full py-0 my-0">
              {Object.entries(
                allPermissions.reduce((acc: Record<string, Permission[]>, perm) => {
                  if (!acc[perm.group]) acc[perm.group] = [];
                  acc[perm.group].push(perm);
                  return acc;
                }, {})
              ).map(([groupName, perms]) => (
                <AccordionItem key={groupName} value={groupName} className="mb-3 shadow border border-b-0 rounded-md">
                  <AccordionTrigger className="border-b px-5 mb-0 hover:no-underline data-[state=open]:bg-gray-100" >{groupName}</AccordionTrigger>
                  <AccordionContent className="py-0">
                    <div className="">
                      {perms.map((perm) => (
                        <div
                          key={perm._id}
                          className="flex justify-between items-center gap-1 border-b h-[55px] px-5"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{perm.name}</span>
                            {perm.description && (
                              <p className="text-xs text-muted-foreground">{perm.description}</p>
                            )}
                          </div>
                          <Switch
                            checked={rolePermissions.includes(perm._id)}
                            onCheckedChange={() => togglePermission(perm._id)}
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <DialogFooter className="h-[60px] flex items-center justify-end border-t px-7 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Đóng
            </Button>
          </DialogClose>
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
