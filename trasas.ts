import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandles = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // 3. Always reuse if route.data.reuse === true
    if (route.data && route.data['reuse'] === true) {
      return true;
    }

    // 1 & 2. Only cache Coverage routes using existing logic
    return this.isCoverageRoute(route);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getRouteKey(route);
    this.storedHandles.set(key, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.data && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      return this.storedHandles.has(key);
    }

    return this.isCoverageRoute(route) && this.storedHandles.has(this.getRouteKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.data && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      return this.storedHandles.get(key) || null;
    }

    if (!this.isCoverageRoute(route)) {
      return null;
    }

    return this.storedHandles.get(this.getRouteKey(route)) || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (future.routeConfig !== curr.routeConfig) {
      return false;
    }

    // 3. Always reuse if route.data.reuse === true
    if (future.data && future.data['reuse'] === true) {
      return true;
    }

    // 2. For Coverage routes, reload if id param changes
    const futureId = future.params['id'];
    const currId = curr.params['id'];

    if (this.isCoverageRoute(future) && futureId && currId && futureId !== currId) {
      return false;
    }

    return true;
  }

  private isCoverageRoute(route: ActivatedRouteSnapshot): boolean {
    return route.pathFromRoot.some(r => r.routeConfig?.path?.startsWith('Coverage'));
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    const path = route.pathFromRoot
      .map(r => r.routeConfig?.path || '')
      .filter(Boolean)
      .join('/');

    const id = route.params['id'] || '';
    return `${path}_${id}`;
  }
}
