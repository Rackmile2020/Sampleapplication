
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([...]),
    {
      provide: 'APP_INITIALIZER',
      useFactory: (router: Router) => () => {
        router.events.subscribe(() => {
          cleanupBootstrapModals();
        });
      },
      deps: [Router],
      multi: true
    }
  ]
};
