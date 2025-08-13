"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { Card } from "@/components/ui/card";

export default function DashboardHome() {
  const [metrics, setMetrics] = useState(null);
  const [storeId, setStoreId] = useState("");

  useEffect(() => {
    if (!storeId) return;
    api.analytics.overview({ storeId }).then(setMetrics).catch(() => setMetrics(null));
  }, [storeId]);

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3">
        <div>
          <label className="text-sm">Store ID</label>
          <input className="border rounded px-2 py-1 ml-2" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="UUID" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-xs text-gray-500">Total Scans</div><div className="text-2xl font-semibold">{metrics?.totalScans ?? "-"}</div></Card>
        <Card className="p-4"><div className="text-xs text-gray-500">Conversions</div><div className="text-2xl font-semibold">{metrics?.conversions ?? "-"}</div></Card>
        <Card className="p-4"><div className="text-xs text-gray-500">Conv. Rate</div><div className="text-2xl font-semibold">{metrics ? Math.round((metrics.conversionRate || 0) * 100) + "%" : "-"}</div></Card>
        <Card className="p-4"><div className="text-xs text-gray-500">Avg Spend</div><div className="text-2xl font-semibold">{metrics?.avgSpend ?? "-"}</div></Card>
      </div>
    </div>
  );
}
