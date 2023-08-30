import { AudioClip, AudioSource, Component, _decorator } from "cc";
import { loadRes } from "./ResourceManager";
const { ccclass, property } = _decorator;
export class SoundObj {
    name: string;
    path: string;
    audio?: AudioClip;
    isMusic: boolean;
}
export class SoundManager {

    private static musicVolume: number = 1;
    private static effectVolume: number = 1;

    private static musicAudioSourArr: AudioSource[] = [];
    private static effectAudioSourArr: AudioSource[] = [];
    private static allAudioMap: Map<string, SoundObj> = new Map<string, SoundObj>();

    public static currMusic: string = null;

    public static addSound(name: string, path: string, isMusic: boolean = false) {
        let sound = new SoundObj();
        sound.name = name;
        sound.path = path;
        sound.isMusic = isMusic;
        this.allAudioMap.set(name, sound);
    }

    public static async preloadAudio(name: string): Promise<AudioClip> {
        let sound: SoundObj = this.allAudioMap.get(name);
        if (!sound) {
            console.error("sound not find : " + name);
            return null;
        }
        if (!sound.audio) {
            sound.audio = await loadRes(AudioClip, sound.path);
            sound.audio.name = name;
        }
        return sound.audio;
    }

    public static async getClip(name: string): Promise<AudioClip> {
        let audio = await this.preloadAudio(name);
        if (audio) {
            return audio;
        }
    }

    public static async getSource(name: string, isMusic: boolean = false): Promise<AudioSource> {
        let arry = isMusic ? this.musicAudioSourArr : this.effectAudioSourArr;
        for (let i = 0; i < arry.length; i++) {
            let soure = arry[i];
            if (!soure.playing || soure.clip.name == name) {
                return soure;
            }
        }
        let soure = new AudioSource();
        arry.push(soure);
        return soure;
    }

    public static async playMusic(name: string, loop: boolean = true) {
        let soure = await this.getSource(name, true);
        if (soure) {
            soure.clip = await this.getClip(name);
            soure.loop = loop;
            soure.play();
            soure.volume = this.musicVolume;
            this.currMusic = name;
        }
    }

    public static async playEffect(name: string) {
        let soure = await this.getSource(name);
        if (soure) {
            soure.clip = await this.getClip(name);
            soure.volume = this.effectVolume;
            soure.playOneShot(soure.clip);
        }
    }

    public static stopMusic() {
        this.musicAudioSourArr.forEach((soure) => {
            if (soure.playing) soure.stop();
        });
    }

    public static stopEffect() {
        this.effectAudioSourArr.forEach((soure) => {
            if (soure.playing) soure.stop();
        });
    }

    public static setMusicVolume(volume: number) {
        if (this.musicVolume == volume) return;
        this.musicVolume = volume;
        this.musicAudioSourArr.forEach((soure) => {
            soure.volume = volume;
        });
    }

    public static setEffectVolume(volume: number) {
        if (this.effectVolume == volume) return;
        this.effectVolume = volume;
        this.effectAudioSourArr.forEach((soure) => {
            soure.volume = volume;
        });
    }

}