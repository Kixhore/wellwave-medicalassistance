function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLogin, setIsLogin] = React.useState(true);
    const [messages, setMessages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [userData, setUserData] = React.useState(null);
    const chatContainerRef = React.useRef(null);

    React.useEffect(() => {
        const validateSession = async () => {
            try {
                const sessionCheck = await checkSession();
                if (!sessionCheck.valid) {
                    performLogout();
                    return;
                }

                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    performLogout();
                    return;
                }

                const parsedUser = JSON.parse(userStr);
                if (!parsedUser || !parsedUser.objectData) {
                    performLogout();
                    return;
                }

                setUserData(parsedUser);
                setIsAuthenticated(true);
                await loadUserMedicalHistory(parsedUser.objectId);
            } catch (error) {
                reportError(error);
                performLogout();
            }
        };

        validateSession();
    }, []);

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const loadUserMedicalHistory = async (userId) => {
        try {
            if (!userData || !userData.objectData) return;

            const history = await getUserMedicalHistory(userId);
            
            const welcomeMessage = {
                content: history.length > 0
                    ? `Welcome back, ${userData.objectData.name}! I've reviewed your medical history. How can I assist you today?`
                    : `Hello ${userData.objectData.name}! I'm your personal medical assistant. To provide better care, I'd like to know about your medical history. Would you mind sharing any existing medical conditions, allergies, or medications you're taking?`,
                isAi: true
            };

            setMessages([welcomeMessage]);
        } catch (error) {
            reportError(error);
            setMessages([{
                content: "Welcome! How can I assist you today?",
                isAi: true
            }]);
        }
    };

    const handleLoginSubmit = async (email, password) => {
        try {
            const result = await handleLogin(email, password);
            if (result.success && result.user) {
                setUserData(result.user);
                setIsAuthenticated(true);
                await loadUserMedicalHistory(result.user.objectId);
                return true;
            }
            return false;
        } catch (error) {
            reportError(error);
            return false;
        }
    };

    const handleSignUpSubmit = async (name, email, password) => {
        try {
            const result = await handleSignUp(name, email, password);
            if (result.success && result.user) {
                setUserData(result.user);
                setIsAuthenticated(true);
                await loadUserMedicalHistory(result.user.objectId);
                return true;
            }
            return false;
        } catch (error) {
            reportError(error);
            return false;
        }
    };

    const handleLogoutClick = async () => {
        try {
            const result = await performLogout();
            if (result.success) {
                setIsAuthenticated(false);
                setMessages([]);
                setUserData(null);
                setIsLogin(true);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleSendMessage = async (message) => {
        try {
            const sessionCheck = await checkSession();
            if (!sessionCheck.valid || !userData || !userData.objectId) {
                performLogout();
                return;
            }

            const newMessages = [...messages, { content: message, isAi: false }];
            setMessages(newMessages);
            setIsLoading(true);

            await saveUserMedicalData(userData.objectId, {
                type: 'user-message',
                content: message,
                timestamp: new Date().toISOString()
            });

            const response = await chatAgent(message, messages, userData.objectData);
            
            await saveUserMedicalData(userData.objectId, {
                type: 'ai-response',
                content: response,
                timestamp: new Date().toISOString()
            });

            setMessages([...newMessages, { content: response, isAi: true }]);
        } catch (error) {
            reportError(error);
            setMessages([...messages, { 
                content: "I apologize, but I'm having trouble processing your request. Please try again or seek immediate medical attention if this is urgent.", 
                isAi: true 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return isLogin ? (
            <Login onToggleAuth={() => setIsLogin(false)} onLogin={handleLoginSubmit} />
        ) : (
            <SignUp onToggleAuth={() => setIsLogin(true)} onSignUp={handleSignUpSubmit} />
        );
    }

    return (
        <div data-name="app" className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <Header onLogout={handleLogoutClick} userData={userData} />
            <main className="max-w-6xl mx-auto">
                <div data-name="chat-container" ref={chatContainerRef} className="chat-container">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center relative z-10">
                            <div className="text-center text-gray-300 floating-effect">
                                <i className="fas fa-wave-square text-5xl text-blue-400 mb-4"></i>
                                <p className="text-xl">Hello {userData?.objectData?.name || 'there'}, how can I assist you with your health today?</p>
                                <p className="text-sm text-gray-400 mt-2">Feel free to ask about any health concerns, symptoms, or medical advice</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <ChatMessage 
                                key={idx} 
                                message={msg.content} 
                                isAi={msg.isAi}
                                userName={userData?.objectData?.name || 'User'}
                            />
                        ))
                    )}
                    {isLoading && (
                        <div className="p-6 bg-blue-900 bg-opacity-20">
                            <div className="max-w-6xl mx-auto flex space-x-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <i className="fas fa-staff-snake text-white text-lg"></i>
                                </div>
                                <LoadingDots />
                            </div>
                        </div>
                    )}
                </div>
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
