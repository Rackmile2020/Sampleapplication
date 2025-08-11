import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandles = new Map<string, DetachedRouteHandle>();

  // Decide if we should detach (cache) the route
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.isCoverageRoute(route); // Only cache Coverage routes
  }

  // Store the detached route
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getRouteKey(route);
    this.storedHandles.set(key, handle);
  }

  // Decide if we should reattach a stored route
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.isCoverageRoute(route) && this.storedHandles.has(this.getRouteKey(route));
  }

  // Retrieve a stored route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!this.isCoverageRoute(route)) {
      return null; // No reuse for other routes
    }
    return this.storedHandles.get(this.getRouteKey(route)) || null;
  }

  // Decide if the same route should be reused without detaching
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (future.routeConfig !== curr.routeConfig) {
      return false;
    }

    const futureId = future.params['id'];
    const currId = curr.params['id'];

    // If it's a Coverage route with different id → reload
    if (this.isCoverageRoute(future) && futureId && currId && futureId !== currId) {
      return false;
    }

    return true;
  }

  // Check if route is part of /Coverage
  private isCoverageRoute(route: ActivatedRouteSnapshot): boolean {
    return route.pathFromRoot.some(r => r.routeConfig?.path?.startsWith('Coverage'));
  }

  // Build a unique key for a route, including id param if present
  private getRouteKey(route: ActivatedRouteSnapshot): string {
    const path = route.pathFromRoot
      .map(r => r.routeConfig?.path || '')
      .filter(p => !!p)
      .join('/');

    const id = route.params['id'] || '';
    return `${path}_${id}`;
  }
}
