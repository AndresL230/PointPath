"use client";

import { useState, useEffect } from "react";

export default function Chat() {
    const userId = "user01";

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchIntro() {
            try {
                const res = await fetch(`http://localhost:8000/api/chat/intro/${userId}`);
                const data = await res.json();

                setMessages([
                    {
                        role: "assistant",
                        content: data.response,
                    },
                ]);
            } catch {
                setMessages([
                    {
                        role: "assistant",
                        content:
                            "Hi, I’m your educational assistant. What can I help you with?",
                    },
                ]);
            }
        }

        fetchIntro();
    }, []);

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    message: userMessage.content,
                }),
            });


            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry — something went wrong while contacting the assistant.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
            <h1 className="text-xl mb-4">
                Ask clarifying questions about your financial state
            </h1>

            <section className="bg-white mt-8 rounded-lg flex flex-col h-[70vh]">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[75%] px-4 py-3 rounded-lg ${msg.role === "assistant"
                                    ? "bg-slate-100 text-gray-800"
                                    : "bg-[#5877B4] text-white ml-auto"
                                }`}
                        >
                            {msg.content}
                        </div>
                    ))}

                    {loading && (
                        <div className="bg-slate-100 text-gray-500 px-4 py-3 rounded-lg w-fit">
                            Thinking…
                        </div>
                    )}
                </div>

                <form
                    onSubmit={sendMessage}
                    className="border-t px-4 py-4 flex gap-3"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your finances..."
                        className="flex-1 text-black border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#5877B4]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#5877B4] text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                        Send
                    </button>
                </form>
            </section>
        </main>
    );
}