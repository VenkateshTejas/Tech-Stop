import React from "react";
import { useNavigate } from "react-router-dom";
import { ChartNoAxesCombined } from "lucide-react";
import { adminSidebarMenuIcons } from "@/config";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// Admin Sidebar props type definition
type AdminSidebarProps = {
  open: boolean;
  setopen: React.Dispatch<React.SetStateAction<boolean>>; // setOpen function type
};

const AdminSidebar = ({ open, setopen }: AdminSidebarProps) => {
  const navigate = useNavigate();

  // MenuItems Component
  const MenuItems = ({ onClose }: { onClose?: () => void }) => {
    return (
      <nav className="mt-8 flex flex-col gap-2">
        {adminSidebarMenuIcons.map((menuItem) => {
          return (
            <div
              onClick={() => {
                navigate(menuItem.path);
                onClose?.(); // Close the sheet if onClose is provided
              }}
              className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-200"
              key={menuItem.id}
            >
              <menuItem.icon size={20} /> {/* Render icon as a JSX element */}
              <span>{menuItem.name}</span>
            </div>
          );
        })}
      </nav>
    );
  };

  return (
    <>
      {/* Mobile Sheet Sidebar */}
      <Sheet open={open} onOpenChange={setopen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            {/* Pass onClose to close the sheet when a menu item is clicked */}
            <MenuItems onClose={() => setopen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </>
  );
};

export default AdminSidebar;
