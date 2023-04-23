import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deselectAll } from "../redux/features";

/** sluša windows evente da zna kad deselectat označene igre ako je pritisnuta tipka escape ili ako je kliknuto izvan označene igre */
export const useWindowEvents = () => {
  const dispatch = useDispatch();

  const onWindowClick = useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      dispatch(deselectAll());
    },
    [dispatch],
  );

  const onWindowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      if (e.key === "Escape") {
        dispatch(deselectAll());
      }
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener("click", onWindowClick);
    window.addEventListener("keydown", onWindowKeyDown);
    return () => {
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [onWindowClick, onWindowKeyDown]);
};
