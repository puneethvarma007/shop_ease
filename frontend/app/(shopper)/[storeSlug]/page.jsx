"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/app/lib/api";
import { ShoppingBag, MessageSquare, Sparkles, Gift, Star, Users } from "lucide-react";

export default function StoreLanding({ params, searchParams }) {
  const { storeSlug } = params;
  const storeId = searchParams?.storeId || ""; // For MVP, pass storeId via query
  const sectionId = searchParams?.sectionId || "";

  useEffect(() => {
    if (!storeId) return;
    api.analytics
      .scan({ storeId, sectionId: sectionId === 'main' ? undefined : sectionId })
      .catch(() => {});
  }, [storeId, sectionId]);

  const storeName = storeSlug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const sectionName = sectionId ? sectionId.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : '';

  return (
    <main className="min-h-screen tranquil-gradient">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 fade-in-up">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-slate-800 border-white/30 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {sectionName ? `${sectionName} Section` : 'Welcome to'}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
                  {storeName}
                  {sectionName && (
                    <span className="block text-3xl md:text-4xl text-slate-600 mt-2">
                      {sectionName} Collection
                    </span>
                  )}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Discover exclusive in-store offers and share your shopping experience.
                  Your journey to amazing deals starts here.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/${storeSlug}/offers${storeId ? `?storeId=${storeId}` : ''}${sectionId ? `&sectionId=${sectionId}` : ''}`}>
                  <Button size="lg" className="tranquil-button w-full sm:w-auto group">
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Explore Offers
                  </Button>
                </Link>
                <Link href={`/${storeSlug}/feedback${storeId ? `?storeId=${storeId}` : ''}`}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/80 border-white/30 hover:bg-white/90 group">
                    <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Give Feedback
                  </Button>
                </Link>
              </div>

              {!storeId && (
                <div className="tranquil-card p-4 rounded-lg">
                  <p className="text-sm text-amber-700 flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    Demo Mode: Add ?storeId=YOUR_STORE_UUID for full functionality
                  </p>
                </div>
              )}
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative floating-animation">
              <div className="relative z-10">
                <Image
                  src="/hero-shopping.svg"
                  alt="Shopping Experience"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#A4D8E1]/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose {storeName}?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Experience shopping like never before with our digital-first approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="tranquil-card swipe-card border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Exclusive Offers</h3>
                <p className="text-slate-600">Access special deals and discounts available only in-store</p>
              </CardContent>
            </Card>

            <Card className="tranquil-card swipe-card border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B2E0E6] to-[#C4F1F4] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Easy Feedback</h3>
                <p className="text-slate-600">Share your experience and help us serve you better</p>
              </CardContent>
            </Card>

            <Card className="tranquil-card swipe-card border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C4F1F4] to-[#E0F7FA] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Personalized Experience</h3>
                <p className="text-slate-600">Get recommendations tailored to your preferences</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
