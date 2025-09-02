import React from "react";
import { logout } from "@/services/auth/authService";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux-helper";
import { setUser } from "@/store/auth";

// Type for the AdminHeader props
type AdminHeaderProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle the sidebar
};

const AdminHeader = ({ setOpen }: AdminHeaderProps) => {
  const dispatch = useAppDispatch();

  // Logout handler
  const handleLogout = async () => {
    const delayedLogout = async () => {
      await logout();
    };

    try {
      setTimeout(() => {
        delayedLogout();
        dispatch(setUser(null));
      }, 500);
    } catch (error) {}
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* Button to toggle sidebar visibility */}
      <Button
        className="lg:hidden sm:block"
        onClick={() => setOpen((prev) => !prev)}
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
