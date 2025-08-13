"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle, Heart, Sparkles } from "lucide-react";

// Star Rating Component
function StarRating({ rating, onRatingChange, size = "md" }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} transition-all duration-200 hover:scale-110`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <Star
            className={`w-full h-full transition-colors ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300 hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage({ params, searchParams }) {
  const { storeSlug } = params;
  const storeId = searchParams?.storeId || ""; // pass storeId via URL for MVP

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [overall, setOverall] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const storeName = storeSlug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const qs = await api.feedback.questions({ storeSlug });
        setQuestions(Array.isArray(qs) ? qs : []);
        setAnswers({});
      } catch (e) {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [storeSlug]);

  const setRating = (qId, val) => setAnswers((p) => ({ ...p, [qId]: { ...(p[qId] || {}), rating: Number(val) } }));
  const setText = (qId, val) => setAnswers((p) => ({ ...p, [qId]: { ...(p[qId] || {}), text: val } }));

  const onSubmit = async () => {
    if (!storeId) {
      toast.error("Missing storeId in URL");
      return;
    }

    if (!overall) {
      toast.error("Please provide an overall rating");
      return;
    }

    const responses = questions.map((q) => ({
      questionId: q.id,
      rating: answers[q.id]?.rating ?? null,
      text: answers[q.id]?.text ?? null,
    }));

    try {
      await api.feedback.submit({ storeId, responses, overallRating: overall });
      toast.success("Thank you for your valuable feedback!");
      setSubmitted(true);
      // Reset form after a delay
      setTimeout(() => {
        setAnswers({});
        setOverall(0);
        setSubmitted(false);
      }, 3000);
    } catch (e) {
      toast.error(e.message || "Failed to submit feedback");
    }
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return texts[rating] || "";
  };

  if (submitted) {
    return (
      <main className="min-h-screen tranquil-gradient flex items-center justify-center p-4">
        <Card className="tranquil-card border-0 shadow-2xl max-w-md w-full text-center">
          <CardContent className="p-8 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Thank You!</h2>
              <p className="text-slate-600">
                Your feedback has been submitted successfully. We appreciate your time and input!
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-medium">Your opinion matters to us</span>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen tranquil-gradient">
      {/* Header Section */}
      <section className="bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <Badge className="bg-[#A4D8E1]/20 text-slate-800 border-[#A4D8E1]/30">
              <MessageSquare className="w-4 h-4 mr-2" />
              Customer Feedback
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Share Your Experience
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Your feedback helps us improve and serve you better. Tell us about your experience at {storeName}.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="tranquil-card">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Rating First */}
              <Card className="tranquil-card border-2 border-[#A4D8E1]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Overall Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">How would you rate your overall experience?</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <StarRating
                      rating={overall}
                      onRatingChange={setOverall}
                      size="lg"
                    />
                    {overall > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        {getRatingText(overall)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Individual Questions */}
              {questions.map((q, index) => (
                <Card key={q.id} className="tranquil-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      {q.question_type === "text" ? (
                        <MessageSquare className="w-5 h-5 text-[#A4D8E1]" />
                      ) : (
                        <Star className="w-5 h-5 text-yellow-400" />
                      )}
                      {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {q.question_type === "text" ? (
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={answers[q.id]?.text || ""}
                        onChange={(e) => setText(q.id, e.target.value)}
                        className="tranquil-input min-h-[100px] resize-none"
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <StarRating
                            rating={answers[q.id]?.rating || 0}
                            onRatingChange={(rating) => setRating(q.id, rating)}
                          />
                          {answers[q.id]?.rating > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              {getRatingText(answers[q.id]?.rating)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Submit Button */}
              <div className="pt-6">
                <Card className="tranquil-card bg-gradient-to-r from-[#E8F9FD] to-[#E0F7FA] border-[#A4D8E1]/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-slate-800">Ready to Submit?</h3>
                      <p className="text-slate-600">
                        Thank you for taking the time to share your feedback with us.
                      </p>
                    </div>
                    <Button
                      onClick={onSubmit}
                      size="lg"
                      className="tranquil-button group"
                      disabled={!overall}
                    >
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Submit Feedback
                      <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                    {!overall && (
                      <p className="text-sm text-amber-600">
                        Please provide an overall rating to submit your feedback
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
