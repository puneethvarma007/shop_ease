"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

export default function QRGeneratorPage() {
  const [storeSlug, setStoreSlug] = useState("my-store");
  const [storeId, setStoreId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const svgRef = useRef(null);

  const url = useMemo(() => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const path = `/${storeSlug}${sectionId ? `/offers` : ""}`;
    const qs = new URLSearchParams({ storeId, ...(sectionId ? { sectionId } : {}) }).toString();
    return `${base}${path}${qs ? `?${qs}` : ""}`;
  }, [storeSlug, storeId, sectionId]);

  const download = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 220;
    canvas.height = 220;

    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `${storeSlug}${sectionId ? `-${sectionId}` : ""}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Store Slug</label>
        <input className="border rounded px-2 py-1 w-full" value={storeSlug} onChange={(e) => setStoreSlug(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Store ID (UUID)</label>
          <input className="border rounded px-2 py-1 w-full" value={storeId} onChange={(e) => setStoreId(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Section ID (optional)</label>
          <input className="border rounded px-2 py-1 w-full" value={sectionId} onChange={(e) => setSectionId(e.target.value)} />
        </div>
      </div>

      <div className="bg-white p-4 rounded border w-fit">
        <QRCodeSVG value={url || ""} size={220} marginSize={4} ref={svgRef} />
      </div>
      <div className="flex items-center gap-3">
        <input className="border rounded px-2 py-1 flex-1" value={url} readOnly />
        <Button onClick={download}>Download PNG</Button>
      </div>
    </div>
  );
}
