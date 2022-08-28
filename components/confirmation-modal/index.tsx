import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import OutlinedLoadingButton from "components/outlined-loading-button";
import React from "react";

const ConfirmationModal = ({
    open,
    handleClose,
    handleYes,
    layerOrProject,
    loading
}: {
    open: boolean;
    handleClose: () => void;
    handleYes: () => void;
    layerOrProject: string,
    loading?: boolean;
}) => {
    const theme = useTheme();
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: 400,
                    padding: "40px",
                    backgroundColor: theme.palette.background.default,
                    borderRadius: "10px",
                }}
            >
                <Typography color={theme.palette.grey[800]} variant="body2" textAlign="center">
                    You are not able to recover once this is deleted. Do you really want to delete the {layerOrProject}?
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "50px",
                            width: 250,
                        }}
                    >
                        <OutlinedLoadingButton
                            onClick={handleClose}
                            variant="outlined"
                            buttonText="No"
                            style={{
                                color: theme.palette.error.main,
                                borderColor: theme.palette.error.main,
                                fontSize: 10,
                                boxShadow: `0 4px 4px 0 ${theme.palette.primary.contrastText}40`
                            }}
                            containerStyle={{ width: 100 }}
                        />
                        <OutlinedLoadingButton
                            onClick={handleYes}
                            variant="contained"
                            buttonText="Yes"
                            loadingElement={
                                <CircularProgress
                                    sx={{
                                        color: theme.palette.background.default,
                                    }}
                                    size={14}
                                />
                            }
                            style={{
                                backgroundColor: theme.palette.error.main,
                                fontSize: 10,
                                boxShadow: `0 4px 4px 0 ${theme.palette.primary.contrastText}40`
                            }}
                            containerStyle={{ width: 100 }}
                            loading={loading}
                        />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal
