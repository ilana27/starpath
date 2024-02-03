/**
 * This class represents a stored set of journal EntryInfo.
 * Its class fields includes a prompt (randomly generated from the backend), 
 * date (the date the entry was created), and entry (user's typed response to the prompt)
 */
export class EntryInfo {
  prompt: string | undefined;
  date: string | undefined;
  entry: string | undefined;

  /**
   * This is the constructor for EntryInfo, which creates an instance of EntryInfo.
   * @param prompt - the journal prompt
   * @param date - the current date
   * @param entry - the user's journal response
   */
  constructor(
    prompt: string | undefined,
    date: string | undefined,
    entry: string | undefined
  ) {
    this.prompt = prompt;
    this.date = date;
    this.entry = entry;
  }
}