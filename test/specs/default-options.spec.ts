import { defaultOptions } from '../../src/utils';

it('should match the snapshot', () => {
  expect(defaultOptions).toMatchSnapshot();
});
