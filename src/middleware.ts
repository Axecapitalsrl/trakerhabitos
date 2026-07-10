import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas que requieren sesión iniciada. El chequeo fino de status ('active') y
// role ('admin') se hace server-side en los layouts de /dashboard y /admin,
// que corren en CADA request.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Todas las rutas menos assets estáticos e internos de Next.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Siempre correr en rutas de API.
    "/(api|trpc)(.*)",
  ],
};
