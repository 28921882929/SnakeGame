import { World } from "../../World";

export interface ISystemBase {
    name: string;
    Start?(): void;
    Update(dt: number): void;
    Pause?(): void;
    Resume?(): void;
    Stop?(): void;
}

export function createSystem<T extends ISystemBase>(system: { new(): T; }): T {
    let sys = new system();
    World.Instance.systemMap.set(sys.name, sys);
    return sys;
}

export enum SystemType {
    Move_System = "Move_System",
}