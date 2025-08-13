"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  QrCode,
  Gift,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Store
} from "lucide-react";

export default function DashboardHome() {
  const [metrics, setMetrics] = useState(null);
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    api.analytics.overview({ storeId })
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, [storeId]);

  const quickActions = [
    {
      title: "Add New Offers",
      description: "Create and manage store offers",
      href: "/dashboard/offers",
      icon: Gift,
      color: "from-[#A4D8E1] to-[#B2E0E6]"
    },
    {
      title: "Generate QR Codes",
      description: "Create QR codes for store sections",
      href: "/dashboard/qr",
      icon: QrCode,
      color: "from-[#B2E0E6] to-[#C4F1F4]"
    },
    {
      title: "Upload Sales Data",
      description: "Import daily sales information",
      href: "/dashboard/sales",
      icon: BarChart3,
      color: "from-[#C4F1F4] to-[#E0F7FA]"
    }
  ];

  const getMetricChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>
          <Badge className="bg-gradient-to-r from-[#A4D8E1] to-[#B2E0E6] text-white border-0">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>

        {/* Store ID Input */}
        <Card className="tranquil-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Store ID</label>
                  <p className="text-xs text-slate-500">Enter your store UUID to view analytics</p>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <Input
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  placeholder="Enter store UUID..."
                  className="tranquil-input"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      {storeId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="tranquil-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total QR Scans</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : (metrics?.totalScans ?? "0")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600 font-medium">+12.5%</span>
                <span className="text-slate-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="tranquil-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Conversions</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : (metrics?.conversions ?? "0")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600 font-medium">+8.2%</span>
                <span className="text-slate-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="tranquil-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : (metrics ? Math.round((metrics.conversionRate || 0) * 100) + "%" : "0%")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-600 font-medium">-2.1%</span>
                <span className="text-slate-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="tranquil-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Spend</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? "..." : (metrics?.avgSpend ? `₹${metrics.avgSpend}` : "₹0")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600 font-medium">+15.3%</span>
                <span className="text-slate-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="tranquil-card hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 group-hover:text-[#A4D8E1] transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#A4D8E1] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {!storeId && (
        <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Welcome to ShopEase Manager!</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Get started by entering your store ID above to view analytics, or use the quick actions to manage your offers,
              generate QR codes, and upload sales data.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/offers">
                <Button className="tranquil-button">
                  <Gift className="w-4 h-4 mr-2" />
                  Manage Offers
                </Button>
              </Link>
              <Link href="/dashboard/qr">
                <Button variant="outline" className="bg-white/80 border-white/30 hover:bg-white/90">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Codes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
