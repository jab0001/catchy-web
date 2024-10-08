
import React from "react";
import ReactDOM from "react-dom";
import { ModalOverlayStyle, ModalContentStyle} from "./styledComponents/ModalStyle";

interface DayLimitModalProps {
    isOpen: boolean;
    limit: number;
    onClose: () => void;
}

const DayLimitModal: React.FC<DayLimitModalProps> = ({ isOpen, onClose, limit }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <ModalOverlayStyle>
            <ModalContentStyle>
                <button onClick={onClose}>&times;</button>
                <h2>Limit Reached</h2>
                <p>У вас осталось ежедневных {limit} запросов</p>
            </ModalContentStyle>
        </ModalOverlayStyle>,
        document.body
    );
};

export default DayLimitModal;