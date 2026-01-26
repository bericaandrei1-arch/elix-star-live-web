
export const LEVEL_BADGES = [
    { min: 1, max: 25, src: '/Icons/b49d9642-9c21-4440-a665-fbcbe31d58dc.png' },
    { min: 26, max: 50, src: '/Icons/Lv25.png' },
    { min: 51, max: 75, src: '/Icons/Lv50.png' },
    { min: 76, max: 9999, src: '/Icons/Lv100.png' }
];

export const getLevelBadge = (level: number) => {
    const badge = LEVEL_BADGES.find(b => level >= b.min && level <= b.max);
    return badge ? badge.src : LEVEL_BADGES[0].src;
};
