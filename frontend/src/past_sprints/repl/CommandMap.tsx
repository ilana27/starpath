import {
  handleLoad,
  handleView,
  handleSearch,
  handleBroadband,
} from "./Commands";
import {
  mockBroadband,
  mockLoad,
  mockSearch,
  mockView,
} from "../../tests/mockCommands";

/* This file creates the commandMap, initializes basic mappings for REPL functionality,
 * and creates add and remove functions that defensively allow an outside developer to
 * add command prompts to REPL.
 */

export const commandMap = new Map<string, Function>();

commandMap.set("load_file", handleLoad);
commandMap.set("view", handleView);
commandMap.set("search", handleSearch);
commandMap.set("broadband", handleBroadband);

addCommand("mockLoad", mockLoad);
addCommand("mockView", mockView);
addCommand("mockSearch", mockSearch);
addCommand("mockBroadband", mockBroadband);
/*
 * Allows devleoper to add a command to the commandMap, which is a library of command prompts -> functions
 */
export function addCommand(command: string, func: Function) {
  commandMap.set(command, func);
}

/*
 * Allows devleoper to remove a command to the commandMap, which is a library of command prompts -> functions
 */
export function removeCommand(command: string) {
  commandMap.delete(command);
}
