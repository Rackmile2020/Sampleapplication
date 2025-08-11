import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  storedHandles = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Only detach (cache) routes under Coverage
    return this.isCoverageRoute(route);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getRouteKey(route);
    this.storedHandles.set(key, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route);
    return this.storedHandles.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getRouteKey(route);
    return this.storedHandles.get(key) || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // reuse if route config is same AND id param matches
    if (future.routeConfig !== curr.routeConfig) {
      return false;
    }

    const futureId = future.params['id'];
    const currId = curr.params['id'];

    if (futureId && currId && futureId !== currId) {
      return false; // different id → don't reuse
    }

    return true;
  }

  private isCoverageRoute(route: ActivatedRouteSnapshot): boolean {
    return route.pathFromRoot.some(r => r.routeConfig?.path?.startsWith('Coverage'));
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    // key based on full route path + id param
    const path = route.pathFromRoot
      .map(r => r.routeConfig?.path || '')
      .filter(p => !!p)
      .join('/');

    const id = route.params['id'] || '';
    return `${path}_${id}`;
  }
}
