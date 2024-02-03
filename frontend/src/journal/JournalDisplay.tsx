import { Dispatch, SetStateAction, useEffect, useState } from "react";
import JournalInput from "./JournalInput";
import MockJournalInput from "./MockJournalInput";
import "../styles/journal.css";

interface JournalProps {
  setCurrentEntry: Dispatch<SetStateAction<string>>;
  setDisplaySuggestions: (display: boolean) => void;
  onSubmit: () => void;
  onNext: () => void;
  mockMode: boolean;
  // isSubmitted: boolean;
}


export default function JournalDisplay(props: JournalProps) {
  // const [history, setHistory] = useState<EntryInfo[]>([]);
  // const [prompt, setPrompt] = useState<string>(""); //
  const [mocking, setMocking] = useState<boolean>(false); 
  

  // useEffect(() => {
  //   if (props.isSubmitted) {
  //     // Do something when isSubmitted changes (e.g., display suggestions)
  //     props.setDisplaySuggestions(true);
  //   }
  // }, [props.isSubmitted]);

  useEffect(() => {
    // whenever mocking boolean is flipped, re render the page

  }, [mocking])

  document.addEventListener("keydown", (event) => {
    if (event.key === "tab") {
      console.log("event listener was run");
      const textBox = document.querySelector(
        ".journal-command-box"
      ) as HTMLElement;
      if (textBox) {
        textBox.focus();
      }
    }
    if (
      (event.ctrlKey) && event.shiftKey &&
      event.code === "KeyM"
    ) {
      setMocking(!mocking);
      console.log("switched modes, mocking is " + mocking);
    }
  });

  return (
    <div className="journal-display" aria-label="journal">
      { props.mockMode ? (
        <MockJournalInput
        onSubmit={() => {
          props.setDisplaySuggestions(true);
          props.onSubmit();
        }}
          setCurrentEntry={props.setCurrentEntry}
        /> 
      ) : (
        <JournalInput
        onSubmit={() => {
          props.setDisplaySuggestions(true);
          props.onSubmit();
        }}
        onNext={() => {
          props.setDisplaySuggestions(false);
          props.onNext();
        }}
        setCurrentEntry={props.setCurrentEntry}
      />
        
      )}

    </div>
  );
}