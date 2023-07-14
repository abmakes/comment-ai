import { useState } from "react";
import { api } from "~/utils/api";

type ChatItem = {
  name: string;
  content: string;
};

export default function SearchForm() {
  const [name, setName] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [grammar, setGrammar] = useState("");
  const [note, setNote] = useState("enthusiastic and participates regularly");
  const [results, setResults] = useState<ChatItem>({name: "", content: "",});
  const [unit, setUnit] = useState("Academy Starters");
  const [book, setBook] = useState("Unit 1")

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
    // console.log(name, note, behaviour, grammar)
    generatedTextMutation.mutate({name, note, behaviour, grammar})
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">
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
      {/* <div className="mb-6">
        <label htmlFor="performance" className="block mb-1 font-medium text-gray-400">
          Performance
        </label>
        <textarea
          id="performance"
          value={performance}
          onChange={(event) => setPerformance(event.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div> */}
      <label className="mb-6 flex flex-col">
        <span className="font-medium">
          Select book
        </span>
        <div className="flex justify-between">
          <select
            name="book"
            className="
              block
              w-3/4
              mt-1
              text-slate-800
              border-gray-300
              rounded-md
              shadow-sm
            "
            onChange={(e)=>setBook(e.target.value)}
          >
            <option>Academy Starters</option>
            <option>Academy Stars 1</option>
            <option>Academy Stars 2</option>
            <option>Academy Stars 3</option>
            <option>Academy Stars 4</option>
          </select>
          <select
            name="unit"
            className="
              block
              w-1/5
              mt-1
              text-slate-800
              border-gray-300
              rounded-md
              shadow-sm
              focus:border-indigo-300
              focus:ring
            "
            onChange={(e)=>setUnit(e.target.value)}
          >
            <option>Unit 1</option>
            <option>Unit 2</option>
            <option>Unit 3</option>
            <option>Unit 4</option>
            <option>Unit 5</option>
            <option>Unit 6</option>
            <option>Unit 7</option>
            <option>Unit 8</option>
            <option>Unit 9</option>
            <option>Unit 10</option>

          </select>
        </div>
      </label>
      <div className="mb-6 flex align-middle justify-center gap-6">
        <div className="mt-2">
          <span className="font-medium">
            Behaviour
          </span>
          <div>
            <label className="inline-flex items-center">
              <input
                name="behaviour"
                type="radio"
                className="
                  text-indigo-600
                  border-gray-300
                  rounded-full
                  shadow-sm
                "
                onClick={()=>setBehaviour("High energy")}
              />
              <span className="ml-2">High energy</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="behaviour"
                type="radio"
                className="
                  text-indigo-600
                  border-gray-300
                  rounded-full
                  shadow-sm
                "
                onClick={()=>setBehaviour("Quiet and studious")}
                />
              <span className="ml-2">Quiet and studious</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="behaviour"
                type="radio"
                className="
                  text-indigo-600
                  border-gray-300
                  rounded-full
                  shadow-sm
                "
                onClick={()=>setBehaviour("Unfocused")}
                />
              <span className="ml-2">Unfocused</span>
            </label>
          </div>
        </div>

        <div className="mt-2">
          <span className="font-medium">
            Grammar
          </span>
          <div>
            <label className="inline-flex items-center">
              <input
                name="grammar"
                type="radio"
                className="
                  text-indigo-600
                  border-gray-300
                  rounded-full
                  shadow-sm
                "
                onClick={()=>setGrammar("Great understanding")}
              />
              <span className="ml-2">Great understanding</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="grammar"
                type="radio"
                className="
                  text-indigo-600
                  border-gray-300
                  rounded-full
                  shadow-sm
                "
                onClick={()=>setGrammar("Basic understanding")}
                />
              <span className="ml-2">Basic understanding</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                name="grammar"
                type="radio"
                className="
                  text-indigo-600
                  border-gray-300
                  rounded-full
                  shadow-sm
                "
                onClick={()=>setGrammar("Needs practice")}
                />
              <span className="ml-2">Needs practice</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="note" className="block mb-1 font-medium">
          {`Teacher's notes (will be included)`}
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
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