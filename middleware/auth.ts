export default defineNuxtRouteMiddleware((to) => {
  const router = useRouter();
  const user = useSupabaseUser();
  if (!router.resolve(to).path){
    return router.push("/");
  }
  if (to.path.startsWith("/protected") && user.value === null) {
    return router.push("/auth/login");
  }
});
