"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/app/context/AppContext";
import { User, Mail, Phone, ArrowRight, Shield, Gift, Star, Sparkles } from "lucide-react";

export default function SignupPage() {
  const { signup, loading } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
    router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <main className="min-h-screen tranquil-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="space-y-8 fade-in-up">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-slate-800 border-white/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Unlock Exclusive Access
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Join ShopEase
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Sign up to unlock exclusive offers, personalized recommendations, and member-only deals.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Exclusive Offers</h3>
                <p className="text-sm text-slate-600">Access special deals not available to regular visitors</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-10 h-10 bg-gradient-to-br from-[#B2E0E6] to-[#C4F1F4] rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Personalized Experience</h3>
                <p className="text-sm text-slate-600">Get recommendations tailored to your preferences</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C4F1F4] to-[#E0F7FA] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Secure & Private</h3>
                <p className="text-sm text-slate-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="stagger-animation">
          <Card className="tranquil-card border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-800">Create Your Account</CardTitle>
              <p className="text-slate-600">Join thousands of happy shoppers</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="tranquil-input h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="tranquil-input h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your mobile number"
                    className="tranquil-input h-12"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 tranquil-button text-lg group"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              {/* Demo Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Demo Mode</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  For demo purposes, use OTP: <span className="font-mono font-bold">123456</span>
                </p>
              </div>

              {/* Back Link */}
              <div className="text-center pt-4 border-t border-slate-100">
                <Link href="/" className="text-sm text-slate-600 hover:text-[#A4D8E1] transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
