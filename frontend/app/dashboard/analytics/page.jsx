"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  QrCode,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Target,
  Sparkles
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AnalyticsPage() {
  const [storeId, setStoreId] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  // Mock data for demonstration
  const mockData = {
    overview: {
      totalScans: 1247,
      conversions: 89,
      conversionRate: 7.1,
      avgSpend: 2450,
      footfall: 1580,
      windowShoppers: 1158
    },
    scanTrends: [
      { date: "Jan 8", scans: 45, conversions: 3 },
      { date: "Jan 9", scans: 52, conversions: 4 },
      { date: "Jan 10", scans: 48, conversions: 2 },
      { date: "Jan 11", scans: 61, conversions: 5 },
      { date: "Jan 12", scans: 55, conversions: 4 },
      { date: "Jan 13", scans: 67, conversions: 6 },
      { date: "Jan 14", scans: 58, conversions: 3 }
    ],
    hourlyDistribution: [
      { hour: "9 AM", scans: 12 },
      { hour: "10 AM", scans: 19 },
      { hour: "11 AM", scans: 25 },
      { hour: "12 PM", scans: 32 },
      { hour: "1 PM", scans: 28 },
      { hour: "2 PM", scans: 35 },
      { hour: "3 PM", scans: 42 },
      { hour: "4 PM", scans: 38 },
      { hour: "5 PM", scans: 45 },
      { hour: "6 PM", scans: 52 },
      { hour: "7 PM", scans: 48 },
      { hour: "8 PM", scans: 35 }
    ],
    sectionBreakdown: [
      { name: "Jewelry", value: 35, color: "#A4D8E1" },
      { name: "Fashion", value: 28, color: "#B2E0E6" },
      { name: "Electronics", value: 20, color: "#C4F1F4" },
      { name: "Home Decor", value: 17, color: "#E0F7FA" }
    ]
  };

  useEffect(() => {
    if (storeId) {
      loadAnalytics();
    }
  }, [storeId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // const data = await api.analytics.overview({ storeId, dateRange });

      // For demo, use mock data
      setTimeout(() => {
        setMetrics(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      setMetrics(mockData); // Fallback to mock data
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="tranquil-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            {change && (
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600 font-medium">{change}</span>
                <span className="text-slate-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h1>
            <p className="text-slate-600">Track your store performance and customer engagement</p>
          </div>
        </div>

        <Button onClick={loadAnalytics} disabled={loading || !storeId} className="tranquil-button">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="tranquil-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-slate-500" />
              <span className="font-medium text-slate-700">Filters:</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Store ID:</label>
              <Input
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                placeholder="Enter store UUID"
                className="w-64 tranquil-input"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Period:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32 tranquil-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Today</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>


	            <Button
	              variant="outline"
	              className="ml-auto"
	              onClick={async () => {
	                try {
	                  const rows = [
	                    ["Metric","Value"],
	                    ["Total QR Scans", String(metrics?.overview.totalScans ?? 0)],
	                    ["Conversions", String(metrics?.overview.conversions ?? 0)],
	                    ["Conversion Rate", `${metrics ? metrics.overview.conversionRate : 0}%`],
	                    ["Avg Spend", `₹${metrics ? metrics.overview.avgSpend : 0}`],
	                  ];
	                  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
	                  const href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
	                  const a = document.createElement('a');
	                  a.href = href;
	                  a.download = `analytics_${new Date().toISOString().slice(0,10)}.csv`;
	                  document.body.appendChild(a);
	                  a.click();
	                  a.remove();
	                } catch (e) {}
	              }}
	              disabled={!metrics}
	            >
	              <Download className="w-4 h-4 mr-2" />
	              Export Report
	            </Button>


          </div>
        </CardContent>
      </Card>

      {!storeId ? (
        <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Enter Store ID to View Analytics</h3>
            <p className="text-slate-600">
              Please enter your store UUID in the filter above to load your analytics data.
            </p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-[#A4D8E1] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics data...</p>
        </div>
      ) : metrics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total QR Scans"
              value={metrics.overview.totalScans.toLocaleString()}
              change="+12.5%"
              icon={QrCode}
              color="bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <MetricCard
              title="Conversions"
              value={metrics.overview.conversions}
              change="+8.2%"
              icon={ShoppingCart}
              color="bg-gradient-to-br from-emerald-400 to-emerald-600"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics.overview.conversionRate}%`}
              change="-2.1%"
              icon={Target}
              color="bg-gradient-to-br from-purple-400 to-purple-600"
            />
            <MetricCard
              title="Avg Spend"
              value={`₹${metrics.overview.avgSpend.toLocaleString()}`}
              change="+15.3%"
              icon={DollarSign}
              color="bg-gradient-to-br from-orange-400 to-orange-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Scan Trends */}
            <Card className="tranquil-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#A4D8E1]" />
                  QR Scan Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.scanTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #A4D8E1',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="#A4D8E1"
                      fill="url(#scanGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A4D8E1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#A4D8E1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card className="tranquil-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#A4D8E1]" />
                  Hourly Scan Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.hourlyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #A4D8E1',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="scans" fill="#A4D8E1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Section Breakdown */}
            <Card className="tranquil-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#A4D8E1]" />
                  Section Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={metrics.sectionBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.sectionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {metrics.sectionBreakdown.map((section, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: section.color }}
                        />
                        <span className="text-sm text-slate-600">{section.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{section.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Behavior */}
            <Card className="tranquil-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#A4D8E1]" />
                  Customer Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Footfall</span>
                    <span className="font-semibold text-slate-800">{metrics.overview.footfall}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">QR Scanners</span>
                    <span className="font-semibold text-slate-800">{metrics.overview.totalScans}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Window Shoppers</span>
                    <span className="font-semibold text-slate-800">{metrics.overview.windowShoppers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Buyers</span>
                    <span className="font-semibold text-slate-800">{metrics.overview.conversions}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Engagement Rate</span>
                      <span className="font-medium">
                        {((metrics.overview.totalScans / metrics.overview.footfall) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#A4D8E1] to-[#B2E0E6] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(metrics.overview.totalScans / metrics.overview.footfall) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#A4D8E1]" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Peak Hours:</strong> 6-7 PM shows highest engagement
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Top Section:</strong> Jewelry drives 35% of all scans
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Conversion:</strong> 7.1% rate is above industry average
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Opportunity:</strong> Increase fashion section promotion
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
