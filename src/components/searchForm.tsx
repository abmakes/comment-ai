import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import books from "../json/books.json" assert { type: "json" };

type ChatItem = { 
  name: string;
  content: string;
};

type UnitsArray = Unit[][]
type Unit = {
  vocabulary: string;
  grammar: string;
  examples: string;
  language_in_use: string;
}

export default function SearchForm() {
  const [name, setName] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [grammar, setGrammar] = useState("");
  const [note, setNote] = useState("");
  const [results, setResults] = useState<ChatItem>({name: "", content: "",});
  const [unit, setUnit] = useState("0");
  const [book, setBook] = useState("0")
  const [unitData, setUnitData] = useState<Unit>({
      vocabulary: "string",
      grammar: "string",
      examples: "string",
      language_in_use: "string",
    }
  )

  useEffect(() => {
    const setUnitContent = (book:number, unit:number) => {
      console.log(book, unit)
      const bookData:UnitsArray = books
      const example:Unit = {
        vocabulary: "string",
        grammar: "string",
        examples: "string",
        language_in_use: "string",
      }
      if (bookData !== undefined) {
        const bookContent:Unit = bookData?.[book]?.[unit] || example;
        setUnitData(bookContent) 
      }
    };
    setUnitContent(parseInt(book), parseInt(unit))
  }, [unit, book]);

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
    generatedTextMutation.mutate({name, note, behaviour, grammar, unitData})
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
            onChange={(e)=>setBook(e.target.selectedOptions[0]?.id || "0")}
          >
            <option id="0">Academy Starters</option>
            <option id="1">Academy Stars 1</option>
            <option id="2">Academy Stars 2</option>
            <option id="3">Academy Stars 3</option>
            <option id="4">Academy Stars 4</option>
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
            onChange={(e)=>setUnit(e.target.selectedOptions[0]?.id || '1')}
          >
            <option id="00">Unit 1</option>
            <option id="01">Unit 2</option>
            <option id="02">Unit 3</option>
            <option id="03">Unit 4</option>
            <option id="04">Unit 5</option>
            <option id="05">Unit 6</option>
            <option id="06">Unit 7</option>
            <option id="07">Unit 8</option>
            <option id="08">Unit 9</option>
            <option id="09">Unit 10</option>
          </select>
        </div>          
        <div className="w-full p-3">
          <div key={1}>Vocab: {unitData.vocabulary}</div> 
          <div key={2}>Grammar: {unitData.grammar}</div>
          <div key={3}>Language in use: {unitData.language_in_use}</div>
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
                onClick={()=>setBehaviour("Hard working")}
              />
              <span className="ml-2">Hard working</span>
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
                onClick={()=>setBehaviour("Participates regularly")}
              />
              <span className="ml-2">Participates regularly</span>
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
                onClick={()=>setBehaviour("not applicable")}
              />
              <span className="ml-2">-na-</span>
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
                onClick={()=>setGrammar("Excelled")}
                />
              <span className="ml-2">Excelled</span>
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
                onClick={()=>setGrammar("Struggled a bit")}
                />
              <span className="ml-2">Struggled a bit</span>
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
                onClick={()=>setGrammar("")}
                />
              <span className="ml-2">-na-</span>
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