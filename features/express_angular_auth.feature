# language: es
Característica: Autenticación con JWT Middleware en Express.js y Functional Interceptor en Angular 17

  Escenario: Petición Autenticada desde Angular Interceptor a Router de Express
    Dado un usuario registrado en el sistema Angular 17
    Cuando inicia sesión, Angular almacena el token JWT en memoria
    Y la app Angular realiza una solicitud POST a `/api/orders`
    Entonces el `authInterceptor` inyecta la cabecera `Authorization: Bearer <token>`
    Y el Middleware de Express verifica el token JWT y procesa la petición de forma segura
    Y Vitest ejecuta las pruebas de integración backend aprobando el test suite
