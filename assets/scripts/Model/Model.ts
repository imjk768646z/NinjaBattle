export enum ModelKey {
    JoinPacket,
    PlayerUUID,
}

const ModelMap: Map<string, any> = new Map<string, any>();

function transferKey(key: string | ModelKey): string {
    let tempKey = '';
    if (typeof (key) != 'string') tempKey = ModelKey[key];
    else tempKey = key;

    return tempKey;
}

export function getValue<Type>(key: string | ModelKey): Type {
    let tempKey = transferKey(key);

    if (ModelMap.has(tempKey)) return ModelMap.get(tempKey);

    return null;
}

export function setValue<Type>(key: string | ModelKey, value: Type) {
    let tempKey = transferKey(key);
    ModelMap.set(tempKey, value);
}