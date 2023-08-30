import { EventTouch, _decorator, v3 } from "cc";
import { NotificationManager } from "../../../FrameWork/Manager/NotificationManager";
import { TouchEventType } from "../../../FrameWork/Manager/TouchManager";
import { EntityBase } from "./Base/EntityBase";
import { MoveComponent } from "../Component/MoveCompent";
const { ccclass, property } = _decorator;
@ccclass('TestEntity')
export class TestEntity extends EntityBase {

    protected onLoad(): void {
        NotificationManager.add(TouchEventType.Touch_Start, this.onTouchStart, this);
        this.addComp(MoveComponent);
    }

    onTouchStart(event: EventTouch) {
        console.log("changeVec: " + event);
        let moveComp = this.getComp(MoveComponent);
        let targetPos = v3(event.getLocation().x, event.getLocation().y, 0);
        this.node.inverseTransformPoint(targetPos, targetPos);
        moveComp.direction = v3(targetPos.x, targetPos.y, 0).subtract(this.node.position).normalize();
        moveComp.speed = 300;   
    }

}