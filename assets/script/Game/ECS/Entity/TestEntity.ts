import { MoveCompent } from "../Compent/MoveCompent";
import { EntityBase } from "./Base/EntityBase";

export class TestEntity extends EntityBase {

    protected start(): void {
        this.addComp(MoveCompent);
    }

}