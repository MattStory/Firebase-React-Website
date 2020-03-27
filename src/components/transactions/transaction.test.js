import React from 'react';
import Transactions from './Transactions';
import renderer from 'react-test-renderer';

test('matches snapshot', () => {
  const tree = renderer.create(<Transactions />).toJSON();

  expect(tree).toMatchSnapshot();
})