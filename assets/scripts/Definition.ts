export enum Action {
    Join = '1001',
    Move = '1002',
    Stop = '1003',
    Jump = '1004',
    PositionInfo = '1005',
    Attack = '1006',
    Die = '1007',
    Damage = '1008',
    HealthBuff = '1009',
    HealthGet = '1010',
}

export const ActionReverseMap = {
    '1001': 'Join',
    '1002': 'Move',
    '1003': 'Stop',
    '1004': 'Jump',
    '1005': 'PositionInfo',
    '1006': 'Attack',
    '1007': 'Die',
    '1008': 'Damage',
    '1009': 'HealthBuff',
    '1010': 'HealthGet',
}

export const PHY_GROUP = {
    DEFAULT: 1 << 0,
    FLOOR: 1 << 1,
    PLAYER: 1 << 2,
    BULLET: 1 << 3,
    WALL: 1 << 4,
    BUFF: 1 << 5,
};