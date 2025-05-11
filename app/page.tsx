import NotificationList from "@/components/ui-custom/NotificationList";
import NotificationDialog from "@/components/ui-custom/NotificationDialog";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <NotificationDialog />
      <NotificationList />
    </div>
  );
}
