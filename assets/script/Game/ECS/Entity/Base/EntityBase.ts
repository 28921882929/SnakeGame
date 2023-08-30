import { Component } from "cc";
import { ICompentData } from "../../Compent/Base/ICompentData";

export class EntityBase extends Component {

    /**
     * 实体ID
     */
    private _entityId: number = 0;
    public get entityId(): number {
        return this._entityId;
    }
    public set entityId(value: number) {
        this._entityId = value;
    }
    /**
     * 挂载组件Map
     */
    private _compentMap: Map<string, ICompentData> = new Map<string, ICompentData>();
    // addComponent<T extends Component>(classConstructor: __private._types_globals__Constructor<T>): T | null;
    public addCompent<T extends ICompentData>(compent: T) {
        let comp = new compent();
        this._compentMap.set(comp.name, comp);
    }

    public removeCompent(string: string) {

    }

    public getCompent(string: string): ICompentData {
        return this._compentMap.has(string) && this._compentMap.get(string);
    }

    public hasCompent(string: string): boolean {
        return this._compentMap.has(string);
    }

}