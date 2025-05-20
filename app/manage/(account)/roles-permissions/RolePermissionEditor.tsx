import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function RolePermissionEditor({ roleId }: { roleId: string }) {
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const [allRes, roleRes] = await Promise.all([
          axios.get("https://api.wedly.info/api/permissions"),
          axios.get(`https://api.wedly.info/api/roles/${roleId}/permissions`)
        ]);

        setAllPermissions(allRes.data.data.map((perm: any) => perm.name));

        setRolePermissions(roleRes.data.data.map((perm: any) => perm.name));
      } catch (error) {
        console.error("Error fetching permissions", error);
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
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {allPermissions.map((perm) => (
              <div
                key={perm}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="text-sm font-medium">{perm}</span>
                <Switch
                  checked={rolePermissions.includes(perm)}
                  onCheckedChange={() => togglePermission(perm)}
                />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
