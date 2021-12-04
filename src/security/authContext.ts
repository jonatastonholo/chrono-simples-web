import React, { useContext } from "react";
import { IUser } from "../domain/IUser";

export interface IAuthContext {
  user: IUser | undefined | null;
  onSignOut: () => void;
}

export const authContext = React.createContext<IAuthContext>({
  user: {
    name: "",
    email: "",
  },
  onSignOut: () => {},
});

export function useAuthContext() {
  return useContext(authContext);
}
