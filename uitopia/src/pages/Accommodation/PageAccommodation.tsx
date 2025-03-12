import React from "react";
import HotelCard from "@/components/molecules/items/AccommodationItem";
import { AccommodationDetails } from "@/types/types";

function PageAccommodation() {
    const accommodationData: AccommodationDetails = {
        _id: "1223",
        type: "hotel",
        name: "Hotel Nature Hill",
        location: {
            city: "Đà Lạt",
            country: "Vietnam",
        },
        checkIn: new Date("2024-07-15"),
        checkOut: new Date("2024-07-20"),
        roomType: "double",
        guestCount: 2,
        amenities: ["Free WiFi", "Swimming Pool"],
        price: 2666997,
        rating: 9.0,
        includesBreakfast: true,
        cancellationPolicy: "Free cancellation",
    };

    return (
        <div>
            <HotelCard
                accommodation={accommodationData}
                onViewAvailability={() => console.log("View Availability")}
                onFavoriteToggle={() => console.log("Toggle Favorite")}
            />
        </div>
    );
}

export default PageAccommodation;
