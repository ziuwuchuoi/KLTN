import { Header } from "./Header"
import { SearchTabs } from "@/components/molecules/SearchTabs"

export default function PageHome() {
    return (
        <main>
            <Header />
            {/* Add this to test scroll effect */}
            <div className="flex flex-col h-screen bg-gradient-to-b from-blue-500 to-purple-500 items-center">
                <div className="flex m-auto">
                    <SearchTabs />
                </div>
            </div>
            <div className="min-h-screen bg-white p-8">
            </div>
        </main>
    )
}