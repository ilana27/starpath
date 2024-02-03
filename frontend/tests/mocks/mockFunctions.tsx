import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ControlledInput } from "../../src/journal/ControlledInput";
import EntryObject from "../../src/journal/JournalDisplay";
import { JournalFunction, MockedJournalFunction } from "../../src/journal/JournalFunction";
import "../styles/journal.css";
import { EntryInfo } from "../../src/journal/EntryInfo";
import JournalPrompt from "../../src/journal/JournalPrompt";

import {
  mockPrompt1,
  mockPrompt2,
  mockPrompt3,
  mockDate,
  mockEntry,
  mockEntry2,
  mockEntryInfo1,
  mockEntryInfo2,
  mockBackend
} from "./mockedData";


// TODO/QUESTION: how would I use / access the setters like this in JournalInput?
// TODO/QUESTION: shouldn't I be using those instead of making new ones here?
const [entry, setEntry] = useState<string>("");
const [prompt, setPrompt] = useState<string>("");
const [date, setDate] = useState<string>("");

async function mockFetchPrompt(): Promise<String | undefined> {
    return mockPrompt1;
  }

async function mockFetchDate(): Promise<String | undefined> {
  return mockDate;
}

// TODO: will putting the return type as any here cause problems?
const mockPreviousEntry : any = (args: Array<string>) => {

  setPrompt(mockPrompt2); // TODO: how to fix these?
  setEntry(mockEntry);
  setDate(mockDate);

  return mockEntryInfo1;
}

const mockNextEntry: any = (args: Array<string>) => {

  setPrompt(mockPrompt3); // TODO: how to fix these?
  setEntry(mockEntry2);
  setDate(mockDate);

  return mockEntryInfo2;
}

/** 
 * Note: to run this one, will need to add global useStates for prompt, entry & date
 * that this can access & save to a map
 * 
 */ 
function mockAutoSave() {
  mockBackend.push(mockEntryInfo1); // for if you import mockBackend from mockedData
  return mockBackend; // then, check if the entry to save exists in the backend
  // or, pass the backend array in as a parameter, run the autosave function,
  // then check if the mocked entry exists in the array
}