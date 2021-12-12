// @flow
import * as React from "react";
import {Card, makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {IReport} from "../domain/IReport";
import {Box, Typography} from "@mui/material";
import {formattedCurrency} from "../helpers/utils";
import {IWorkedHours} from "../domain/IWorkedHours";
import {ReportContentValue} from "./ReportContentValue";
import {ExpenseType} from "../domain/types/ExpenseType";

const useStyles = makeStyles({
  root: {
    background: theme.background,
    color: theme.fonts.color,
    display: "flex",
    flexDirection: "row",
    padding: "0.0rem",
    marginTop: "25px",
    minHeight: "15.25rem",
    textAlign: "center",
  },

  content: {
    background: theme.background,
    color: theme.fonts.color,
    display: "flex",
    fontWeight: 100,
    flexDirection: "column",
    padding: "1.25rem",
    textAlign: "start",
    minWidth: "20rem",
    margin: "0.25rem",
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
        Selecione um período para gerar o Relatório
      </Card>
    )
  }

  return (
    <>
      <Box className={classes.root}>

        <Card className={classes.content}>
          <Typography variant="h5" component="h2">
            Resumo do Período
          </Typography>
          <ReportContentValue label={"Início"} value={report.periodBegin}/>
          <ReportContentValue label={"Fim"} value={report.periodEnd}/>
          <ReportContentValue label={"Fator R"} value={report.rFactor}/>
          <ReportContentValue label={"Horas trabalhadas"} value={formatWorkedHours(report.workedHours)}/>
          <ReportContentValue label={"Dependentes cadastrados"} value={report.financialDependents}/>
          <ReportContentValue label={"Dedução no IRRF dos dependentes"} value={formattedCurrency("BRL",  report.financialDependentsDeduction)}/>
        </Card>

        <Card className={classes.content}>
          <Typography variant="h5" component="h2">
            Faturamento
          </Typography>
          <ReportContentValue label={"Últimos 12 meses"} value={formattedCurrency("BRL",  report.last12MonthEarnings)}/>
          <ReportContentValue label={"Faturamento no período"} value={formattedCurrency("BRL",  report.periodEarnings)}/>
          <ReportContentValue label={"Pró-labore bruto"} value={formattedCurrency("BRL",  report.baseProLabor)}/>
          <ReportContentValue label={"Pró-labore líquido"} value={formattedCurrency("BRL",  report.liquidProLabor)}/>
        </Card>

        <Card className={classes.content}>
          <Typography variant="h5" component="h2">
            Impostos
          </Typography>
          <ReportContentValue label={"DAS"}  value={formattedCurrency("BRL",  report.dasAmount)}/>
          <ReportContentValue label={"INSS"} value={formattedCurrency("BRL",  report.inssAmount)}/>
          <ReportContentValue label={"IRRF"} value={formattedCurrency("BRL",  report.irrfAmount)}/>
        </Card>

      </Box>

      <Box className={classes.root}>
        <Card className={classes.content}>
          <Typography variant="h5" component="h2">
            Despesas Dedutíveis do IRRF
          </Typography>
          {
            report
              .expenses
              ?.filter(expense => expense.type === ExpenseType.PERSONAL)
              ?.map(expense =>(
                  <ReportContentValue
                    key={expense.id}
                    label={expense.description}
                    value={formattedCurrency("BRL",  expense.value)}/>
                ))
          }
        </Card>

        <Card className={classes.content}>
          <Typography variant="h5" component="h2">
            Despesas da Empresa
          </Typography>
          {
            report
              .expenses
              ?.filter(expense => expense.type === ExpenseType.COMPANY)
              ?.map(expense => (
                <ReportContentValue
                  key={expense.id}
                  label={expense.description}
                  value={formattedCurrency("BRL",  expense.value)}/>
              ))
          }
        </Card>

        <Card className={classes.content}>
          <Typography variant="h5" component="h2">
            Valores a Sacar
          </Typography>
          <ReportContentValue label={"Pró-labore"}  value={formattedCurrency("BRL",  report.proLaborToWithdrawal)}/>
          <ReportContentValue label={"Lucros"} value={formattedCurrency("BRL",  report.profitToWithdrawal)}/>
          <ReportContentValue label={"Total a Sacar"} value={formattedCurrency("BRL",  report.amountToWithdrawal)}/>
          <ReportContentValue label={"Fica na conta PJ"} value={formattedCurrency("BRL",  report.amountToKeep)}/>
        </Card>


      </Box>
    </>
  );
}
