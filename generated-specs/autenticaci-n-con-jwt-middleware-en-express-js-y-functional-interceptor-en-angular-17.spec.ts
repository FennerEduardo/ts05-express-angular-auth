import { test, expect } from '@playwright/test';

test.describe('Autenticación con JWT Middleware en Express.js y Functional Interceptor en Angular 17', () => {


  test('Petición Autenticada desde Angular Interceptor a Router de Express', async ({ page }) => {
    // Accessibility-first Playwright Step Bindings
    // Given un usuario registrado en el sistema Angular 17
    // When inicia sesión, Angular almacena el token JWT en memoria
    // Then el `authInterceptor` inyecta la cabecera `Authorization: Bearer <token>`
  });

});
