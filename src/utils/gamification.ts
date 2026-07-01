export const getTreeLevelInfo = (minutes: number) => {
  if (minutes < 30) {
    return { name: 'Mầm Non', icon: '🌱', nextLevelMins: 30, percent: (minutes / 30) * 100, isMax: false };
  } else if (minutes < 120) {
    return { name: 'Cây Non', icon: '🌿', nextLevelMins: 120, percent: (minutes / 120) * 100, isMax: false };
  } else if (minutes < 500) {
    return { name: 'Cây Xanh Tốt', icon: '🌳', nextLevelMins: 500, percent: (minutes / 500) * 100, isMax: false };
  } else {
    return { name: 'Cổ Thụ Tri Thức', icon: '🌲', nextLevelMins: minutes, percent: 100, isMax: true };
  }
};
