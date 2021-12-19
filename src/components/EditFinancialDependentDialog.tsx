import React, {useEffect, useRef, useState} from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, FormControl, TextField} from "@mui/material";
import {IFinancialDependent} from "../domain/IFinancialDependent";
import {IValidationErrors} from "../domain/IValidationErrors";
import DateRangeDialog from "./DateRageDialog";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {getDateWithCorrectTimezone} from "../helpers/utils";
import {addMonths} from "date-fns";

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
  financialDependent?: IFinancialDependent | undefined
  open: boolean;
  onClose: () => void;
  onSave: (financialDependent: IFinancialDependent) => void;
}

export default function EditFinancialDependentDialog(props: IEventFormDialogProps) {
  const classes = useStyles();
  const [financialDependent, setFinancialDependent] = useState<IFinancialDependent | undefined>(props.financialDependent);
  const [errors, setErrors] = useState<IValidationErrors>({});
  const [irrfDeductChecked, setIrrfDeductChecked] = React.useState<boolean>();
  const inputName = useRef<HTMLInputElement | null>();
  const title =
    !financialDependent?.id
      ? "Criar Novo Dependente"
      : `Editar "${financialDependent?.name}"`;

  useEffect(() => {
    if (props.open) {

      const isIrrfDeduct = props.financialDependent
        ? props.financialDependent.irrfDeduct
        : true;

      const beginDate =
        props.financialDependent
          ? getDateWithCorrectTimezone(props.financialDependent.periodBegin)
          : new Date();

      const endDate =
        props.financialDependent
          ? getDateWithCorrectTimezone(props.financialDependent.periodEnd)
          : addMonths(new Date(), 1);

      setIrrfDeductChecked(isIrrfDeduct);
      setFinancialDependent({...props.financialDependent, irrfDeduct: isIrrfDeduct, periodBegin: beginDate, periodEnd: endDate} as IFinancialDependent);
    } else {
      onDialogClose();
    }
  }, [props.open]);

  const handleCancel = () => {
    onDialogClose();
  };

  const onDialogClose = () => {
    setFinancialDependent(undefined);
    setIrrfDeductChecked(undefined);
    setErrors({});
    props.onClose();
  }

  const handleFinancialDependentNameChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFinancialDependent({ ...financialDependent, name: evt.target.value} as IFinancialDependent);
    setErrors({});
  }

  const handleIrrfDeductChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setIrrfDeductChecked(evt.target.checked)
    setFinancialDependent({ ...financialDependent, irrfDeduct: evt.target.checked} as IFinancialDependent);
    setErrors({});
  };

  const handleDateRangeChange = (dateRangeBegin: Date, dateRangeEnd: Date) => {
    setFinancialDependent({...financialDependent, periodBegin: dateRangeBegin, periodEnd: dateRangeEnd} as IFinancialDependent)
    setErrors({});
  }

  function save(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      props.onSave(financialDependent as IFinancialDependent);
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};

    if (!financialDependent?.name) {
      currentErrors["name"] = "O nome do dependente é obrigatório";
      inputName.current?.focus();
    }

    if (!financialDependent?.periodBegin) {
      currentErrors["beginDateValue"] = "O início do período é obrigatório";
    }
    if (!financialDependent?.periodEnd) {
      currentErrors["endDateValue"] = "O fim do período é obrigatório";
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

              <TextField
                inputRef={inputName}
                className={classes.textField}
                autoFocus
                margin="dense"
                id="name"
                label="Nome"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={financialDependent?.name}
                error={!!errors.name}
                helperText={errors.name ? errors.name : ''}
                onChange={handleFinancialDependentNameChange}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={irrfDeductChecked}
                    onChange={handleIrrfDeductChange}
                  />
                }
                label="Deduzir do IRRF"
              />

              <DateRangeDialog
                initialBeginValue={financialDependent?.periodBegin}
                initialEndValue={financialDependent?.periodEnd}
                errorBeginDateValue={errors["beginDateValue"]}
                errorEndDateValue={errors["endDateValue"]}
                onDataRangeChange={handleDateRangeChange}
              />
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
