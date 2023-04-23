import * as React from "react";
import { ModalBase } from "../modal";
import { Spinner } from "../../ui";
import { useImageDisplay, useImageUploader } from "../../../hooks";

export const ModalImage: React.FC = () => {
  const { imageUrl, handleError } = useImageDisplay();
  const { handleImageChange, loading, handleCloseModal, isImageUploaded } = useImageUploader();

  return (
    <ModalBase customCloseFn={handleCloseModal}>
      {loading && <Spinner />}
      <div className="modal-image">
        <img key={imageUrl} src={imageUrl} alt="Preview" className="modal-image__preview" onError={handleError} />
        <div className="modal-image__info">
          {!isImageUploaded
            ? "Slika mora biti JPEG formata široke 540px i visoke 450px"
            : "slika je uspješno promijenjena."}
        </div>
        <div className="modal-image__actions">
          <input
            type="file"
            accept=".jpg, .jpeg"
            onChange={handleImageChange}
            className="modal-image__input"
            id="image-upload"
          />
          {!isImageUploaded ? (
            <label htmlFor="image-upload" className="modal-image__upload-btn">
              Odaberi novu sliku
            </label>
          ) : (
            <button onClick={handleCloseModal} className="modal-image__upload-btn">
              U redu
            </button>
          )}
        </div>
      </div>
    </ModalBase>
  );
};
