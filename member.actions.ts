// member.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadMember = createAction(
  '[Member] Load Member',
  props<{ id: string }>()   // could be your `memberID` or `id` field
);

export const loadMemberSuccess = createAction(
  '[Member] Load Member Success',
  props<{ id: string; data: any }>()
);

export const loadMemberFailure = createAction(
  '[Member] Load Member Failure',
  props<{ id: string; error: any }>()
);
