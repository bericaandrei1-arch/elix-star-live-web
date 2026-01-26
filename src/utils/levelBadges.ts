
export const LEVEL_BADGES = [
    { min: 1, max: 25, src: '/icons/Untitled-Layer%201%20(3).png' },
    { min: 26, max: 50, src: '/icons/badge2.png' },
    { min: 51, max: 75, src: '/icons/badge3.png' },
    { min: 76, max: 9999, src: '/icons/badge4.png' }
];

export const getLevelBadge = (level: number) => {
    const badge = LEVEL_BADGES.find(b => level >= b.min && level <= b.max);
    return badge ? badge.src : LEVEL_BADGES[0].src;
};
