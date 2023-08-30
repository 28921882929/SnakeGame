import { SoundManager } from "../Manager/SoundManager";

export class SoundRegister {

    public static register(name: string, path: string, isMusic: boolean = false) {
        SoundManager.addSound(name, path, isMusic);
    }

    public static init() {
        this.register("bgm", "sound/bgm", true);
        this.register("effect", "sound/effect");
    }
}

export enum SoundType {
    BGM = "bgm",
    EFFECT = "effect",
}