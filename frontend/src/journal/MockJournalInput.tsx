// put the submit button here

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ControlledInput } from "./ControlledInput";
import { JournalFunction } from "./JournalFunction";
import "../styles/journal.css";
import submit from "../assets/submit.png";
import { EntryInfo } from "./EntryInfo";
import JournalPrompt from "./JournalPrompt";
import PrevButton from "./PrevButton";
import NextButton from "./NextButton";
import {
  mockPrompt1,
  mockPrompt2,
  mockPrompt3,
  mockDate,
  mockEntry,
  mockEntry2,
  mockEntryInfo1,
  mockEntryInfo2,
  mockBackend,
} from "../../tests/mocks/mockedData";

interface JournalInputProps {
  onSubmit: () => void;
  // history: EntryInfo[]; // the map of past entries
  setCurrentEntry: Dispatch<SetStateAction<string>>;
  //setDisplaySuggestions: Dispatch<SetStateAction<boolean>>; // the 3 suggestions shown
}

/* This displays the text box and associated buttons and ... ? */
export default function MockJournalInput(props: JournalInputProps) {
  // Manages the contents of the input box, object, and csv
  const [entry, setEntry] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [render, setRender] = useState<number>(0);
  const [entryNum, setEntryNum] = useState<number>(1);

  /* fetch the prompt when the page is started */
  function mockFetchPrompt(): string {
    return mockPrompt1;
  }

  function mockFetchDate(): string {
    return mockDate;
  }

  /* on page initialization, get & display the prompt and the date */
  useEffect(() => {
    const mockFetchedPrompt = mockFetchPrompt();
    const mockFetchedDate = mockFetchDate();
    setPrompt(mockFetchedPrompt);
    setDate(mockFetchedDate);
  }, []);

  useEffect(() => {
    // whenver mock next or prev is called, render will be updated, which should 
    // visually re render the items on the page with the new mock entry objects
  }, [entryNum]);

  function errorDisplay(message: string) {
    const errorDisplay = document.getElementById("error-display");
    if (errorDisplay) {
      errorDisplay.innerText = `Error: ${message}`;
      errorDisplay.style.display = "block";
    } else {
      console.error("Error display message not found.");
    }
  }

  function mockPreviousEntry() {
    const p = mockBackend[entryNum - 1].prompt;
    const d = mockBackend[entryNum - 1].date;
    const e = mockBackend[entryNum - 1].entry;

    if (typeof p === "string") {
      setPrompt(p); // TODO: how to fix these?
    }
    if (typeof d === "string") {
      setDate(d); // TODO: how to fix these?
    }    if (typeof e === "string") {
      setEntry(e); // TODO: how to fix these?
    }

    console.log("p: " + p + "\nd: " + d + "\ne: " + e);

    setEntryNum(entryNum - 1);
  };

  function mockNextEntry() {
    const p = mockBackend[entryNum + 1].prompt;
    const d = mockBackend[entryNum + 1].date;
    const e = mockBackend[entryNum + 1].entry;

    if (typeof p === "string") {
      setPrompt(p); // TODO: how to fix these?
    }
    if (typeof d === "string") {
      setDate(d); // TODO: how to fix these?
    }    if (typeof e === "string") {
      setEntry(e); // TODO: how to fix these?
    }

    console.log("p: " + p + "\nd: " + d + "\ne: " + e);

    setEntryNum(entryNum + 1);
  };

  const handleClick = () => {
    console.log("Submit button clicked");
    props.setCurrentEntry(entry);
    props.onSubmit();
  };
  /**
   * allows user to press enter instead of clicking submit
   * @param event a keyboard press
   * @param command the input string
   */
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    entry: string
  ) => {
    if (event.key === "Enter") {
      console.log("enter pressed");
      // handleSubmit(entry);
      // scrollHistoryToBottom();
    }
  };

  function mockAutoSave() {
    mockBackend[entryNum].entry = entry;
  }

  /* returns component to user: the input box, sets logic for submtting a command on submit button */
  return (
    <div
      className="journal-input"
      aria-label="Journal input"
      aria-description="Journal input box"
    >
      <JournalPrompt prompt={prompt} date={date} />

      <ControlledInput
        value={entry}
        setValue={setEntry}
        ariaLabel="journal command box"
        placeholder="Enter response here..."
        onKeyPress={(e) => handleKeyPress(e, entry)}
        onInput={(e) => mockAutoSave()}
      />
      <div className="button-area">
        <div className="prev-next-menu">
          <button className="prev-button" onClick={() => mockPreviousEntry()}>
            <PrevButton />
            prev
          </button>
          <button className="next-button" onClick={() => mockNextEntry()}>
            <NextButton />
            next
          </button>
        </div>
        <button
          className="submit-button"
          aria-label="submit button"
          id="submit-button"
          onClick={handleClick}
        >
          <p className="submit-text">submit for suggestions</p>
          <a target="_blank" rel="noopener noreferrer">
            <img src={submit} alt="submit" className="submit-arrows" />
          </a>
        </button>
      </div>
    </div>
  );
}
