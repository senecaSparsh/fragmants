// Fix this path to point to your project's `memory.js` source file
const {
  writeFragment,
  readFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('testing, writeFragment()', async () => {
    const result = await writeFragment({ ownerId: 'x', id: 'y', fragment: 'test1' });
    expect(result).toBe(undefined);
  });

  test('testing, readFragments() and return into the database', async () => {
    const data = { ownerId: 'x', id: 'y', fragment: 'test2' };
    await writeFragment(data);
    const result = await readFragment('x', 'y');
    expect(result).toBe(data);
  });

  test('testing, writeFragmentData()', async () => {
    const result = await writeFragmentData('x', 'y', 'test3');
    expect(result).toBe(undefined);
  });

  test('testing, readFragmentsData() and return into the database', async () => {
    const data = 'test4';
    await writeFragmentData('x', 'y', data);
    const result = await readFragmentData('x', 'y');
    expect(result).toBe(data);
  });
});
