import React, { useState } from "react";
import axios from "axios";

const AIChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const styles = {
    toggleButton: {
      position: "fixed",
      bottom: "20px",
      left: "20px",
      zIndex: 999,
      padding: "0.7rem 1rem",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    container: {
      position: "fixed",
      bottom: "80px",
      left: "20px",
      width: "320px",
      maxHeight: "480px",
      backgroundColor: "#f4f4f4",
      borderRadius: "10px",
      fontFamily: "sans-serif",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      display: open ? "flex" : "none",
      flexDirection: "column",
      zIndex: 1000,
    },
    chatbox: {
      flex: 1,
      overflowY: "auto",
      padding: "1rem",
      backgroundColor: "#fff",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      borderBottom: "1px solid #ddd",
    },
    message: {
      margin: "0.5rem 0",
    },
    user: {
      textAlign: "right",
      color: "#007bff",
    },
    bot: {
      textAlign: "left",
      color: "#333",
    },
    inputArea: {
      display: "flex",
      gap: "0.5rem",
      padding: "0.5rem",
      borderTop: "1px solid #ccc",
      backgroundColor: "#f9f9f9",
    },
    input: {
      flex: 1,
      padding: "0.4rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "0.4rem 0.8rem",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    // Check if the user is asking for nearby hospitals
    if (userInput.toLowerCase().includes("find a hospital") || userInput.toLowerCase().includes("nearest hospital")) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          axios.get(`http://localhost:4000/api/places/nearby?lat=${latitude}&lng=${longitude}`)
            .then(response => {
              const places = response.data.results;
              const reply = places.length
                ? places.slice(0, 5).map(place => `${place.name}, ${place.vicinity}`).join("\n")
                : "No hospitals found nearby.";
              
              setMessages([...newMessages, { sender: "bot", text: reply }]);
            })
            .catch(() => setMessages([...newMessages, { sender: "bot", text: "Sorry, couldn't fetch hospital data." }]));
        },
        (error) => setMessages([...newMessages, { sender: "bot", text: "Please enable location access." }])
      );
    } else {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant for the ArogyaMate	 platform. Help users with booking doctor appointments, managing prescriptions, and using the platform. Keep responses short, clear, and focused. Avoid long paragraphs or unrelated content.",
              },
              ...newMessages.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
              })),
            ],
          }),
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
          const botReply = data.choices[0].message.content;
          setMessages([...newMessages, { sender: "bot", text: botReply.trim() }]);
        } else {
          setMessages([...newMessages, { sender: "bot", text: "Sorry, no response received." }]);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages([...newMessages, { sender: "bot", text: "Error: Could not reach chatbot API." }]);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <button style={styles.toggleButton} onClick={() => setOpen(!open)}>
        {open ? "Close Chat" : "Chat with us 💬"}
      </button>
      <div style={styles.container}>
        <div style={styles.chatbox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(msg.sender === "user" ? styles.user : styles.bot),
              }}
            >
              <strong>{msg.sender === "user" ? "You" : "Sarah"}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} style={styles.button} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatBot;
