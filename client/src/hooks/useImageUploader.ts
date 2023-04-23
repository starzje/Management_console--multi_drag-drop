import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGameImage,
  lobbyTypeSelector,
  somethingChanged,
  selectMultipleGames,
  dismissModal,
} from "../redux/features";

/**
 * React hook koji obavlja upload slika unutar modala
 * @property {function(React.ChangeEvent<HTMLInputElement>): void} handleImageChange - Funkcija koja rješava upload imagea, te taj base64 zapisiva unutar redux storea
 * @property {boolean} loading - Loading stanje koje prati je li slika u procesu uploada
 * @property {function(): void} handleCloseModal - funkcija koja gasi modal
 * @property {boolean} isImageUploaded - Stanje koje prati je li slika uploadana
 * @returns {ImageUploaderResult} Objekt koji sadržava sva stanja i funckije povezane s uploadom imagea.
 */

export const useImageUploader = () => {
  const dispatch = useDispatch();
  const selectedGameIDs = useSelector(selectMultipleGames);
  const lobbyType = useSelector(lobbyTypeSelector);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files && e.target.files[0];
    if (file && file.type === "image/jpeg") {
      try {
        const base64Image = await readFileAsDataURL(file);
        updateImageInStore(base64Image);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    } else {
      alert("Please select a valid JPEG image.");
    }
    setLoading(false);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const updateImageInStore = useCallback(
    (base64Image: string) => {
      if (selectedGameIDs.length > 0) {
        const gameID = parseInt(selectedGameIDs[0], 10);
        dispatch(
          updateGameImage({
            gameID,
            lobbyType: lobbyType,
            imageURL: base64Image,
          }),
        );
      }
      dispatch(somethingChanged());
      setIsImageUploaded(true);
    },
    [dispatch, lobbyType, selectedGameIDs],
  );

  const handleCloseModal = () => {
    setIsImageUploaded(false);
    dispatch(dismissModal());
  };

  return { handleImageChange, loading, handleCloseModal, isImageUploaded };
};
