import { Header } from "./Header"

export default function PageHome() {
    return (
        <main>
            <Header />
            {/* Add this to test scroll effect */}
            <div className="h-screen bg-gradient-to-b from-blue-500 to-purple-500">
            </div>
            <div className="min-h-screen bg-white p-8">
            </div>
        </main>
    )
}