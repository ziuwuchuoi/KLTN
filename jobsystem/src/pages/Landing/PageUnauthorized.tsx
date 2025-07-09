import { Link } from "react-router-dom";

const PageUnauthorized = () => {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white px-4 text-center">
            <h1 className="text-6xl font-bold mb-6 text-white">401 - Unauthorized</h1>
            <p className="text-lg mb-10">
                You don't have permission to access this page.
            </p>
            <Link
                to="/"
                className="bg-white text-black font-semibold px-6 py-2 rounded-xl hover:bg-gray-200 transition"
            >
                Go back to Home
            </Link>
        </div>
    );
};

export default PageUnauthorized;
