import React, {useEffect, useRef, useState} from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, FormControl, InputAdornment, TextField} from "@mui/material";
import {IProject} from "../domain/IProject";
import {ICurrency} from "../domain/ICurrency";
import {IValidationErrors} from "../domain/IValidationErrors";

const currencies = [
  {
    value: 'BRL',
    label: 'R$',
  },
  {
    value: 'USD',
    label: '$',
  },
] as ICurrency[];

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
  project?: IProject | undefined
  open: boolean;
  onClose: () => void;
  onSave: (project: IProject) => void;
}

export default function EditProjectDialog(props: IEventFormDialogProps) {
  const classes = useStyles();
  const [project, setProject] = useState<IProject | undefined>(props.project);
  const [errors, setErrors] = useState<IValidationErrors>({});
  const [currencyValue, setCurrencyValue] = useState<string | undefined>("BRL");
  const [currencyLabel, setCurrencyLabel] = useState<string | undefined>('R$');
  const inputName = useRef<HTMLInputElement | null>();
  const inputHourValue = useRef<HTMLInputElement | null>();
  const projectName = project?.name;
  const title =
    !project?.id
    ? "Criar Novo Projeto"
    : `Editar "${projectName}"`;

  useEffect(() => {
    const currencyFound = project
    ? currencies.find(curr => curr.value === project?.currencyCode)
    : currencies.find(curr => curr.value === 'BRL');

    setCurrencyValue(currencyFound?.value);
    setCurrencyLabel(currencyFound?.label);
  }, []);


  useEffect(() => {
    setProject(project);
    setErrors({});
    if(project) {
      const currencyVal = currencies.find(curr => curr.value === project?.currencyCode);
      setCurrencyValue(currencyVal?.value);
      setCurrencyLabel(currencyVal?.label);
    }
  }, [project]);

  useEffect(() => {
    if (!props.open) {
      setProject(props.project);
    }
  }, [props.project, props.open]);

  const handleCancel = () => {
    setErrors({});
    props.onClose();
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let selectedCurrency = event.target.value;
    setCurrencyValue(selectedCurrency);
    setProject({...project, currencyCode: selectedCurrency} as IProject)
    const label = currencies.find(cur => cur.value === selectedCurrency)?.label;
    setCurrencyLabel(label);
  };

  function save(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      props.onSave(project as IProject);
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};
    if (!project?.name) {
      currentErrors["name"] = "O nome é obrigatório";
      inputName.current?.focus();
    }
    if (!project?.hourValue) {
      currentErrors["hourValue"] = "O valor hora é obrigatório";
      inputHourValue.current?.focus();
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
                defaultValue={project?.name}
                error={!!errors.name}
                onChange={(evt) => setProject({ ...project, name: evt.target.value, currencyCode: currencyValue} as IProject)}
              />

              <TextField
                id="currency"
                select
                label="Moeda"
                value={currencyValue}
                onChange={handleCurrencyChange}
                SelectProps={{
                  native: true,
                }}
                helperText="Please select your currency"
                variant="filled"
                defaultValue={currencyValue}
              >
                {currencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>

              <TextField
                className={classes.textField}
                autoFocus
                margin="dense"
                id="hourValue"
                label="Hora/Valor"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={project?.hourValue}
                inputProps={{
                  inputMode: 'numeric', pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                  startAdornment: <InputAdornment position="start">{currencyLabel}</InputAdornment>,
                }}
                error={!!errors.hourValue}
                onChange={(evt) => {
                  const hourValue = parseFloat(evt.target.value);
                  const p = {...project, hourValue, currencyCode: currencyValue} as IProject;
                  setProject(p);
                }}
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
