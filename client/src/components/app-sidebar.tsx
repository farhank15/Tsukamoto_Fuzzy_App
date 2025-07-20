import { LayoutDashboardIcon, LibraryBig, ScatterChart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { getRoleFromAccessTokenCookie } from "@/lib/JwtDecode";
import { UserMenu } from "@/components/UserMenu";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboardIcon,
    role: "admin",
  },
  {
    title: "Statistics",
    url: "/admin/statistics",
    icon: ScatterChart,
    role: "admin",
  },
  {
    title: "Documentation",
    url: "/admin/fuzzy-proccessing",
    icon: LibraryBig,
    role: "admin",
  },
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: LayoutDashboardIcon,
    role: "student",
  },
  // {
  //   title: "Statistics",
  //   url: "/student/statistics",
  //   icon: ScatterChart,
  //   role: "student",
  // },
  // {
  //   title: "Form",
  //   url: "/student/form",
  //   icon: FormInput,
  //   role: "student",
  // },
];

export function AppSidebar() {
  const role =
    typeof document !== "undefined" ? getRoleFromAccessTokenCookie() : null;

  const filteredItems = role ? items.filter((item) => item.role === role) : [];

  return (
    <>
      <Sidebar className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="mt-auto mb-4 flex justify-center">
        <UserMenu />
      </div>
    </>
  );
}
