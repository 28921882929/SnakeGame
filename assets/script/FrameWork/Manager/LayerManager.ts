import { Component, Node, Prefab, UIOpacity, UITransform, Vec3, _decorator, instantiate, view } from "cc";
import { toParent } from "../../Utils/CocosExtension";
const { ccclass, property } = _decorator;
export enum LayerType {
    /**
     * 无
     */
    NONE = 0,
    /**
     * UI层
     */
    UI = 1,
    /**
     * 提示层
     */
    TIP = 2,
    /**
     * 飞行层
     */
    FLY = 3,
    /**
     * 顶层
     */
    TOP = 4,
}
@ccclass('LayerManager')
export default class LayerManager extends Component {

    layer_prefab: Prefab = null;
    @property(Prefab)
    modalBlocker: Prefab = null;
    @property(Node)
    root_node: Node = null;

    private static _instance: LayerManager = null;
    private static layerMap: Map<LayerType, Node> = new Map<LayerType, Node>();
    public static get instance(): LayerManager {
        if (this._instance == null) {
            this._instance = new LayerManager();
        }
        return this._instance;
    }

    onLoad() {
        LayerManager._instance = this;
        this.init();
    }

    init() {
        if (this.root_node == null) return;
        let index = 0;
        for (var enumMember in LayerType) {
            if (isNaN(parseInt(enumMember))) {
                this.addLayer(index, enumMember)
                index++;
            }
        }
    }

    addLayer(index: number, name: string) {
        if (this.root_node == null) return;
        let layer = instantiate(this.layer_prefab);
        layer.name = name;
        layer.parent = this.root_node;
        layer.setSiblingIndex(index);
        let ws = view.getVisibleSize();
        let uitransform = layer.getComponent(UITransform);
        if (!uitransform) uitransform = layer.addComponent(UITransform);
        uitransform.width = ws.width;
        uitransform.height = ws.height;
        LayerManager.layerMap.set(index, layer);
    }

    getLayer(layer: LayerType): Node {
        if (LayerManager.layerMap.has(layer)) {
            return LayerManager.layerMap.get(layer);
        }
        return null;
    }

    /**
     * 设置层级
     * @param layer 层级
     * @param node 设置节点
     */
    setLayer(layer: LayerType, node: Node) {
        if (node == null) return;
        if (layer == LayerType.NONE) {
            node.removeFromParent();
            return;
        }
        let layernode = this.getLayer(layer);
        if (!node.parent) {
            node.parent = layernode;
            node.position = Vec3.ZERO;
        } else {
            toParent(node, layernode);
        }
    }

    /**
     * 创建蒙版
     * @param modalAlpha 蒙版透明度
     * @param onClick 点击回调
     * @returns 
     */
    public createModaler(modalAlpha: number = 0.75, onClick: Function = null): Node {
        if (this.modalBlocker) {
            var blocker: Node = instantiate(this.modalBlocker);
            if (onClick) {
                blocker.on(Node.EventType.TOUCH_END, onClick);
            }
            let uiopacity = blocker.getComponent(UIOpacity);
            if (!uiopacity) uiopacity = blocker.addComponent(UIOpacity);
            uiopacity.opacity = modalAlpha * 255;
            return blocker;
        }
        return null;
    }
}
