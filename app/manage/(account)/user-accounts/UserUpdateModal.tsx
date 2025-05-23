import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useRoles } from "@/hooks/use-roles";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UserUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | number | null;
}

export default function UserUpdateModal({
  open,
  onOpenChange,
  userId,
}: UserUpdateModalProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } =
    useRoles({
      page: 0,
      pageSize: 100,
    });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !open) return;

      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/users/${userId}`);

        setUsername(data.username || "");
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
        setRole(data.role || "");
        setIsVerified(data.isVerified || false);
        setAvatarUrl(data.avatarUrl || "");
        setAddress({
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postalCode: data.address?.postalCode || "",
          country: data.address?.country || "",
        });
      } catch (error: any) {
        alert("Lỗi khi tải thông tin người dùng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, open]);

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);

    try {
      await axiosInstance.put(`/api/users/${userId}`, {
        username,
        fullName,
        email,
        phoneNumber,
        role,
        isVerified,
        avatarUrl,
        address,
      });

      alert("Cập nhật người dùng thành công!");
      onOpenChange(false);
    } catch (error: any) {
      alert(`Cập nhật thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // helper for updating nested address state
  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
   <Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="right" className="max-w-lg overflow-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6">
    <SheetHeader className="mb-6">
      <SheetTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Chỉnh sửa người dùng
      </SheetTitle>
      <SheetDescription className="text-gray-500 dark:text-gray-400">
        {isLoading ? "Đang tải thông tin..." : "Cập nhật thông tin người dùng"}
      </SheetDescription>
    </SheetHeader>

    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tên đăng nhập
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Họ và tên
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Nhập họ và tên"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Nhập email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Số điện thoại
        </Label>
        <Input
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Vai trò
        </Label>
        {rolesLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Đang tải vai trò...</p>
        ) : rolesError ? (
          <p className="text-red-500">Lỗi tải vai trò</p>
        ) : (
          <Select
            onValueChange={setRole}
            value={role}
            disabled={rolesLoading || isLoading}
          >
            <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {rolesData?.data?.map((roleItem: any) => (
                <SelectItem
                  key={roleItem.id || roleItem._id}
                  value={roleItem.name}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  {roleItem.displayName || roleItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Switch
          id="isVerified"
          checked={isVerified}
          onCheckedChange={(checked) => setIsVerified(!!checked)}
          disabled={isLoading}
          className="data-[state=checked]:bg-blue-500 transition-colors duration-200"
        />
        <Label htmlFor="isVerified" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Đã xác minh
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          URL ảnh đại diện
        </Label>
        <Input
          id="avatarUrl"
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Nhập URL ảnh đại diện"
        />
      </div>

      <fieldset className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg space-y-4">
        <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2">
          Địa chỉ
        </legend>

        <div className="space-y-2">
          <Label htmlFor="street" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Đường phố
          </Label>
          <Input
            id="street"
            type="text"
            value={address.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Nhập tên đường"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Thành phố
          </Label>
          <Input
            id="city"
            type="text"
            value={address.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Nhập thành phố"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tỉnh/Thành
          </Label>
          <Input
            id="state"
            type="text"
            value={address.state}
            onChange={(e) => handleAddressChange("state", e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Nhập tỉnh/thành"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mã bưu điện
          </Label>
          <Input
            id="postalCode"
            type="text"
            value={address.postalCode}
            onChange={(e) => handleAddressChange("postalCode", e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Nhập mã bưu điện"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quốc gia
          </Label>
          <Input
            id="country"
            type="text"
            value={address.country}
            onChange={(e) => handleAddressChange("country", e.target.value)}
            disabled={isLoading}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Nhập quốc gia"
          />
        </div>
      </fieldset>

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isSaving}
          className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
        >
          {isSaving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  </SheetContent>
</Sheet>
  );
}
