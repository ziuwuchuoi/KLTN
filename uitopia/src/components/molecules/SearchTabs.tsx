import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  TbBuildingSkyscraper, 
  TbHome, 
  TbBuildingCommunity,
  TbMapPin,
  TbCalendar,
  TbUsers,
  TbSearch
} from "react-icons/tb"
import { useState } from "react"

export function SearchTabs() {
  const [selectedTab, setSelectedTab] = useState("hotels")

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid grid-cols-3 w-fit gap-2 p-1 bg-white/10 backdrop-blur-sm">
          <TabsTrigger 
            value="hotels" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary px-8"
          >
            <TbBuildingSkyscraper className="w-5 h-5 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger 
            value="villa"
            className="data-[state=active]:bg-white data-[state=active]:text-primary px-8"
          >
            <TbHome className="w-5 h-5 mr-2" />
            Villa
          </TabsTrigger>
          <TabsTrigger 
            value="apartment"
            className="data-[state=active]:bg-white data-[state=active]:text-primary px-8"
          >
            <TbBuildingCommunity className="w-5 h-5 mr-2" />
            Apartment
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-white rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <TbMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="City, hotel, place to go" 
                className="pl-10"
              />
            </div>

            <div className="relative">
              <TbCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Check-in & Check-out Dates"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <TbUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="1 Adult(s), 0 Child, 1 Room"
                className="pl-10"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <TbSearch className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <p className="text-white/80">Trusted by</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {/* Partner logos */}
            <img src="/path-to-logo1.png" alt="Partner 1" className="h-8" />
            <img src="/path-to-logo2.png" alt="Partner 2" className="h-8" />
            <img src="/path-to-logo3.png" alt="Partner 3" className="h-8" />
            <img src="/path-to-logo4.png" alt="Partner 4" className="h-8" />
          </div>
        </div>
      </Tabs>
    </div>
  )
}

