import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandles = new Map<string, DetachedRouteHandle>();

  // Create a unique cache key based on route path + params (especially `id`)
  private getKey(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get('id') || '';
    return `${route.routeConfig?.path || ''}_${id}`;
  }

  // 1️⃣ Decide if this route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Case 1: Routes with `reuse: true` in data → Always cache
    if (route.data && route.data['reuse'] === true) {
      return true;
    }

    // Case 2: Mycoverage route caching based on id
    if (this.isMyCoverageRoute(route)) {
      return true; // We’ll handle reload prevention in shouldAttach
    }

    // Case 3: Everything else → No caching
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKey(route);
    this.storedHandles.set(key, handle);
  }

  // 2️⃣ Decide if this route can be re-attached from cache
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Always restore if reuse=true
    if (route.data && route.data['reuse'] === true) {
      return this.storedHandles.has(this.getKey(route));
    }

    // Mycoverage: Only restore if same id exists in cache
    if (this.isMyCoverageRoute(route)) {
      return this.storedHandles.has(this.getKey(route));
    }

    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig) return null;
    return this.storedHandles.get(this.getKey(route)) || null;
  }

  // 3️⃣ Compare for reuse
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // If Mycoverage → reload only when ID changes
    if (this.isMyCoverageRoute(future) && this.isMyCoverageRoute(curr)) {
      return future.paramMap.get('id') === curr.paramMap.get('id');
    }

    // Default Angular behavior
    return future.routeConfig === curr.routeConfig;
  }

  private isMyCoverageRoute(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path || '';
    return path.startsWith('Coverage/:id/medical');
  }
}
