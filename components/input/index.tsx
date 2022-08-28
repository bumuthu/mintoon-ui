import * as React from "react";
import { FormikProps } from "formik";
import { Box, TextField, Typography, useTheme } from "@mui/material";

type Props = {
  type: string;
  name: string;
  label?: string;
  id?: string;
  formik?: FormikProps<any>;
  placeholder: string;
  containerStyle?: object;
  inputStyle?: object;
  labelStyle?: object;
  value?: string;
  min?: number;
  max?: number;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  onChange?: (event: any) => void;
  onBlur?: (event?: any) => void;
};

export default function UnstyledInputBasic(props: Props) {
  const {
    type,
    name,
    label,
    id,
    formik,
    placeholder,
    containerStyle,
    inputStyle,
    labelStyle,
    value,
    min,
    max,
    multiline,
    disabled,
    rows,
    onChange,
    onBlur,
  } = props;
  const theme = useTheme();
  return (
    <Box
      style={{
        marginBottom: 8,
        minHeight: 60,
        ...containerStyle,
      }}
    >
      {label && (
        <Box
          sx={{
            marginBottom: "8px",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.secondary.main,
              fontWeight: 600,
              ...labelStyle,
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
      <TextField
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        onChange={onChange ? onChange : formik?.handleChange}
        onBlur={onBlur ? onBlur : formik?.handleBlur}
        value={value ? value : formik?.values[name] ? formik?.values[name] : ""}
        InputProps={{ inputProps: { min: min, max: max } }}
        error={formik?.touched[name] && formik?.errors[name] !== undefined}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        helperText={`${
          formik?.touched[name] && formik?.errors[name]
            ? formik?.errors[name]
            : ""
        }`}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-input": {
            color: theme.palette.secondary.main,
            padding: "8px 12px",
            fontSize: 14,
            ...inputStyle,
          },
          "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
              borderColor: theme.palette.primary.light,
            },
          },
          "& .MuiFormHelperText-root": {
            marginLeft: "2px",
            marginTop: "2px",
          },
        }}
      />
    </Box>
  );
}
