import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-3xl border-b-4 border-peach-100 sticky top-0 z-50 px-4">
            <div className="max-w-7xl mx-auto flex justify-between h-24 items-center">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-[1.5rem] bg-gradient-to-tr from-peach-500 via-orange-500 to-peach-600 text-white shadow-2xl shadow-peach-500/40 rotate-3 transform hover:rotate-6 transition-all duration-500">
                        <ShoppingCart className="h-9 w-9" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-peach-600 via-lavender-600 to-mint-600">
                            CartWise
                        </h1>
                        <p className="text-[10px] font-black text-peach-500 tracking-[0.3em] uppercase opacity-80 decoration-lavender-400 decoration-2 underline-offset-4 underline">
                            The Smart Comparison Engine
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center px-6 py-3 border-2 border-lavender-200 text-sm font-black rounded-2xl text-lavender-700 bg-white hover:bg-lavender-50 hover:border-lavender-400 transition-all shadow-lg shadow-lavender-500/10 active:scale-95"
                    >
                        <LogOut className="h-5 w-5 mr-2" strokeWidth={2.5} />
                        LOGOUT
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
