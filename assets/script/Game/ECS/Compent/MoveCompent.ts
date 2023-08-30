import { Vec3 } from "cc";
import { CompentType, ICompentData } from "./Base/ICompentData";

export class MoveCompent implements ICompentData {
    public speed: number = 0;
    public direction: Vec3 = Vec3.ZERO;
    public name: string = CompentType.Move_Compent;
    constructor() {
        this.Init();
    }
    Init(): void {
        this.speed = 0;
        this.direction = Vec3.ZERO;
    }
}