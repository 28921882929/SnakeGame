export interface ISystemBase {
    Start(): void;
    Update(dt: number): void;
    Pause?(): void;
    Resume?(): void;
    Stop?(): void;
}
