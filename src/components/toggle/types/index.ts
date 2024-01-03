export interface IROToggleCfg {
    readonly active: boolean;
    readonly alpha: number;
    readonly  time: number;
    readonly callback: () => void;
}