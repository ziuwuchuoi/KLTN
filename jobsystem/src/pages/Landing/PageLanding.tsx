import { CheckCircle, Code, FileText, Bot, Zap } from 'lucide-react';
// Gợi ý: Bạn nên cài đặt thư viện 'lucide-react' để có các icon đẹp và nhẹ
// Bằng lệnh: npm install lucide-react hoặc yarn add lucide-react

export default function PageLanding() {
    return (
        <main className="bg-zinc-950 text-white">
            {/* --- Hero Section --- */}
            {/* Tôi đã điều chỉnh lại một chút để thêm tiêu đề và nút kêu gọi hành động (CTA) */}
            <section className="relative flex flex-col lg:flex-row items-center h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 px-6 md:px-12">
                {/* Text Content */}
                <div className="lg:w-1/2 text-center lg:text-left z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Recruiting New Generation IT Talent
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                    Quantum Leap is a comprehensive platform that helps you objectively and efficiently assess, interview, and select top IT candidates.
                    </p>
                    {/* <div className="flex justify-center lg:justify-start gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
                            Bắt đầu Miễn phí
                        </button>
                        <button className="bg-transparent border border-slate-500 hover:bg-slate-800 text-slate-200 font-bold py-3 px-8 rounded-full transition duration-300">
                            Xem Demo
                        </button>
                    </div> */}
                </div>

                {/* Image Content */}
                <div className="relative lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
                    {/* Ảnh hành tinh của bạn */}
                    <img
                        src="./src/assets/moon.png" // Giữ nguyên ảnh của bạn
                        alt="Planet"
                        className="w-full max-w-sm md:max-w-md lg:max-w-xl drop-shadow-[0_0px_55px_rgba(79,70,229,0.5)]"
                    />
                    {/* Hiệu ứng nền mờ ảo */}
                    <div className="absolute w-full h-full bg-indigo-600/20 rounded-full blur-3xl -z-10"></div>
                </div>
            </section>

            {/* --- Features Section --- */}
            <section id="features" className="py-20 md:py-28 bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Assessment Platform</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-12">
                    From CV screening to technical interviews, we provide a powerful toolkit to help you find the best candidate.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1: CV Review */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 transform transition duration-300 hover:-translate-y-2">
                            <FileText className="h-10 w-10 mx-auto mb-4 text-blue-400" />
                            <h3 className="text-xl font-bold mb-2">CV Evaluation</h3>
                            <p className="text-slate-400">
                            Our AI analyzes and ranks CVs based on job requirements, helping you focus on the most potential candidates or improve your CV
                            </p>
                        </div>
                        {/* Feature 2: Quiz */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 transform transition duration-300 hover:-translate-y-2">
                            <Zap className="h-10 w-10 mx-auto mb-4 text-green-400" />
                            <h3 className="text-xl font-bold mb-2">Quiz Test</h3>
                            <p className="text-slate-400">
                            A diverse library of multiple choice questions on algorithms, programming languages and system knowledge.
                            </p>
                        </div>
                        {/* Feature 3: Live Code */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 transform transition duration-300 hover:-translate-y-2">
                            <Code className="h-10 w-10 mx-auto mb-4 text-purple-400" />
                            <h3 className="text-xl font-bold mb-2">Live Coding Test</h3>
                            <p className="text-slate-400">
                            Real-time coding environment, integrated compiler and screen sharing to assess problem solving skills.
                            </p>
                        </div>
                        {/* Feature 4: AI Interview */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 transform transition duration-300 hover:-translate-y-2">
                            <Bot className="h-10 w-10 mx-auto mb-4 text-orange-400" />
                            <h3 className="text-xl font-bold mb-2">AI Interview Simulation</h3>
                            <p className="text-slate-400">
                            AI conducts preliminary interviews, asks situational questions, and evaluates candidates' answers objectively.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}