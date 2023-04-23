import { Game } from "../types";

/** vraća 2 arraya, prvi koji počinje iznad drag drop targeta, i drugi koji počinje ispod drag drop targeta */
export const splitArray = (selectedGames: Game[], unselectedGames: Game[], endIndex: number, startIndex: number) => {
  //let dropTargetGame: Game;
  const kopijaArraya = [...unselectedGames];
  /** dropTargetGame postavi ovisno o tom dragaju li se selektirani itemi iznad ili ispod selektiranih itema */
  const dropTargetGame = endIndex > startIndex ? endIndex - (selectedGames.length - 1) : endIndex;
  /** igre koje su iznad drop targeta */
  const gamesAboveDropTarget = kopijaArraya.splice(0, dropTargetGame);
  /** igre koje su ispod drop targeta */
  const gamesBelowDropTarget = kopijaArraya;
  const reorderedGames = [...gamesAboveDropTarget, ...selectedGames, ...gamesBelowDropTarget];

  return reorderedGames;
};
