/* Class for mockedData */

// mock responses for Load
const successLoadResponse = {
  response_type: "success",
  responseMap: {
    result: "success",
    filepath: "data/example1.csv",
  },
};

const successLoadResponse2 = {
  response_type: "success",
  responseMap: {
    result: "success",
    filepath: "data/example2.csv",
  },
};

const successLoadResponse3 = {
  response_type: "success",
  responseMap: {
    result: "success",
    filepath: "data/example3.csv",
  },
};

const failedLoadResponse = {
  response_type: "success",
  responseMap: {
    result: "err_bad_request",
    filepath: "no/such/path.csv",
  },
};

const LoadResponses = new Map();
LoadResponses.set("data1", successLoadResponse);
LoadResponses.set("data2", successLoadResponse2);
LoadResponses.set("data3", successLoadResponse3);
LoadResponses.set("data4", failedLoadResponse);

// mock responses for view
const successViewResponse = {
  response_type: "success",
  responseMap: {
    result: "success",
    data: [
      ["col1", "col2"],
      ["a", "b"],
      ["1", "2"],
    ],
  },
};
const successViewResponse2 = {
  response_type: "success",
  responseMap: {
    result: "success",
    data: [
      ["Seehanah", "21", "Brown"],
      ["Selena", "20", "Brown"],
      ["Serena", "19", "Cornell"],
      ["Williams", "", ""],
    ],
  },
};
const successViewResponse3 = {
  response_type: "success",
  responseMap: {
    result: "success",
    data: [["x"], ["y"], ["z"]],
  },
};

const failedViewResponse = {
  response_type: "error",
  responseMap: {
    result: "error",
  },
};

const ViewResponses = new Map();
ViewResponses.set("data1", successViewResponse);
ViewResponses.set("data2", successViewResponse2);
ViewResponses.set("data3", successViewResponse3);
ViewResponses.set("data4", failedViewResponse);

// mock responses for search
const successSearchResponse = {
  response_type: "success",
  responseMap: {
    result: "success",
    matches: [["a", "b"]],
    searchVal: "a",
    colIdentifier: "none",
  },
};

const successSearchResponse2 = {
  response_type: "success",
  responseMap: {
    result: "success",
    matches: [
      ["Seehanah", "21", "Brown"],
      ["Selena", "20", "Brown"],
    ],
    searchVal: "Brown",
    colIdentifier: "3",
  },
};
const failedSearchResponse = {
  response_type: "error",
  responseMap: {
    result: "error",
  },
};

const SearchResponses = new Map();
SearchResponses.set("data1", successSearchResponse);
SearchResponses.set("data2", successSearchResponse2);
SearchResponses.set("data3", failedSearchResponse);

// mock responses for BroadBand
const successBroadBandResponse = {
  result: "success",
  broadband_percentage: "90",
  state: "state",
  county: "county",
};
const failedBroadBandResponse = {
  result: "error",
  details: "error bad request. invalid county provided: providence",
};

const BroadBandResponses = new Map();
BroadBandResponses.set("data1", successBroadBandResponse);
BroadBandResponses.set("data2", failedBroadBandResponse);

export { LoadResponses, ViewResponses, SearchResponses, BroadBandResponses };
