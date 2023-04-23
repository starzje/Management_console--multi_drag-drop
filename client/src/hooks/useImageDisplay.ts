import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectGameById, selectMultipleGames } from "../redux/features";
import placeholderImage from "../assets/placeholder.svg";
import { RootState } from "../redux/store";

/**
 * React hook koji se brine prikazivanjem uploadane slike
 * @property {string | undefined} imageUrl -  URL slike iz redux storea/SQL procedure ili placeholdera ako slika nije dostupna u drugim opcijama.
 * @property {function(): void} handleError - Funkcija koja handlea errore tako da postavlja imageUrl na placeholder.
 * @returns {ImageDisplayResult} Objekt koji sadrži imageUrl i handleError funkciju.
 */

export const useImageDisplay = () => {
  const selectedGameIDs = useSelector(selectMultipleGames);
  const gameID = parseInt(selectedGameIDs[0], 10);
  const selectedGame = useSelector((state: RootState) => selectGameById(state, gameID));
  const [imageUrl, setImageUrl] = useState<string>(placeholderImage);

  useEffect(() => {
    if (selectedGame && selectedGame.gameProviderWebName && selectedGame.webName) {
      const primaryImageUrl = `${process.env.API_URL}${selectedGame.gameProviderWebName}/${selectedGame.webName}.jpg`;
      setImageUrl(selectedGame.thumb || primaryImageUrl);
    } else {
      setImageUrl(placeholderImage);
    }
  }, [selectedGame]);

  const handleError = () => {
    setImageUrl(placeholderImage);
  };

  return {
    imageUrl,
    handleError,
  };
};
