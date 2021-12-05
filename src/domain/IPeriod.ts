import {IProject} from "./IProject";

export interface IPeriod {
  id: string;
  project: IProject;
  description: string;
  hourValue: number;
  currency: string;
  begin: Date;
  end: Date;
}
