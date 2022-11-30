import * as React from "react";
import { ModalBase } from "./ModalBase";

export const ModalSpinner = () => {
    return (
        <ModalBase dismissDisabled={true}>
            <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </ModalBase>

    );
};



