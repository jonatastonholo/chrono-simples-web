import React, {ChangeEvent, useRef, useState} from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, FormControl, Stack, TextField} from "@mui/material";
import {IPeriod} from "../domain/IPeriod";
import {IValidationErrors} from "../domain/IValidationErrors";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {ptBR} from "date-fns/locale";
import {IReportGenerationRequest} from "../domain/IReportGenerationRequest";
import {DatePicker} from "@mui/lab";

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
  const [rFactor, setRFactor] = useState<number>(0.28);
  const [beginDateValue, setBeginDateValue] = useState<Date | null>(new Date());
  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState<IValidationErrors>({});
  const inputRFactor = useRef<HTMLInputElement | null>();
  const inputBeginDate = useRef<HTMLInputElement | null>();
  const inputEndDate = useRef<HTMLInputElement | null>();
  const title = "Gerar Relatório";

  const onCloseActions = () => {
    setErrors({});
    setRFactor(0.28);
    setBeginDateValue(null);
    setEndDateValue(null);
  }

  const handleCancel = () => {
    onCloseActions();
    props.onClose();
  };

  function filter(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      props.onFilter({periodBegin: beginDateValue as Date, periodEnd: endDateValue as Date, rFactor});
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};
    if (!rFactor) {
      currentErrors["rFactor"] = "O Fator R é obrigatório";
      inputRFactor.current?.focus();
    }
    else if (!beginDateValue) {
      currentErrors["beginDateValue"] = "O início do período é obrigatório";
      inputBeginDate.current?.focus();
    }
    else if (!endDateValue) {
      currentErrors["endDateValue"] = "O fim do período é obrigatório";
      inputEndDate.current?.focus();
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }

  const handleRFactorChange = (evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRFactor(parseFloat(evt.target.value));
  };

  const handleBeginDateValueChange = (newValue: Date | null) => {
    setBeginDateValue(newValue);
  };

  const handleEndDateValueChange = (newValue: Date | null) => {
    setEndDateValue(newValue);
  };

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
                  className={classes.textField}
                  autoFocus
                  margin="dense"
                  id="rFactor"
                  label="Fator R"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={rFactor}
                  inputProps={{
                    inputMode: 'numeric', pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                  }}
                  error={!!errors.rFactor}
                  onChange={handleRFactorChange}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                  <DatePicker
                    label="Begin Date picker"
                    value={beginDateValue}
                    onChange={handleBeginDateValueChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label="End Date picker"
                    value={endDateValue}
                    onChange={handleEndDateValueChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
