import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Star, Heart } from "lucide-react";

export default function OfferCard({ offer }) {
  const discount = offer.discount_percentage ?? (offer.original_price && offer.offer_price
    ? Math.round(((offer.original_price - offer.offer_price) / offer.original_price) * 100)
    : null);

  return (
    <Card className="tranquil-card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group border-0">
      <div className="relative h-48 w-full bg-gradient-to-br from-[#E8F9FD] to-[#E0F7FA] overflow-hidden">
        {offer.image_url ? (
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <Tag className="w-12 h-12 mb-2" />
            <span className="text-sm font-medium">Product Image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount != null && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
              {discount}% OFF
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="p-2 bg-white/80 backdrop-blur-sm border-white/30 hover:bg-white/90">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <CardContent className="p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-[#A4D8E1] transition-colors">
            {offer.title}
          </h3>
          {offer.description && (
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {offer.description}
            </p>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-3 pt-2">
          {offer.offer_price != null && (
            <span className="text-xl font-bold text-slate-800">
              ₹{Number(offer.offer_price).toLocaleString()}
            </span>
          )}
          {offer.original_price != null && offer.original_price !== offer.offer_price && (
            <span className="text-sm text-slate-400 line-through">
              ₹{Number(offer.original_price).toLocaleString()}
            </span>
          )}
          {discount && (
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Save ₹{Number(offer.original_price - offer.offer_price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Validity and Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {offer.valid_until && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Until {new Date(offer.valid_until).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-slate-600">
              {offer.rating || '4.5'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <Button className="w-full tranquil-button group">
            View Details
            <Tag className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
