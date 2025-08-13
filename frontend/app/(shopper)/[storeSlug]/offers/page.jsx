"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useApp } from "@/app/context/AppContext";
import OfferCard from "@/components/OfferCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Filter, Unlock, Eye, Star, Gift, ArrowRight, Sparkles } from "lucide-react";

export default function OffersPage({ params, searchParams }) {
  const { storeSlug } = params;
  const storeId = searchParams?.storeId || ""; // pass storeId via URL for MVP
  const sectionId = searchParams?.sectionId || ""; // optional section filter from QR
  const { user } = useApp();

  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollContainerRef = useRef(null);

  const previewMode = !user; // full catalog unlocked after signup/verify

  const storeName = storeSlug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const sectionName = sectionId ? sectionId.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : '';

  // Scroll functions for horizontal swipe
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await api.offers.list({
          storeId,
          sectionId: sectionId || undefined,
          categoryId: selectedCategory === "all" ? undefined : selectedCategory,
          preview: previewMode,
          limit: previewMode ? 3 : 20,
        });
        setOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    if (storeId) run();
  }, [storeId, sectionId, selectedCategory, previewMode]);

  // Log a scan on entering offers page (store or section specific)
  useEffect(() => {
    if (!storeId) return;
    api.analytics.scan({ storeId, sectionId: sectionId || undefined }).catch(() => {});
  }, [storeId, sectionId]);

  useEffect(() => {
    api.categories
      .list()
      .then((list) => setCategories(Array.isArray(list) ? list : []))
      .catch(() => setCategories([]));
  }, []);

  // Group offers by category for better organization
  const groupedOffers = categories.reduce((acc, category) => {
    acc[category.id] = offers.filter(offer => offer.category_id === category.id);
    return acc;
  }, {});

  const allOffers = offers;

  return (
    <main className="min-h-screen tranquil-gradient">
      {/* Header Section */}
      <section className="bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#A4D8E1]/20 text-slate-800 border-[#A4D8E1]/30">
                  <Gift className="w-4 h-4 mr-2" />
                  {sectionName ? `${sectionName} Section` : 'Store Offers'}
                </Badge>
                {previewMode && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Mode
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                {sectionName ? `${sectionName} Offers` : `${storeName} Offers`}
              </h1>
              <p className="text-slate-600">
                {previewMode
                  ? "Get a taste of our amazing deals. Sign up to unlock the full catalog!"
                  : "Explore all our exclusive offers and deals"
                }
              </p>
            </div>

            <div className="lg:ml-auto flex flex-col sm:flex-row gap-3">
              {previewMode ? (
                <Link href="/auth/signup">
                  <Button size="lg" className="tranquil-button group">
                    <Unlock className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Unlock Full Catalog
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">Full Access Unlocked</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#A4D8E1] data-[state=active]:text-white">
                All Offers
              </TabsTrigger>
              {categories.slice(0, 4).map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-[#A4D8E1] data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.length > 4 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] tranquil-input">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="More Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* All Offers Tab */}
          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: previewMode ? 3 : 6 }).map((_, i) => (
                  <Card key={i} className="tranquil-card">
                    <CardContent className="p-0">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Horizontal Swipe Section for Preview Mode */}
                {previewMode && offers.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-slate-800">Featured Offers</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={scrollLeft} className="p-2">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={scrollRight} className="p-2">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div
                      ref={scrollContainerRef}
                      className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {offers.map((offer, index) => (
                        <div key={offer.id} className="flex-none w-80 swipe-card">
                          <OfferCard offer={offer} />
                        </div>
                      ))}

                      {/* Call to Action Card */}
                      <div className="flex-none w-80">
                        <Card className="h-full tranquil-card border-2 border-dashed border-[#A4D8E1] bg-gradient-to-br from-[#E8F9FD] to-[#E0F7FA]">
                          <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-full flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-slate-800">See More Offers</h3>
                              <p className="text-slate-600 text-sm">Sign up to unlock our complete catalog of exclusive deals</p>
                            </div>
                            <Link href="/auth/signup">
                              <Button className="tranquil-button group">
                                Unlock Now
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Layout for Full Access */}
                {!previewMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {offers.map((offer, index) => (
                      <div key={offer.id} className="swipe-card" style={{ animationDelay: `${index * 0.1}s` }}>
                        <OfferCard offer={offer} />
                      </div>
                    ))}
                  </div>
                )}

                {offers.length === 0 && !loading && (
                  <Card className="tranquil-card">
                    <CardContent className="p-12 text-center">
                      <Gift className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">No Offers Available</h3>
                      <p className="text-slate-600">Check back soon for new deals and offers!</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Individual Category Tabs */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(groupedOffers[category.id] || []).map((offer, index) => (
                  <div key={offer.id} className="swipe-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>

              {(!groupedOffers[category.id] || groupedOffers[category.id].length === 0) && (
                <Card className="tranquil-card">
                  <CardContent className="p-12 text-center">
                    <Gift className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No {category.name} Offers</h3>
                    <p className="text-slate-600">Check back soon for new {category.name.toLowerCase()} deals!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Preview Mode Footer */}
      {previewMode && (
        <section className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">Ready to Unlock More?</h3>
              <p className="text-slate-600">
                You're seeing just a preview of our amazing offers. Sign up now to access our complete catalog
                of exclusive deals, personalized recommendations, and member-only discounts.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="tranquil-button group">
                  <Unlock className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Sign Up & Unlock Full Access
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
