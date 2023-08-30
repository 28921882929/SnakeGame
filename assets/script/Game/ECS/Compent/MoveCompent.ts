import { Vec3 } from "cc";
import { CompentType, ICompentData } from "./Base/ICompentData";

export class MoveCompent implements ICompentData {
    public enabeld: boolean = true;
    public speed: number = 0;
    public direction: Vec3 = Vec3.ZERO;
    public name: string = CompentType.Move_Compent;
}