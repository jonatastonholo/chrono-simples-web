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
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {IReportGenerationRequest} from "../domain/IReportGenerationRequest";
import DateRangePicker, {DateRange} from '@mui/lab/DateRangePicker';
import {ptBR} from "date-fns/locale";

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
  const [dateRange, setDateRange] = React.useState<DateRange<Date>>([null, null]);
  const [errors, setErrors] = useState<IValidationErrors>({});
  const inputRFactor = useRef<HTMLInputElement | null>();
  const inputBeginDate = useRef<HTMLInputElement | null>();
  const inputEndDate = useRef<HTMLInputElement | null>();
  const title = "Gerar Relatório";

  const onCloseActions = () => {
    setErrors({});
    setRFactor(28.00);
    setDateRange([null, null]);
  }

  const handleCancel = () => {
    onCloseActions();
    props.onClose();
  };

  function filter(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      props.onFilter({periodBegin: dateRange[0] as Date, periodEnd: dateRange[1] as Date, rFactor: rFactor/100});
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};
    if (!rFactor) {
      currentErrors["rFactor"] = "O Fator R é obrigatório";
      inputRFactor.current?.focus();
    }
    if (!dateRange[0]) {
      currentErrors["beginDateValue"] = "O início do período é obrigatório";
      inputBeginDate.current?.focus();
    }
    if (!dateRange[1]) {
      currentErrors["endDateValue"] = "O fim do período é obrigatório";
      inputEndDate.current?.focus();
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }

  const handleRFactorChange = (evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRFactor(parseFloat(evt.target.value));setErrors({});
  };

  const handleDateRangePickerChange = (newValue: DateRange<Date>) => {
    setDateRange(newValue);
    setErrors({});
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

                <LocalizationProvider dateAdapter={AdapterDateFns}  locale={ptBR}>
                  <DateRangePicker
                    startText="Início"
                    endText="Fim"
                    value={dateRange}
                    onChange={handleDateRangePickerChange}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField
                          {...startProps}
                          inputRef={inputBeginDate}
                          error={!!errors.beginDateValue}
                          helperText={errors.beginDateValue ? errors.beginDateValue : ''}
                        />
                        <Box sx={{ mx: 2 }}> até </Box>
                        <TextField
                          {...endProps}
                          inputRef={inputEndDate}
                          error={!!errors.endDateValue}
                          helperText={errors.endDateValue ? errors.endDateValue : ''}
                        />
                      </React.Fragment>
                    )}
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
