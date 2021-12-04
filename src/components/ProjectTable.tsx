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
import {IProject} from "../domain/IProject";
import {toCurrency} from "../helpers/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton, Stack} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';

interface Column {
  id: "name" | "hourValue" | "currencyCode" | "action";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "name", label: "Nome", width: 50},
  {
    id: "hourValue",
    label: "Hora/Valor",
    width: 50,
    align: "right",
    format: (value: number) => toCurrency(value),
  },
  {
    id: "currencyCode",
    label: "Moeda",
    width: 50,
  },
  {
    id: "action",
    label: "Ação",
    width: 50,
  }
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
  projects: IProject[];
  onDelete: (projectId: string) => void
  onEdit: (projectId: string) => void
};

export default function ProjectTable({ projects, onDelete, onEdit }: props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  if (!projects || projects.length === 0) {
    return <></>;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (projectId : string) => {
    onEdit(projectId);
  }

  const handleDeleteClick = (projectId : string) => {
    onDelete(projectId);
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
            {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    if (column.id !== 'action') {
                      const value = row[column.id];
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
                          <IconButton aria-label="edit" onClick={() => handleEditClick(row.id)}><EditIcon /></IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDeleteClick(row.id)}><DeleteIcon /></IconButton>
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
        rowsPerPageOptions={[1, 5, 10, 25, 50]}
        component="div"
        count={projects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
