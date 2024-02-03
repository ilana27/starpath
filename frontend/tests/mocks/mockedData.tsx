import { EntryInfo } from "../../src/journal/EntryInfo";

export const mockPrompt1: string = "Mock: Describe a highlight and challenge from today.";
export const mockPrompt2: string = "Mock: Describe your emotions over the past few days.";
export const mockPrompt3: string = "Mock: What helps you with difficult emotions?";
export const mockDate: string = "Mock: Dec 18, 2023";
export const mockEntry: string = "Mock: I've been really sad, but also really grateful.";
export const mockEntry2: string = "";


export const mockEntryInfo1: EntryInfo = new EntryInfo(mockPrompt2, "Mock: Dec 11, 2023", mockEntry);
export const mockEntryInfo: EntryInfo = new EntryInfo(mockPrompt1, mockDate, "highlights, hmm")
export const mockEntryInfo2: EntryInfo = new EntryInfo(mockPrompt3, "Mock: Dec 25, 2023", mockEntry2);
export const mockBackend: EntryInfo[] = [mockEntryInfo1, mockEntryInfo, mockEntryInfo2];

export const mockSuggestions = ["Mock: Suggestion 1", "Mock: Suggestion 2", "Mock: Suggestion 3"]