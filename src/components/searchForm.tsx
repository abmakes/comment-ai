import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import books from "../json/books.json" assert { type: "json" };
import parse from 'html-react-parser';
import Image from "next/image";
import Loading from "../loading-loop.svg"
import { spawn } from "child_process";


// type ChatItem = { 
//   name: string;
//   content: string;
// };

type UnitsArray = Unit[][]
type Unit = {
  vocabulary: string;
  grammar: string;
  examples: string;
  language_in_use: string;
}

export default function SearchForm() {
  const [accordion, setAccordion] = useState(false)
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [grammar, setGrammar] = useState("");
  const [note, setNote] = useState("");
  const [results, setResults] = useState<string>("Comments will display here");
  const [unit, setUnit] = useState("0");
  const [book, setBook] = useState("0")  
  const [length, setLength] = useState(30)
  const [temperature, setTemperature] = useState(70)

  const [unitData, setUnitData] = useState<Unit>({
      vocabulary: "string",
      grammar: "string",
      examples: "string",
      language_in_use: "string",
    }
  )

  useEffect(() => {
    const setUnitContent = (book:number, unit:number) => {
      // console.log(book, unit)
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
      const str = data?.generatedText || ""
      let formattedText = str.replaceAll(/Option 1:/gi, '<b>Option 1:</b><br />');
      formattedText = formattedText.replaceAll(/Option 2:/gi, '<br /><br /><b>Option 2:</b><br />');
      setResults(
         formattedText
      );
    },

    onError: (error) => {
      setResults(
         error.message ?? "error occured",
      );
    },

    onSettled: () => {
      // console.log("complete")
      setLoading(false)
    },
  });
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    // console.log("name: ", name, ", note: ", note, ", behaviour: ", behaviour, ", grammar: ", grammar, ", length: ", length)
    generatedTextMutation.mutate({name, note, behaviour, grammar, unitData, length})
  };

  return (
    <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn flex justify-center items-center flex-col space-y-5 text-sm font-inter text-blue-950">
      <h1 className="text-base font-semibold">Select options and generate a comment</h1>
      <div className="grid sm:grid-cols-2 justify-center gap-5 lg:gap-10">
        
        <div  className="flex justify-center flex-col lg:max-w-sm  space-y-3">
          <div className="">
            <label htmlFor="name" className="block mb-1 font-medium">
              Student name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Student name"
              onChange={(event) => setName(event.target.value)}
              className="w-full px-3 py-2 leading-tight placeholder-gray-600 border-b border-gray-400 bg-gray-100 rounded focus:outline outline-gray-300"
              // focus:outline-blue-100 focus:shadow-outline
            />
          </div>
          <label className="flex flex-col space-y-2">
            <span className="font-medium">
              Select current book and unit
            </span>
            <div className="flex justify-between">
              <select
                name="book"
                className="
                  block
                  w-3/5
                  px-3 py-2 leading-tight text-gray-600 border-b border-gray-400 bg-gray-100 rounded focus:outline outline-gray-300
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
                  w-1/3
                  px-3 py-2 leading-tight text-gray-600 border-b border-gray-400 bg-gray-100 rounded focus:outline outline-gray-300
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
             {/* text-gray-600 border-b border-gray-400 bg-gray-100 rounded          */}
            <div className="flex flex-col w-full text-xs h-24 p-1 leading-tight">
              <div key={1}><b>Vocabulary:</b> {unitData.vocabulary}</div> 
              <div key={2}><b>Grammar:</b> {unitData.grammar}</div>
              <div key={3}><b>Language in use:</b> {unitData.language_in_use}</div>
            </div>
          </label>

          <div className="flex align-middle justify-between gap-3">
            <div className="mt-2 text-sm">
              <span className="font-medium">
                Behaviour
              </span>
              <select
                name=""
                className="
                  flex
                  w-full
                  px-3 py-2 leading-tight text-gray-600 border-b border-gray-400 bg-gray-100 rounded focus:outline outline-gray-300
                "
                onChange={(e)=>setBehaviour(e.target.selectedOptions[0]?.id || '')}
              >
                <option id="High energy">High energy</option>
                <option id="Hard working">Hard working</option>
                <option id="Participates regularly">Participates regularly</option>
                <option id="Quiet and studious">Quiet and studious</option>
                <option id="Unfocused">Unfocused</option>
                <option id="">-na-</option>
              </select>

            </div>

            <div className="mt-2 text-sm">
              <span className="font-medium">
                Grammar
              </span>
              <select
                name=""
                className="
                  flex
                  w-full
                  px-4 py-2 leading-tight text-gray-600 border-b border-gray-400 bg-gray-100 rounded focus:outline outline-gray-300
                "
                onChange={(e)=>setGrammar(e.target.selectedOptions[0]?.id || '')}
              >
                <option id="Excellent">Excelled</option>
                <option id="Great understanding">Great understanding</option>
                <option id="Good understanding">Good understanding</option>
                <option id="Quiet and studious">Quiet and studious</option>
                <option id="Struggled a bit">Struggled a bit</option>
                <option id="Needs practice">Needs practice</option>
                <option id="">-na-</option>
              </select>
            </div>
          </div>
          <div className="">
            <label htmlFor="note" className="block mb-1 font-medium">
              {`Teacher's notes (will be included)`}
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full p-3 leading-tight text-gray-700 border-b border-gray-400 bg-gray-100 rounded focus:outline outline-gray-300"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3 lg:max-w-sm">
          <label className="self-end">
            
            <input type="checkbox" className="group peer appearance-none absolute" />
            <div onClick={() => setAccordion(!accordion)} className="hover:text-violet-800 hover:stroke-violet-800 hover:border-violet-800 text-gray-500 stroke-gray-500 flex gap-1 items-center text-xs cursor-pointer justify-end"> 
                Settings      
              { accordion ?
                <svg className="fill-inherit text-inherit w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="rotate(180 12 12)"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 10l5 5m0 0l5-5"/></g></svg>
                :
                <svg className="fill-inherit text-inherit w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 10l5 5m0 0l5-5"/></svg>
              }
         
            </div>   

            <div className="peer-checked:h-auto h-0 peer-checked:flex hidden self-end text-xs flex-col gap-1">
              <div className="self-end items-center gap-3">
                <span>{`Set creativity (higher more creative): `}</span>
                <label className="inline-flex items-center">
                  <select
                    name="comment-temp"
                    className="
                      block
                      w-16
                      mt-1
                      bg-gray-100
                      text-slate-800
                      border-gray-300
                      p-1
                      rounded-md
                      shadow-sm
                    "
                    value={temperature}
                    onChange={(e)=>setTemperature(parseInt(e.target.value || "70"))}
                  >
                    <option>50</option>
                    <option>60</option>
                    <option>70</option>
                    <option>80</option>
                    <option>90</option>
                  </select>
                </label>
              </div>        
              
              <div className="self-end items-center gap-3">
                <span>{`Set comment length (words): `}</span>
                <label className="inline-flex items-center">
                  <select
                    name="comment-length"
                    className="
                      block
                      w-16
                      mt-1
                      bg-gray-100
                      text-slate-800
                      border-gray-300
                      p-1
                      rounded-md
                      shadow-sm
                    "
                    onChange={(e)=>setLength(parseInt(e.target.value || "50"))}
                  >
                    <option>30</option>
                    <option>40</option>
                    <option>50</option>
                    <option>60</option>
                    <option>70</option>
                  </select>
                </label>
              </div> 
            </div>
          </label>

          <div className="w-full text-sm p-3 h-full text-gray-700 border-t border-b  border-gray-400 rounded focus:outline outline-gray-300">
            {
                loading 
                ?                 
                <svg className="stroke-gray-700 w-full h-8 mt-5"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" strokeLinecap="round" strokeWidth="2"><path strokeDasharray="60" strokeDashoffset="60" strokeOpacity=".3" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0"/></path><path strokeDasharray="15" strokeDashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg>
                : 
                parse(results) || "Comments will display here"
            }
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="px-20 py-2 font-medium text-white bg-gradient-to-tr from-blue-900 via-violet-700 to-violet-900 rounded-full hover:via-violet-900 hover:to-blue-950 focus:outline-none active:bg-blue-900"
      >
        {
          loading 
          ? 
          <svg className="stroke-gray-50 w-40 h-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" strokeLinecap="round" strokeWidth="2"><path strokeDasharray="60" strokeDashoffset="60" strokeOpacity=".3" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0"/></path><path strokeDasharray="15" strokeDashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg>
          : 
          <span className="w-44 h-5">Generate new comments</span>
        }
      </button>
    </form>
  );
}