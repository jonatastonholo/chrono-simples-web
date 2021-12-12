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
import {IPeriod} from "../domain/IPeriod";
import {toCurrency} from "../helpers/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton, Stack} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import {IProject} from "../domain/IProject";

interface Column {
  id: "projectName" | "description" | "hourValue" | "currency" | "begin" | "end" | "action";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "projectName", label: "Projeto", width: 100},
  { id: "description", label: "Descrição", width: 100},
  {
    id: "hourValue",
    label: "Hora/Valor",
    width: 50,
    align: "right",
    format: (value: number) => toCurrency(value),
  },
  {
    id: "currency",
    label: "Moeda",
    width: 50,
  },
  {
    id: "begin",
    label: "Início",
    width: 50,
  },
  {
    id: "end",
    label: "Fim",
    width: 50,
  },
  {
    id: "action",
    label: "Ação",
    width: 50,
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
  },
  tableContent: {
    color: theme.fonts.color,
  },
  tableFooter: {
    background,
    color: theme.fonts.color,
  },
});

type props = {
  periods: IPeriod[];
  onDelete: (periodId: string) => void
  onEdit: (periodId: string) => void
};

export default function PeriodTable({ periods, onDelete, onEdit }: props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (!periods || periods.length === 0) {
    return <></>;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (periodId : string) => {
    onEdit(periodId);
  }

  const handleDeleteClick = (periodId : string) => {
    onDelete(periodId);
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
                  align={column.align}
                  style={{ minWidth: column.minWidth, width: column.width }}
                  className={classes.tableHeader}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {periods.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((period) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={period.id}>
                  {columns.map((column) => {
                    if (column.id !== 'action') {
                      let value;
                      if(column.id === 'projectName') {
                        const project = period['project'] as IProject;
                        value = project.name;
                      } else {
                        value = period[column.id];
                      }
                      return (
                        <TableCell
                          className={classes.tableContent}
                          key={column.id}
                          align={column.align}
                        >
                          {column.format && typeof value === "number" ? column.format(value) : value}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        className={classes.tableContent}
                        key={column.id}
                        align={column.align}
                      >
                        <Stack direction="row" spacing={2}>
                          <IconButton aria-label="edit" onClick={() => handleEditClick(period.id)}><EditIcon /></IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDeleteClick(period.id)}><DeleteIcon /></IconButton>
                        </Stack>
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
        labelRowsPerPage="Projetos por página:"
        className={classes.tableFooter}
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={periods.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
