import { AudioClip, AudioSource, Node, _decorator, assetManager, director } from "cc";

/**
 * 音效控制
 */
const { ccclass, property } = _decorator;

@ccclass
export class AudioEngineControl {
    private static instance: AudioEngineControl;
    private audioClips: Map<string, AudioClip> = new Map<string, AudioClip>();
    private playingList: Map<string, number> = new Map<string, number>();
    private audioPlayingList: Map<string, number> = new Map<string, number>();
    private musicPlayingList: Map<string, number> = new Map<string, number>();
    private defMusicVolume: number = 0.5;
    private defEffectsVolume: number = 0.5;
    private timerList: Map<string, number> = new Map<string, number>();     // 計時器列表
    private isBack: boolean = false;

    private musicSource: AudioSource;
    private effectSource: AudioSource;
    private loopSource: AudioSource;

    private constructor() {
        let audioMusic = new Node();
        audioMusic.name = 'audioMusic';
        let scene = director.getScene();
        scene.addChild(audioMusic);
        director.addPersistRootNode(audioMusic);
        this.musicSource = audioMusic.addComponent(AudioSource);

        let audioEffect = new Node();
        audioEffect.name = 'audioEffect';
        director.getScene().addChild(audioEffect);
        director.addPersistRootNode(audioEffect);
        this.effectSource = audioEffect.addComponent(AudioSource);

        let audioLoop = new Node();
        audioLoop.name = 'audioLoop';
        director.getScene().addChild(audioLoop);
        director.addPersistRootNode(audioLoop);
        this.loopSource = audioLoop.addComponent(AudioSource);
    }

    public static getInstance() {
        if (AudioEngineControl.instance == undefined) {
            AudioEngineControl.instance = new AudioEngineControl();
        }

        return AudioEngineControl.instance;
    }

    public set setBackground(value: boolean) {
        this.isBack = value;
    }

    /**
     * 設置檔案
     * @param name 檔案名稱
     * @param clip 音頻檔
     */
    setAudioTask(name: string, clip: AudioClip) {
        this.audioClips.set(name, clip);
    }

    /**
     * 設置音樂預設音量
     * @param value 音量，範圍0~1，取小數後1位，預設為0.5
     */
    public setMusicVolume(value: number) {
        this.musicSource.volume = value;
    }

    public setEffectVolume(value: number) {
        this.effectSource.volume = value;
        this.loopSource.volume = value;
    }

    /**
     * 播放背景音樂
     * @param name 檔案名稱，音效檔需先載入
     * @param loop 是否循環播放，預設為為否
     */
    playMusic(name: string, loop?: boolean, startTime?: number, callback?: Function): number;
    playMusic(name: string, loop?: boolean, startTime?: number, volume?: number, callback?: Function): number;
    playMusic(name: string, loop: boolean = true, startTime: number = 0, ...args: any[]): number {
        if (this.isBack) return null
        if (this.audioClips.has(name)) {
            let id: number;
            switch (args.length) {
                case 0:
                    this.setMusicVolume(this.defMusicVolume);
                    this.musicSource.stop();
                    this.musicSource.clip = this.audioClips.get(name);
                    this.musicSource.loop = loop;
                    this.musicSource.currentTime = startTime;
                    this.musicSource.play();
                    break;
                case 1:
                    if (typeof (args[0]) == "number") this.setMusicVolume(args[0]);
                    this.musicSource.stop();
                    this.musicSource.clip = this.audioClips.get(name);
                    this.musicSource.loop = loop;
                    this.musicSource.currentTime = startTime;
                    this.musicSource.play();
                    if (typeof (args[0]) == "function") this.musicSource.node.off(AudioSource.EventType.ENDED, args[0])
                    break;
                case 2:
                    this.setMusicVolume(args[0]);
                    this.musicSource.stop();
                    this.musicSource.clip = this.audioClips.get(name);
                    this.musicSource.loop = loop;
                    this.musicSource.currentTime = startTime;
                    this.musicSource.play();
                    this.musicSource.node.off(AudioSource.EventType.ENDED, args[1])
                    break;
            }
            this.playingList.set(name, id);
            this.musicPlayingList.set(name, id);
            return id;
        }

        return null;
    }

