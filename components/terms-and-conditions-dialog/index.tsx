import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import privacyPolicy from "./privacy-policy";
import Grid from "@mui/material/Grid";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const readPrivacyPolicy = (): string[] => {
    return privacyPolicy.split("\n");
}

const isHeading = (str: string): boolean => {
    return str.charAt(0) === "#"
}

const TermsAndConditionsDialog = ({
    open,
    handleClickOpen,
    handleClose,
}: {
    open: boolean;
    handleClickOpen: () => void;
    handleClose: () => void;
}) => {
    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    Mintoon - Privacy Policy
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {
                        readPrivacyPolicy().map((str, i) => {
                            return (
                                <div key={i}>
                                    {
                                        isHeading(str) ? (
                                            <Typography variant="h4" >
                                                {str.slice(1)}
                                            </Typography>
                                        ) : (
                                            <Typography gutterBottom>
                                                {str}
                                            </Typography>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div >
    );
};

export default TermsAndConditionsDialog;
