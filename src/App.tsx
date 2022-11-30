import * as React from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { Spinner } from "./components/ui/spinner/Spinner";
import { DisplayInformation } from "./components/layout/displayInformation/DisplayInformation";
import { useSelector } from "react-redux";
import { ModalConnected } from "./components/ui/modal/ModalConnected";
import { modalSelector, ModalType } from "./redux/features/ModalControlSlice";
import Header from "./components/layout/Header";
import DraggableList from "./components/layout/gameTableList/DraggableList";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { fetchGamesThunk } from "./redux/thunks/fetchGamesThunk";
import { initialLoadingSelector } from "./redux/features/gameSlice";

export const App = () => {
  const modal = useSelector(modalSelector);
  const initialLoadingCompleted = useSelector(initialLoadingSelector);

  const dispatch = useDispatch<AppDispatch>();

  //* inicijalni fetch igara */
  useEffect(() => {
    dispatch(fetchGamesThunk());
  }, []);

  //* zaustavlja skrolanje mišom ako je modal upaljen */
  useMemo(() => {
    modal !== ModalType.None
      ? document.body.classList.add("disable_scroll")
      : document.body.classList.remove("disable_scroll");
  }, [modal]);

  return (
    <>
      <ModalConnected />
      <main className="container">
        <Header />
        <section>
          <DisplayInformation />
          {initialLoadingCompleted ? <DraggableList /> : <Spinner />}
        </section>
      </main>
    </>
  );
};

export default App;
