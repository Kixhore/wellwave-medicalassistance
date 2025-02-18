function ChatInput({ onSendMessage, disabled }) {
    const [message, setMessage] = React.useState('');

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            if (message.trim() && !disabled) {
                onSendMessage(message);
                setMessage('');
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleKeyPress = (e) => {
        try {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <div data-name="chat-input" className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-purple-900 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4">
                <div className="relative">
                    <textarea
                        data-name="message-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe your medical concern... (Press Enter to send)"
                        className="w-full p-4 pr-24 rounded-lg bg-white bg-opacity-10 border border-gray-600 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                        rows="1"
                        disabled={disabled}
                    />
                    <button
                        data-name="send-button"
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg 
                            ${!message.trim() || disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'} 
                            text-white transition-colors`}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}
