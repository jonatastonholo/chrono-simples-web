import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {Box, FormControl, InputAdornment, Stack, TextField} from "@mui/material";
import {IPeriod} from "../domain/IPeriod";
import {ICurrency} from "../domain/ICurrency";
import {IValidationErrors} from "../domain/IValidationErrors";
import {IProject} from "../domain/IProject";
import projectService from "../service/project.service"
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {ptBR} from "date-fns/locale";
import {addSeconds} from 'date-fns'

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
  period?: IPeriod | undefined
  open: boolean;
  onClose: () => void;
  onSave: (period: IPeriod) => void;
}

export default function EditPeriodDialog(props: IEventFormDialogProps) {
  const classes = useStyles();
  const [period, setPeriod] = useState<IPeriod | undefined>(props.period);
  const [beginDateValue, setBeginDateValue] = useState<Date | null>();
  const [endDateValue, setEndDateValue] = useState<Date | null>();
  const [projects, setProjects] = useState<IProject[] | []>([]);
  const [project, setProject] = useState<IProject>();
  const [errors, setErrors] = useState<IValidationErrors>({});
  const [currencyValue, setCurrencyValue] = useState<string | undefined>("BRL");
  const [currencyLabel, setCurrencyLabel] = useState<string | undefined>('R$');
  const [hourValue, setHourValue] = useState<string | undefined>();
  const inputHourValue = useRef<HTMLInputElement | null>();
  const inputProject = useRef<HTMLInputElement | null>();
  const title =
    !period?.id
      ? "Criar Novo Per??odo"
      : `Editar Per??odo`;

  useEffect(() => {
    (async () => {
      if (props.open) {
        const selectedProject = await loadProject();

        const beginDate =
          props.period
            ? props.period.begin
            : new Date();

        const endDate =
          props.period
            ? props.period.end
            : addSeconds(new Date(), 1);

        const hourValue =
          props.period
            ? props.period.hourValue
            : selectedProject?.hourValue;

        setBeginDateValue(beginDate);
        setEndDateValue(endDate);
        setPeriod({...props.period, projectId: selectedProject?.id, project: selectedProject, currency: currencyValue, hourValue, begin: beginDate, end: endDate} as IPeriod);
        setHourValue(hourValue?.toString());
      } else {
        onCloseActions();
      }
    })();
  }, [props.open]);

  useEffect(() => {
    if(props.open) {
      setPeriod({...period, hourValue: project?.hourValue, currency: project?.currencyCode} as IPeriod);
    }
  }, [project]);

  useEffect(() => {
    if (props.open) {
      const currencyFound =
        props.period
        ? currencies.find(curr => curr.value === props.period?.currency)
        : currencies.find(curr => curr.value === 'BRL');

      const projectSelected =
        period
        ? projects.find(p => p.id === period.project.id)
        : projects[0];

      setProject(projectSelected);
      setCurrencyValue(currencyFound?.value);
      setCurrencyLabel(currencyFound?.label);
      setHourValue(projectSelected?.hourValue.toString())
    }
  }, [projects]);

  useEffect(() => {
    if (props.open) {
      setPeriod(props.period);
    }
  }, [props.period, props.open]);

  const loadProject = async () : Promise<IProject | undefined> => {
    const projectList = await projectService.findAll();

    if (projectList) {
      const selectedProject =
      props.period
        ? props.period.project
        : projectList[0];

      setProjects(projectList);
      setProject(selectedProject as IProject);
      return selectedProject;
    }
    return undefined;
  }

  const onCloseActions = () => {
    setProject(undefined);
    setProjects([]);
    setErrors({});
    setCurrencyLabel("R$");
    setCurrencyValue("BRL");
    setBeginDateValue(null);
    setEndDateValue(null);
    setHourValue(undefined);
  }

  const handleCancel = () => {
    onCloseActions();
    props.onClose();
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let selectedCurrency = event.target.value;
    setCurrencyValue(selectedCurrency);
    setPeriod({...period, currency: selectedCurrency} as IPeriod)
    const label = currencies.find(cur => cur.value === selectedCurrency)?.label;
    setCurrencyLabel(label);
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let selectedProjectId = event.target.value;
    const selectedProject = projects.find(p => p.id === selectedProjectId) as IProject;
    setProject(selectedProject);
    setPeriod({...period, projectId: selectedProject.id, project: selectedProject, currency: selectedProject.currencyCode, hourValue: selectedProject.hourValue} as IPeriod)
    setHourValue(selectedProject?.hourValue.toString())
  };

  function save(evt: React.FormEvent) {
    evt.preventDefault();
    if (validate()) {
      const value = hourValue ? parseFloat(hourValue) : 0;
      props.onSave({...period, hourValue: value} as IPeriod);
    }
  }

  function validate(): boolean {
    const currentErrors: IValidationErrors = {};
    if (!period?.project) {
      currentErrors["project"] = "O projeto ?? obrigat??rio";
      inputProject.current?.focus();
    }
    if (!period?.hourValue) {
      currentErrors["hourValue"] = "O valor hora ?? obrigat??rio";
      inputHourValue.current?.focus();
    }

    if (hourValue === undefined || hourValue === "") {
      currentErrors["hourValue"] = "O valor hora ?? obrigat??rio";
      inputHourValue.current?.focus();
    } else {
      try {
        parseFloat(hourValue);
      }catch (e) {
        currentErrors["hourValue"] = "O valor hora est?? incorreto";
      }
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }

  const handleBeginDateValueChange = (newValue: Date | null) => {
    setBeginDateValue(newValue);
    setPeriod({...period, begin: newValue} as IPeriod);
  };

  const handleEndDateValueChange = (newValue: Date | null) => {
    setEndDateValue(newValue);
    setPeriod({...period, end: newValue} as IPeriod);
  };

  const handleHourValueChange = (evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setHourValue(evt.target.value);
  };

  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 700}}}
      maxWidth="xs"
      open={props.open}
    >
      <form onSubmit={save}>
        <Box className={classes.rootContent}>

          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <Stack spacing={3}>
                <TextField
                  className={classes.textField}
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Descri????o"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={period?.description}
                  error={!!errors.name}
                  onChange={(evt) => setPeriod({...period, description: evt.target.value, currency: currencyValue} as IPeriod)}
                />

                <TextField
                  className={classes.textField}
                  id="project"
                  select
                  label="Projeto"
                  value={project?.id}
                  error={!!errors.project}
                  helperText={errors.project ? errors.project : ''}
                  onChange={handleProjectChange}
                  SelectProps={{
                    native: true,
                  }}
                  variant="filled"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </TextField>

                <TextField
                  className={classes.textField}
                  id="currency"
                  select
                  label="Moeda"
                  value={currencyValue}
                  onChange={handleCurrencyChange}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Selecione a Moeda"
                  variant="filled"
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
                  label="Valor/Hora"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={hourValue}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
                  }}
                  error={!!errors.hourValue}
                  helperText={errors.hourValue ? errors.hourValue : ''}
                  onChange={handleHourValueChange}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR} className={classes.textField}>
                  <DateTimePicker
                    label="In??cio"
                    value={beginDateValue}
                    onChange={handleBeginDateValueChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DateTimePicker
                    label="Fim"
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
