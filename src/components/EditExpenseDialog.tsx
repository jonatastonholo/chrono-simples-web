import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, FormControl, InputAdornment, Stack, TextField} from "@mui/material";
import {IExpense} from "../domain/IExpense";
import {IValidationErrors} from "../domain/IValidationErrors";
import {expensesType, ExpenseType} from "../domain/types/ExpenseType";
import DateRangeDialog from "./DateRageDialog";
import {IExpenseType} from "../domain/types/IExpenseType";

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
  expense?: IExpense | undefined
  open: boolean;
  onClose: () => void;
  onSave: (expense: IExpense) => void;
}

export default function EditExpenseDialog(props: IEventFormDialogProps) {
  const classes = useStyles();
  const defaultExpenseType = {value: "COMPANY", description: ExpenseType.COMPANY}
  const [expense, setExpense] = useState<IExpense | undefined>(props.expense);
  const [errors, setErrors] = useState<IValidationErrors>({});
  const inputName = useRef<HTMLInputElement | null>();
  const inputHourValue = useRef<HTMLInputElement | null>();
  const expenseDescription = expense?.description;
  const title =
    !expense?.id
      ? "Criar Nova Despesa"
      : `Editar "${expenseDescription}"`;

  useEffect(() => {
    if (props.open) {
      if (props.expense) {
        setExpense(props.expense);
      } else {
        setExpense({...expense, type: defaultExpenseType} as IExpense);
      }
    } else {
      onDialogClose();
    }
  }, [props.open]);

  const handleCancel = () => {
    setErrors({});
    onDialogClose();
  };

  const onDialogClose = () => {
    setExpense(undefined);
    setErrors({});
    props.onClose();
  }

  const handleExpenseTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let selectedType = event.target.value;
    setExpense({...expense, type: expensesType.find(type => type.value === selectedType) as IExpenseType} as IExpense)
    setErrors({});
  };

  const handleExpenseDescriptionChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setExpense({ ...expense, description: evt.target.value} as IExpense);
    setErrors({});
  }

  const handleValueChange = (evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setExpense({ ...expense, value: parseFloat(evt.target.value)} as IExpense);
    setErrors({});
  };

  const handleDateRangeChange = (dateRangeBegin: Date, dateRangeEnd: Date) => {
    setExpense({...expense, periodBegin: dateRangeBegin, periodEnd: dateRangeEnd} as IExpense)
    setErrors({});
  }

  function save(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      props.onSave(expense as IExpense);
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};
    if (!expense?.type) {
      currentErrors["type"] = "O tipo de gasto ?? obrigat??rio";
      inputName.current?.focus();
    }

    if (!expense?.description) {
      currentErrors["description"] = "A descri????o do gasto ?? obrigat??ria";
      inputHourValue.current?.focus();
    }

    if (!expense?.value) {
      currentErrors["value"] = "O valor do gasto ?? obrigat??rio";
      inputHourValue.current?.focus();
    }

    if (!expense?.periodBegin) {
      currentErrors["beginDateValue"] = "O in??cio do per??odo ?? obrigat??rio";
    }
    if (!expense?.periodEnd) {
      currentErrors["endDateValue"] = "O fim do per??odo ?? obrigat??rio";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={props.open}
    >
      <form onSubmit={save}>
        <Box className={classes.rootContent}>

          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth >
              <Stack spacing={3}>
                <TextField
                  className={classes.textField}
                  id="type"
                  select
                  label="Tipo de gasto"
                  value={expense?.type.value}
                  error={!!errors.type}
                  helperText={errors.type ? errors.type : ''}
                  onChange={handleExpenseTypeChange}
                  SelectProps={{
                    native: true,
                  }}
                  variant="filled"
                >
                  {expensesType.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.description}
                    </option>
                  ))}
                </TextField>

                <TextField
                  inputRef={inputName}
                  className={classes.textField}
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Descri????o"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={expense?.description}
                  error={!!errors.description}
                  helperText={errors.description ? errors.description : ''}
                  onChange={handleExpenseDescriptionChange}
                />

                <TextField
                  className={classes.textField}
                  autoFocus
                  margin="dense"
                  id="value"
                  label="Valor"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={expense?.value}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                  }}
                  error={!!errors.value}
                  helperText={errors.value ? errors.value : ''}
                  onChange={handleValueChange}
                />

                <DateRangeDialog
                  initialBeginValue={expense?.periodBegin}
                  initialEndValue={expense?.periodEnd}
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
