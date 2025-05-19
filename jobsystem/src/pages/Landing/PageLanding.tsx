
export default function PageLanding() {
    return (
        <main>
            {/* Hero Section */}
            <div className="relative flex flex-col h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 items-center justify-center px-6 text-white">
                <div className="relative flex items-center justify-center">
                    <img
                        src="./src/assets/moon.png"
                        alt="Moon"
                        className="w-full max-w-sm md:max-w-md lg:max-w-lg drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="min-h-screen p-8 bg-gradient-to-t from-zinc-950 via-slate-900 to-gray-900"></div>
        </main>
    );
}
