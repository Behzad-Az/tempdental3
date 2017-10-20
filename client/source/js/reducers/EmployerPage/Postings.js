import { Map } from 'immutable';

import {
  EMP_GET_POSTINGS_START,
  EMP_GET_POSTINGS_ERROR,
  EMP_GET_POSTINGS_SUCCESS,
  EMP_DELETE_POSTING,
  EMP_DECREMENT_POSTING_APPL_COUNT
} from 'actions/EmployerPage/Postings';

const initialState = Map({
  dataLoaded: false,
  pageError: false,
  postings: [],
  applicantCounts: [],
  asyncLoading: false,
  asyncError: null
});

const actionsMap = {
  [EMP_DELETE_POSTING]: (state, action) => {
    const { vacancyId } = action;
    const postings = vacancyId === '_all' ? [] : state.get('postings').filter(posting => posting.id !== vacancyId);
    return state.merge(Map({ postings }));
  },

  [EMP_DECREMENT_POSTING_APPL_COUNT]: (state, action) => {
    let applicantCounts = [ ...state.get('applicantCounts') ];
    console.log("i'm here action:", action.vacancyId);
    console.log("i'm here count.vacancy_id:", applicantCounts[0].vacancy_id);
    // const index = applicantCounts.indexOf(count => count.vacancy_id == action.vacancyId);
    console.log("i'm here index: ", applicantCounts[0].vacancy_id === action.vacancyId);
    // applicantCounts[index].count = parseInt(applicantCounts[inde]);
    return state.merge(Map({ applicantCounts }));
  },

  [EMP_GET_POSTINGS_START]: (state, action) => {
    return state.merge(Map({
      asyncLoading: true,
      asyncError: null
    }));
  },
  [EMP_GET_POSTINGS_ERROR]: (state, action) => {
    return state.merge(Map({
      asyncLoading: false,
      asyncError: action.error,
      pageError: true,
      dataLoaded: true
    }));
  },
  [EMP_GET_POSTINGS_SUCCESS]: (state, action) => {
    const { postings, applicantCounts } = action.data;
    return state.merge(Map({
      asyncLoading: false,
      asyncError: null,
      pageError: false,
      dataLoaded: true,
      postings,
      applicantCounts
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
