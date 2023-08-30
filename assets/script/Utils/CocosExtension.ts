import { Label, Layout, Node, RichText, Vec2, Vec3, sys, v2, v3 } from "cc";
import { WECHAT_MINI_PROGRAM } from "cc/env";

//延时
export async function delay(milliseconds: number) {
    return new Promise((resolve, reject) =>
        setTimeout(() => resolve(null), milliseconds));
}

//函数截流
export function throttle(fn: Function, wait: number) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args);
                timer = null;
            }, wait);
        }
    }
}

//可取消的promise
export function promiseCancelable(promise: Promise<any>): { promise: Promise<any>, cancel?: Function } {
    let hasCanceled = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) =>
            hasCanceled ? reject({ isCanceled: true }) : resolve(val)
        );
        promise.catch((error) =>
            hasCanceled ? reject({ isCanceled: true }) : reject(error)
        );
    });
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled = true;
        },
    };
};

//是否同一天
export function isSameDay(time1: number, time2: number): boolean {
    return new Date(time1).toDateString() == new Date(time2).toDateString();
}

//比较版本号(1表示v1比v2新，0表示相同，-1表示比v2要老)
export function compareVersion(v1, v2) {
    let v1value = v1.split('.').map((v, index) => parseInt(v) * Math.pow(1000, 2 - index)).reduce((a, b) => a + b, 0);
    let v2value = v2.split('.').map((v, index) => parseInt(v) * Math.pow(1000, 2 - index)).reduce((a, b) => a + b, 0);
    if (v1value > v2value) {
        return 1;
    } else if (v1value < v2value) {
        return -1;
    } else {
        return 0;
    }
}

//随机种子随机数
let randomSeed: number = 5;
export function seedRandom(seed?: number): number {
    if (seed != undefined) {
        randomSeed = seed;
    }
    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    let rnd = randomSeed / 233280.0;
    return rnd;
}

export function seedRandomInt(min: number, max: number, seed?: number): number {
    max = max || 1;
    min = min || 0;
    let rnd = seedRandom(seed);
    return Math.floor(min + rnd * (max - min));   // Math.ceil实现取整功能，可以根据需要取消取整
}

//放到别的容器
export function toParent(node: Node, parent: Node): void {
    if (parent == node.parent) {
        return;
    }
    let pos = convertPosition(node, parent);
    node.parent = parent;
    node.setPosition(v3(pos.x, pos.y));
}

//获取相对坐标
export function convertPosition(nodeOrWorldPos: Node | Vec2, parent: Node): Vec2 {
    let pos: Vec3 = v3();
    if (nodeOrWorldPos instanceof Node) {
        if (nodeOrWorldPos.isValid && nodeOrWorldPos.parent) {
            pos = nodeOrWorldPos.parent.worldPosition;
        }
    } else {
        pos = v3(nodeOrWorldPos.x, nodeOrWorldPos.y);
    }
    parent.inverseTransformPoint(pos, pos);
    return v2(pos.x, pos.y);
}

//立马更新
export function updateNow(node: Node) {
    let label = node.getComponent(Label);
    if (label) {
        label["_forceUpdateRenderData"]();
        return;
    }
    let richText = node.getComponent(RichText);
    if (richText) {
        node["_activeInHierarchy"] = true;
        richText["_updateRichText"]();
        return;
    }
    let layout = node.getComponent(Layout);
    if (layout) {
        layout.updateLayout()
        return;
    }
}


//执行函数
export function invokeCallback(cb, ...arg: any[]) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
}

/**随机int(左闭右开)*/
export function randomInt(min, max) {
    return Math.floor(randomNumber(min, max));
}

export function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

//范围内取值
export function rangeValue(value, min, max) {
    value = Math.max(min, value);
    value = Math.min(max, value);
    return value;
}

/**二维数组转置 */
export function switchMatt(arr: any[][]) {
    let result = arr[0].map(function (col, i) {
        return arr.map(function (row) {
            return row[i];
        })
    });
    return result;
}

/**
 * 洗牌算法
 * @param arr 数组
 * @param flag 是否影响原数组
 * @returns 
 */
