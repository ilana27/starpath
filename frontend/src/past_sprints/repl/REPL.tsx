import { Dispatch, SetStateAction, useState } from "react";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";
/* The input gets parsed into an input object so that the data can be easily accessed and displayed */
export interface InputObject {
  command: string;
  result?: string[][] | string;
}

interface REPLProps {
  setKeyword: Dispatch<SetStateAction<string>>;
}

/* The main repl component that contains the shared history state and displays the history and input. */
export default function REPL(props: REPLProps) {
  const [history, setHistory] = useState<InputObject[]>([]);
  const [mode, setMode] = useState<boolean>(false);

  document.addEventListener("keydown", (event) => {
    if (event.key === "tab") {
      console.log("event listener was run");
      const textBox = document.querySelector(
        ".repl-command-box"
      ) as HTMLElement;
      if (textBox) {
        textBox.focus();
      }
    }
  });

  return (
    <div className="repl" aria-label="REPL">
      <REPLHistory history={history} mode={mode} />
      <hr></hr>
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
        setKeyword={props.setKeyword}
      />
    </div>
  );
}
