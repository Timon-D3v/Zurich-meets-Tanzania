import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await authService.fetchCurrentUserDetails();

    if (user?.type === "admin") {
        return true;
    }

    if (user?.type === "user" || user?.type === "member") {
        return router.createUrlTree(["/"]);
    }

    return router.createUrlTree(["/login"], { queryParams: { returnUrl: route.url } });
};
