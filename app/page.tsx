"use client";

import React from "react";
import ImageCropper from "@/components/ui-custom/ImageCropper";
import ImageUploader from "@/components/ui-custom/ImageUploader";
import MultiImageUploader from "@/components/ui-custom/MultiImageUploader";
import MultiImageUploader2 from "@/components/ui-custom/MultiImageUploader2";

const NotificationsPage = () => {

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <MultiImageUploader />
      <br /><hr />
      <MultiImageUploader2 />
      {/* <ImageUploader /> */}
      <ImageCropper />
    </div>
  );
};

export default NotificationsPage;
