import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles/suggestions.css";
import rectangle from "./assets/rectangle.png";
import {mockSuggestions} from "../tests/mocks/mockedData";


interface SuggestionsProps {
  currentEntry: string;
  displaySuggestions: boolean;
  mockMode: boolean;
}

/* The main repl component that contains the shared history state and displays the history and input. */
export default function SuggestionsDisplay(props: SuggestionsProps) {

    document.addEventListener("keydown", (event: KeyboardEvent) => {
    if ( // if first suggestion is clicked using keyboard input
      (event.ctrlKey) && event.shiftKey &&
      event.code === "Digit1"
    ) {
      document.getElementById("checkbox1")?.click();

    }
    if (
      (event.ctrlKey) && event.shiftKey &&
      event.code === "Digit2"
    ) {
      document.getElementById("checkbox2")?.click();
    }
    if (
      (event.ctrlKey) && event.shiftKey &&
      event.code === "Digit3"
    ) {
      document.getElementById("checkbox3")?.click();
    }
  });

  const [suggestion, setSuggestion] = useState<Array<string>>([]);
  var flaskIPAddress = "http://192.168.1.131:5001/"; // of python server running on flask handling suggestion generation
  

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (props.mockMode) {
          setSuggestion(mockSuggestions);
        } else {
        const link = flaskIPAddress + "getsuggestions?entry=" + props.currentEntry;
        const response = await fetch(link);
        console.log("making fetch call to pytho backend");
        const data = await response.json();
        setSuggestion(data.suggestions || []);
        console.log("retrieved suggestions from flask are: " + data.suggestions)
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [props.currentEntry, props.mockMode]);

  // const suggestions = (args: string): Promise<Array<string> | undefined> => {
  //   const link = "http://localhost:3232/getsuggestions?entry=" + props.currentEntry;
  //   return fetch(link)
  //     .then((response) => response.json())
  //     .then((responseObject) => {
  //       return responseObject;
  //     });
  // };

  async function handleClick(suggestion: string) {
    // fetch request sending the suggestion to the savesuggestion flask endpoint
    try {
      const link = flaskIPAddress + "savesuggestion?suggestion=" + suggestion;
      const response = await fetch(link);
      const result = await response.json();

      if (result!="success") {
        console.log("an error occured when saving the suggestion to the user's history in the backend")
      }

    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }

  }

  return (
    <div className="suggestions-display" aria-label="suggestions display">
      <h2 className="suggestions-title">Suggestions:</h2>
      <div className="suggestions-content">
        <body>
          <ul className="suggestions-list" aria-label="suggestions list">
            <li>
              <input type="checkbox" id="checkbox1" onChange={() => handleClick(suggestion[0])}>
              </input>
              <label htmlFor="checkbox1">{suggestion[0]}</label>
            </li>
            <hr className="list-division"></hr>
            <li>
              <input type="checkbox" id="checkbox2" onChange={() => handleClick(suggestion[1])}></input>
              <label htmlFor="checkbox2">{suggestion[1]}</label>
            </li>
            <hr className="list-division"></hr>
            <li>
              <input type="checkbox" id="checkbox3" onChange={() => handleClick(suggestion[2])}></input>
              <label htmlFor="checkbox3">{suggestion[2]}</label>
            </li>
          </ul>
        </body>
      </div>
    </div>
  );
}
