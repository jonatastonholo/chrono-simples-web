import { IUser } from "../domain/IUser";
import sessionClient from "../external/crhono-simples-api/session.client"

export async function signIn(email: string, password: string): Promise<IUser | undefined> {
  return await sessionClient.signIn(email, password);
}

export async function getSession () : Promise<IUser | undefined> {
  return await sessionClient.getSession();
}

export async function signOut () : Promise<IUser | undefined> {
  return await sessionClient.signOut();
}
