import { floatCompare, sortOn, caseless, mergeDeep, zoomableOption, zoomablesOptions, createZoomOption } from './helpers';

test('floatCompare correctly compares float values for an array sort method', () => {
  expect(floatCompare(1.1, 1.1)).toBe(0);
  expect(floatCompare(1.1, 1.2)).toBe(-1);
  expect(floatCompare(1.2, 1.1)).toBe(1);
  expect(floatCompare(1.1, 1.1)).toBe(0);
});

test('sortOn sorts alphabetically on "label" property', () => {
  const items = [
    { label: 'E', value: 'E' },
    { label: 'D', value: 'D' },
    { label: 'C', value: 'C' },
    { label: 'B', value: 'B' },
    { label: 'A', value: 'A' },
  ];
  const sorted = sortOn(items, 'label');
  expect(sorted[0].label).toBe('A');
  expect(sorted[1].label).toBe('B');
  expect(sorted[2].label).toBe('C');
  expect(sorted[3].label).toBe('D');
  expect(sorted[4].label).toBe('E');
});

test('sortOn sorts numerically on "label" property', () => {
  const items = [
    { label: 'Five', value: 5 },
    { label: 'Four', value: 4 },
    { label: 'Three', value: 3 },
    { label: 'Two', value: 2 },
    { label: 'One', value: 1 },
  ];
  const sorted = sortOn(items, 'label', true);
  expect(sorted[0].label).toBe('One');
  expect(sorted[1].label).toBe('Two');
  expect(sorted[2].label).toBe('Three');
  expect(sorted[3].label).toBe('Four');
  expect(sorted[4].label).toBe('Five');
});

test('caseless correctly compares letters for an array sort method', () => {
  expect(caseless('a', 'A')).toBe(0);
  expect(caseless('a', 'b')).toBe(-1);
  expect(caseless('b', 'a')).toBe(1);
  expect(caseless('a', 'a')).toBe(0);
});

test('mergeDeep correctly merges two objects', () => {
  const obj1 = {
    a: {
      b: {
        c: 'c',
      },
    },
  };

  const obj2 = {
    a: {
      b: {
        d: 'd',
      },
    },
    a2: 'b2',
  };
  const merged = mergeDeep(obj1, obj2);
  expect(merged.a.b.c).toBe('c');
  expect(merged.a.b.d).toBe('d');
  expect(merged.a2).toBe('b2');
});

test('createZoomOption method correctly creates a zoom object', () => {
  const option = createZoomOption('label', 'value', [1, 2]);
  expect(option.label).toBe('label');
  expect(option.value).toBe('value');
  expect(option.extent).toEqual([1, 2]);
});

test('zoomableOption correctly creates a zoomable option from an object', () => {
  const item = {
    label: 'label',
    id: 'id',
    fields: {
      extent: [0, 1],
    },
  };
  const zoomable = zoomableOption(item);
  expect(zoomable.label).toBe('label');
  expect(zoomable.value).toBe('id');
  expect(zoomable.extent).toEqual([0, 1]);
});

test('zoomableOption correctly creates a zoomable option from an object with overrides', () => {
  const item = {
    name: 'label1',
    key: 'id1',
    fields: {
      extent: [0, 1],
    },
  };
  const zoomable = zoomableOption(item, 'name', 'key');
  expect(zoomable.label).toBe('label1');
  expect(zoomable.value).toBe('id1');
  expect(zoomable.extent).toEqual([0, 1]);
});

test('zoomablesOptions correctly creates a list of zoomable options', () => {
  const items = [
    {
      label: 'label1',
      id: 'id1',
      fields: {
        extent: [0, 1],
      },
    },
    {
      label: 'label2',
      id: 'id2',
      fields: {
        extent: [2, 3],
      },
    },
  ];
  const zoomables = zoomablesOptions(items);
  expect(zoomables[0].label).toBe('label1');
  expect(zoomables[0].value).toBe('id1');
  expect(zoomables[0].extent).toEqual([0, 1]);
  expect(zoomables[1].label).toBe('label2');
  expect(zoomables[1].value).toBe('id2');
  expect(zoomables[1].extent).toEqual([2, 3]);
});

test('zoomablesOptions correctly creates a list of zoomable options with overrides', () => {
  const items = [
    {
      name: 'label1',
      key: 'id1',
      fields: {
        extent: [0, 1],
      },
    },
    {
      name: 'label2',
      key: 'id2',
      fields: {
        extent: [2, 3],
      },
    },
  ];
  const zoomables = zoomablesOptions(items, 'name', 'key');
  expect(zoomables[0].label).toBe('label1');
  expect(zoomables[0].value).toBe('id1');
  expect(zoomables[0].extent).toEqual([0, 1]);
  expect(zoomables[1].label).toBe('label2');
  expect(zoomables[1].value).toBe('id2');
  expect(zoomables[1].extent).toEqual([2, 3]);
});
