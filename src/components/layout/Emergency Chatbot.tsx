import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';

const EmergencyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your emergency assistant. How can I help you with hazard-related issues today?", 
      sender: 'bot' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Emergency responses based on hazard types
  const emergencyResponses = {
    'flood': "If you're experiencing flooding: 1) Move to higher ground immediately 2) Avoid walking or driving through flood waters 3) Call emergency services if you're trapped",
    'fire': "For fire hazards: 1) Evacuate immediately and call emergency services 2) Never go back inside a burning building 3) If trapped, cover vents and door cracks to keep smoke out",
    'gas': "If you smell gas: 1) Don't use any electrical devices or open flames 2) Open windows and doors 3) Leave the area immediately and call emergency services",
    'road': "For road hazards: 1) Put on hazard lights if in a vehicle 2) If possible, move your vehicle away from traffic 3) Place warning triangles if available",
    'tree': "For fallen trees: 1) Stay away from any downed power lines 2) Don't attempt to remove large branches yourself 3) Report to local authorities",
    'power': "During power outages: 1) Use flashlights instead of candles 2) Keep refrigerator doors closed 3) Unplug sensitive electronics",
    'general': "Please provide more details about the emergency situation so I can give you specific guidance. If this is a life-threatening emergency, please call emergency services immediately."
  };

  const quickResponses = [
    { id: 1, text: "What should I do in case of flooding?" },
    { id: 2, text: "How to report a gas leak?" },
    { id: 3, text: "Steps for road damage emergency" },
    { id: 4, text: "When should I evacuate?" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const processUserMessage = (text) => {
    // Simple keyword matching for emergency responses
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('flood') || lowerText.includes('water')) {
      return emergencyResponses.flood;
    } else if (lowerText.includes('fire') || lowerText.includes('burning')) {
      return emergencyResponses.fire;
    } else if (lowerText.includes('gas') || lowerText.includes('smell')) {
      return emergencyResponses.gas;
    } else if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('traffic')) {
      return emergencyResponses.road;
    } else if (lowerText.includes('tree') || lowerText.includes('branch') || lowerText.includes('fallen')) {
      return emergencyResponses.tree;
    } else if (lowerText.includes('power') || lowerText.includes('electricity') || lowerText.includes('outage')) {
      return emergencyResponses.power;
    } else if (lowerText.includes('help') || lowerText.includes('emergency') || lowerText.includes('danger')) {
      return "If you're in immediate danger, please call emergency services. If you'd like to report a hazard, use our 'Report Hazard' button in the navigation bar.";
    } else {
      return emergencyResponses.general;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    
    // Simulate bot typing with a small delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: processUserMessage(inputValue),
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickResponse = (text) => {
    // Add user message from quick response
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    
    // Simulate bot typing with a small delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: processUserMessage(text),
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 transition z-50 flex items-center"
      >
        {!isOpen ? (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="ml-2 font-medium">Emergency Help</span>
          </>
        ) : (
          <X className="h-6 w-6" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed right-6 bottom-24 bg-white rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out
            ${isMinimized ? 'w-64 h-12' : 'w-80 sm:w-96 h-96'}`}
        >
          {/* Chat header */}
          <div className="bg-red-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Emergency Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleMinimize} className="hover:bg-red-700 rounded p-1">
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button onClick={toggleChat} className="hover:bg-red-700 rounded p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="h-64 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-3 max-w-3/4 ${message.sender === 'user' ? 'ml-auto' : ''}`}
                  >
                    <div 
                      className={`p-3 rounded-lg inline-block 
                        ${message.sender === 'user' 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick responses */}
              <div className="p-2 border-t border-gray-200 flex overflow-x-auto hide-scrollbar">
                {quickResponses.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => handleQuickResponse(response.text)}
                    className="text-xs bg-gray-100 text-gray-800 py-1 px-3 rounded-full mr-2 whitespace-nowrap hover:bg-gray-200"
                  >
                    {response.text}
                  </button>
                ))}
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your emergency question..."
                  className="flex-grow p-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white p-2 rounded-lg ml-2 hover:bg-red-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EmergencyChatbot;