import chronoSimplesClient from './chronoSimples.client'
import {IUser} from "../../domain/IUser";
import {ApiError} from "../../error/ApiError";

const BASE_URI = "/chrono-simples/v1/session";

export async function signIn(email: string, password: string): Promise<IUser | undefined> {
  try {
    const response = await chronoSimplesClient.POST(BASE_URI, { email, password: password });
    if (response.status === 200) {
      const { nome: name, email } = response.data;
      return { name, email };
    } else {
      throw new ApiError(response.status, "Fail on singIn", response);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getSession () : Promise<IUser | undefined> {
  try {
    const response = await chronoSimplesClient.GET(BASE_URI);
    if (response.status === 200) {
      const { nome: name, email } = response.data;
      return { name, email};
    } else {
      throw new ApiError(response.status, "Fail to get session", response);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function signOut () : Promise<IUser | undefined> {
  try {

    const response = await chronoSimplesClient.DELETE(BASE_URI);

    if (response.status === 200) {
      const { nome: name, email } = response.data;
      return { name, email};
    } else {
      throw new ApiError(response.status, "Fail on signOut", response);
    }
  } catch (e) {
    console.error(e);
  }
}

export default {
  signIn,
  signOut,
  getSession
}
