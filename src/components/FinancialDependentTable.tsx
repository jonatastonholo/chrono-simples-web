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
import {IFinancialDependent} from "../domain/IFinancialDependent";
import {formattedDate} from "../helpers/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';

interface Column {
  id: "name" | "irrfDeduct" | "periodBegin" | "periodEnd" | "action";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | "center" | "left";
  formatCurrency?: (value: number) => string;
  formatDate?: (value: Date) => string;
}

const columns: Column[] = [
  {
    id: "name",
    label: "Descrição",
    width: 100,
    align: "left",
  },
  {
    id: "irrfDeduct",
    label: "Deduzir no IRRF",
    width: 50,
    align: "center",
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
  financialDependents: IFinancialDependent[];
  onDelete: (financialDependentId: string) => void
  onEdit: (financialDependentId: string) => void
};

export default function FinancialDependentTable({ financialDependents, onDelete, onEdit }: props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (!financialDependents || financialDependents.length === 0) {
    return <></>;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (financialDependentId : string) => {
    onEdit(financialDependentId);
  }

  const handleDeleteClick = (financialDependentId : string) => {
    onDelete(financialDependentId);
  }

  const handleValue = (column: Column,  value: any) : string => {
    if (column.id === 'irrfDeduct') return Boolean(value) ? 'Sim' : 'Não';
    if (column.formatDate) return column.formatDate(value);
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
            {financialDependents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((financialDependent) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={financialDependent.id}>
                  {columns.map((column) => {
                    if (column.id !== 'action') {
                      let value = financialDependent[column.id];
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
                        <IconButton aria-label="edit" onClick={() => handleEditClick(financialDependent.id)}><EditIcon /></IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDeleteClick(financialDependent.id)}><DeleteIcon /></IconButton>
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
        count={financialDependents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
