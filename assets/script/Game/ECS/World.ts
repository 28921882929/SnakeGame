import { Component } from "cc";
import { ISystemBase } from "./System/Base/ISystemBase";
import { EntityBase } from "./Entity/Base/EntityBase";

export class World extends Component {

    private systemMap: Map<string, ISystemBase> = new Map<string, ISystemBase>();
    private entityMap: Map<string, EntityBase> = new Map<string, EntityBase>();

    public updateEntityArray: Array<EntityBase> = new Array<EntityBase>();
    public upadteSystemArray: Array<ISystemBase> = new Array<ISystemBase>();

    public static Instance: World = null;
    protected onLoad(): void {
        World.Instance = this;
    }

    protected start(): void {
        
    }

    protected update(dt: number): void {
        this.upadteSystemArray.forEach((system: ISystemBase) => {
            system.Update(dt);
        });
    }
}