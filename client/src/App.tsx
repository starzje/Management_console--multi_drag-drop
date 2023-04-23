import * as React from "react";
import { useMemo, useEffect } from "react";
import { Spinner } from "./components/ui";
import { DisplayInformation, DraggableList } from "./components/layout";
import { useSelector, useDispatch } from "react-redux";
import { ModalConnected } from "./components/ui/modal";
import { modalSelector, ModalType, initialLoadingSelector } from "./redux/features";
import { Header } from "./components/layout";
import { AppDispatch } from "./redux/store";
import { fetchGamesThunk } from "./redux/thunks";

export const App = () => {
  const modal = useSelector(modalSelector);
  const initialLoadingCompleted = useSelector(initialLoadingSelector);

  const dispatch = useDispatch<AppDispatch>();

  //* inicijalni fetch igara */
  useEffect(() => {
    dispatch(fetchGamesThunk());
  }, [dispatch]);

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
