function ChatMessage({ message, isAi, userName }) {
    try {
        return (
            <div data-name="chat-message" className={`p-6 ${isAi ? 'bg-opacity-20 bg-blue-900' : 'bg-opacity-20 bg-purple-900'} relative z-10`}>
                <div className="max-w-3xl mx-auto flex space-x-6">
                    <div data-name="avatar" className={`w-10 h-10 rounded-full flex items-center justify-center ${isAi ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                        <i className={`${isAi ? 'fas fa-staff-snake' : 'fas fa-user-circle'} text-white text-lg`}></i>
                    </div>
                    <div data-name="message-content" className="flex-1">
                        <div className="text-gray-400 text-sm mb-1">
                            {isAi ? 'Dr. WellWave' : userName}
                        </div>
                        <p className="text-gray-100 whitespace-pre-wrap">{message}</p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
