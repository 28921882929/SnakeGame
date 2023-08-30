import { EventTouch, _decorator, v3 } from "cc";
import { NotificationManager } from "../../../FrameWork/Manager/NotificationManager";
import { TouchEventType } from "../../../FrameWork/Manager/TouchManager";
import { MoveCompent } from "../Compent/MoveCompent";
import { EntityBase } from "./Base/EntityBase";
import { CompentType } from "../Compent/Base/ICompentData";
const { ccclass, property } = _decorator;
@ccclass('TestEntity')
export class TestEntity extends EntityBase {

    protected onLoad(): void {
        NotificationManager.add(TouchEventType.Touch_Start, this.onTouchStart, this);
        this.addComp(MoveCompent);
    }

    onTouchStart(event: EventTouch) {
        console.log("changeVec: " + event);
        let moveComp = this.getComp(CompentType.Move_Compent) as MoveCompent;
        let targetPos = v3(event.getLocation().x, event.getLocation().y, 0);
        this.node.inverseTransformPoint(targetPos, targetPos);
        moveComp.direction = v3(targetPos.x, targetPos.y, 0).subtract(this.node.position).normalize();
        moveComp.speed = 200;
    }

}