"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Gift,
  QrCode,
  Upload,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  Sparkles,
  Store
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Offers", href: "/dashboard/offers", icon: Gift },
  { name: "QR Codes", href: "/dashboard/qr", icon: QrCode },
  { name: "Sales Upload", href: "/dashboard/sales", icon: Upload },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 leading-tight">ShopEase</h1>
              <p className="text-xs text-gray-500">Manager Portal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User profile */}
        <div className="px-4 py-5">
          <Card className="border border-gray-200 shadow-sm">
            <div className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">Store Manager</p>
                <p className="text-sm text-gray-500 truncate">manager@store.com</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all
                  ${isActive
                    ? "bg-primary text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 w-full px-4 text-center text-xs text-gray-400">
          <p>ShopEase Manager v1.0</p>
          <p className="mt-1">© 2024 ShopEase</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-gray-800">ShopEase Manager</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
