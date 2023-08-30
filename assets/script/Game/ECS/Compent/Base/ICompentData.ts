export interface ICompentData {
    name: string;
    enabeld: boolean;
    Init?(): void;
}
export enum CompentType {
    Move_Compent = "MoveCompent",
}

