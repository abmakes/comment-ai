import { useState } from "react";
import { api } from "~/utils/api";

type ChatItem = {
  name: string;
  content: string;
};

export default function SearchForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<ChatItem>({name: "", content: "",});

  const generatedTextMutation = api.aiRouter.generateText.useMutation({
    onSuccess: (data) => {
      setResults(
        {
          content: data?.generatedText || "",
          name: "AI",
        },
      );
    },

    onError: (error) => {
      setResults(
        {
          content: error.message ?? "error occured",
          name: "AI",
        },
      );
    },

    onSettled: () => {
      console.log("complete")
    },
  });

  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    generatedTextMutation.mutate({ prompt: name })
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-bold text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block mb-2 font-bold text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>{results.content}</div>
      <button
        type="submit"
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      >
        Submit
      </button>
    </form>
  );
}