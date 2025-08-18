// member.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadMember = createAction(
  '[Member] Load Member',
  props<{ request: any }>()   // whole request object
);

export const loadMemberSuccess = createAction(
  '[Member] Load Member Success',
  props<{ request: any; data: any }>()
);

export const loadMemberFailure = createAction(
  '[Member] Load Member Failure',
  props<{ request: any; error: any }>()
);
// member.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as MemberActions from './member.actions';

export interface MemberState {
  entities: { [key: string]: any }; // cache keyed by request
  loading: boolean;
  error?: any;
}

export const initialState: MemberState = {
  entities: {},
  loading: false,
  error: null
};

// Convert request object → string key
function makeKey(request: any): string {
  return JSON.stringify(request);
}

export const memberReducer = createReducer(
  initialState,

  on(MemberActions.loadMember, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MemberActions.loadMemberSuccess, (state, { request, data }) => ({
    ...state,
    loading: false,
    entities: {
      ...state.entities,
      [makeKey(request)]: data   // cache result by request
    }
  })),

  on(MemberActions.loadMemberFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
// member.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MemberState } from './member.reducer';

export const selectMemberState = createFeatureSelector<MemberState>('member');

// Returns cached result if request is already in store
export const selectMemberByRequest = (request: any) =>
  createSelector(selectMemberState, (state) => state.entities[JSON.stringify(request)]);

export const selectMemberLoading = createSelector(
  selectMemberState,
  (state) => state.loading
);
// member.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as MemberActions from './member.actions';
import { MemberService } from './member.service';
import { selectMemberByRequest } from './member.selectors';

@Injectable()
export class MemberEffects {
  loadMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberActions.loadMember),
      switchMap(({ request }) =>
        this.store.select(selectMemberByRequest(request)).pipe(
          switchMap((cached) => {
            if (cached) {
              // ✅ Already cached → return it
              return of(MemberActions.loadMemberSuccess({ request, data: cached }));
            } else {
              // ❌ Not cached → call API
              return this.memberService.getMember(request).pipe(
                map((data) => MemberActions.loadMemberSuccess({ request, data })),
                catchError((error) =>
                  of(MemberActions.loadMemberFailure({ request, error }))
                )
              );
            }
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private memberService: MemberService,
    private store: Store
  ) {}
}
