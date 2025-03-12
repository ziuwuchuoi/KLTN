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
export type Transportation =
    | "flight"
    | "train"
    | "taxi"
    | "boat"
    | "rentCar"
    | "bus"
    | "ferry"
    | "bicycle"
    | "walking"
    | "helicopter";

// TransportationDetails nghĩa là ví dụ như có nhiều chuyến bay với chuyến xe khác nhau (trừ những phương tiện linh động như xe hơi)
export interface TransportationDetails {
    _id: string; //id của phương tiện đó
    type: Transportation; //loại phương tiện
    price: number; //? mình không biết có cần price không, hoặc price để vào booking
    provider: string; //nhà cung cấp, ví dụ như máy bay thì có hãng máy bay, xe thuê thì sẽ có chú thích của người đó idk
    vehicleDetails?: string; //xe có mấy chỗ something something
    departureTime?: Date; //nếu là máy bay thì có thời gian đi
    arrivalTime?: Date; //same
    departureLocation?: Location; //nếu là đặt xe đặt máy bay sẽ có địa điểm đến
    arrivalLocation?: Location; //same
    seatType?: "economy" | "business" | "firstClass"; //dành cho máy bay
    seatNumber?: string; //dành cho máy bay, tàu, thuyền,..
    baggageInfo?: string; //gửi hành lý
    duration?: number; //chuyến đi trong bao lâu
    bookingReference?: string; //chưa biết
    includesTransfer?: boolean; //chưa biết
}

// Accommodation-related types
export type Accommodation =
    | "hotel"
    | "homestay"
    | "apartment"
    | "resort"
    | "villa"
    | "hostel"
    | "guesthouse"
    | "campsite"
    | "cruiseShip";

export type RoomType = "single" | "double" | "twin" | "triple" | "family" | "suite" | "deluxe" | "penthouse";

// này là accomodationdetails,
export interface AccommodationDetails {
    _id: string; //id
    type: Accommodation; //loại chỗ ở
    name: string; //tên chỗ ở
    location: Location; //địa điểm
    checkIn?: Date; //thời điểm checkin thì cái này là sẽ chọn sau -> optional phải kh ha
    checkOut?: Date; //thời điểm checkout cũng tương tự, vì này chỉ lưu thông tin của địa điểm đó -> nên đẩy cái này qua booking
    roomType?: RoomType; //loại phòng
    guestCount: number; //số người ở
    amenities: string[]; //vật dụng
    rating?: number; //đánh giá
    price: number; //số tiền
    bookingReference?: string;
    includesBreakfast?: boolean;
    includesAirport?: boolean;
    cancellationPolicy?: string; //mấy cái policy của ngta
}

// Entertainment-related types
export type Entertainment =
    | "sightseeing"
    | "museum"
    | "themePark"
    | "concert"
    | "sports"
    | "beach"
    | "hiking"
    | "shopping"
    | "foodTour"
    | "nightlife"
    | "safari"
    | "diving"
    | "cruise"
    | "culturalShow"
    | "workshop";

//dành cho hoạt động
export interface EntertainmentDetails {
    _id: string; //id
    type: Entertainment; //thể loại giải trí
    name: string; //tên
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
    duration?: number;
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
    _id: string;
    date?: Date;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    activities: Activity[];
    meals?: MealPlan[];
    freeTime?: boolean;
    notes?: string;
}

export interface Activity {
    _id: string;
    type: "transportation" | "accommodation" | "entertainment" | "meal" | "freeTime";
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    duration?: number; // in minutes
    location?: Location;
    included: boolean;
    price?: number; // if not included
    accommodationDetails?: AccommodationDetails;
    transportationDetails?: TransportationDetails;
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
export interface TourDetails {
    _id: string;
    name: string;
    description: string;
    imagePath?: string[];
    imageUrl?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    //tour thì đã có schedule rùi, vậy mình có cần phần accommodation với transportation ở ngoài kh?
    //hay bỏ ở schedule?
    accommodation: Accommodation[];
    transportation: Transportation[];
    destination: Location[];
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
    tour?: string; // reference to tour
    type: "accommodations" | "transportations" | "entertainments" | "tours";
    userId: string; // reference to user
    bookingDate: Date;

    //tuỳ vào loại booking mà sử dụng cho phù hợp :D
    accommodationBookingDetails?: AccommodationDetails;
    transportationBookingDetails?: TransportationDetails;
    entertainmentBookingDetails?: EntertainmentDetails;
    tourBookingDetails?: TourDetails;

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

// Notification-related types -> chuaw bietes nuawx
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
