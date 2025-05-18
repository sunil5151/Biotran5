import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { ArrowLeft, Paperclip, Download, File } from 'lucide-react';

const ChatScreen = () => {
  const { user } = useContext(AppContext);
  const { receiverEmail } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);

  // Connect to socket.io server
  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    
    // Announce user is online
    if (user?.email) {
      socketRef.current.emit('user_online', user.email);
    }
    
    // Listen for online users
    socketRef.current.on('user_status', (users) => {
      setOnlineUsers(users);
    });
    
    // Listen for typing indicators
    socketRef.current.on('typing_indicator', (data) => {
      if (data.sender === receiverEmail) {
        setIsTyping(data.isTyping);
      }
    });
    
    // Listen for incoming messages
    socketRef.current.on('receive_message', (newMessage) => {
      if (
        (newMessage.sender === receiverEmail && newMessage.receiver === user?.email) ||
        (newMessage.sender === user?.email && newMessage.receiver === receiverEmail)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    
    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [user?.email, receiverEmail]);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        if (user?.email && receiverEmail) {
          const response = await axios.get('http://localhost:4000/api/messages/history', {
            params: {
              sender: user.email,
              receiver: receiverEmail
            }
          });
          
          if (response.data.success) {
            setMessages(response.data.messages);
          }
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    
    fetchChatHistory();
  }, [user?.email, receiverEmail]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (socketRef.current && user?.email && receiverEmail) {
      socketRef.current.emit('typing', {
        sender: user.email,
        receiver: receiverEmail
      });
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout
      const timeout = setTimeout(() => {
        socketRef.current.emit('stop_typing', {
          sender: user.email,
          receiver: receiverEmail
        });
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are supported');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      
      setAttachmentName(file.name);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear attachment
  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download attachment
  const downloadAttachment = (attachmentData, fileName) => {
    const link = document.createElement('a');
    link.href = attachmentData;
    link.download = fileName || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if ((!message.trim() && !attachment) || !user?.email || !receiverEmail) return;
    
    setIsUploading(true);
    
    const messageData = {
      sender: user.email,
      receiver: receiverEmail,
      content: message.trim() || 'Sent an attachment',
      timestamp: new Date(),
      hasAttachment: !!attachment,
      attachmentType: attachment ? 'pdf' : 'none',
      attachmentData: attachment,
      attachmentName: attachmentName
    };
    
    try {
      // Send to server
      await axios.post('http://localhost:4000/api/messages/send', messageData);
      
      // Emit to socket
      socketRef.current.emit('send_message', messageData);
      
      // Update local state
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
      clearAttachment();
      
      // Stop typing indicator
      socketRef.current.emit('stop_typing', {
        sender: user.email,
        receiver: receiverEmail
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if user is online
  const isUserOnline = onlineUsers.includes(receiverEmail);

  // Go back to chat list
  const goBackToChats = () => {
    navigate('/chats');
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={goBackToChats}
                className="mr-3 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className="font-semibold">{receiverEmail}</p>
                <div className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${isUserOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                  <span className="text-xs">{isUserOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${msg.sender === user?.email ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.sender === user?.email 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  
                  {/* Display attachment if exists */}
                  {msg.hasAttachment && msg.attachmentData && (
                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center justify-between">
                      <div className="flex items-center">
                        <File size={16} className="mr-2" />
                        <span className="text-sm truncate max-w-[120px]">
                          {msg.attachmentName || 'Document.pdf'}
                        </span>
                      </div>
                      <button
                        onClick={() => downloadAttachment(msg.attachmentData, msg.attachmentName)}
                        className="p-1 rounded hover:bg-white hover:bg-opacity-20"
                        title="Download file"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${msg.sender === user?.email ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 rounded-bl-none">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Attachment preview */}
          {attachment && (
            <div className="p-2 bg-gray-100 border-t flex items-center justify-between">
              <div className="flex items-center">
                <File size={16} className="mr-2 text-blue-600" />
                <span className="text-sm truncate max-w-[200px]">{attachmentName}</span>
              </div>
              <button
                onClick={clearAttachment}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
          
          {/* Message input */}
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                title="Attach PDF"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message..."
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
              <button
                type="submit"
                className={`bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isUploading}
              >
                {isUploading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatScreen;