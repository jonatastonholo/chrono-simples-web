import {CardPanel} from "../components/CardPanel";
import PeriodTable from "../components/PeriodTable";
import EditPeriodDialog from "../components/EditPeriodDialog";
import React, {useEffect, useState} from "react";
import {IPeriod} from "../domain/IPeriod";
import periodService from "../service/period.service"
import {ContentHeader} from "../components/ContentHeader";
import {Container} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {useSnackbar} from "notistack";
import {ApiError} from "../error/ApiError";

const useStyles = makeStyles({
  rootContent: {
    border: 0,
    padding: "0.0rem",
    marginTop: "0.02rem",
    marginBottom: "25px",
    textAlign: "center",
    color: theme.fonts.color,
    display: "flex",
    flexDirection: "row",
  },
  content: {

    padding: "0.50rem",
    textAlign: "center",
  },
});

export default function PeriodPage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [periodSelected, setPeriodSelected] = React.useState<IPeriod | undefined>();
  const [periods, setPeriods] = useState<IPeriod[] | []>([]);

  useEffect(() => {
    (async () => {
      await loadPeriods();
    })();
  }, []);

  useEffect(() => {
    if(periodSelected) {
      setOpenEditDialog(true);
    }
  }, [periodSelected]);

  const loadPeriods = async() => {
    const periods = (await periodService.findAll()) as Array<IPeriod>;
    setPeriods(periods);
  }

  const handleAddNewClick = () => {
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setPeriodSelected(undefined);
  };

  const handleSave = async (period: IPeriod) => {
    try {
      await periodService.save(period);
      setOpenEditDialog(false);
      setPeriodSelected(undefined);
      enqueueSnackbar("Período salvo com sucesso", { variant: 'success' });
      await loadPeriods();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleDelete(periodId: string)  {
    try {
      await periodService.remove(periodId);
      enqueueSnackbar("Período removido com sucesso", { variant: 'success' });
      await loadPeriods();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleEdit(periodId: string)  {
    setPeriodSelected(periods.find(p => p.id === periodId));
  }

  return (
    <CardPanel>
      <Container className={classes.rootContent}>
        <ContentHeader title={"Períodos"} onAddNewClick={handleAddNewClick}/>
        <PeriodTable periods={periods} onDelete={handleDelete} onEdit={handleEdit} />
        <EditPeriodDialog
          period={periodSelected}
          open={openEditDialog}
          onClose={handleClose}
          onSave={handleSave}
        />
      </Container>
    </CardPanel>
  );
}
