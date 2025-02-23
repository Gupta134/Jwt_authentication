import React, { useState, useEffect } from 'react';
import axios from 'axios';
import chatbotimg from './assets/userbot.jpg';
import { MdOutlineRestartAlt } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaComment, FaRobot } from "react-icons/fa";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Welcome to the chatbot! What course are you interested in?', typing: false }
  ]);
  const [step, setStep] = useState('courseSelection');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [userDetails, setUserDetails] = useState({ reason: '', name: '', email: '', contact: '', address: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  const restartChat = () => {
    setMessages([{ from: 'bot', text: 'Welcome to the chatbot! What course are you interested in?', typing: false }]);
    setStep('courseSelection');
    setSelectedCourse('');
    setUserDetails({ reason: '', name: '', email: '', contact: '', address: '' });
  };

  const simulateTyping = (newMessage) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: newMessage, typing: false }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setMessages(prev => [...prev, { from: 'user', text: course }]);
    simulateTyping(`Why do you want to learn ${course}? Please select one reason:`);
    setStep('reasonSelection');
  };

  const handleReasonSelect = (reason) => {
    setUserDetails(prev => ({ ...prev, reason }));
    setMessages(prev => [...prev, { from: 'user', text: reason }]);
    simulateTyping('What is your name?');
    setStep('name');
  };

  const handleInput = (input) => {
    if (step === 'name') {
      setUserDetails(prev => ({ ...prev, name: input }));
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      simulateTyping('Please enter your email:');
      setStep('email');
    } else if (step === 'email') {
      setUserDetails(prev => ({ ...prev, email: input }));
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      simulateTyping('Please enter your contact number:');
      setStep('contact');
    } else if (step === 'contact') {
      setUserDetails(prev => ({ ...prev, contact: input }));
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      simulateTyping('Please enter your address:');
      setStep('address');
    } else if (step === 'address') {
      const updatedDetails = { ...userDetails, address: input };
      setUserDetails(updatedDetails);
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      simulateTyping(`Thank you ${updatedDetails.name}! You've selected ${selectedCourse} Course. Our team will reach out to you at ${updatedDetails.email}.`);
      setStep('completed');

      // Axios POST request
      axios.post('http://localhost:3000/', {
        name: updatedDetails.name,
        email: updatedDetails.email,
        contact: updatedDetails.contact,
        selectedCourse: selectedCourse
      })
      .then(response => {
        console.log('Data successfully sent to backend:', response.data);
      })
      .catch(error => {
        console.error('Error sending data to backend:', error);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      handleInput(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="bg-img relative min-h-screen bg-gray-100 flex justify-center items-center p-5">
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleChat}
            className="p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 focus:outline-none"
          >
            <FaComment className="w-6 h-6" />
          </button>
        </div>
      )}

      {isChatOpen && (
        <div className="absolute bottom-6 right-6 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden transition-all transform translate-y-0">
          <div className="bg-purple-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="border h-12 w-12 rounded-full flex items-center justify-center overflow-hidden">
                <img src={chatbotimg} alt="Chatbot" className="w-full h-full object-cover" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-semibold">Chatbot</span>
                <div className="flex items-center">
                  <p className="text-sm">Online Now</p>
                  <span className="ml-2 w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <span onClick={restartChat} className="cursor-pointer"><MdOutlineRestartAlt size={20} /></span>
              <span onClick={toggleChat} className="cursor-pointer"><RxCross2 size={20} /></span>
            </div>
          </div>

          <div className="p-4 space-y-4 h-96 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs p-3 rounded-lg flex items-center space-x-2 ${msg.from === 'bot' ? 'bg-gray-300 text-gray-700' : 'bg-purple-500 text-white'}`}>
                  {msg.from === 'bot' && <FaRobot className="w-5 h-5 text-gray-600" />}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-lg bg-gray-300 text-gray-700 flex items-center space-x-2">
                  <FaRobot className="w-5 h-5 text-gray-600" />
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}

            {step === 'courseSelection' && (
              <div className="flex flex-col space-y-2">
                {['Web Development', 'Data Science', 'UI/UX Design'].map(course => (
                  <button key={course} onClick={() => handleCourseSelect(course)} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                    {course}
                  </button>
                ))}
              </div>
            )}

            {step === 'reasonSelection' && (
              <div className="flex space-x-2">
                {['Career Advancement', 'Skill Development', 'Personal Interest'].map(reason => (
                  <button key={reason} onClick={() => handleReasonSelect(reason)} className="p-2 bg-purple-400 text-white rounded-lg hover:bg-purple-600">
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>

          {step !== 'completed' && ['name', 'email', 'contact', 'address'].includes(step) && (
            <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-200">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type your response..."
              />
              <button type="submit" className="ml-2 p-2 rounded-full bg-purple-500 text-white">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
