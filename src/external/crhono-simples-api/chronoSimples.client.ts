import axios from "axios";

const BASE_URL: string = process.env.REACT_APP_BACKEND_URL!;
const API_KEY: string = process.env.REACT_APP_BACKEND_API_KEY!;


const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout:10000,
  withCredentials: false
})

async function GET(uri : string) : Promise<any> {
  return await httpClient.get(uri, {
    headers: {
      'x-api-key':  API_KEY,
      responseType: "json"
    }
  });
}

async function POST(uri : string, body : any) : Promise<any> {
  return await httpClient.post(uri, body, {
    headers: {
      'x-api-key':  API_KEY,
      responseType: "json"
    }
  });
}

async function PUT(uri : string, body : any) : Promise<any> {
  return await httpClient.put(uri, body, {
    headers: {
      'x-api-key':  API_KEY,
      responseType: "json"
    }
  });
}

async function PATCH(uri : string, body? : any) : Promise<any> {
  return await httpClient.patch(uri, body, {
    headers: {
      'x-api-key':  API_KEY,
      responseType: "json"
    }
  });
}

async function DELETE(uri : string) : Promise<any> {
  return await httpClient.delete(uri, {
    headers: {
      'x-api-key':  API_KEY,
      responseType: "json"
    }
  });
}

export default {
  BASE_URL,
  GET,
  POST,
  DELETE,
  PUT,
  PATCH
}
