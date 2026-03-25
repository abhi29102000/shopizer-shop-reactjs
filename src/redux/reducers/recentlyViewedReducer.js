import { FETCH_RECENTLY_VIEWED, SET_RECENTLY_VIEWED } from '../actions/recentlyViewedActions';

const initState = { items: [], loading: false };

const recentlyViewedReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_RECENTLY_VIEWED:
      return { ...state, loading: true };
    case SET_RECENTLY_VIEWED:
      return { items: action.payload, loading: false };
    default:
      return state;
  }
};

export default recentlyViewedReducer;