    /**
     * 播放音效
     * @param name 檔案名稱，音效檔需先載入
     * @param callback 播放完回呼
     * @param volume 音量，預設0.5
     */
    playAudio(name: string, callback?: Function): number;
    playAudio(name: string, volume?: number, callback?: Function): number;
    playAudio(name: string, ...args: any[]): number {
        if (this.isBack) return null
        if (this.audioClips.has(name)) {
            let id: number;
            switch (args.length) {
                case 0:
                    this.effectSource.playOneShot(this.audioClips.get(name), this.defEffectsVolume);
                    break;
                case 1:
                    if (typeof (args[0]) == "number") {
                        this.effectSource.playOneShot(this.audioClips.get(name), args[0]);
                    } else {
                        this.effectSource.playOneShot(this.audioClips.get(name), this.defEffectsVolume);
                        if (typeof (args[0]) == "function") this.effectSource.node.off(AudioSource.EventType.ENDED, args[0]);
                    }
                    break;
                case 2:
                    this.effectSource.playOneShot(this.audioClips.get(name), args[0]);
                    this.effectSource.node.off(AudioSource.EventType.ENDED, args[1]);
                    break;
            }
            this.playingList.set(name, id);
            this.audioPlayingList.set(name, id);
            return id;
        }
        return null;
    }

    /**
     * 播放音效(預設重複播放)
     * @param name 檔案名稱，音效檔需先載入
     * @param volume 音量，預設0.5
     */
    playLoopAudio(name: string, volume?: number) {
        if (this.audioClips.has(name)) {
            if (volume) this.loopSource.volume = volume;
            else this.loopSource.volume = this.defMusicVolume;
            this.loopSource.stop();
            this.loopSource.clip = this.audioClips.get(name);
            this.loopSource.loop = true;
            this.loopSource.play();
        }
    }

    // # 音樂、音效控制
    /** 停止所有音效 */
    stopAudio() {
        if (this.isBack) return
        this.effectSource.stop();
        this.loopSource.stop();
    }

    /** 停止背景音樂 */
    stopMusic() {
        if (this.isBack) return
        this.musicSource.stop();
    }

    /** 停止所有音頻 */
    stopAll() {
        this.effectSource.stop();
        this.musicSource.stop();
        this.loopSource.stop();
    }

    /** 暫停所有播放中的音頻 */
    pauseAll() {
        this.effectSource.pause();
        this.musicSource.pause();
    }

    /** 暫停所有播放中的音效 */
    pauseAllAudio() {
        this.effectSource.pause();
    }

    /** 暫停播放中的背景音樂 */
    pauseAllMusic() {
        this.musicSource.pause();
    }

    /** 恢復所有暫停的音頻 */
    resumeAll() {
        this.effectSource.play();
        this.musicSource.play();
    }

    /** 恢復所有暫停的音效 */
    resumeAllAudio() {
        this.effectSource.play();
    }

    /** 恢復暫停的背景音樂 */
    resumeAllMusic() {
        this.musicSource.play();
    }

    // # 取得播放狀態

    /**
     * 取得當前播放時間
     * @param name 檔名
     * @param id id
     */
    getMusicCurrentTime(name: string, id: number): string {
        if (!this.audioClips.has(name)) {
            return;
        }
        return this.musicSource.currentTime.toFixed(1);
    }

    /**
     * 取得音效總長度
     * @param name 檔名
     * @param id id
     */
    getMusicDurationTime(name: string, id: number): string {
        if (!this.audioClips.has(name)) {
            return;
        }
        return this.musicSource.duration.toFixed(1);
    }

    /** 是否正在播放音樂 */
    get isMusicPlaying(): boolean {
        return this.musicSource.playing;
    }

    /**
     * 獲得指定檔名音頻狀態
     * @param name 檔案名稱
     * @returns state： 
     *      INIT = 0,
            PLAYING = 1,
            PAUSED = 2,
            STOPPED = 3,
            INTERRUPTED = 4
     */
    getMusicState(): number {
        return this.musicSource.state;
    }

    setMusicCurrentTime(id: number, sec: number) {
        this.musicSource.currentTime = sec;
    }

    // # Else

    /** 釋放所有音效資源 */
    releaseAll() {
        this.audioClips.forEach((value, key, map) => {
            assetManager.releaseAsset(value)
        })
    }
}
