import { CompentType } from "../Compent/Base/ICompentData";
import { MoveCompent } from "../Compent/MoveCompent";
import { World } from "../World";
import { ISystemBase, SystemType } from "./Base/ISystemBase";

export class MoveSystem implements ISystemBase {

    name: string = SystemType.Move_System;

    Update(dt: number): void {
        World.Instance.entityMap.forEach((entity, _key) => {
            if (!entity.enabled) return;
            let comp = entity.getComp(CompentType.Move_Compent) as MoveCompent
            if (comp && comp.enabeld) {
                entity.node.position = entity.node.position.add3f(comp.direction.x * comp.speed * dt, comp.direction.y * comp.speed * dt, 0);
            }
        });
    }

}