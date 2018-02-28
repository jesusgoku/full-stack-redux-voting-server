import { expect } from 'chai';
import { Map, fromJS } from 'immutable';

import makeStore from '../src/store';

describe('store', () => {
  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(Map());

    store.dispatch({
      type: 'SET_ENTRIES',
      entries: ['Trainspoting', '28 Days Later'],
    });
    expect(store.getState()).to.equal(fromJS({
      entries: ['Trainspoting', '28 Days Later'],
    }));
  });
});
