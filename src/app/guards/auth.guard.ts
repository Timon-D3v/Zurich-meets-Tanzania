import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (await authService.isUserCurrentlyLoggedIn()) {
        return true;
    }

    return router.createUrlTree(["/login"], {
        queryParams: {
            redirectUrl: route.url,
        },
    });
};
