import {CardPanel} from "../components/CardPanel";
import {useEffect, useState} from "react";
import {ContentHeader} from "../components/ContentHeader";
import {Container} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {useSnackbar} from "notistack";
import {IReportGenerationRequest} from "../domain/IReportGenerationRequest";
import reportService from "../service/report.service"
import {IReport} from "../domain/IReport";
import ReportFilterDialog from "../components/ReportFilterDialog";
import {ReportContent} from "../components/ReportContent";
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

export default function ReportPage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [reportGenerationRequest, setReportGenerationRequest] = useState<IReportGenerationRequest | undefined>();
  const [report, setReport] = useState<IReport | undefined>();

  useEffect(() => {
    (async () => {
      if(reportGenerationRequest) {
        try {
          const reportGenerated = await reportService.generate(reportGenerationRequest as IReportGenerationRequest) as IReport;
          setReport(reportGenerated);
        } catch (apiError: ApiError | any) {
          enqueueSnackbar(apiError.message, { variant: 'error' });
        }
      }
    })();
  }, [reportGenerationRequest])

  const handleAddNewClick = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false);
  };

  const handleFilter = (reportFilter: IReportGenerationRequest) => {
    setReport(undefined);
    setReportGenerationRequest(reportFilter);
    setOpenFilterDialog(false);
  };

  return (
    <CardPanel>
      <Container className={classes.rootContent}>
        <ContentHeader title={"Relatório"} onAddNewClick={handleAddNewClick}/>
        <ReportContent report={report}/>
        <ReportFilterDialog
          open={openFilterDialog}
          onClose={handleFilterDialogClose}
          onFilter={handleFilter}
        />
      </Container>
    </CardPanel>
  );
}
