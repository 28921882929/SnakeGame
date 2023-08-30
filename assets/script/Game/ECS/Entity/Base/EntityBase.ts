import { Component } from "cc";
import { PoolManager } from "../../../../FrameWork/Manager/PoolManager";
import { IComponentData } from "../../Component/Base/IComponentData";

export class EntityBase extends Component {

    /**
     * 实体ID
     */
    private _entityId: string = "";
    public get entityId(): string {
        return this._entityId;
    }

    public init(id: string) {
        this._entityId = id;
        this.node.name = id;
    }
    /**
     * 挂载组件Map
     */
    private _ComponentMap: Map<any, IComponentData> = new Map<any, IComponentData>();
    /**
     * 添加组件
     * @param Component 
     */
    public addComp<T extends IComponentData>(type: new () => T) {
        let comp = PoolManager.Get(type);
        this._ComponentMap.set(type, comp);
    }
    /**
     * 移除组件
     * @param string 
     */
    public removeComp<T extends IComponentData>(type: new () => T) {
        let comp = this._ComponentMap.delete(type);
        PoolManager.Put(comp);
    }

    public getComp<T extends IComponentData>(type: new () => T): T {
        let comp = this._ComponentMap.has(type) && this._ComponentMap.get(type);
        return comp as T;
    }

    public hasComp<T extends IComponentData>(type: new () => T): boolean {
        return this._ComponentMap.has(type);
    }

}