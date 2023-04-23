import { Store } from "@reduxjs/toolkit";
import store, { RootState } from "../../store";
import ModalControlSliceReducer, {
  showModal,
  dismissModal,
  ModalType,
  modalSelector,
  modalMessage,
  modalErrorTypeSelector,
} from "../modalControlSlice";

describe("ModalControlSlice reducers", () => {
  it("should show the correct modal when showModal is called", () => {
    const newState = ModalControlSliceReducer(
      { ...store.getState().modalSlice },
      showModal({ modalType: ModalType.DiscardDialog }),
    );
    expect(newState.modalType).toEqual(ModalType.DiscardDialog);
  });

  it("should dismiss the modal when dismissModal is called", () => {
    const newState = ModalControlSliceReducer({ ...store.getState().modalSlice }, dismissModal());
    expect(newState.modalType).toEqual(ModalType.None);
  });
});

describe("ModalControlSlice selectors", () => {
  const testStore = store as Store<RootState>;

  it("should return the value of modal type", () => {
    testStore.dispatch(showModal({ modalType: ModalType.DiscardDialog }));
    const result = modalSelector(testStore.getState());
    expect(result).toEqual(ModalType.DiscardDialog);

    testStore.dispatch(dismissModal());
    const result2 = modalSelector(testStore.getState());
    expect(result2).toEqual(ModalType.None);
  });

  it("should return the value of modal message", () => {
    const state = testStore.getState();
    const result = modalMessage(state);
    expect(result).toEqual(state.modalSlice.message);
  });

  it("should return the value of modal error type", () => {
    const state = testStore.getState();
    const result = modalErrorTypeSelector(state);
    expect(result).toEqual(state.modalSlice.errorType);
  });
});
