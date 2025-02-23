export function AddEvent(eventName: EventName, callback: (...args: any[]) => void) {
    EventManager.addEventListener(EventName[eventName], callback);
}

export class EventManager {
    private eventMap: Map<string, Array<(...args: any[]) => void>> = new Map<string, Array<(...args: any[]) => void>>();
    private static instance: EventManager;
    private static get Instance() {
        if (EventManager.instance == undefined) {
            EventManager.instance = new EventManager();
        }

        return EventManager.instance;
    }

    public static addEventListener(signalKey: string, callback: (...args: any[]) => void) {
        if (!this.Instance.eventMap.has(signalKey)) {
            this.Instance.eventMap.set(signalKey, []);
        }
        this.Instance.eventMap.get(signalKey)?.push(callback);
    }

    public static dispathEvent(eventName: EventName, ...args: any[]) {
        let timer = setTimeout(() => {
            this.Instance.dispatch(EventName[eventName], ...args);
            clearTimeout(timer)
            timer = null;
        }, 0);
    }

    private dispatch(key: string, ...args: any[]) {
        if (this.eventMap.has(key)) {
            const eventFuncs = this.eventMap.get(key) || [];
            for (const fn of eventFuncs) {
                fn(...args); // 傳遞多個參數
            }
        }
    }
}

export enum EventName {
    KeyDown,
    KeyUp,
}