import { Vec3 } from "cc";
import { IComponentData } from "./Base/IComponentData";

export class MoveComponent implements IComponentData {
    public speed: number = 0;
    public direction: Vec3 = Vec3.ZERO;
}