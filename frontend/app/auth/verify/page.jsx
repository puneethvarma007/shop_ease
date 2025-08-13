"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/app/context/AppContext";
import { Mail, Shield, CheckCircle, ArrowRight, RefreshCw, Sparkles } from "lucide-react";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { verify, loading } = useApp();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef([]);

  useEffect(() => {
    const e = params.get("email");
    if (e) setEmail(e);
  }, [params]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus the last filled input or the first empty one
    const lastFilledIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = lastFilledIndex === -1 ? 5 : Math.max(0, lastFilledIndex - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    await verify({ email, otp: otpString });
    router.push("/dashboard");
  };

  const resendOtp = () => {
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    // In a real app, you would call an API to resend the OTP
  };

  const otpString = otp.join('');
  const isOtpComplete = otpString.length === 6;

  return (
    <main className="min-h-screen tranquil-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="tranquil-card border-0 shadow-2xl fade-in-up">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#A4D8E1] to-[#B2E0E6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Verify Your Email</CardTitle>
            <p className="text-slate-600">
              We've sent a 6-digit code to
            </p>
            <Badge className="bg-[#A4D8E1]/20 text-slate-800 border-[#A4D8E1]/30 mt-2">
              {email}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Enter 6-digit code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold tranquil-input"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !isOtpComplete}
                className="w-full h-12 tranquil-button text-lg group"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verify & Continue
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Timer and Resend */}
            <div className="text-center space-y-3">
              {timeLeft > 0 ? (
                <p className="text-sm text-slate-600">
                  Code expires in <span className="font-mono font-bold text-[#A4D8E1]">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Code has expired</p>
              )}

              <Button
                variant="outline"
                onClick={resendOtp}
                disabled={timeLeft > 0}
                className="text-sm bg-white/80 border-white/30 hover:bg-white/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </Button>
            </div>

            {/* Demo Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Use demo OTP: <span className="font-mono font-bold">123456</span>
              </p>
            </div>

            {/* Back Link */}
            <div className="text-center pt-4 border-t border-slate-100">
              <Link href="/auth/signup" className="text-sm text-slate-600 hover:text-[#A4D8E1] transition-colors">
                ← Back to Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
