"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  QrCode,
  Download,
  Copy,
  Store,
  MapPin,
  Link as LinkIcon,
  Sparkles,
  CheckCircle,
  FileImage,
  Printer
} from "lucide-react";
import { toast } from "sonner";

export default function QRGeneratorPage() {
  const [storeSlug, setStoreSlug] = useState("my-store");
  const [storeId, setStoreId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [qrSize, setQrSize] = useState("220");
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);

  const url = useMemo(() => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const isMain = sectionId === "main" || sectionId === "";
    const path = `/${storeSlug}${!isMain ? `/offers` : ""}`;
    const qs = new URLSearchParams({ storeId, ...(!isMain ? { sectionId } : {}) }).toString();
    return `${base}${path}${qs ? `?${qs}` : ""}`;
  }, [storeSlug, storeId, sectionId]);

  const sectionName = sectionId ? sectionId.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : '';

  const storeName = storeSlug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const download = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const size = parseInt(qrSize);
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `${storeSlug}${sectionId ? `-${sectionId}` : ""}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("QR Code downloaded successfully!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const predefinedSections = [
    { id: "main", name: "Main Store" },
    { id: "jewelry", name: "Jewelry" },
    { id: "fashion", name: "Fashion" },
    { id: "kids", name: "Kids" },
    { id: "electronics", name: "Electronics" },
    { id: "home-decor", name: "Home Decor" },
    { id: "sports", name: "Sports" },
    { id: "beauty", name: "Beauty" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">QR Code Generator</h1>
            <p className="text-slate-600">Create QR codes for your store and sections</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#A4D8E1]" />
                Store Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Store Slug</label>
                <Input
                  value={storeSlug}
                  onChange={(e) => setStoreSlug(e.target.value)}
                  placeholder="e.g., my-awesome-store"
                  className="tranquil-input"
                />
                <p className="text-xs text-slate-500">This will be part of your store URL</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Store ID (UUID)</label>
                <Input
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  placeholder="Enter your store UUID"
                  className="tranquil-input"
                />
                <p className="text-xs text-slate-500">Unique identifier for your store</p>
              </div>
            </CardContent>
          </Card>

          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A4D8E1]" />
                Section Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Section</label>
                <Select value={sectionId} onValueChange={setSectionId}>
                  <SelectTrigger className="tranquil-input">
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedSections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Leave as "Main Store" for general store QR, or select a specific section
                </p>
              </div>

              {sectionId && (
                <div className="p-3 bg-[#A4D8E1]/10 rounded-lg border border-[#A4D8E1]/20">
                  <div className="flex items-center gap-2 text-[#A4D8E1]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Section-Specific QR</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    This QR code will show offers specific to the {sectionName} section
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-[#A4D8E1]" />
                QR Code Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Size</label>
                <Select value={qrSize} onValueChange={setQrSize}>
                  <SelectTrigger className="tranquil-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">Small (150px)</SelectItem>
                    <SelectItem value="220">Medium (220px)</SelectItem>
                    <SelectItem value="300">Large (300px)</SelectItem>
                    <SelectItem value="400">Extra Large (400px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Preview */}
        <div className="space-y-6">
          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#A4D8E1]" />
                QR Code Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-[#A4D8E1]/20">
                  <QRCodeSVG
                    value={url || ""}
                    size={parseInt(qrSize)}
                    marginSize={4}
                    ref={svgRef}
                    fgColor="#1e293b"
                    bgColor="#ffffff"
                  />
                </div>
              </div>

              {/* QR Code Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Store:</span>
                  </div>
                  <Badge className="bg-[#A4D8E1]/20 text-slate-800 border-[#A4D8E1]/30">
                    {storeName}
                  </Badge>
                </div>

                {sectionId && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Section:</span>
                    </div>
                    <Badge className="bg-[#B2E0E6]/20 text-slate-800 border-[#B2E0E6]/30">
                      {sectionName}
                    </Badge>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Generated URL:</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={url}
                      readOnly
                      className="tranquil-input text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUrl}
                      className="shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={download}
                  className="tranquil-button flex-1 group"
                  disabled={!storeId}
                >
                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-white/80 border-white/30 hover:bg-white/90"
                  disabled={!storeId}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print QR Code
                </Button>
              </div>

              {!storeId && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Please enter a Store ID to generate a functional QR code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A4D8E1]" />
                How to Use Your QR Code
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• <strong>Main Store QR:</strong> Place at store entrance for general access</p>
                <p>• <strong>Section QR:</strong> Place in specific departments for targeted offers</p>
                <p>• <strong>Print Size:</strong> Minimum 2x2 inches for reliable scanning</p>
                <p>• <strong>Placement:</strong> Ensure good lighting and avoid reflective surfaces</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
