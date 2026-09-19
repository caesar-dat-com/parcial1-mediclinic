# Challenge 04 - Storage Ionic

## Enunciado (Clase 04 - Routing and Storage)

Create a new Demo Login Page in ionic. It should contain:

- Email
- Password
- Button to Login

When the button is clicked, we are going to validate if the user is:

- user: `user@mail.com`
- password: `123`

In that case, we are going to store a token called `logged = true` and redirect to the
List page. Next time we enter to the app, we're going to check if the user is logged,
then is not necessary to log-in again.

Create a button to logout, then when the button is clicked, the app will clean the token
and redirects to login page.

## Checklist

- [ ] Pagina de login con email, password y boton
- [ ] Validacion contra user@mail.com / 123
- [ ] Guardar token `logged = true` en storage
- [ ] Redireccion a la pagina List tras login correcto
- [ ] Al abrir la app, si hay token no pedir login de nuevo
- [ ] Boton de logout que limpia el token y vuelve al login

## Notas

En la planilla del curso figura como "Storage Ionic".
