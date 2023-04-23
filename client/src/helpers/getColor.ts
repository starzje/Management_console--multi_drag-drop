import { Game } from "../types";

/** vraća boju ikone ovisno o tom ima li igra thumbnail property */
export const getColor = (item: Game, stateChanged: boolean): string => {
  if (item.thumb) {
    if (stateChanged) {
      return "orange";
    } else {
      return "green";
    }
  } else {
    return "white";
  }
};
