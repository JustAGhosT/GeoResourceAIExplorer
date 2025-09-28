import { Mine } from '@/types'

export interface ExploreTabState {
  showFilters: boolean
  showSatellite: boolean
  selectedMine: Mine | null
  mines: Mine[]
  loading: boolean
  error: Error | null
}

export const initialState: ExploreTabState = {
  showFilters: false,
  showSatellite: false,
  selectedMine: null,
  mines: [],
  loading: true,
  error: null,
}

export type ExploreTabAction =
  | { type: 'TOGGLE_FILTERS' }
  | { type: 'TOGGLE_SATELLITE' }
  | { type: 'SELECT_MINE'; payload: Mine | null }
  | { type: 'FETCH_MINES_START' }
  | { type: 'FETCH_MINES_SUCCESS'; payload: Mine[] }
  | { type: 'FETCH_MINES_FAILURE'; payload: Error }
  | { type: 'SET_SHOW_FILTERS'; payload: boolean }


export function exploreTabReducer(state: ExploreTabState, action: ExploreTabAction): ExploreTabState {
  switch (action.type) {
    case 'TOGGLE_FILTERS':
      return { ...state, showFilters: !state.showFilters }
    case 'TOGGLE_SATELLITE':
      return { ...state, showSatellite: !state.showSatellite }
    case 'SELECT_MINE':
      return { ...state, selectedMine: action.payload }
    case 'FETCH_MINES_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_MINES_SUCCESS':
      return { ...state, loading: false, mines: action.payload }
    case 'FETCH_MINES_FAILURE':
      return { ...state, loading: false, error: action.payload }
    case 'SET_SHOW_FILTERS':
      return { ...state, showFilters: action.payload }
    default:
      return state
  }
}