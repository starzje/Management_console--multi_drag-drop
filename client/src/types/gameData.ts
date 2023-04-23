export enum LobbyType {
  liveCasino = "live-casino",
  eIgre = "e-igre",
}

export type Game = {
  /** unique game ID - prema ovome razlikujemo igre */
  gameID: number;
  /** naziv igre - za prikaz u UI (npr: "Live Roulette European") */
  gameName: string;
  /** naziv igre prilagođen za upotrebu u URL-u (npr: "live-roulette-european") */
  webName: string;
  /** popis hash-tagova kategorija kojima igra pripada (npr: "#igreZaStolom #live") */
  gameCategory: string;
  /** da li je pristup igri omogućen ili ne (moguće vrijednosti: 0, 1) */
  gameEnabled: number;
  /** random napomena */
  napomena: string;
  /** da li za igru postoji opcija "probnog" igranja (moguće vrijednosti: 0, 1) */
  freePlaySupport: boolean;
  /** je li igra dostupna na mobitelima (moguće vrijednosti: 0, 1) */
  mobileSupport: boolean;
  /** ID game provider-a kojem igra pripada */
  providerID: number;
  /** naziv game provider-a kojem igra pripada */
  providerName: string;
  /** interni ID igre definiran od strane game provider-a */
  providerGameID: string;
  /** redoslijed kojim igre trebaju biti prikazane u UI */
  lobbySortOrder: number;
  /** (opcionalno) dodatne informacije o igri specifične za game provider-a */
  gameData1: string;
  /** (opcionalno) dodatne informacije o igri specifične za game provider-a */
  gameData2: string;
  /** tip lobby-a kojem igre pripadaju - moguće vrijednosti: "live-casino" i "e-igre" */
  lobbyType: LobbyType;
  /** Ime game providera koje je formatirao za upotrebu u URL-u*/
  gameProviderWebName: string;
  /** thumbnail za sliku, ako thumb nije zadan, slika nije promijenjena */
  thumb?: string;
};
