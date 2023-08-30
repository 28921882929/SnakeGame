import { _decorator, Component, instantiate, Node, Prefab, Tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;
/// <summary>
/// 对象池管理
/// </summary> 
export class PoolManager {
    private static typePools: Map<any, AbstractPool> = new Map<any, AbstractPool>();
    private static prefabPools: Map<Node | Prefab, PrefabPool> = new Map<Node, PrefabPool>();

    public static PrefabPool(prefab: Node | Prefab, maxCount: number = -1, prepareCount: number = 0): PrefabPool {
        if (!prefab)
            throw ("prefab is null");
        if (this.HasPoolPrefab(prefab)) {
            return this.prefabPools.get(prefab);
        }

        let pool = new PrefabPool();
        pool.prefab = prefab;
        pool.name = prefab.name;
        pool.MaxPoolCount = maxCount;
        pool.PrepareCount = prepareCount;
        this.prefabPools.set(prefab, pool);
        return pool;
    }

    public static GetPrefab(prefab: Node | Prefab, maxCount: number = -1, prepareCount: number = 0): Node {
        let node = this.PrefabPool(prefab, maxCount, prepareCount).Get();
        node["poolRes"] = prefab;
        node["poolType"] = "Prefab";
        node.active = true;
        let uiopacity = node.getComponent(UIOpacity);
        if (uiopacity) uiopacity.opacity = 255;
        return node;
    }

    public static PutPrefab(node: Node): boolean {
        let prefabRes = node["poolRes"];
        if (prefabRes) {
            this.GetPoolPrefab(prefabRes).Put(node);
            return true;
        } else if (node.parent) {
            node.removeFromParent();
        }
        return false;
    }

    public static PutPrefabByParent(node: Node) {
        while (node.children.length > 0) {
            PoolManager.PutPrefab(node.children[0]);
        }
    }

    public static Get<T>(type: new () => T, maxCount: number = -1, prepareCount: number = 0): T {
        let instance = this.Pool(type, maxCount, prepareCount).Get();
        instance["poolRes"] = type;
        instance["poolType"] = "Class";
        return instance;
    }

    public static Put(instance: any): boolean {
        let poolRes = instance["poolRes"];
        if (poolRes) {
            if (instance["poolType"] == "Class") {
                this.GetPool(poolRes).Put(instance);
            } else if (instance["poolType"] == "Prefab") {
                this.GetPoolPrefab(poolRes).Put(instance);
            }
            return true;
        }
        return false;
    }

    public static Pool<T>(type: new () => T, maxCount: number = -1, prepareCount: number = 0): ObjectPool<T> {
        if (this.HasPool<T>(type)) {
            this.typePools.get(type) as ObjectPool<T>;
        }

        let pool = new ObjectPool<T>(type);
        pool.name = type.name;
        pool.MaxPoolCount = maxCount;
        this.typePools.set(type, pool);
        return pool;
    }

    public static HasPoolPrefab(prefab: Node | Prefab): boolean {
        return prefab && this.prefabPools.has(prefab);
    }

    public static HasPool<T>(type: new () => T): boolean {
        return this.typePools.has(type);
    }

    public static GetPoolPrefab(prefab: Node): PrefabPool {
        if (!prefab)
            throw ("prefab");
        if (!this.HasPoolPrefab(prefab)) return;
        return this.prefabPools.get(prefab);
    }

    public static GetPool<T>(type: new () => T): ObjectPool<T> {
        if (!this.HasPool<T>(type)) return;
        return this.typePools.get(type) as ObjectPool<T>;
    }
}

export class AbstractPool {
    public name: string;
}

export class ObjectPool<T> extends AbstractPool {
    constructor(type?: any) {
        super();
        this.type = type;
    }
    private mPool: T[] = [];
    private type: any;
    private mMaxPoolCount: number = 10;
    private mPrepareCount: number = 10;

    public Get(): T {
        let obj: T;
        if (this.PoolCount > 0) {
            obj = this.mPool.pop();
        }
        else {
            obj = this.Instantiate();
        }

        return obj;
    }

    public Put(obj: T) {
        if (this.mPool.indexOf(obj) != -1) {
            return;
        }
        if (this.PoolCount < this.mMaxPoolCount || this.mMaxPoolCount < 0) {
            this.Remove(obj);
            this.mPool.push(obj);
        }
        else {
            this.Destroy(obj);
        }
    }

    protected Destroy(obj: T) {
    }

    protected Remove(obj: T) {
    }

    protected Instantiate(): T {
        let instance = new this.type();
        return instance;
    }

    protected PrepareInit() {
        if (this.PoolCount < this.mPrepareCount && this.type) {
            for (let i = 0; i < this.mPrepareCount - this.PoolCount; i++) {
                let obj = new this.type();
                this.mPool.push(obj);
            }
        }
    }

    public get PoolCount(): number {
        return this.mPool.length;
    }

    public get MaxPoolCount(): number {
        return this.mMaxPoolCount;
    }

    public set MaxPoolCount(value: number) {
        this.mMaxPoolCount = value;
    }

    public get PrepareCount(): number {
        return this.mPrepareCount;
    }

    public set PrepareCount(value: number) {
        this.mPrepareCount = value;
        this.PrepareInit();
    }

    public get PoolData(): T[] {
        return this.mPool;
    }

    public Clear() {
        this.mPool = [];
    }
}

export class PrefabPool extends ObjectPool<Node>
{
    public prefab: Node | Prefab;
    /** 实例化一个对象 */
    protected Instantiate(): Node {
        let instance = instantiate(this.prefab);
        return instance as Node;
    }

    protected Destroy(obj: Node) {
        Tween.stopAllByTarget(obj);
        obj.removeFromParent();
        obj.destroy();
    }

    protected Remove(obj: Node) {
        Tween.stopAllByTarget(obj);
        obj.removeFromParent();
    }

    protected PrepareInit() {
        if (this.PoolCount < this.PrepareCount && this.prefab) {
            for (let i = 0; i < this.PrepareCount - this.PoolCount; i++) {
                let node = instantiate(this.prefab);
                this.Put(node as Node);
            }
        }
    }

}
