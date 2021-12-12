import {IReport} from "../domain/IReport";
import client from "../clients/crhono-simples-api/report.client"
import {IReportGenerationRequest} from "../domain/IReportGenerationRequest";

async function generate(report: IReportGenerationRequest) : Promise<IReport> {
  return await client.generate(report);
}

export default {generate}
