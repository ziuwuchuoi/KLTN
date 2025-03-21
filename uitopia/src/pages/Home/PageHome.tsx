import { Header } from "@/components/Header";
import { SearchTabs } from "@/components/molecules/SearchTabs";

export default function PageHome() {
    return (
        <main>
            <Header />
            {/* Add this to test scroll effect */}
            <div className="flex flex-col h-screen bg-gradient-to-b from-teal-400 via-blue-200 to-indigo-400 items-center">
                <div className="flex m-auto">
                    <SearchTabs />
                </div>
            </div>
            <div className="min-h-screen bg-white p-8"></div>
        </main>
    );
}
