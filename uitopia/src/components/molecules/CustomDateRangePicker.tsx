import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
    className?: string;
    onChange?: (checkIn: Date, checkOut: Date) => void;
}

const CustomDateRangePicker: React.FC<DateRangePickerProps> = ({ className, onChange }) => {
    // Get today's date at midnight for consistent comparison
    const getTodayMidnight = (): Date => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    // Initialize with today's date for check-in and tomorrow for check-out
    const today = getTodayMidnight();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [checkInDate, setCheckInDate] = useState<Date>(today);
    const [checkOutDate, setCheckOutDate] = useState<Date>(tomorrow);

    // Set the current month view to today's month
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const [currentView, setCurrentView] = useState({
        leftMonth: currentMonth,
        leftYear: currentYear,
        rightMonth: currentMonth + 1 > 11 ? 0 : currentMonth + 1,
        rightYear: currentMonth + 1 > 11 ? currentYear + 1 : currentYear,
    });

    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [selectionMode, setSelectionMode] = useState<"checkin" | "checkout">("checkin");
    const [showCheapestDates, setShowCheapestDates] = useState<boolean>(true);
    const [maxDate, setMaxDate] = useState<Date>(new Date());

    // Set max date to 3 years from now
    useEffect(() => {
        const threeYearsLater = new Date(today);
        threeYearsLater.setFullYear(threeYearsLater.getFullYear() + 3);
        setMaxDate(threeYearsLater);
    }, []);

    // Notify parent component when dates change
    useEffect(() => {
        if (onChange) {
            onChange(checkInDate, checkOutDate);
        }
    }, [checkInDate, checkOutDate, onChange]);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Format the date for display
    const formatDateForDisplay = (date: Date): string => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Handle navigation for both calendars
    const handlePrevMonth = () => {
        setCurrentView((prev) => {
            const newLeftMonth = prev.leftMonth === 0 ? 11 : prev.leftMonth - 1;
            const newLeftYear = prev.leftMonth === 0 ? prev.leftYear - 1 : prev.leftYear;
            const newRightMonth = prev.rightMonth === 0 ? 11 : prev.rightMonth - 1;
            const newRightYear = prev.rightMonth === 0 ? prev.rightYear - 1 : prev.rightYear;

            // Don't allow navigation before the current month
            if (
                newLeftYear < today.getFullYear() ||
                (newLeftYear === today.getFullYear() && newLeftMonth < today.getMonth())
            ) {
                return prev;
            }

            return {
                leftMonth: newLeftMonth,
                leftYear: newLeftYear,
                rightMonth: newRightMonth,
                rightYear: newRightYear,
            };
        });
    };

    const handleNextMonth = () => {
        setCurrentView((prev) => {
            const newLeftMonth = prev.leftMonth === 11 ? 0 : prev.leftMonth + 1;
            const newLeftYear = prev.leftMonth === 11 ? prev.leftYear + 1 : prev.leftYear;
            const newRightMonth = prev.rightMonth === 11 ? 0 : prev.rightMonth + 1;
            const newRightYear = prev.rightMonth === 11 ? prev.rightYear + 1 : prev.rightYear;

            // Don't allow navigation beyond max date
            if (
                newRightYear > maxDate.getFullYear() ||
                (newRightYear === maxDate.getFullYear() && newRightMonth > maxDate.getMonth())
            ) {
                return prev;
            }

            return {
                leftMonth: newLeftMonth,
                leftYear: newLeftYear,
                rightMonth: newRightMonth,
                rightYear: newRightYear,
            };
        });
    };

    interface CalendarDay {
        day: number;
        month: number;
        year: number;
        isCurrentMonth: boolean;
        date?: Date;
        isDisabled?: boolean;
    }

    const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Adjust first day to make Monday the first day of the week (0 = Monday, 6 = Sunday)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const days: CalendarDay[] = [];

        // Previous month days
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);

            days.push({
                day: daysInPrevMonth - i,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false,
                date,
                isDisabled: date < today, // Disable past dates
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                day: i,
                month,
                year,
                isCurrentMonth: true,
                date,
                isDisabled: date < today || date > maxDate, // Disable past dates and dates beyond max date
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const nextMonth = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            const date = new Date(nextYear, nextMonth, i);

            days.push({
                day: i,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false,
                date,
                isDisabled: date > maxDate, // Disable dates beyond max date
            });
        }

        return days;
    };

    const handleDateClick = (dateObj: CalendarDay) => {
        if (dateObj.isDisabled) return;

        const selectedDate = new Date(dateObj.year, dateObj.month, dateObj.day);

        if (selectionMode === "checkin") {
            // Update check-in date
            setCheckInDate(selectedDate);

            // If the new check-in date is after or equal to checkout date, adjust checkout date
            if (selectedDate >= checkOutDate) {
                const newCheckOutDate = new Date(selectedDate);
                newCheckOutDate.setDate(selectedDate.getDate() + 1);
                setCheckOutDate(newCheckOutDate);
            }

            setSelectionMode("checkout");
        } else {
            // Don't allow check-out date before check-in
            if (selectedDate < checkInDate) {
                return;
            }

            setCheckOutDate(selectedDate);
            setShowCalendar(false);
            setSelectionMode("checkin");
        }
    };

    const isDateInRange = (date: Date): boolean => {
        return date > checkInDate && date < checkOutDate;
    };

    const isCheckInDate = (date: Date): boolean => {
        return (
            date.getDate() === checkInDate.getDate() &&
            date.getMonth() === checkInDate.getMonth() &&
            date.getFullYear() === checkInDate.getFullYear()
        );
    };

    const isCheckOutDate = (date: Date): boolean => {
        return (
            date.getDate() === checkOutDate.getDate() &&
            date.getMonth() === checkOutDate.getMonth() &&
            date.getFullYear() === checkOutDate.getFullYear()
        );
    };

    const isDayHighlighted = (date: Date): boolean => {
        // Highlight weekends
        return date.getDay() === 0 || date.getDay() === 6;
    };

    // Handle clicks outside the calendar to close it
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const calendar = document.getElementById("calendar-dropdown");
            if (calendar && !calendar.contains(target)) {
                setShowCalendar(false);
            }
        };

        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendar]);

    return (
        <div className={`relative flex border border-gray-200 rounded overflow-hidden h-10 ${className}`}>
            {/* Check-in field */}
            <div
                className="flex-1 px-3 flex flex-col justify-center border-r cursor-pointer"
                onClick={() => {
                    setSelectionMode("checkin");
                    setShowCalendar(true);
                }}
            >
                <div className="text-xs text-gray-500">Check-in</div>
                <div className="text-sm font-medium">{formatDateForDisplay(checkInDate)}</div>
            </div>

            {/* Check-out field */}
            <div
                className="flex-1 px-3 flex flex-col justify-center cursor-pointer"
                onClick={() => {
                    setSelectionMode("checkout");
                    setShowCalendar(true);
                }}
            >
                <div className="text-xs text-gray-500">Check-out</div>
                <div className="text-sm font-medium">{formatDateForDisplay(checkOutDate)}</div>
            </div>

            {/* Calendar dropdown */}
            {showCalendar && (
                <div
                    id="calendar-dropdown"
                    className="absolute left-0 z-10 mt-10 border border-gray-200 rounded-lg shadow-md bg-white p-4"
                >
                    <div className="flex justify-between items-center">
                        {/* Calendar navigation */}
                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>

                        <div className="flex space-x-20">
                            <div className="text-center">
                                <h3 className="font-medium">
                                    {months[currentView.leftMonth]} {currentView.leftYear}
                                </h3>
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium">
                                    {months[currentView.rightMonth]} {currentView.rightYear}
                                </h3>
                            </div>
                        </div>

                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={handleNextMonth}>
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Selected mode indicator */}
                    <div className="mt-2 mb-1 text-sm text-gray-600">
                        {selectionMode === "checkin" ? "Select check-in date" : "Select check-out date"}
                    </div>

                    {/* Dual calendar display */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {/* Left Month */}
                        <div>
                            <div className="grid grid-cols-7 mb-1">
                                {days.map((day) => (
                                    <div key={day} className="text-center text-xs text-gray-500 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {generateCalendarDays(currentView.leftYear, currentView.leftMonth).map(
                                    (dateObj, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                !dateObj.isDisabled &&
                                                dateObj.isCurrentMonth &&
                                                handleDateClick(dateObj)
                                            }
                                            className={`text-center p-2 text-sm ${
                                                dateObj.isDisabled
                                                    ? "text-gray-300 cursor-not-allowed"
                                                    : !dateObj.isCurrentMonth
                                                    ? "text-gray-300 cursor-default"
                                                    : dateObj.date && isCheckInDate(dateObj.date)
                                                    ? "bg-blue-500 text-white rounded-full font-medium cursor-pointer"
                                                    : dateObj.date && isCheckOutDate(dateObj.date)
                                                    ? "bg-gray-200 text-gray-800 rounded-full font-medium cursor-pointer"
                                                    : dateObj.date && isDateInRange(dateObj.date)
                                                    ? "bg-blue-100 cursor-pointer"
                                                    : dateObj.date && isDayHighlighted(dateObj.date)
                                                    ? "text-red-500 cursor-pointer hover:bg-gray-100"
                                                    : "text-gray-700 cursor-pointer hover:bg-gray-100"
                                            }`}
                                        >
                                            {dateObj.day}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Right Month */}
                        <div>
                            <div className="grid grid-cols-7 mb-1">
                                {days.map((day) => (
                                    <div key={day} className="text-center text-xs text-gray-500 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {generateCalendarDays(currentView.rightYear, currentView.rightMonth).map(
                                    (dateObj, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                !dateObj.isDisabled &&
                                                dateObj.isCurrentMonth &&
                                                handleDateClick(dateObj)
                                            }
                                            className={`text-center p-2 text-sm ${
                                                dateObj.isDisabled
                                                    ? "text-gray-300 cursor-not-allowed"
                                                    : !dateObj.isCurrentMonth
                                                    ? "text-gray-300 cursor-default"
                                                    : dateObj.date && isCheckInDate(dateObj.date)
                                                    ? "bg-blue-500 text-white rounded-full font-medium cursor-pointer"
                                                    : dateObj.date && isCheckOutDate(dateObj.date)
                                                    ? "bg-gray-200 text-gray-800 rounded-full font-medium cursor-pointer"
                                                    : dateObj.date && isDateInRange(dateObj.date)
                                                    ? "bg-blue-100 cursor-pointer"
                                                    : dateObj.date && isDayHighlighted(dateObj.date)
                                                    ? "text-red-500 cursor-pointer hover:bg-gray-100"
                                                    : "text-gray-700 cursor-pointer hover:bg-gray-100"
                                            }`}
                                        >
                                            {dateObj.day}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Show cheapest dates checkbox */}
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="cheapest-dates"
                            className="h-4 w-4 text-blue-500 rounded"
                            checked={showCheapestDates}
                            onChange={() => setShowCheapestDates(!showCheapestDates)}
                        />
                        <label htmlFor="cheapest-dates" className="ml-2 text-sm text-gray-700">
                            Show cheapest dates to stay
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDateRangePicker;
