import { _decorator, Component, Node } from 'cc';
import { SoundManager } from '../FrameWork/Manager/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {

    start() {
        SoundManager.addSound("bgm", "sound/bgm", true);
        SoundManager.playMusic("bgm");
    }

    update(deltaTime: number) {

    }
}

