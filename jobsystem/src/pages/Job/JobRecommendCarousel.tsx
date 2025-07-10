"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { JobRecommendCard } from "./JobRecommendCard";
import { RecommendedJDItem } from "@/services/file.service";

interface JobRecommendCarouselProps {
    jobs: (RecommendedJDItem["values"] & { _id: string })[];
    onJobClick: (job) => void;
}

export function JobRecommendCarousel({ jobs, onJobClick }: JobRecommendCarouselProps) {
    if (!jobs || jobs.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {jobs.map((job, index) => (
                        <CarouselItem
                            key={job._id || index}
                            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                            <div className="h-full">
                                <JobRecommendCard job={job} onJobClick={onJobClick} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
                <CarouselNext className="hidden md:flex -right-12 bg-slate-800 border-slate-700 text-white hover:bg-slate-700" />
            </Carousel>
        </div>
    );
}
