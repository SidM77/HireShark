import Navbar from "@/components/custom/Navbar"

function WelcomePage() {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#0d9488] text-white text-left overflow-y-auto px-6 pt-28">
            <Navbar />
            {/* Hero Section */}
            <div className="flex flex-col justify-center items-center text-center min-h-[calc(100vh-7rem)] w-full max-w-full">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                    Streamline Hiring. <br /> Empower Talent. <br /> Make Smarter Decisions.
                </h1>

                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
                    At <span className="text-teal-300 font-semibold">HireShark</span>, we’re redefining the hiring process with intelligent automation, candidate insights, and AI-powered assessments — so you can focus on what truly matters: hiring the right people, faster.
                </p>

                <button className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-lg font-semibold transition">
                    Get Started
                </button>
            </div>
        </div>
    )
}

export default WelcomePage