export function shuffle(arr: any[], isEffectSrc = false) {
    let newArr = [];
    let cloneArr: Function = (arr: any[]) => {
        return arr.slice(0);
    }
    isEffectSrc ? (newArr = arr) : (newArr = cloneArr(arr));
    let getRandom: Function = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    for (let i = 0; i < newArr.length; i++) {
        let j = getRandom(0, i);
        let temp = newArr[i];
        newArr[i] = newArr[j];
        newArr[j] = temp;
    }
    return newArr;
}

/**
 * 随机权重
 * @param element 元素组
 * @param weight 权重组
 * @returns 返回随机元素的索引
 */
export function randomByWeight(element: any[], weight: number[]): number {
    if (element.length != weight.length) {
        console.error('权重随机输入参数长度不等');
        return;
    }
    let sum = 0;
    weight.forEach(v => sum += v);
    let rand = Math.random() * sum;
    let tmp = weight[0];
    for (let i = 1; i < weight.length; i++) {
        if (rand < tmp) return i - 1;
        tmp += weight[i];
    }
    return weight.length - 1;
}

/**获得两个时间戳的差值 单位ms */
export function getDeltaTime(curTime: number, lastTime: number): number {
    return curTime - lastTime;
}

export function getBit(value: number, bit: number = 1): string {
    return value.toFixed(bit);
}

/**格式化自动换行 */
export function formatStrEnter(str: string, format: number = 10, isRichtext: boolean = false): string {
    let enter: string = isRichtext ? '<br/>' : '\n';
    let sig: string[] = [];
    let count: number = 0;
    let start = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            count += 2;
        }
        else count++;
        if (count >= format) {
            sig.push(str.slice(start, i));
            start = i;
            count = 0;
        }
    }
    sig.push(str.slice(start));
    let result: string = '';
    for (let i = 0, l = sig.length; i < l; i++) {
        result += sig[i];
        if (i < l - 1) result += enter;
    }
    return result;
}

/**格式化长名字 */
export function formatLongName(str: string, limit: number = 0): string {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            len += 2;
        } else {
            len++;
        }
        if (len >= limit) {
            str = str.slice(0, i + 1) + '...';
            break;
        }
    }

    return str;
}

/**格式化数值逗号 */
export function formatNumberDot(num: number) {
    let data = (num || 0).toString();
    let result = '';
    while (data.length > 3) {
        result = ',' + data.slice(-3) + result;
        data = data.slice(0, data.length - 3);
    }
    if (data) { result = data + result; }
    return result;
}

/**格式化时间 返回字符串’w天x小时y分钟z秒‘*/
export function formatTimeHMS_str(time: number, isChinese: boolean = true, isDay: boolean = false, length: number = 0) {
    time = ~~time;
    let data = formatTimeHMS(time);
    let res = '';
    let len = 0;
    if (data.hour > 23 && isDay) {
        let days = ~~(data.hour / 24);
        res += days + (isChinese ? '天' : 'd');
        data.hour -= days * 24;
        len++;
    }
    if (data.hour > 0 && (!length || len < length)) {
        res += data.hour + (isChinese ? '小时' : 'h');
        len++;
    }
    if (data.min > 0 && (!length || len < length)) {
        res += data.min + (isChinese ? '分钟' : 'm');
        len++;
    }
    if (data.sec > 0 && (!length || len < length)) {
        res += data.sec + (isChinese ? '秒' : 's');
        len++;
    }
    return res;
}

/**格式化时间 返回小时分钟秒钟对象 */
export function formatTimeHMS(time: number) {
    let hour = ~~(time / 3600);
    time %= 3600;
    let min = ~~(time / 60);
    time %= 60;
    let sec = time;
    return { hour: hour, min: min, sec: sec };
}

/**
 * 格式化时间为小时
 * @param time 时间
 * @param type 时间单位
 */
export function formatHour(time: number, type: string = 'second'): string {
    if (type == 'micosecond') time /= 3600000;
    else if (type == 'second') time /= 3600;
    else if (type == 'minute') time /= 60;
    //取小数点后两位
    let tmp = ('' + time).split('.');
    return '' + tmp[0] + '.' + (tmp[1] ? tmp[1].substr(0, 2) : '0');
}

/**
 * 格式化时间(形式:'xxhxxmxxs')
 * @param time 秒
 * @param includeHour 是否包含小时(形式:'xx:xx:xx')
 */
