import {CardPanel} from "../components/CardPanel";
import ExpenseTable from "../components/ExpenseTable";
import EditExpenseDialog from "../components/EditExpenseDialog";
import React, {useEffect, useState} from "react";
import {IExpense} from "../domain/IExpense";
import expenseService from "../service/expense.service"
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

export default function ExpensePage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [expenseSelected, setExpenseSelected] = React.useState<IExpense | undefined>();
  const [expenses, setExpenses] = useState<IExpense[] | []>([]);

  useEffect(() => {
    (async () => {
      await loadExpenses();
    })();
  }, []);

  useEffect(() => {
    if(expenseSelected) {
      setOpenEditDialog(true);
    }
  }, [expenseSelected]);

  const loadExpenses = async() => {
    const expenses = (await expenseService.findAll()) as Array<IExpense>;
    setExpenses(expenses);
  }

  const handleAddNewClick = () => {
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setExpenseSelected(undefined);
  };

  const handleSave = async (expense: IExpense) => {
    try {
      await expenseService.save(expense);
      setOpenEditDialog(false);
      setExpenseSelected(undefined);
      enqueueSnackbar("Despesa salva com sucesso", { variant: 'success' });
      await loadExpenses();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleDelete(expenseId: string)  {
    try {
      await expenseService.remove(expenseId);
      enqueueSnackbar("Despesa removida com sucesso", { variant: 'success' });
      await loadExpenses();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleEdit(expenseId: string)  {
    setExpenseSelected(expenses.find(p => p.id === expenseId));
  }

  return (
    <CardPanel>
      <Container className={classes.rootContent}>
        <ContentHeader title={"Despesas"} onAddNewClick={handleAddNewClick}/>
        <ExpenseTable expenses={expenses} onDelete={handleDelete} onEdit={handleEdit} />
        <EditExpenseDialog
          expense={expenseSelected}
          open={openEditDialog}
          onClose={handleClose}
          onSave={handleSave}
        />
      </Container>
    </CardPanel>
  );
}
