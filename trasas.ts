import { createReducer, on } from '@ngrx/store';
import { createAction } from '@ngrx/store';

export const increment = createAction('[Counter] Increment');

export interface ChildState {
  counter: number;
}

export const initialState: ChildState = {
  counter: 0,
};

export const featureReducer = createReducer(
  initialState,
  on(increment, (state) => ({
    ...state,
    counter: state.counter + 1,
  }))
);

 counter$: Observable<number>;

  constructor(private store: Store<{ childFeature: { counter: number } }>) {
    this.counter$ = this.store.select(
      (state) => state.childFeature.counter
    );
  }

  increment() {
    this.store.dispatch(increment());
  }
