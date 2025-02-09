import { useState } from 'react';

type ChatProps = {
  matchId: string | undefined;
};

function ChatOption({ matchId }: ChatProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-2">Chat Room - Match {matchId}</h2>
      <div className="h-32 border rounded-lg p-2 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-1 border-b">{msg}</div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input 
          type="text" 
          className="border rounded-lg p-2 flex-grow" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatOption;