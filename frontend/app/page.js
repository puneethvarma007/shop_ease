import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  QrCode,
  Gift,
  BarChart3,
  Users,
  Smartphone,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: QrCode,
      title: "QR Code Access",
      description: "Instant access to offers by scanning QR codes at store entrance or sections"
    },
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Discover amazing deals and member-only discounts tailored for you"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Store managers get detailed insights on customer engagement and sales"
    },
    {
      icon: Users,
      title: "Customer Feedback",
      description: "Easy feedback collection to improve shopping experience"
    }
  ];

  const benefits = [
    "Instant QR code-based access to offers",
    "Section-specific deals and catalogs",
    "Beautiful, mobile-responsive design",
    "Real-time analytics and reporting",
    "Excel-based bulk offer management",
    "Customer feedback collection system"
  ];

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
                  Digital Shopping Experience
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
                  ShopEase
                  <span className="block text-3xl md:text-4xl text-slate-600 mt-2">
                    QR-Powered Retail
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  Transform your retail store with QR code-based access to offers,
                  product catalogs, and customer feedback collection. Beautiful UI
                  meets powerful analytics.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo-store">
                  <Button size="lg" className="tranquil-button w-full sm:w-auto group">
                    <Smartphone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Try Demo Store
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/80 border-white/30 hover:bg-white/90 group">
                    <Store className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Manager Dashboard
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">100%</p>
                  <p className="text-sm text-slate-600">Mobile Responsive</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">QR</p>
                  <p className="text-sm text-slate-600">Code Powered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">Real-time</p>
                  <p className="text-sm text-slate-600">Analytics</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative floating-animation">
              <div className="relative z-10">
                <Image
                  src="/hero-shopping.svg"
                  alt="ShopEase Shopping Experience"
                  width={500}
                  height={400}
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to create an amazing digital shopping experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="tranquil-card swipe-card border-0" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose ShopEase?</h2>
              <p className="text-slate-600">
                Built with modern technology and beautiful design principles
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Tranquil Waters Design</h3>
                  <p className="text-slate-600 mb-6">
                    Beautiful, calming color palette with smooth animations and responsive design
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#A4D8E1]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#B2E0E6]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#C4F1F4]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#E0F7FA]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#E8F9FD]"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Ready to Get Started?</h2>
            <p className="text-slate-600">
              Experience the future of retail with ShopEase. Try our demo or set up your store today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo-store">
                <Button size="lg" className="tranquil-button group">
                  <QrCode className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Try Demo Store
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="bg-white/80 border-white/30 hover:bg-white/90">
                  <Store className="w-5 h-5 mr-2" />
                  Manager Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
