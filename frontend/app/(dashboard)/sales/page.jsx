"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function SalesUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    if (!file) return;
    try {
      const res = await api.sales.upload(file);
      setResult(res);
      toast.success("Sales uploaded");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Sales Excel (.xlsx)</label>
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <Button onClick={upload} disabled={!file}>Upload</Button>
      {result && (
        <Card className="p-4 text-sm">Inserted rows: {result.inserted ?? 0}</Card>
      )}
    </div>
  );
}
