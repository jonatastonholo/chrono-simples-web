import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {ptBR} from "date-fns/locale";
import DateRangePicker, {DateRange} from "@mui/lab/DateRangePicker";
import React, {useEffect, useRef} from "react";
import {Box, TextField} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {makeStyles} from "@material-ui/core";
import {getDateWithCorrectTimezone} from "../helpers/utils";

const useStyles = makeStyles({
  root: {
    marginTop: "1rem"
  }
});

type props = {
  initialBeginValue?: Date | undefined;
  initialEndValue?: Date | undefined;
  errorBeginDateValue: string | undefined;
  errorEndDateValue: string | undefined;
  onDataRangeChange: (dateRangeBegin: Date, dateRangeEnd: Date) => void;
};

export default function DateRangeDialog({ initialBeginValue, initialEndValue, errorBeginDateValue, errorEndDateValue, onDataRangeChange } : props) {
  const classes = useStyles();
  const [dateRange, setDateRange] = React.useState<DateRange<Date>>([null, null]);
  const inputBeginDate = useRef<HTMLInputElement | null>();
  const inputEndDate = useRef<HTMLInputElement | null>();

  useEffect(() => {
    const begin = initialBeginValue ? getDateWithCorrectTimezone(initialBeginValue) : getDateWithCorrectTimezone(new Date());
    const end = initialEndValue ? getDateWithCorrectTimezone(initialEndValue) : getDateWithCorrectTimezone(new Date());
    setDateRange([begin, end]);
  }, [initialBeginValue, initialEndValue]);


  useEffect(() => {
    if (errorBeginDateValue) inputBeginDate.current?.focus();
    if (errorEndDateValue) inputEndDate.current?.focus();
  }, [errorBeginDateValue, errorEndDateValue]);

  const handleDateRangePickerChange = (newValue: DateRange<Date>) => {
    setDateRange(newValue);
    if (!!newValue[0] && !!newValue[1]) {
      onDataRangeChange(newValue[0], newValue[1]);
    }
  };

  return(
    <Box className={classes.root}>
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
                error={!!errorBeginDateValue}
                helperText={errorBeginDateValue ?? ''}
              />
              <Box sx={{ mx: 2 }}> até </Box>
              <TextField
                {...endProps}
                inputRef={inputEndDate}
                error={!!errorEndDateValue}
                helperText={errorEndDateValue ?? ''}
              />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </Box>
  );
}
