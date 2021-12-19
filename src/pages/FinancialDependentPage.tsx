import {CardPanel} from "../components/CardPanel";
import FinancialDependentTable from "../components/FinancialDependentTable";
import EditFinancialDependentDialog from "../components/EditFinancialDependentDialog";
import React, {useEffect, useState} from "react";
import {IFinancialDependent} from "../domain/IFinancialDependent";
import financialDependentService from "../service/financialDependent.service"
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

export default function FinancialDependentPage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [financialDependentSelected, setFinancialDependentSelected] = React.useState<IFinancialDependent | undefined>();
  const [financialDependents, setFinancialDependents] = useState<IFinancialDependent[] | []>([]);

  useEffect(() => {
    (async () => {
      await loadFinancialDependents();
    })();
  }, []);

  useEffect(() => {
    if(financialDependentSelected) {
      setOpenEditDialog(true);
    }
  }, [financialDependentSelected]);

  const loadFinancialDependents = async() => {
    const financialDependents = (await financialDependentService.findAll()) as Array<IFinancialDependent>;
    setFinancialDependents(financialDependents);
  }

  const handleAddNewClick = () => {
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setFinancialDependentSelected(undefined);
  };

  const handleSave = async (financialDependent: IFinancialDependent) => {
    try {
      await financialDependentService.save(financialDependent);
      setOpenEditDialog(false);
      setFinancialDependentSelected(undefined);
      enqueueSnackbar("Dependente salvo com sucesso", { variant: 'success' });
      await loadFinancialDependents();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleDelete(financialDependentId: string)  {
    try {
      await financialDependentService.remove(financialDependentId);
      enqueueSnackbar("Dependente removido com sucesso", { variant: 'success' });
      await loadFinancialDependents();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleEdit(financialDependentId: string)  {
    setFinancialDependentSelected(financialDependents.find(p => p.id === financialDependentId));
  }

  return (
    <CardPanel>
      <Container className={classes.rootContent}>
        <ContentHeader title={"Dependentes"} onAddNewClick={handleAddNewClick}/>
        <FinancialDependentTable financialDependents={financialDependents} onDelete={handleDelete} onEdit={handleEdit} />
        <EditFinancialDependentDialog
          financialDependent={financialDependentSelected}
          open={openEditDialog}
          onClose={handleClose}
          onSave={handleSave}
        />
      </Container>
    </CardPanel>
  );
}