export function formatMinuteUnit(time: number, includeHour: boolean = false): string {
    time = ~~time;
    let hour = ~~(time / 3600);
    if (includeHour) time %= 3600;
    let min = ~~(time / 60);
    let second = time % 60;
    let res = '';
    if (includeHour) {
        if (hour > 0) res += hour + 'h';
    }
    if (min > 0) {
        res += min + 'm';
    }
    if (second > 0) {
        res += second + 's';
    }
    return res;
}

/**
 * 格式化时间(形式:'xx:xx')
 * @param time 秒
 * @param includeHour 是否包含小时(形式:'xx:xx:xx')
 */
export function formatMinute(time: number, includeHour: boolean = false): string {
    time = ~~time;
    let hour = ~~(time / 3600);
    if (includeHour) time %= 3600;
    let min = ~~(time / 60);
    let second = time % 60;
    let res = '';
    if (includeHour) {
        if (hour < 10) res += '0';
        res += '' + hour + ':';
    }
    if (min < 10) res += '0';
    res += '' + min + ':';
    if (second < 10) res += '0';
    res += '' + second;
    return res;
}

export function zero(t) {
    return t > 9 ? t : ('0' + t);
}
export function formateDate(time: Date) {
    // 1. 获取到年 月 日 小时 分钟 秒
    //  并且给需要的时间 补0
    var year = time.getFullYear();
    var month = zero(time.getMonth() + 1);
    var day = zero(time.getDate());
    var hours = zero(time.getHours());
    var mins = zero(time.getMinutes());
    var seconds = zero(time.getSeconds());
    // 2. 拼接字符串
    return year + '/' + month + '/' + day + ' ' + hours + ':' + mins;
}

export function date2BeijingUnixMilli(date: number | Date): Date {
    const eightHour = 8 * 3600 * 1000
    if (typeof date === "number") {
        const d = new Date(date)
        const offset = d.getTimezoneOffset() * 60 * 1000
        d.setTime(d.getTime() + offset + eightHour)
        return d
    } else {
        const offset = date.getTimezoneOffset() * 60 * 1000
        date.setTime(date.getTime() + offset + eightHour)
        return date
    }
}

//随机不重复int
export function randomInts(min, max, count) {
    let arr = [];
    count = Math.min(max - min + 1, count);
    for (var i = min; i <= max; i++) {
        arr.push(i);
    }
    arr.sort(function () { return 0.5 - Math.random(); });
    arr.length = count;
    return arr;
}

export function segmentFunc(source: number, limit: number) {
    if (source > limit) return limit;
    else return source;
}

//移除数组中的某个元素
export function removeFromArr(arr: any[], element: any) {
    let idx: number = 0;
    idx = arr.indexOf(element);
    if (idx != -1) arr.splice(idx, 1);
}

//数组去重
export function uniqueArr(arr: number[]) {
    let result = [];
    let hash = {};
    for (let i = 0; i < arr.length; i++) {
        if (!hash[arr[i]]) {
            hash[arr[i]] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

//字符串是否为空或空格
export function isNullEmptyOrSpace(str: string) {
    if (str == null) return true;
    return str.replace(/\s/g, '').length == 0;
}

// //js对象转查询字符串
// export function obj2Urlstr(params: any) {
//     if (isApp()) {
//         return Object.keys(params).map(key => {
//             return "".concat(key, "=").concat(params[key].toString());
//         }).join('&');
//     } else {
//         return Object.keys(params).map(key => {
//             return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(params[key]));
//         }).join('&');
//     }
// }

//map转object
export function mapToObj(strMap) {
    let obj = Object.create(null);
    strMap.forEach((v, k) => {
        obj[k] = v;
    });
    return obj;
}

//object转map
export function objToMap(obj, keyIsNum: boolean = false) {
    let strMap = new Map();
    Object.keys(obj).forEach(k => {
        if (keyIsNum) strMap.set(parseInt(k), obj[k]);
        else strMap.set(k, obj[k]);
    });
    return strMap;
}

//uint8转int32
export function byteToInt(value) {
    let r = 0;
    r = (value[0] << 24) + (value[1] << 16) + (value[2] << 8) + (value[3]);
    return r;
}

export function isValue(data: any): boolean {
    if (data !== undefined && data !== null) return true;
    else return false;
}

//是否微信平台
export function isWX() {
    return WECHAT_MINI_PROGRAM;
}
