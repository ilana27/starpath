import { InputObject } from "./REPL";
import { useRef, useEffect } from "react";
import "../App.css";
/* history object defined as a list of input objects */
interface REPLHistoryProps {
  history: InputObject[];
  mode: boolean;
}
/**
 * History component determines how previous commands are displayed.
 * @param props the list of previous commands
 * @returns all previous commands as a list
 */
export function REPLHistory(props: REPLHistoryProps) {
  const historyRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [props.history]);
  return (
    <div
      className="repl-history"
      aria-label="REPL history"
      aria-description="History of REPL command results"
      ref={historyRef}
    >
      {props.history.map((inputObj, index) => (
        <div className="command" key={index}>
          {props.mode && <p>Command: {inputObj.command}</p>}
          {<div>Result: </div>}
          {typeof inputObj.result === "string" ? (
            <p>{inputObj.result}</p>
          ) : (
            inputObj.result?.map((row, rowIndex) => (
              <p key={rowIndex}>{row.join(", ")}</p>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
