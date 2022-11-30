import * as React from "react";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { modalSelector, ModalType, } from "../../../redux/features/ModalControlSlice";
import { ModalDiscard } from "./ModalDiscard";
import { ModalError } from "./ModalError";
import { ModalNotification } from "./ModalNotification";
import { ModalSave } from "./ModalSave";
import { ModalSpinner } from "./ModalSpinner";


export const ModalConnected: React.FC = () => {
    const modalType = useSelector(modalSelector)

    const changeModalType = useCallback(() => {
        switch (modalType) {
            case ModalType.Error:
                return <ModalError />
            case ModalType.Notification:
                return <ModalNotification />
            case ModalType.Spinner:
                return <ModalSpinner />
            case ModalType.DiscardDialog:
                return <ModalDiscard />
            case ModalType.SaveDialog:
                return <ModalSave />
            case ModalType.None:
                return undefined;
        }
    }, [modalType])

    return (
        <>
            {changeModalType()}
        </>
    )
}