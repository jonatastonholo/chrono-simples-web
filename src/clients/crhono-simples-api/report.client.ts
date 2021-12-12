import client from './chronoSimples.client'
import {IApiError} from "../../domain/IApiError";
import {ApiError} from "../../error/ApiError";
import {IReport} from "../../domain/IReport";
import {IReportGenerationRequest} from "../../domain/IReportGenerationRequest";

const BASE_URI = "/chrono-simples/v1/reports";

async function generate(request: IReportGenerationRequest) : Promise<IReport> {

  try {
    const response = await client.POST(`${BASE_URI}`, {periodBegin: request.periodBegin, periodEnd: request.periodEnd, rFactor: request.rFactor});
    const { data } : { data: IReport } = response;
    return data;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

export default {
  generate
}
