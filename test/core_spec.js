import { expect } from 'chai';
import { List, Map } from 'immutable';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspoting', '28 Days Later');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspoting', '28 Days Later'),
      }))
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspoting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspoting', '28 Days Later'),
      }));
    });
  });

  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspoting', '28 Days Later', 'Sunshine'),
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        entries: List.of('Sunshine'),
        vote: Map({
          pair: List.of('Trainspoting', '28 Days Later'),
        }),
      }));
    });

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspoting', '28 Days Later'),
          tally: Map({
            'Trainspoting': 4,
            '28 Days Later': 2,
          }),
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours'),
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
        }),
        entries: List.of('127 Hours', 'Trainspoting'),
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspoting', '28 Days Later'),
          tally: Map({
            'Trainspoting': 3,
            '28 Days Later': 3,
          }),
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours'),
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
        }),
        entries: List.of('127 Hours', 'Trainspoting', '28 Days Later'),
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspoting', '28 Days Later'),
          tally: Map({
            'Trainspoting': 4,
            '28 Days Later': 2,
          }),
        }),
        entries: List(),
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Trainspoting',
      }));
    });
  });


  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({ pair: List.of('Trainspoting', '28 Days Later') });
      const nextState = vote(state, 'Trainspoting');
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspoting', '28 Days Later'),
        tally: Map({ Trainspoting: 1 }),
      }));

      it('adds to existing tally for the voted entry', () => {
        const state = Map({
          pair: List.of('Trainspoting', '"8 Days Later'),
          tally: Map({
            'Trainspoting': 3,
            '28 Days Later': 2,
          }),
        });
        const nextState = vote(state, 'Trainspoting');
        expect(nextState).to.equal(Map({
          pair: List.of('Trainspoting', '"8 Days Later'),
          tally: Map({
            'Trainspoting': 4,
            '28 Days Later': 2,
          }),
        }));
      });
    });
  });
});
