const port = 3232;
const path = "http://localhost:" + port + "/";

/**
 * handleLoad parses user input to make a query to the backend when the command is
 * load_file
 * @param words - a list of the words (split on space) that the user entered in to the REPL
 * @returns a success or error message depending if the file loaded successfully
 */
export async function handleLoad(words: string[]) {
  const filepath = words[1];
  if (words[1] == "") {
    return "Error: no filepath.";
  }
  let header;
  if (words[2]) {
    // hasHeader can be accessed by doing words[2]
    header = "true";
  } else {
    header = "false";
  }
  const link = path + "loadCSV?filepath=" + filepath + "&hasHeader=" + header;
  const response = await fetch(link);
  const responseObject = await response.json();
  const result = responseObject.responseMap.result;
  if (result === "success") {
    return words[1] + " successfully loaded.";
  }
  return "Error loading " + words[1] + ". Please enter valid filepath.";
}

/**
 * handleView makes a query to the backend when the command is view
 * @param words - a list of the words (split on space) that the user entered in to the REPL
 *                in this case is just 'viewCSV'
 * @returns the CSV to view when successful, returns an informative error message from the
 *          backend when unsuccessful
 */
export async function handleView(words: string[]) {
  let result;
  await fetch(path + "viewCSV")
    .then((response) => response.json())
    .then((responseObject) => {
      if (responseObject.response_type === "success") {
        result = responseObject.responseMap.data;
      } else {
        result = responseObject.responseMap.result;
      }
    });
  return result;
}

/**
 * handleSearch parses user input to make a search query to the backend when the command
 * is search
 * @param words - a list of the words (split on space) that the user entered in to the REPL
 * @returns the search results when searched successfuly, the error message if an error occurs
 */
export async function handleSearch(words: string[]) {
  let result;
  if (!words[1]) {
    return "Please enter search value and column identifier.";
  }
  const searchVal = words[1];
  let colIdentifier = words[2];
  if (!words[2]) {
    colIdentifier = "none";
  }

  await fetch(
    path +
      "searchCSV?searchVal=" +
      searchVal +
      "&colIdentifier=" +
      colIdentifier
  )
    .then((response) => response.json())
    .then((responseObject) => {
      if (responseObject.response_type === "success") {
        result = responseObject.responseMap.matches;
      } else {
        result = responseObject.responseMap.err_msg;
      }
    });
  if (!result) {
    return "Found no matches.";
  }
  return result;
}

/**
 * handleBroadband makes a query to the backend when the command
 * is broadband.
 * @param words - a list of words (split on space) that the user entered
 *                into the REPL. Correctly used, those words would be
 *                broadband <stateName> <countyName>
 * @returns a % of the broadband access in that county if successful
 *          returns an error message if an error occurs
 */
export async function handleBroadband(words: string[]) {
  let result;
  if (!(words[1] && words[2])) {
    return "Please enter state and county";
  }
  const state = words[1];
  const county = words[2];

  await fetch(path + "broadband?state=" + state + "&county=" + county)
    .then((response) => response.json())
    .then((responseObject) => {
      if (responseObject.result === "success") {
        result = responseObject.broadband_percentage;
      } else {
        result = "Invalid inputs: was not able to fetch result.";
      }
    });
  return result;
}
