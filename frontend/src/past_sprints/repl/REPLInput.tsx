import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ControlledInput } from "../../journal/ControlledInput";
import { InputObject } from "./REPL";
import { commandMap } from "./CommandMap";
import "../App.css";

interface REPLInputProps {
  history: InputObject[];
  setHistory: Dispatch<SetStateAction<InputObject[]>>;
  mode: boolean;
  setMode: Dispatch<SetStateAction<boolean>>;
  setKeyword: Dispatch<SetStateAction<string>>;
}

/* This component determines the input view and logic for the user as they type a command to be loaded, viewed, or searched. */
export function REPLInput(props: REPLInputProps) {
  // Manages the contents of the input box, object, and csv
  const [commandString, setCommandString] = useState<string>("");
  // const [filepath, setFilepath] = useState("");
  // const [header, setHeader] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);
  useEffect(() => {
    // what to do when errorFlag changes
    setErrorFlag(false);
  }, [errorFlag]);

  // Manages the current amount of times the button is clicked
  //if load, set filepath to this filepath

  /**
   * allows user to press enter instead of clicking submit
   * @param event a keyboard press
   * @param command the input string
   */
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    command: string
  ) => {
    if (event.key === "Enter") {
      console.log("enter pressed");
      handleSubmit(command);
      // scrollHistoryToBottom();
    }
  };

  // This function is triggered when the button is clicked.
  async function handleSubmit(command: string) {
    const result = await handleHandlers(command);

    //creates an object from our inputted results
    if (errorFlag === false) {
      const resultObject = {
        command: command,
        result: result,
      };
      //sets history to previous history + current object
      props.setHistory([...props.history, resultObject]);
    }
    setCommandString(""); //resets the input after submit
  }

  /* changes the state of the command to brief or verbose given user input */
  function handleMode(command: string) {
    const commandList = command.split(" ");
    switch (commandList[commandList.length - 1]) {
      case "verbose":
        props.setMode(true);
        break;
      case "brief":
        props.setMode(false);
        break;
      default:
        setErrorFlag(true);
        window.alert("Enter valid mode.");
        return "Enter a valid mode.";
    }
    return "Mode changed to " + command;
  }

  function handleAreaSearch(command: string) {
    const commandList = command.split(" ");
    props.setKeyword(commandList[1]);
    return "Performing area search.";
  }

  /* Parses repl input to determine the command that was entered */
  async function handleHandlers(command: string) {
    // search related variables
    const commandList = command.split(" "); //splits command into list
    // search related variables
    // const colIdentifier: string | number = command[2]; // could be idx or colName
    if (commandList[0] === "mode") {
      return handleMode(command);
    } else if (commandList[0] === "areasearch") {
      return handleAreaSearch(command);
    } else {
      const myFunc = commandMap.get(commandList[0]);
      if (myFunc == undefined) {
        setErrorFlag(true);
        window.alert("Enter a valid command.");
        return "Enter a valid command;";
      } else {
        const result = await myFunc(commandList);
        return result;
      }
    }
  }

  /* returns component to user: the input box, sets logic for submtting a command on submit button */
  return (
    <div
      className="repl-input"
      aria-label="Repl input"
      aria-description="Repl input box"
    >
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
          onKeyPress={(e) => handleKeyPress(e, commandString)}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>Submit</button>
    </div>
  );
}
