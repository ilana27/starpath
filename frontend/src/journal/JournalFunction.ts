import { EntryInfo } from "./EntryInfo";

/**
 * A command-processor function for our journal. The function returns a Promise
 * which resolves to a string, which is the value to print to history when
 * the command is done executing.
 *
 * @param args an array of string representing the arguments to the command
 * @return a promise of an EntryInfo object
 */
export interface JournalFunction {
  (args: Array<string>): Promise<EntryInfo>;
}

export interface MockedJournalFunction {
  (args: Array<string>): Array<EntryInfo>;
}