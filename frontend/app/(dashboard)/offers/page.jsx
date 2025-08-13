"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OffersManagePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    if (!file) return;
    const res = await api.offers.bulk(file);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button onClick={upload} disabled={!file}>Bulk Upload</Button>
      </div>
      {result && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inserted</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Errors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{result.inserted ?? "-"}</TableCell>
              <TableCell>{result.updated ?? 0}</TableCell>
              <TableCell>{Array.isArray(result.errors) ? result.errors.length : 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}
