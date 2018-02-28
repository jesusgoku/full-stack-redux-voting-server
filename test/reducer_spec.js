import { expect } from 'chai';
import { Map, fromJS } from 'immutable';

import reducer from '../src/reducer';

describe('reducer', () => {
  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = { type: 'SET_ENTRIES', entries: ['Trainspoting'] };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      entries: ['Trainspoting'],
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Trainspoting', '28 Days Later'],
    });
    const action = { type: 'NEXT' };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspoting', '28 Days Later'],
      },
      entries: [],
    }));
  });

  it('handles VOTES', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Trainspoting', '28 Days Later'],
      },
      entries: [],
    });
    const action = { type: 'VOTE', entry: 'Trainspoting' };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspoting', '28 Days Later'],
        tally: { Trainspoting: 1 }
      },
      entries: [],
    }));
  });

  it('has an initial state', () => {
    const action = { type: 'SET_ENTRIES', entries: ['Trainspoting'] };
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      entries: ['Trainspoting'],
    }));
  });


  it('can be used with reduce', () => {
    const actions = [
      { type: 'SET_ENTRIES', entries: ['Trainspoting', '28 Days Later'] },
      { type: 'NEXT' },
      { type: 'VOTE', entry: 'Trainspoting' },
      { type: 'VOTE', entry: '28 Days Later' },
      { type: 'VOTE', entry: 'Trainspoting' },
      { type: 'NEXT' },
    ];
    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
      winner: 'Trainspoting',
    }));
  });
});
