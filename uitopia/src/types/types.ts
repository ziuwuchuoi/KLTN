export type UserRole = "admin" | "customer" | "service";

export type ServiceType = "tourGuide" | "driver" | "translator" | "photographer" | "chef";

export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string; // Password should not be sent to the client
    role: UserRole;
    avatarPath?: string;
    avatarUrl?: string;
    createdAt?: Date;
    lastSeen?: Date;
    phoneNumber?: string;
    address?: string;
    nationality?: string;
    languages?: string[];
    dateOfBirth?: Date;
    preferences?: UserPreferences;
    serviceType?: ServiceType; // Only applicable if role is "service"
    verified?: boolean;
}

export interface UserPreferences {
    preferredCurrency?: string;
    preferredLanguage?: string;
    dietaryRestrictions?: string[];
    accommodationPreferences?: Accommodation[];
    transportationPreferences?: Transportation[];
    notificationSettings?: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
    };
}

// Transportation-related types
export type Transportation = "flight" | "train" | "taxi" | "boat" | "rentCar" | "bus" | "ferry" | "bicycle" | "walking" | "helicopter";

export interface TransportationDetails {
    type: Transportation;
    provider?: string;
    vehicleDetails?: string;
    departureTime?: Date;
    arrivalTime?: Date;
    departureLocation?: Location;
    arrivalLocation?: Location;
    seatType?: "economy" | "business" | "firstClass";
    seatNumber?: string;
    price?: number;
    bookingReference?: string;
    duration?: number; // in minutes
    includesTransfer?: boolean;
}

// Accommodation-related types
export type Accommodation = "hotel" | "homestay" | "apartment" | "resort" | "villa" | "hostel" | "guesthouse" | "campsite" | "cruiseShip";

export type RoomType = "single" | "double" | "twin" | "triple" | "family" | "suite" | "deluxe" | "penthouse";

export interface AccommodationDetails {
    type: Accommodation;
    name: string;
    address: string;
    location: Location;
    checkIn: Date;
    checkOut: Date;
    roomType: RoomType;
    guestCount: number;
    amenities: string[];
    rating?: number;
    price: number;
    bookingReference?: string;
    includesBreakfast?: boolean;
    includesAirport?: boolean;
    cancellationPolicy?: string;
}

// Entertainment-related types
export type Entertainment = 
    "sightseeing" | 
    "museum" | 
    "themePark" | 
    "concert" | 
    "sports" | 
    "beach" | 
    "hiking" | 
    "shopping" | 
    "foodTour" | 
    "nightlife" | 
    "safari" | 
    "diving" | 
    "cruise" | 
    "culturalShow" | 
    "workshop";

export interface EntertainmentDetails {
    type: Entertainment;
    name: string;
    description: string;
    location: Location;
    startTime?: Date;
    endTime?: Date;
    price?: number;
    bookingRequired: boolean;
    bookingReference?: string;
    includedInPackage?: boolean;
    ageRestrictions?: string;
    accessibilityOptions?: string[];
    guidedTour?: boolean;
    duration?: number; // in minutes
}

// Location and geography types
export interface Location {
    address?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

// Schedule-related types
export interface Schedule {
    day: number;
    date?: Date;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    activities: Activity[];
    meals?: MealPlan;
    freeTime?: boolean;
    notes?: string;
}

export interface Activity {
    type: "transportation" | "accommodation" | "entertainment" | "meal" | "freeTime";
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    duration?: number; // in minutes
    location?: Location;
    included: boolean;
    price?: number; // if not included
    transportationDetails?: TransportationDetails;
    accommodationDetails?: AccommodationDetails;
    entertainmentDetails?: EntertainmentDetails;
    mealDetails?: MealDetails;
}

export interface MealPlan {
    breakfast?: MealDetails;
    lunch?: MealDetails;
    dinner?: MealDetails;
    snacks?: MealDetails[];
}

export interface MealDetails {
    included: boolean;
    location?: string;
    cuisine?: string;
    dietaryOptions?: string[];
    time?: string;
    price?: number; // if not included
}

// Tour-related types
export interface Tour {
    _id: string;
    name: string;
    description: string;
    imagePath?: string[];
    imageUrl?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    accommodation: Accommodation[];
    transportation: Transportation[];
    schedule: Schedule[];
    duration: number; // in days
    startDates: Date[];
    endDates: Date[];
    price: {
        adult: number;
        child?: number;
        infant?: number;
        singleSupplement?: number; // extra cost for single occupancy
        currency: string;
    };
    destination: Location[];
    maxGroupSize: number;
    minGroupSize?: number;
    currentBookings?: number;
    difficulty?: "easy" | "moderate" | "challenging";
    languages?: string[];
    included: string[];
    excluded: string[];
    highlights: string[];
    tags?: string[];
    rating?: number;
    reviews?: TourReview[];
    createdBy?: string; // reference to admin user
    tourGuides?: string[]; // references to service users
    isActive: boolean;
    cancellationPolicy?: string;
    faq?: FAQ[];
}

export interface TourReview {
    _id: string;
    user: string; 
    tourId: string;
    rating: number;
    title?: string;
    comment?: string;
    date: Date;
    photos?: string[];
    verified?: boolean;
    likes?: number;
    reply?: {
        comment: string;
        date: Date;
        by: string; // reference to admin/service
    };
}

export interface FAQ {
    question: string;
    answer: string;
}

// Booking-related types
export interface Booking {
    _id: string;
    tour: string; // reference to tour
    user: string; // reference to user
    bookingDate: Date;
    tourDates: {
        startDate: Date;
        endDate: Date;
    };
    travelers: Traveler[];
    totalPrice: number;
    currency: string;
    status: "pending" | "confirmed" | "paid" | "completed" | "cancelled" | "refunded";
    paymentInfo?: {
        method: "creditCard" | "bankTransfer" | "paypal" | "cash";
        transactionId?: string;
        paidAmount: number;
        paidDate?: Date;
        remainingAmount?: number;
        dueDate?: Date;
    };
    specialRequests?: string;
    emergencyContact?: {
        name: string;
        relationship: string;
        phoneNumber: string;
    };
    insuranceDetails?: {
        provider: string;
        policyNumber: string;
        coverageDates: {
            startDate: Date;
            endDate: Date;
        };
    };
    createdAt: Date;
    updatedAt?: Date;
    bookingReference: string;
    cancellationReason?: string;
    refundAmount?: number;
}

export interface Traveler {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    passportNumber?: string;
    passportExpiry?: Date;
    nationality: string;
    specialRequirements?: string;
    type: "adult" | "child" | "infant";
}

// Payment-related types
export interface Payment {
    _id: string;
    booking: string; // reference to booking
    user: string; // reference to user
    amount: number;
    currency: string;
    method: "creditCard" | "bankTransfer" | "paypal" | "cash";
    status: "pending" | "completed" | "failed" | "refunded";
    transactionId?: string;
    transactionDate: Date;
    receiptUrl?: string;
    notes?: string;
}

// Notification-related types
export interface Notification {
    _id: string;
    user: string; // reference to user
    title: string;
    message: string;
    type: "booking" | "payment" | "tour" | "system";
    relatedId?: string; // ID of related entity (booking, payment, etc.)
    isRead: boolean;
    createdAt: Date;
}