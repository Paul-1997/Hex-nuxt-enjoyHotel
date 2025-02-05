export default defineNuxtRouteMiddleware((to, from) => {
  console.log('from',from.path);
  console.log('to',to.path);
  
  // If the user is authenticated, continue with the route
  const cookie = useCookie('auth');
  console.log(cookie.value);  
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  // if (to.path !== '/') {
  //   return navigateTo('/')
  // }
})
