import {Button} from "./Button";
import {Lock, Trash2} from "lucide-react";
import React from "react";

interface DeleteAccountButtonProps {
    onDeleteClick: () => void;
}

export const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({ onDeleteClick }) => {
    return (
        <div className="account-actions">
            <Button
                variant="outline"
                className="delete-account-btn"
                onClick={onDeleteClick}
            >
                <Trash2 size={16} />
                Delete Account
            </Button>
        </div>

);
};