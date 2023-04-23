import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { DiscardChangesRejectReasons } from "../../types";
import { saveGamesThunk, fetchGamesThunk, discardChangesThunk } from "../thunks";
import { RootState } from "../store";

export enum ModalType {
  /** nije prikazan niti jedan modal dialog */
  None,
  /** prikazan je modal dialog za spremanje promjena */
  SaveDialog,
  /** prikazan je modal dialog za odbacivanjea */
  DiscardDialog,
  /** oprikazana je notifikacija (ima jednu tipku) */
  Notification,
  /** prikazan je error dialog koji ima dvije tipke */
  Error,
  /** prikazan je spinner */
  Spinner,
  /** prikazan je modal za upload slika */
  Image,
}

export type ModalInfo = {
  /** koji dialog je trenutno prikazan */
  modalType: ModalType;
  /** poruka koju dialog prikazuje */
  message?: string;
  /** tip error modala je nastao prilikom savea ili fetcha */
  errorType: "save" | "fetch" | null;
};

const initialState: ModalInfo = {
  modalType: ModalType.None,
  message: "",
  errorType: null,
};

const modalControlSlice = createSlice({
  name: "modalSlice",
  initialState: initialState,
  reducers: {
    showModal: (state, action: PayloadAction<{ modalType: ModalType }>) => {
      const { modalType } = action.payload;
      switch (modalType) {
        case ModalType.None:
          state.modalType = ModalType.None;
          break;
        case ModalType.DiscardDialog:
          state.modalType = ModalType.DiscardDialog;
          break;
        case ModalType.SaveDialog:
          state.modalType = ModalType.SaveDialog;
          break;
        case ModalType.Error:
          state.modalType = ModalType.Error;
          break;
        case ModalType.Notification:
          state.modalType = ModalType.Notification;
          break;
        case ModalType.Spinner:
          state.modalType = ModalType.Spinner;
          break;
        case ModalType.Image:
          state.modalType = ModalType.Image;
          break;
      }
    },
    dismissModal: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveGamesThunk.rejected, (state, action) => {
        switch (action.payload?.rejectReason) {
          case DiscardChangesRejectReasons.CommError:
            state.message = "Došlo je do pogreške prilikom spremanja podataka";
            break;
          case DiscardChangesRejectReasons.SqlExRes:
            state.message = "Došlo je do pogreške prilikom spremanja podataka, provjerite svoju internetsku vezu";
        }
        state.modalType = ModalType.Error;
        state.errorType = "save";
      })
      .addCase(fetchGamesThunk.fulfilled, (state) => {
        state.modalType = ModalType.None;
      })
      .addMatcher(isAnyOf(discardChangesThunk.fulfilled, saveGamesThunk.fulfilled), (state) => {
        state.modalType = ModalType.Notification;
      })
      .addMatcher(isAnyOf(discardChangesThunk.pending, saveGamesThunk.pending), (state) => {
        state.modalType = ModalType.Spinner;
      })
      .addMatcher(isAnyOf(discardChangesThunk.rejected, fetchGamesThunk.rejected), (state, action) => {
        switch (action.payload?.rejectReason) {
          case DiscardChangesRejectReasons.CommError:
            state.message = "Došlo je do pogreške prilikom dohvaćanja podataka";
            break;
          case DiscardChangesRejectReasons.SqlExRes:
            state.message = "Došlo je do pogreške prilikom dohvaćanja podataka, provjerite svoju internetsku vezu";
        }
        state.modalType = ModalType.Error;
        state.errorType = "fetch";
      });
  },
});

export default modalControlSlice.reducer;
export const { showModal, dismissModal } = modalControlSlice.actions;
export const modalSelector = (state: RootState) => state.modalSlice.modalType;
export const modalMessage = (state: RootState) => state.modalSlice.message;
export const modalErrorTypeSelector = (state: RootState) => state.modalSlice.errorType;
