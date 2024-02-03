import {
  LoadResponses,
  SearchResponses,
  ViewResponses,
  BroadBandResponses,
} from "./mockData";

/**
 * REPLFunction to mockLoad
 * @param words command string
 * @returns result string
 */
export async function mockLoad(words: string[]) {
  const filepath = words[1];
  if (words[1] == "") {
    return "Error: no filepath.";
  }
  if (LoadResponses.has(filepath)) {
    const result = LoadResponses.get(filepath).responseMap.result;
    if (result === "success") {
      return words[1] + " successfully loaded.";
    }
  }
  return "Error loading " + words[1] + ". Please enter valid filepath.";
}

/**
 * REPLFunction to mockView
 * @param words command string
 * @returns result string
 */
export async function mockView(words: string[]) {
  if (ViewResponses.has(words[1])) {
    const map = ViewResponses.get(words[1]);
    if (map.response_type === "success") {
      return map.responseMap.data;
    } else {
      return map.responseMap.result;
    }
  }
}

/**
 * REPLFunction to mockSearch
 * @param input command string
 * @returns result matches or string
 */
export async function mockSearch(words: string[]) {
  if (SearchResponses.has(words[1])) {
    const map = SearchResponses.get(words[1]);
    if (map.response_type === "success") {
      if (!map.responseMap.matches) {
        return "Found no matches.";
      }
      return map.responseMap.matches;
    } else {
      return map.responseMap.err_msg;
    }
  }
}

/**
 * REPLFunction to mockBroadband
 * @param input command string
 * @returns result percentage or error message
 */
export async function mockBroadband(words: string[]) {
  if (BroadBandResponses.has(words[1])) {
    const map = BroadBandResponses.get(words[1]);
    if (map.result === "success") {
      return map.broadband_percentage;
    } else {
      return map.details;
    }
  }
}
