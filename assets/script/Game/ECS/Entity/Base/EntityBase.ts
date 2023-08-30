import { Component } from "cc";
import { ICompentData } from "../../Compent/Base/ICompentData";

export class EntityBase extends Component {

    /**
     * 实体ID
     */
    private _entityId: string = "";
    public get entityId(): string {
        return this._entityId;
    }
    constructor(id: string) {
        super();
        this._entityId = id;
        this.node.name = id;
    }
    /**
     * 挂载组件Map
     */
    private _compentMap: Map<string, ICompentData> = new Map<string, ICompentData>();
    /**
     * 添加组件
     * @param compent 
     */
    public addComp<T extends ICompentData>(compent: new () => T) {
        let comp = new compent();
        this._compentMap.set(comp.name, comp);
    }
    /**
     * 移除组件
     * @param string 
     */
    public removeComp(string: string) {
        this._compentMap.delete(string);
    }

    public getComp(string: string): ICompentData {
        return this._compentMap.has(string) && this._compentMap.get(string);
    }

    public hasComp(string: string): boolean {
        return this._compentMap.has(string);
    }

}