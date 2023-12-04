const {
  writeFragment,
  writeFragmentData,
  listFragments,
  readFragment,
  readFragmentData,
} = require('../../src/model/data/memory');

describe('test memory data provider', () => {
  test('readFragment()', async () => {
    await writeFragment({ ownerId: '123', id: '1', fragment: 'fragment 1' });
    const frag = await readFragment('123', '1');
    expect(frag).toEqual({ ownerId: '123', id: '1', fragment: 'fragment 1' });
    expect(() => readFragment('123', '333').expect.toThrow());
  });
  test('readFragmentData()', async () => {
    await writeFragment({ ownerId: '234', id: '1', fragment: 'fragment 1' });
    await writeFragmentData('234', '1', 'This is fragment 1 (data)');

    const data = await readFragmentData('234', '1');
    expect(data).toEqual('This is fragment 1 (data)');
    expect(() => readFragmentData('234', '444').expect.toThrow());
  });
  test('listFragments() writeFragment() writeFragmentData()', async () => {
    await writeFragment({ ownerId: 'ab', id: '1', fragment: 'fragment 1' });
    await writeFragmentData('ab', '1', 'This is fragment 1');

    await writeFragment({ ownerId: 'ab', id: '2', fragment: 'fragment 2' });
    await writeFragmentData('ab', '2', 'This is fragment 2');

    const ids = await listFragments('ab');
    expect(Array.isArray(ids)).toBe(true);
    expect(ids).toEqual(['1', '2']);

    const fragments = await listFragments('ab', true);
    expect(Array.isArray(fragments)).toBe(true);
    expect(fragments).toEqual([
      { ownerId: 'ab', id: '1', fragment: 'fragment 1' },
      { ownerId: 'ab', id: '2', fragment: 'fragment 2' },
    ]);
  });
});
