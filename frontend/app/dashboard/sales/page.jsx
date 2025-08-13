"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileSpreadsheet,
  Download,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Database
} from "lucide-react";
import { toast } from "sonner";

export default function SalesUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load upload history (mock data for now)
    setUploadHistory([
      {
        id: 1,
        date: "2024-01-15",
        filename: "sales_2024_01_15.xlsx",
        records: 245,
        status: "success",
        uploadedAt: "2024-01-15T18:30:00Z"
      },
      {
        id: 2,
        date: "2024-01-14",
        filename: "sales_2024_01_14.xlsx",
        records: 198,
        status: "success",
        uploadedAt: "2024-01-14T19:15:00Z"
      }
    ]);
  }, []);

  const upload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await api.sales.upload(file);

      clearInterval(progressInterval);
      setProgress(100);

      setResult(res);
      toast.success("Sales data uploaded successfully!");

      // Add to history
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        filename: file.name,
        records: res.inserted || 0,
        status: "success",
        uploadedAt: new Date().toISOString()
      };
      setUploadHistory(prev => [newEntry, ...prev]);

      // Reset form
      setTimeout(() => {
        setFile(null);
        setProgress(0);
      }, 2000);

    } catch (e) {
      setProgress(0);
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // const downloadTemplate = async () => {
  //   try {
  //     const text = await api.sales.template();
  //     console.log(blob,"blob response")
  //     const href = `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`;
  //     const a = document.createElement('a');
  //     a.href = href;
  //     a.download = 'sales_template.csv';
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //   } catch (e) {
  //     toast.error('Failed to download template');
  //   }
  // };

  const downloadTemplate = async () => {
  try {
    const response = await api.sales.template();
    // Create a blob URL for the response
    const blob = new Blob([response], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Template downloaded successfully!');
  } catch (e) {
    toast.error('Failed to download template');
    console.error('Download error:', e);
  }
};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Sales Data Upload</h1>
            <p className="text-slate-600">Upload daily sales data for analytics and reporting</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#A4D8E1]" />
                Upload Sales Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="space-y-4">
                <label 
                  htmlFor="sales-file-upload"
                  className="border-2 border-dashed border-[#A4D8E1]/30 rounded-lg p-8 text-center block cursor-pointer hover:bg-[#A4D8E1]/5 transition-colors"
                >
                  <FileSpreadsheet className="w-12 h-12 text-[#A4D8E1] mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">Upload Excel File</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Select your daily sales Excel file (.xlsx, .xls)
                  </p>
                </label>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="sales-file-upload"
                  accept=".xlsx,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  disabled={uploading}
                />

                {/* Selected File Preview */}
                {file && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#A4D8E1]/10 rounded-lg border border-[#A4D8E1]/20">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-5 h-5 text-[#A4D8E1]" />
                        <div>
                          <p className="font-medium text-slate-800">{file.name}</p>
                          <p className="text-sm text-slate-600">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Badge className="bg-[#A4D8E1]/20 text-slate-800 border-[#A4D8E1]/30">
                        Ready to Upload
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Uploading...</span>
                          <span className="font-medium text-slate-800">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    {/* Upload Button */}
                    <Button
                      onClick={upload}
                      disabled={uploading || !file}
                      className="w-full tranquil-button"
                    >
                      {uploading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Sales Data
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Template Download */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-slate-800 mb-3">Need a Template?</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Download our Excel template to ensure your sales data is formatted correctly.
                </p>
                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Sales Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Result */}
          {result && (
            <Card className="tranquil-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Upload Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-700">{result.inserted || 0}</p>
                    <p className="text-sm text-emerald-600">Records Processed</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-2xl font-bold text-blue-700">{result.errors || 0}</p>
                    <p className="text-sm text-blue-600">Errors</p>
                  </div>
                </div>

                {result.errors > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Some records had issues</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      Check the error log for details on failed records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - History & Instructions */}
        <div className="space-y-6">
          {/* Upload History */}
          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#A4D8E1]" />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No uploads yet</p>
                  <p className="text-sm text-slate-500">Your upload history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadHistory.slice(0, 5).map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
                          <FileSpreadsheet className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{upload.filename}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(upload.uploadedAt).toLocaleDateString()} • {upload.records} records
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={upload.status === 'success'
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {upload.status === 'success' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {upload.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A4D8E1]" />
                Sales Data Format
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Date:</strong> Transaction date (YYYY-MM-DD)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Product ID:</strong> Unique product identifier</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Product Name:</strong> Name of the product sold</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Quantity:</strong> Number of units sold</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Unit Price:</strong> Price per unit (numeric)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Total Amount:</strong> Total transaction value</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Store ID:</strong> Your store UUID</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#A4D8E1]" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-800">{uploadHistory.length}</p>
                  <p className="text-xs text-slate-600">Total Uploads</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-800">
                    {uploadHistory.reduce((sum, upload) => sum + upload.records, 0)}
                  </p>
                  <p className="text-xs text-slate-600">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
