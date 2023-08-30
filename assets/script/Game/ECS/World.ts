import { Component, EventTouch, Node, _decorator, v3 } from "cc";
import { ISystemBase, createSystem } from "./System/Base/ISystemBase";
import { EntityBase, createEntity } from "./Entity/Base/EntityBase";
import { NotificationManager } from "../../FrameWork/Manager/NotificationManager";
import { TouchEventType } from "../../FrameWork/Manager/TouchManager";
import { PoolManager } from "../../FrameWork/Manager/PoolManager";
import { CompentType } from "./Compent/Base/ICompentData";
import { MoveCompent } from "./Compent/MoveCompent";
import { MoveSystem } from "./System/MoveSystem";
import { TestEntity } from "./Entity/TestEntity";
const { ccclass, property } = _decorator;
@ccclass('World')
export class World extends Component {

    public systemMap: Map<string, ISystemBase> = new Map<string, ISystemBase>();
    public entityMap: Map<string, EntityBase> = new Map<string, EntityBase>();

    public static Instance: World = null;
    protected onLoad(): void {
        World.Instance = this;
    }

    @property(Node)
    tset_node: Node = null;
    protected start(): void {
        PoolManager.PutPrefab(this.tset_node);
        for (let i = 0; i < 100; i++) {
            let entity = createEntity(TestEntity, this.tset_node, "TestEntity_" + i);
            entity.node.parent = this.node;
            entity.node.position = v3(Math.random() * 1000, Math.random() * 1000, 0);
        }
        createSystem(MoveSystem);
    }

    protected update(dt: number): void {
        this.systemMap.forEach((system, _key) => {
            system.Update(dt);
        });
    }

}