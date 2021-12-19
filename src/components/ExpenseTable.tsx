import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {theme} from "../Styles";
import {IExpense} from "../domain/IExpense";
import {formattedDate, toCurrency} from "../helpers/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import {IExpenseType} from "../domain/types/IExpenseType";

interface Column {
  id: "description" | "value" | "type" | "periodBegin" | "periodEnd" | "action";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | "center" | "left";
  formatCurrency?: (value: number) => string;
  formatDate?: (value: Date) => string;
}

const columns: Column[] = [
  {
    id: "description",
    label: "Descrição",
    width: 100,
    align: "left",
  },
  {
    id: "value",
    label: "Valor (R$)",
    width: 50,
    align: "center",
    formatCurrency: (value: number) => toCurrency(value),
  },
  {
    id: "type",
    label: "Tipo",
    width: 50,
    align: "left",
  },
  {
    id: "periodBegin",
    label: "Início do Período",
    width: 50,
    align: "center",
    formatDate: (value: Date) => formattedDate(value),
  },
  {
    id: "periodEnd",
    label: "Fim do Período",
    width: 50,
    align: "center",
    formatDate: (value: Date) => formattedDate(value),
  },
  {
    id: "action",
    label: "Ação",
    width: 50,
    align: "center",
  },
];

const background = "#2B2B2C";

const useStyles = makeStyles({
  root: {
    width: "100%",
    background: theme.background,
  },
  container: {
    maxHeight: 600,
  },
  tableHeader: {
    background,
    color: theme.fonts.color,
    fontWeight: 800,
    textAlign: "center"
  },
  tableContent: {
    color: theme.fonts.color
  },
  tableFooter: {
    background,
    color: theme.fonts.color,
  },
});

type props = {
  expenses: IExpense[];
  onDelete: (expenseId: string) => void
  onEdit: (expenseId: string) => void
};

export default function ExpenseTable({ expenses, onDelete, onEdit }: props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (!expenses || expenses.length === 0) {
    return <></>;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (expenseId : string) => {
    onEdit(expenseId);
  }

  const handleDeleteClick = (expenseId : string) => {
    onDelete(expenseId);
  }

  const handleValue = (column: Column,  value: any) : string => {
    if (column.formatCurrency && typeof value === "number") return column.formatCurrency(value);
    if (column.formatDate) return column.formatDate(value);
    if (typeof value === "object") {
      const type = value as IExpenseType;
      return type.description;
    }
    return value;
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth, width: column.width }}
                  className={classes.tableHeader}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={expense.id}>
                  {columns.map((column) => {
                    if (column.id !== 'action') {
                      let value = expense[column.id];
                      return (
                        <TableCell
                          className={classes.tableContent}
                          key={column.id}
                          align={column.align}
                        >
                          {handleValue(column, value)}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        className={classes.tableContent}
                        key={column.id}
                        align={column.align}
                      >
                        <IconButton aria-label="edit" onClick={() => handleEditClick(expense.id)}><EditIcon /></IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDeleteClick(expense.id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    );

                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage="Despesas por página:"
        className={classes.tableFooter}
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={expenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
