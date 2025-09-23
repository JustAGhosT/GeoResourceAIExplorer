export function useMinerals(type: 'basic' | 'advanced') {
  if (type === 'basic') {
    return [
      {
        id: 'garnet',
        name: 'Garnet',
        badge: 'Common',
        formula: 'X3Y2(SiO4)3',
        gallery: ['image1.jpg', 'image2.jpg'],
        properties: [{ label: 'Hardness', value: '6.5-7.5' }],
        tips: ['Look for rounded grains in stream sediments.'],
      },
    ];
  }
  return [
    {
      id: 'diopside',
      name: 'Chrome Diopside',
      badge: 'Rare',
      formula: 'MgCaSi2O6',
      gallery: ['image3.jpg', 'image4.jpg'],
      properties: [{ label: 'Color', value: 'Emerald Green' }],
      tips: ['Often found with chromite.'],
    },
  ];
}
