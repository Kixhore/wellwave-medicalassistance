function Header({ onLogout, userData }) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        onLogout();
    };

    return (
        <div data-name="header" className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 shadow-lg">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <i className="fas fa-wave-square text-3xl text-blue-400"></i>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        WellWave
                    </h1>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 bg-opacity-20 bg-white rounded-lg px-4 py-2 hover:bg-opacity-30 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <i className="fas fa-user-circle text-white"></i>
                        </div>
                        <span className="text-sm text-gray-200">{userData?.objectData?.name}</span>
                        <i className={`fas fa-chevron-down text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                            <div className="px-4 py-2 border-b border-gray-700">
                                <p className="text-sm text-gray-400">Signed in as</p>
                                <p className="text-sm text-white truncate">{userData?.objectData?.email}</p>
                            </div>
                            <button
                                onClick={handleLogoutClick}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Sign Out</h2>
                        <p className="text-gray-300 mb-6">Are you sure you want to sign out of WellWave?</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
