import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  /** Determines if this route should be detached and stored */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (route.data?.['reuse'] === true) {
      return true; // Case 1: Always reuse if reuse=true
    }

    if (this.isCoverageRoute(route)) {
      return true; // Case 2: Coverage route → cache (reuse logic handled in shouldAttach)
    }

    return false; // Case 3: No reuse
  }

  /** Store the detached route */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getRouteKey(route);
    this.storedRoutes.set(key, handle);
  }

  /** Determines if this route should be reattached from cache */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route);

    if (route.data?.['reuse'] === true) {
      return this.storedRoutes.has(key);
    }

    if (this.isCoverageRoute(route)) {
      // Reuse only if same id is cached
      const cachedKey = this.getCoverageRouteKey(route);
      return this.storedRoutes.has(cachedKey);
    }

    return false;
  }

  /** Retrieve the stored route */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getRouteKey(route);

    if (route.data?.['reuse'] === true) {
      return this.storedRoutes.get(key) || null;
    }

    if (this.isCoverageRoute(route)) {
      return this.storedRoutes.get(this.getCoverageRouteKey(route)) || null;
    }

    return null;
  }

  /** Decide if routes are the same for reuse purposes */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  // ---------- Helpers ----------
  private getRouteKey(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(r => r.url.map(seg => seg.path).join('/'))
      .filter(path => path.length > 0)
      .join('/');
  }

  private isCoverageRoute(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path?.startsWith('Coverage/:id') ?? false;
  }

  private getCoverageRouteKey(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get('id');
    const basePath = route.routeConfig?.path ?? '';
    return `${basePath}_${id}`;
  }
}

private getRouteId(route: ActivatedRouteSnapshot): string | null {
  let current: ActivatedRouteSnapshot | null = route;
  while (current) {
    const id = current.paramMap.get('id');
    if (id) {
      return id;
    }
    current = current.parent; // go up to parent route
  }
  return null; // not found
}
