import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { AccommodationDetails } from '@/types/types';

interface HotelCardProps {
  accommodation: AccommodationDetails;
  onViewAvailability?: () => void;
  onFavoriteToggle?: () => void;
}

export default function HotelCard({ 
  accommodation, 
  onViewAvailability, 
  onFavoriteToggle 
}: HotelCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden rounded-xl shadow-lg">
      <div className="relative md:w-1/3">
        <img 
          src="/placeholder-hotel.jpg" // You'll need to replace with actual image handling
          alt={`${accommodation.name} room`} 
          className="w-full h-64 md:h-auto object-cover"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
          onClick={onFavoriteToggle}
        >
          <Heart className="text-red-500 w-5 h-5" />
        </Button>
      </div>
      
      <CardContent className="md:w-2/3 space-y-3 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-blue-600">{accommodation.name}</h2>
            <p className="text-sm text-muted-foreground">
              {accommodation.location.city} • {accommodation.location.address}
            </p>
          </div>
          <Badge variant="default">Nổi bật</Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Phòng {accommodation.roomType === 'double' ? 'Giường Đôi' : accommodation.roomType}
          </p>
          <p className="text-sm text-muted-foreground">
            {accommodation.guestCount} khách
          </p>
        </div>

        <div className="text-sm text-green-700 space-y-1">
          {accommodation.amenities.map((amenity, index) => (
            <p key={index}>✔ {amenity}</p>
          ))}
          {accommodation.includesBreakfast && <p>✔ Bao gồm bữa sáng</p>}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            {accommodation.rating && (
              <>
                <Star className="text-yellow-500 w-5 h-5" />
                <span className="font-bold text-blue-600">{accommodation.rating}</span>
              </>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-blue-700">
              {formatPrice(accommodation.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              {accommodation.cancellationPolicy && `Chính sách hủy: ${accommodation.cancellationPolicy}`}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Nhận phòng: {new Date(accommodation.checkIn).toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Trả phòng: {new Date(accommodation.checkOut).toLocaleDateString()}
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={onViewAvailability}
        >
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
}