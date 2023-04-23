import * as React from "react";
import { Button } from "../../ui";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLobbyType,
  lobbyTypeSelector,
  ModalType,
  showModal,
  didSomethingChangeSelector,
} from "../../../redux/features";
import { LobbyType } from "../../../types";

export const Header = () => {
  const dispatch = useDispatch();
  const lobbyIsType = useSelector(lobbyTypeSelector);
  const somethingChangedInTheApp = useSelector(didSomethingChangeSelector);

  const handleChangeGameType = () => {
    dispatch(changeLobbyType());
  };

  const openDiscardModal = () => {
    gtag("event", "discard_button");
    dispatch(
      showModal({
        modalType: ModalType.DiscardDialog,
      }),
    );
  };

  const openSaveModal = () => {
    gtag("event", "save_button");
    dispatch(
      showModal({
        modalType: ModalType.SaveDialog,
      }),
    );
  };

  return (
    <header>
      <div className="btn">
        <div className="btn__switch">
          <Button
            onClick={handleChangeGameType}
            text="Casino"
            btnClass={`btn__switch__casino  ${
              lobbyIsType === LobbyType.liveCasino ? "btn__switch__casino--active" : ""
            }`}
            isDisabled={lobbyIsType === LobbyType.liveCasino}
          />
          <Button
            onClick={handleChangeGameType}
            text="E-igre"
            btnClass={`btn__switch__games  ${lobbyIsType === LobbyType.eIgre ? "btn__switch__games--active" : ""}`}
            isDisabled={lobbyIsType === LobbyType.eIgre}
          />
        </div>
        <div className="btn__control">
          <Button
            onClick={openDiscardModal}
            text="Odbaci"
            btnClass="btn__control__delete"
            isDisabled={!somethingChangedInTheApp}
          />
          <Button
            onClick={openSaveModal}
            text="Spremi"
            btnClass="btn__control__save"
            isDisabled={!somethingChangedInTheApp}
          />
        </div>
      </div>
    </header>
  );
};
