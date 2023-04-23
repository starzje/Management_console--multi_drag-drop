import * as React from "react";
import { ModalBase } from "../modal";

export const ModalSpinner = () => {
  return (
    <ModalBase dismissDisabled={true}>
      <div className="spinner" data-testid="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </ModalBase>
  );
};
