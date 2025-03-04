import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    TbBuildingSkyscraper,
    TbHome,
    TbBuildingCommunity,
} from "react-icons/tb";
import { useState } from "react";
import FormAccommodationOption from "@/pages/Accommodation/forms/FormAccommodationOption";
import FormTransportationOption from "@/pages/Transportation/forms/FormTransportationOption";
import FormEntertainmentOption from "@/pages/Entertainment/forms/FormEntertainmentOption";

export function SearchTabs() {
    // Set default tab
    const [activeTab, setActiveTab] = useState("accommodations");

    // Handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    // Render the appropriate form based on active tab
    const renderForm = () => {
        switch (activeTab) {
            case "accommodation":
                return <FormAccommodationOption />;
            case "transportation":
                return <FormTransportationOption />;
            case "activity-tour":
                return <FormEntertainmentOption />;
            default:
                return <FormAccommodationOption />;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <Tabs defaultValue="accommodatation" onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-3 w-fit gap-2 p-1 bg-white/10 backdrop-blur-sm">
                    <TabsTrigger
                        value="accommodatation"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary px-8"
                    >
                        <TbBuildingSkyscraper className="w-5 h-5 mr-2" />
                        Accommodations
                    </TabsTrigger>
                    <TabsTrigger
                        value="transportation"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary px-8"
                    >
                        <TbHome className="w-5 h-5 mr-2" />
                        Transportations
                    </TabsTrigger>
                    <TabsTrigger
                        value="activity-tour"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary px-8"
                    >
                        <TbBuildingCommunity className="w-5 h-5 mr-2" />
                        Activities & Tours
                    </TabsTrigger>
                </TabsList>

                {renderForm()}
            </Tabs>
        </div>
    );
}
