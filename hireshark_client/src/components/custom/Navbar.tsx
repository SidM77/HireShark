import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo_navbar2.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-900 border-b shadow-md fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo + Brand */}
                    <Link to="/" className="flex items-center gap-1">
                        <img
                            src={logo}
                            alt="HireShark Logo"
                            className="h-24 w-24 object-contain"
                        />
                        <span className="text-xl font-bold text-white tracking-wide">HireShark</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-6">
                        <Link to="/jobs/selection" className="text-gray-300 hover:text-blue-400 font-medium">
                            Dashboard
                        </Link>
                        <Link to="/all-candidates" className="text-gray-300 hover:text-blue-400 font-medium">
                            All Candidates
                        </Link>
                        <Link to="/all-jobs" className="text-gray-300 hover:text-blue-400 font-medium">
                            All Jobs
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-blue-400">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4 bg-gray-900 shadow">
                    <Link to="/jobs/selection" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">
                        Dashboard
                    </Link>
                    <Link to="/all-candidates" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">
                        All Candidates
                    </Link>
                    <Link to="/all-jobs" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">
                        All Jobs
                    </Link>
                </div>
            )}
        </nav>

    );
};

export default Navbar;
