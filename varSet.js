structsCost = {
  0: new Decimal('1e1'),
  1: new Decimal('1e2'),
  2: new Decimal('2.5e3'),
  3: new Decimal('1.0e4'),
  4: new Decimal('1.5e5'),
  5: new Decimal('1.0e6'),
  6: new Decimal('5.0e6'),
  7: new Decimal('1.0e8'),
  8: new Decimal('1.0e9'),
  9: new Decimal('1.0e13'),
};
structsHave = {
  0: new Decimal('0'),
  1: new Decimal('0'),
  2: new Decimal('0'),
  3: new Decimal('0'),
  4: new Decimal('0'),
  5: new Decimal('0'),
  6: new Decimal('0'),
  7: new Decimal('0'),
  8: new Decimal('0'),
  9: new Decimal('0')
};
structsName = [
  'Weighing Beam', 'Beaker', 'Flask', 'Petri Dish', 'Graduation Cylinder',
  'Burette', 'Filter Paper', 'Fractionation Funnel', 'Spamler', 'Stopwatch'
];
structsPower = [
  [1, 1],
  [5, 1],
  [25, 1],
  [1, 2],
  [5, 2],
  [5e4, 1],
  [1e3, 2],
  [1e2, 3],
  [5e3, 3],
  [2e5, 4]
];
researchAssign = {
  0: new Decimal('0'),
  1: new Decimal('0'),
  2: new Decimal('0'),
  3: new Decimal('0'),
  4: new Decimal('0'),
  5: new Decimal('0'),
  6: new Decimal('0'),
  7: new Decimal('0'),
  8: new Decimal('0'),
  9: new Decimal('0')
};
researchCount = {
  0: new Decimal('0'),
  1: new Decimal('0'),
  2: new Decimal('0'),
  3: new Decimal('0'),
  4: new Decimal('0'),
  5: new Decimal('0'),
  6: new Decimal('0'),
  7: new Decimal('0'),
  8: new Decimal('0'),
  9: new Decimal('0')
};
researchBoost = {
  0: new Decimal('0'),
  1: new Decimal('1'),
  2: new Decimal('1'),
  3: new Decimal('1'),
  4: new Decimal('0'),
  5: new Decimal('0'),
  6: new Decimal('0'),
  7: new Decimal('0'),
  8: new Decimal('0'),
  9: new Decimal('0')
};
bitOpen = {
  0: new Decimal('0'),
  1: new Decimal('0'),
  2: new Decimal('0'),
  3: new Decimal('0'),
  4: new Decimal('0'),
  5: new Decimal('0'),
  6: new Decimal('0'),
  7: new Decimal('0'),
  8: new Decimal('0'),
  9: new Decimal('0'),
  10: new Decimal('0'),
  11: new Decimal('0'),
  12: new Decimal('0'),
  13: new Decimal('0'),
  14: new Decimal('0'),
  15: new Decimal('0'),
  16: new Decimal('0'),
  17: new Decimal('0'),
  18: new Decimal('0'),
  19: new Decimal('0'),
};
varData = [
  'gunpowder', 'gps1', 'gps2', 'gps3', 'gps4',
  'structsCost', 'gLimitLevel', 'lastTick', 'booster', 'structsHave',
  'ep', 'eCount', 'researchAssign', 'researchCount', 'bits'
];
resetData = {
  0: new Decimal('10'),
  1: new Decimal('0'),
  2: new Decimal('0'),
  3: new Decimal('0'),
  4: new Decimal('0'),
  5: structsCost,
  6: new Decimal('0'),
  7: new Date().getTime(),
  8: new Decimal('0'),
  9: structsHave,
  10: new Decimal('0'),
  11: new Decimal('0'),
  12: researchAssign,
  13: researchCount,
  14: new Decimal('0')
};
