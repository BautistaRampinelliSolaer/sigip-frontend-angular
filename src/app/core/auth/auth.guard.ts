import { inject } from "@angular/core";
import { CanMatchFn, Router, UrlSegment, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";

/** Build attempted absolute URL from the matched segments (used as returnUrl). */
export function attemptedUrl(segments: UrlSegment[], router: Router): string {
    const tree = router.createUrlTree(['/', ...segments.map(s => s.path)]);
    return router.serializeUrl(tree);
}

/** Guard for private routes: allow only if authenticated, otherwise redirect to /login?returnUrl=... */
export const authGuard: CanMatchFn = (_route, segments) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLogged()) return true;

    const returnUrl = attemptedUrl(segments, router);
    const tree: UrlTree = router.createUrlTree(['/login'], { queryParams: { returnUrl } });
    return tree;
};

/** Guard for the login route: block if already authenticated (send to home). */
export const loginBlockGuard: CanMatchFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.isLogged() ? router.createUrlTree(['/']) : true;
}