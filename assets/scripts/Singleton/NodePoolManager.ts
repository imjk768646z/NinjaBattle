import { Node, instantiate, NodePool, Prefab } from "cc";

/**
 * Node pool對象池
 */
export class NodePoolManager {
    private _nodePoolMap: Map<string, NodePool> = new Map<string, NodePool>();
    private static _instance: NodePoolManager = null;

    private constructor() {

    }

    static getNodePoolMgr() {
        if (this._instance == null) {
            this._instance = new NodePoolManager();
        }

        return this._instance;
    }

    /**
     * 檢查對象池是否存在
     * @param key 
     */
    private checkNodePool(key: string): NodePool {
        let nodePool: NodePool = null;

        if (!this._nodePoolMap.has(key)) {
            nodePool = new NodePool();
            this._nodePoolMap.set(key, nodePool);
        }
        else
            nodePool = this._nodePoolMap.get(key);

        return nodePool;
    }

    /**
     * 由對象池取出一個prefab節點
     * @param key key,一般設為遊戲名稱
     * @param parent 父節點
     * @param prefab prefab
     */
    createNode(key: string, parent: Node, prefab: Prefab): Node {
        if (key == null || prefab == null || parent == null) return;

        let nodePool = this.checkNodePool(key);
        let node: Node = null;

        if (nodePool.size() == 0) {
            node = instantiate(prefab);
        }
        else {
            node = nodePool.get();
        }

        node.parent = parent;

        return node;
    }

    /**
     * 返回一個對象並會自動從畫面上移除
     * @param key 
     * @param node 
     */
    returnNode(key: string, node: Node) {
        let nodePool = this.checkNodePool(key);
        nodePool.put(node);
    }

    onDestroy() {
        this._nodePoolMap.forEach((value, key, map) => {
            if (value.size() > 0) value.clear();
        })
    }
}
