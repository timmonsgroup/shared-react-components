import { floatCompare, sortOn, caseless, mergeDeep, zoomableOption, zoomablesOptions, createZoomOption, objectReducer, getSectionChoices, processLayout } from './helpers';

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

test('Object reduce method correctly reduces an object', () => {
  const obj = { a: { b: { c: 1 } } };
  const result = objectReducer(obj, 'a.b.c' );
  expect(result).toBe(1);
});

test('Object reduce method correctly returns missing as undefined', () => {
  const obj = { a: { b: { c: 1 } } };
  const result = objectReducer(obj, 'a.b.d');
  console.log(result);
  expect(result).toBe(undefined);
});

const layout = {
  sections: [
    {
      editable: true,
      enabled: true,
      name: 'Section One',
      order: 10,
      layout: [
        {
          label: 'Fire Department',
          path: 'fireDepartment',
          type: 10,
          model: {
            id: 5,
            modelid: 10,
            type: 2,
            name: 'fireDepartment',
            data: {},
          },
          disabled: false,
          possibleChoices: [
            { name: 'BATTENS FD (Coffee County)', id: 7403 },
            { name: 'Broomtown VFD (Cherokee County)', id: 7404 },
            { name: 'Cedar Bluff VFD (Cherokee County)', id: 7405 },
            { name: 'Centre VFD (Cherokee County)', id: 7406 },
          ],
        }
      ],
    },
  ],
};

test('getSectionChoices correctly returns a list of choices', () => {
  const choices = getSectionChoices(layout, 'Section One', 'fireDepartment');
  expect(choices.length).toBe(4);
  expect(choices[0].label).toBe('BATTENS FD (Coffee County)');
  expect(choices[0].id).toBe(7403);
  expect(choices[1].label).toBe('Broomtown VFD (Cherokee County)');
  expect(choices[1].id).toBe(7404);
});

test('getSectionChoices correctly returns an empty list when section does not contain a matching modelName', () => {
  const choices = getSectionChoices(layout, 'Section One', 'fireStation');
  expect(choices.length).toBe(0);
});

test('getSectionChoices correctly returns an empty list when section does not exist', () => {
  const choices = getSectionChoices(layout, 'Section Two', 'fireDepartment');
  expect(choices.length).toBe(0);
});

test('processLayout correctly processes a layout', () => {
  const processed = processLayout(layout);
  const section = processed[0];
  const {fields} = section;
  console.log(section);
  expect(section.name).toBe('Section One');
  expect(fields.length).toBe(1);

  const field = fields[0];
  expect(field.path).toBe('fireDepartment');
  expect(field.type).toBe(10);
  expect(field.render).not.toBeUndefined();

  const choices = field.render.choices;

  expect(choices.length).toBe(4);
  expect(choices[0].label).toBe('BATTENS FD (Coffee County)');
  expect(choices[0].id).toBe(7403);
  expect(choices[1].label).toBe('Broomtown VFD (Cherokee County)');
  expect(choices[1].id).toBe(7404);
});
