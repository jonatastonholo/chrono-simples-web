// @flow
import * as React from "react";
import {Card, makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {IReport} from "../domain/IReport";
import {Box, Container, List, Typography} from "@mui/material";
import {formattedCurrency, formattedDate, formattedPercentage} from "../helpers/utils";
import {IWorkedHours} from "../domain/IWorkedHours";
import {ReportContentValue} from "./ReportContentValue";
import {ExpenseType} from "../domain/types/ExpenseType";
import {DividerLine} from "./DividerLine";

const useStyles = makeStyles({
  root: {
    background: theme.background,
    color: theme.fonts.color,
    display: "flex",
    flexDirection: "row",
    padding: "0.0rem",
    marginTop: "25px",
    height: "18.0rem",
    textAlign: "center",
  },

  card: {
    background: "#434A4C",
    color: theme.fonts.color,
    display: "flex",
    fontWeight: 100,
    flexDirection: "column",
    padding: "0.4rem 0.5rem 0.5rem  0.9rem",
    margin: "0.25rem",
    textAlign: "start",
    width: '22rem',
    height: "18.0rem",
  },
});

type props = {
  report: IReport | undefined;
}

const formatWorkedHours = (workedHours: IWorkedHours) : string => {
  if(!workedHours) return "";
  return `${workedHours.hours.toString().padStart(2,'0')}:${workedHours.minutes.toString().padStart(2,'0')}:${workedHours.seconds.toString().padStart(2,'0')}`;
}

export function ReportContent({ report }: props) {
  const classes = useStyles();

  if(!report) {
    return (
      <Card className={classes.root}>
        <Container className={classes.root}>
          <Typography variant="h6" component="h5" textAlign="center">
            Selecione um período para gerar o Relatório
          </Typography>
        </Container>
      </Card>
    )
  }

  return (
    <List
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      <Box className={classes.root}>
        <Card className={classes.card}>
          <Typography variant="h5" component="h2" textAlign="center">
            Resumo do Período
          </Typography>
          <DividerLine sx={{paddingBottom: "5px"}}/>
          <Box sx={{display: "flex", flexDirection: "row"}}>
            <ReportContentValue label={"Período"} value={formattedDate(report.periodBegin)}/>
            <ReportContentValue sx={{paddingLeft: "0.6rem"}} sxLabel={{paddingRight: "0.4rem"}} label={"-"} value={formattedDate(report.periodEnd)}/>
          </Box>
          <ReportContentValue label={"Horas trabalhadas"} value={formatWorkedHours(report.workedHours)}/>
          <ReportContentValue label={"Dependentes cadastrados"} value={report.financialDependents}/>
          <ReportContentValue label={"Dedução no IRRF (dependentes)"} value={formattedCurrency("BRL",  report.financialDependentsDeduction)}/>
        </Card>

        <Card className={classes.card}>
          <Typography variant="h5" component="h2" textAlign="center">
            Faturamento do Período
          </Typography>
          <DividerLine sx={{paddingBottom: "5px"}}/>
          <ReportContentValue label={"Últimos 12 meses"} value={formattedCurrency("BRL",  report.last12MonthEarnings)}/>
          <ReportContentValue label={"Faturamento bruto"} value={formattedCurrency("BRL",  report.periodEarnings)}/>
          <ReportContentValue label={"Faturamento líquido"} value={formattedCurrency("BRL",  report.liquidPeriodEarnings)}/>
          <ReportContentValue label={"Pró-labore bruto"} value={formattedCurrency("BRL",  report.baseProLabor)}/>
          <ReportContentValue label={"Pró-labore líquido"} value={formattedCurrency("BRL",  report.liquidProLabor)}/>
        </Card>

        <Card className={classes.card}>
          <Typography variant="h5" component="h2" textAlign="center">
            Impostos
          </Typography>
          <DividerLine sx={{paddingBottom: "5px"}}/>
          <ReportContentValue label={"Fator R"} value={formattedPercentage(report.rFactor)}/>
          <ReportContentValue label={"DAS"}  value={formattedCurrency("BRL",  report.dasAmount)}/>
          <ReportContentValue label={"INSS"} value={formattedCurrency("BRL",  report.inssAmount)}/>
          <ReportContentValue label={"IRRF"} value={formattedCurrency("BRL",  report.irrfAmount)}/>
          <Box sx={{padding: "0.5rem 0.6rem 0.5rem 0", fontSize: "0.85rem", textAlign: "justify", fontStyle: "italic", fontWeight: "500"}} >
            Obs: os cálculos de impostos só serão válidos se a nota fiscal for emitida com o mesmo valor do faturamento bruto do período.
          </Box>
        </Card>

      </Box>

      <Box className={classes.root}>
        <Card className={classes.card}>
          <Typography variant="h5" component="h2" textAlign="center">
            Despesas Dedutíveis do IRRF
          </Typography>
          <DividerLine sx={{paddingBottom: "5px"}}/>
          <List
            sx={{
              height: '100%',
              width: '100%',
              position: 'relative',
              overflow: 'auto',
              paddingRight: "0.2rem",
              marginTop: "0.5rem",
            }}
          >
            {
              report
                .expenses
                .filter(expense => expense.type === ExpenseType.PERSONAL)
                .map(expense =>(
                    <ReportContentValue
                      key={expense.id}
                      label={expense.description}
                      value={formattedCurrency("BRL",  expense.value)}/>
                  ))
            }
          </List>
        </Card>

        <Card className={classes.card}>
          <Typography variant="h5" component="h2" textAlign="center">
            Despesas da Empresa
          </Typography>
          <DividerLine sx={{paddingBottom: "5px"}}/>
          <List
            sx={{
              height: '100%',
              width: '100%',
              position: 'relative',
              overflow: 'auto',
              paddingRight: "0.2rem",
              marginTop: "0.5rem",
            }}
          >
            {
              report
                .expenses
                .filter(expense => expense.type === ExpenseType.COMPANY)
                .map(expense => (
                  <ReportContentValue
                    key={expense.id}
                    label={expense.description}
                    value={formattedCurrency("BRL",  expense.value)}/>
                ))
            }
          </List>
        </Card>

        <Card className={classes.card}>
          <Typography variant="h5" component="h2" textAlign="center">
            Valores a Sacar
          </Typography>
          <DividerLine sx={{paddingBottom: "5px"}}/>
          <ReportContentValue label={"Pró-labore"}  value={formattedCurrency("BRL",  report.proLaborToWithdrawal)}/>
          <ReportContentValue label={"Lucros"} value={formattedCurrency("BRL",  report.profitToWithdrawal)}/>
          <DividerLine/>
          <ReportContentValue label={"Total a Sacar"} value={formattedCurrency("BRL",  report.totalAmountToWithdrawal)}/>
          <ReportContentValue label={"Fica na conta PJ"} value={formattedCurrency("BRL",  report.amountToKeep)}/>
        </Card>

      </Box>
    </List>
  );
}
