import { Component, Node, _decorator, v3 } from "cc";
import { PoolManager } from "../../FrameWork/Manager/PoolManager";
import { EntityBase } from "./Entity/Base/EntityBase";
import { TestEntity } from "./Entity/TestEntity";
import { ISystemBase, createSystem } from "./System/Base/ISystemBase";
import { MoveSystem } from "./System/MoveSystem";
import { createEntity } from "../../Utils/CocosExtension";
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
