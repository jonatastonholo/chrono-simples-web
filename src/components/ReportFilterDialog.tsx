import React, {ChangeEvent, useRef, useState} from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, FormControl, InputAdornment, Stack, TextField} from "@mui/material";
import {IPeriod} from "../domain/IPeriod";
import {IValidationErrors} from "../domain/IValidationErrors";
import {IReportGenerationRequest} from "../domain/IReportGenerationRequest";
import DateRangeDialog from "./DateRageDialog";

const useStyles = makeStyles({
  rootContent: {
    textAlign: "center",
    color: theme.fonts.color,
    background: theme.background,
    flexDirection: "row",
  },
  textField: {
    color: theme.fonts.color,
  }
});

interface IEventFormDialogProps {
  period?: IPeriod | undefined
  open: boolean;
  onClose: () => void;
  onFilter: (reportFilter: IReportGenerationRequest) => void;
}

export default function ReportFilterDialog(props: IEventFormDialogProps) {
  const classes = useStyles();
  const [rFactor, setRFactor] = useState<number>(28.00);
  const [beginDate, setBeginDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [errors, setErrors] = useState<IValidationErrors>({});
  const inputRFactor = useRef<HTMLInputElement | null>();
  const inputBeginDate = useRef<HTMLInputElement | null>();
  const inputEndDate = useRef<HTMLInputElement | null>();
  const title = "Gerar Relatório";

  const onCloseActions = () => {
    setErrors({});
    setRFactor(28.00);
    setBeginDate(undefined);
    setEndDate(undefined);
  }

  const handleCancel = () => {
    onCloseActions();
    props.onClose();
  };

  function filter(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      props.onFilter({periodBegin: beginDate as Date, periodEnd: endDate as Date, rFactor: rFactor/100});
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};
    if (!rFactor) {
      currentErrors["rFactor"] = "O Fator R é obrigatório";
      inputRFactor.current?.focus();
    }
    if (!beginDate) {
      currentErrors["beginDateValue"] = "O início do período é obrigatório";
      inputBeginDate.current?.focus();
    }
    if (!endDate) {
      currentErrors["endDateValue"] = "O fim do período é obrigatório";
      inputEndDate.current?.focus();
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }

  const handleRFactorChange = (evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRFactor(parseFloat(evt.target.value));setErrors({});
  };

  const handleDateRangeChange = (dateRangeBegin: Date, dateRangeEnd: Date) => {
    setBeginDate(dateRangeBegin);
    setEndDate(dateRangeEnd);
    setErrors({});
  }

  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 700}}}
      maxWidth="xs"
      open={props.open}
    >
      <form onSubmit={filter}>
        <Box className={classes.rootContent}>

          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <Stack spacing={3}>

                <TextField
                  inputRef={inputRFactor}
                  className={classes.textField}
                  autoFocus
                  margin="dense"
                  id="rFactor"
                  label="Fator R"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={rFactor}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                  }}
                  error={!!errors.rFactor}
                  onChange={handleRFactorChange}
                  helperText={errors.rFactor ? errors.rFactor : ''}
                />

                <DateRangeDialog
                  errorBeginDateValue={errors["beginDateValue"]}
                  errorEndDateValue={errors["endDateValue"]}
                  onDataRangeChange={handleDateRangeChange}
                />

              </Stack>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogActions>

        </Box>
      </form>
    </Dialog>
  );
}
