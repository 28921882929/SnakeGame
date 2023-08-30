import { Asset, AssetManager, Node, Prefab, Sprite, SpriteFrame, Texture2D, assetManager, instantiate, sp } from "cc";

//设置默认图片
var defaultImage: SpriteFrame;
var resVersion: string;
export function initResLoader(defaultImg: SpriteFrame, version: string) {
    defaultImage = defaultImg;
    resVersion = version;
    registerHeadImgLoader();
}
//加载bundle包


export async function loadBundle(name: string): Promise<AssetManager.Bundle> {
    return new Promise<AssetManager.Bundle>((resolve, reject) => {
        let version = (name == "gameAsset" || name == "resources" || name == "miniGame") ? "" : resVersion;
        assetManager.loadBundle(name, { version: version }, (err, bundle: AssetManager.Bundle) => {
            if (err) {
                console.error("loadBundle error", err);
                reject();
            } else {
                resolve(bundle);
            }
        });
    });
}
/**
 * 释放bundle
 * @param name
 */

export function releaseBundle(name: AssetManager.Bundle | string) {
    if (typeof (name) == "string") {
        let bundle = assetManager.getBundle(name);
        if (bundle)
            bundle.releaseAll();
    }
    else {
        // 小游戏列表可能没有这个
        name?.releaseAll?.();
    }
}
//加载资源
let bundleList = ["resources"];
export async function loadRes<T extends Asset>(type: new () => T, path: string): Promise<T> {
    if (!path)
        return null;
    let bundles = bundleList;
    for (let i = 0; i < bundles.length; i++) {
        const name = bundles[i];
        let res = await loadBundleRes(type, path, name);
        if (res != null) {
            return res;
        }
    }
    console.warn("loadRes err", path);
    return null;
}
//预加载资源

export async function preloadRes<T extends Asset>(type: new () => T, path: string): Promise<boolean> {
    if (!path)
        return false;
    let bundles = bundleList;
    for (let i = 0; i < bundles.length; i++) {
        const name = bundles[i];
        let res = await preloadBundleRes(type, path, name);
        if (res) {
            return res;
        }
    }
    console.warn("loadRes err", path);
    return false;
}
//加载bundle资源
export async function loadBundleRes<T extends Asset>(type: new () => T, path: string, bundleName: string): Promise<T> {
    let promise = new Promise<T>(async (resolve) => {
        let res = getRes(type, path, bundleName);
        if (res != null) {
            resolve(res);
            return;
        }
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            bundle = await loadBundle(bundleName);
        }
        if (!bundle.getInfoWithPath(path)) {
            path = null;
        }
        if (path) {
            bundle.load(path, <any>type, (err, asset) => {
                resolve(err ? null : asset as T);
            });
        } else {
            resolve(null);
        }
    });
    return promise;
}

export async function preloadBundleRes<T extends Asset>(type: new () => T, path: string, bundleName: string): Promise<boolean> {
    let promise = new Promise<boolean>(async (resolve) => {
        let res = getRes(type, path, bundleName);
        if (res != null) {
            resolve(true);
            return;
        }
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            bundle = await loadBundle(bundleName);
        }
        if (!bundle.getInfoWithPath(path)) {
            resolve(null);
        } else {
            bundle.preload(path, <any>type, (err, asset) => {
                resolve(err ? false : true);
            });
        }
    });
    return promise;
}

export function getRes<T extends Asset>(type: new () => T, path: string, bundle: string): T {
    if (!path)
        return null;
    let uuid = path2uuid(type, path, bundle);
    if (!uuid) {
        return null;
    }
    let res = assetManager.assets.get(uuid);
    return res ? res as T : null;
}

//加载spine
export async function loadSpine(path: string): Promise<sp.SkeletonData> {
    if (!path)
        return null;
    let res = await loadRes(sp.SkeletonData, path);
    return res;
}

// //加载图片资源，修复因为异步问题图片显示不对的bug
// export async function loadImage(target: Sprite, url: string, scaleMode: ImageFillMode = ImageFillMode.None, removeOnStart: boolean = true) {
//     if (!target || !target.node) return;
//     let res = await loadRes(SpriteFrame, url);
// }


//加载远程资源
export let remoteCache: Map<string, SpriteFrame> = new Map();
export async function loadRemote(url: string, extension: string = null, cacheMode: boolean = true): Promise<any> {
    let promise = new Promise<any>(resolve => {
        if (!url) {
            resolve(null);
            return;
        }
        let options = { cacheEnabled: cacheMode } as any;
        extension && (options.ext = extension);
        assetManager.loadRemote(url, options, (err, asset) => {
            if (err) resolve(null);
            if (asset instanceof Texture2D) {
                let spriteFrame: SpriteFrame = remoteCache.get(url);
                if (spriteFrame == null || spriteFrame["_texture"] == null) {
                    spriteFrame = new SpriteFrame();
                    spriteFrame.texture = asset;
                    remoteCache.set(url, spriteFrame);
                }
                resolve(spriteFrame);
            } else {
                resolve(asset);
            }
        });
    });
    return promise;
}

export async function loadPrefab(url: string): Promise<Node> {
    let prefab = await loadRes(Prefab, url);
    if (prefab == null) {
        console.error("loadPrefab not found prefab:" + url);
        return null;
    }
    let view = instantiate(prefab);
    return view;
}

//释放资源
export function releaseAsset(asset: Asset) {
    assetManager.releaseAsset(asset);
}

//根据文件路径获得uuid
export function path2uuid<T extends Asset>(type: new () => T, path: string, bundle: string): string {
    let bundles = assetManager.bundles;
    if (bundles.has(bundle)) {
        var bundleAsset = bundles.get(bundle);
        var info = bundleAsset.getInfoWithPath(path, type as any);
        if (info && info.redirect) {
            if (!bundles.has(info.redirect)) throw new Error(`you need to load bundle ${info.redirect} first`);
            bundleAsset = bundles.get(info.redirect);
            // info = bundleAsset.getAssetInfo(info.uuid);
        }
        return info ? info.uuid : null;
    }
}

//根据uuid获得文件路径
export function uuid2path(uuid: string): string {
    if (!uuid) return null;
    let bundles = assetManager.bundles;
    let info: any = null;
    bundles.forEach((bundle, key) => {
        if (info == null) {
            info = bundle.getAssetInfo(uuid);
        }
    })
    return info ? info.path : null;
}


/**  https://forum.microapp.bytedance.com/mini-game/posts/5f4f51290e7d0602311070b7
 * 新版本的cocos加载头像的时候，需要先下载，但是在字节小游戏平台下，会有跨域的问题。这个方法需要在进入游戏后加载前调用 
* 加载头像的用法:assetManager.loadRemote(url,{ext:headImgExt},(err,texture)=>{});
* 所有不想下载直接使用的图像都可以加上{ext:headImgExt}来使用  */
export function registerHeadImgLoader() {
    let headImgExt = ".head";
    assetManager.downloader.register(headImgExt, (content, options, onComplete) => {
        onComplete(null, content);
    });
    assetManager.parser.register(headImgExt, assetManager.downloader.downloadDomImage);
    (assetManager as any).factory.register(headImgExt, createTexture);

    function createTexture(id, data, options, onComplete) {
        let out = null,
            err = null;
        try {
            out = new Texture2D();
            out._uuid = id;
            out._nativeUrl = id;
            out._nativeAsset = data;
            console.warn("load head image end", id);
        } catch (e) {
            err = e;
            console.warn("load head image err", id, e);
        }
        onComplete && onComplete(err, out);
    }
}
