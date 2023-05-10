<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
# Teslo API

1. Clonar proyecto

```bash
  git clone
```
2. Instalar dependencias

```bash
  yarn install
```

3. Crear archivo .env.template y renombrarlo a .env

```bash
  cp .env.example .env
```
4. cambiar las variables de entorno
  
  ```bash
    DB_HOST=teslo-db
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_DATABASE=teslo
  ```

5. Levantar la base de datos

```bash
  docker-compose up -d
```
6. Ejecutar seed

```bash
  curl -X GET http://localhost:3000/seed
```
## Running the app

```bash
  # development
  $ yarn start

  # watch mode
  $ yarn start:dev

  # production mode
  $ yarn start:prod
```