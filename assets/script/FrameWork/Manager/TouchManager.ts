import { Component, EventTouch, Node, NodeEventType, _decorator } from "cc";
import { NotificationManager } from "./NotificationManager";
const { ccclass, property } = _decorator;
export enum TouchEventType {
    Touch_Start = "Touch_Start",
    Touch_Move = "Touch_Move",
    Touch_End = "Touch_End",
    Touch_Cancel = "Touch_Cancel",
}
@ccclass('TouchManager')
export class TouchManager extends Component {

    private static _instance: TouchManager = null;
    protected onLoad(): void {
        TouchManager._instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchCancel(event: EventTouch) {
        console.log("onTouchCancel: " + event);
        NotificationManager.dispatch(TouchEventType.Touch_Cancel, event)
    }

    onTouchEnd(event: EventTouch) {
        console.log("onTouchEnd: " + event);
        NotificationManager.dispatch(TouchEventType.Touch_End, event)
    }

    onTouchMove(event: EventTouch) {
        console.log("onTouchMove: " + event);
        NotificationManager.dispatch(TouchEventType.Touch_Move, event)
    }

    onTouchStart(event: EventTouch) {
        console.log("onTouchStart: " + event);
        NotificationManager.dispatch(TouchEventType.Touch_Start, event)
    }

}