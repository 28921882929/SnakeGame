import { Component, Prefab, Node } from "cc";
import { ICompentData } from "../../Compent/Base/ICompentData";
import { PoolManager } from "../../../../FrameWork/Manager/PoolManager";
import { World } from "../../World";

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
     * 实体激活状态
     */
    

    /**
     * 挂载组件Map
     */
    private _compentMap: Map<string, ICompentData> = new Map<string, ICompentData>();
    /**
     * 添加组件
     * @param compent 
     */
    public addComp<T extends ICompentData>(compent: new () => T) {
        let comp = PoolManager.Get(compent);
        this._compentMap.set(comp.name, comp);
    }
    /**
     * 移除组件
     * @param string 
     */
    public removeComp<T extends ICompentData>(compent: new () => T) {
        let comp = this._compentMap.delete(compent.name);
        PoolManager.Put(comp);
    }

    public getComp(string: string): ICompentData {
        return this._compentMap.has(string) && this._compentMap.get(string);
    }

    public hasComp(string: string): boolean {
        return this._compentMap.has(string);
    }

}

export function createEntity<T extends EntityBase>(entity: new () => T, node: Node | Prefab, id: string): T {
    let entityNode = PoolManager.GetPrefab(node);
    let entityComp = entityNode.getComponent(entity);
    if (entityComp == null) {
        entityComp = entityNode.addComponent(entity);
    }
    entityComp.init(id);
    World.Instance.entityMap.set(entityComp.entityId, entityComp);
    return entityComp;
}