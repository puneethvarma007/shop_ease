"use client"
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Gift,
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function OffersManagePage() {
  const [activeTab, setActiveTab] = useState("list");
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state for manual entry
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    original_price: "",
    offer_price: "",
    discount_percentage: "",
    category_id: "",
    image_url: "",
    store_id: "",
    section_id: "",
    valid_from: "",
    valid_until: "",
    is_active: true
  });

  useEffect(() => {
    loadOffers();
    loadCategories();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await api.offers.list();
      setOffers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.categories.list();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setCategories([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-calculate discount percentage
    if (field === "original_price" || field === "offer_price") {
      const original = field === "original_price" ? parseFloat(value) : parseFloat(formData.original_price);
      const offer = field === "offer_price" ? parseFloat(value) : parseFloat(formData.offer_price);

      if (original && offer && original > offer) {
        const discount = Math.round(((original - offer) / original) * 100);
        setFormData(prev => ({ ...prev, discount_percentage: discount.toString() }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
      };

      await api.offers.create(payload);
      toast.success("Offer created successfully!");
      setShowAddDialog(false);
      setFormData({
        title: "",
        description: "",
        original_price: "",
        offer_price: "",
        discount_percentage: "",
        category_id: "",
        image_url: "",
        store_id: "",
        section_id: "",
        valid_from: "",
        valid_until: "",
        is_active: true
      });
      loadOffers();
    } catch (error) {
      toast.error("Failed to create offer");
    }
  };

  const handleBulkUpload = async () => {
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
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Please upload a valid Excel file (.xlsx, .xls, or .csv)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum 5MB allowed.");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);

      // Using axios for upload with progress tracking
      const result = await api.offers.bulk(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUploadResult(result);
      toast.success("Bulk upload completed successfully!");
      loadOffers();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || "Bulk upload failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const deleteOffer = async (id) => {
    try {
      await api.offers.remove(id);
      toast.success("Offer deleted successfully!");
      loadOffers();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Offer Management</h1>
            <p className="text-slate-600">Create and manage your store offers</p>
          </div>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="tranquil-button group">
              <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#A4D8E1]" />
                Create New Offer
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter offer title"
                    className="tranquil-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                    <SelectTrigger className="tranquil-input">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter offer description"
                  className="tranquil-input"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Original Price</label>
                  <Input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange("original_price", e.target.value)}
                    placeholder="0.00"
                    className="tranquil-input"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Offer Price</label>
                  <Input
                    type="number"
                    value={formData.offer_price}
                    onChange={(e) => handleInputChange("offer_price", e.target.value)}
                    placeholder="0.00"
                    className="tranquil-input"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Discount %</label>
                  <Input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => handleInputChange("discount_percentage", e.target.value)}
                    placeholder="0"
                    className="tranquil-input"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Store ID</label>
                  <Input
                    value={formData.store_id}
                    onChange={(e) => handleInputChange("store_id", e.target.value)}
                    placeholder="Enter store UUID"
                    className="tranquil-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Section ID (Optional)</label>
                  <Input
                    value={formData.section_id}
                    onChange={(e) => handleInputChange("section_id", e.target.value)}
                    placeholder="e.g., jewelry, fashion"
                    className="tranquil-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Image URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="tranquil-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Valid From</label>
                  <Input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => handleInputChange("valid_from", e.target.value)}
                    className="tranquil-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Valid Until</label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => handleInputChange("valid_until", e.target.value)}
                    className="tranquil-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="tranquil-button">
                  Create Offer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="list" className="data-[state=active]:bg-[#A4D8E1] data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            View Offers
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-[#A4D8E1] data-[state=active]:text-white">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        {/* Offers List Tab */}
        <TabsContent value="list" className="space-y-6">
          <Card className="tranquil-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#A4D8E1]" />
                  Current Offers ({offers.length})
                </span>
                <Badge className="bg-[#A4D8E1]/20 text-slate-800 border-[#A4D8E1]/30">
                  {offers.filter(offer => offer.is_active).length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-[#A4D8E1] border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading offers...</p>
                </div>
              ) : offers.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Offers Yet</h3>
                  <p className="text-slate-600 mb-6">Create your first offer to get started</p>
                  <Button onClick={() => setShowAddDialog(true)} className="tranquil-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Offer
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Offer</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Pricing</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((offer) => (
                        <TableRow key={offer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {offer.image_url ? (
                                <img
                                  src={offer.image_url}
                                  alt={offer.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-slate-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-slate-800">{offer.title}</p>
                                <p className="text-sm text-slate-500 line-clamp-1">{offer.description}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50">
                              {categories.find(c => c.id === offer.category_id)?.name || 'Uncategorized'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {offer.offer_price && (
                                <p className="font-semibold text-slate-800">₹{offer.offer_price}</p>
                              )}
                              {offer.original_price && offer.original_price !== offer.offer_price && (
                                <p className="text-sm text-slate-500 line-through">₹{offer.original_price}</p>
                              )}
                              {offer.discount_percentage && (
                                <Badge className="bg-red-100 text-red-700 border-red-200">
                                  {offer.discount_percentage}% OFF
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {offer.valid_from && (
                                <p className="text-sm text-slate-600">
                                  From: {new Date(offer.valid_from).toLocaleDateString()}
                                </p>
                              )}
                              {offer.valid_until && (
                                <p className="text-sm text-slate-600">
                                  Until: {new Date(offer.valid_until).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={offer.is_active
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                          }
                        >
                          {offer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteOffer(offer.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    {/* Bulk Upload Tab */}
    <TabsContent value="bulk" className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="tranquil-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#A4D8E1]" />
              Excel Bulk Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* File Drop Zone */}
              <label 
                htmlFor="file-upload"
                className="border-2 border-dashed border-[#A4D8E1]/30 rounded-lg p-8 text-center block cursor-pointer hover:bg-[#A4D8E1]/5 transition-colors"
              >
                <FileSpreadsheet className="w-12 h-12 text-[#A4D8E1] mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">Upload Excel File</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Select an Excel file (.xlsx, .xls) containing your offers data
                </p>
              </label>
              
              {/* Hidden File Input - Moved outside the label but still associated */}
              <input
                type="file"
                id="file-upload"
                accept=".xlsx,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {/* File Preview and Upload Button */}
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
                    <Button
                      onClick={handleBulkUpload}
                      disabled={loading}
                      className="tranquil-button"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-[#A4D8E1] h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions & Results */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A4D8E1]" />
                Excel Format Requirements
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Title:</strong> Product/offer name (required)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Description:</strong> Detailed offer description</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Original Price:</strong> Regular price (numeric)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Offer Price:</strong> Discounted price (numeric)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Store ID:</strong> Your store UUID (required)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Section ID:</strong> Department/section (optional)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Results */}
          {uploadResult && (
            <Card className="tranquil-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {uploadResult.errors && uploadResult.errors.length > 0 ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-700">{uploadResult.inserted || 0}</p>
                    <p className="text-sm text-emerald-600">Inserted</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-2xl font-bold text-blue-700">{uploadResult.updated || 0}</p>
                    <p className="text-sm text-blue-600">Updated</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-2xl font-bold text-red-700">
                      {Array.isArray(uploadResult.errors) ? uploadResult.errors.length : 0}
                    </p>
                    <p className="text-sm text-red-600">Errors</p>
                  </div>
                </div>

                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Errors Found
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TabsContent>
  </Tabs>
</div>
);
}