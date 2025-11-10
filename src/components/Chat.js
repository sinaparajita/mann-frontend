import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "asc"));  // Use "chats" in lowercase
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMsg.trim() === "") return;

    try {
      await addDoc(collection(db, "chats"), {  // Use "chats" in lowercase
        text: newMsg.trim(),
        author: "Anonymous",
        createdAt: serverTimestamp(),
      });
      setNewMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>Peer Support Chat</h3>
      <div style={{ height: 400, overflowY: "auto", border: "1px solid #eee", padding: 10, backgroundColor: "#fafafa", borderRadius: 4, marginBottom: 10 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <strong>{msg.author}:</strong> <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <textarea
        rows={3}
        style={{ width: "100%", resize: "none", padding: 8 }}
        placeholder="Type your message here..."
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={sendMessage} style={{ marginTop: 8, padding: "8px 16px" }}>Send</button>
    </div>
  );
}
