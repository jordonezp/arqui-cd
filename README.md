# Smart Cities G6

Te lo ruego chupete suazo, por favor

## Requisitos
- Docker Compose
## Set Up
1. Clonar el repositorio
2. Crear un archivo ```.env``` en  la carpeta ```./entrega0```.
```
DB_USERNAME={username de la base de datos}
DB_PASSWORD={password de la base de datos}
DB_NAME={nombre de la base de datos}
```
3. Crear un archivo ```.env``` la raíz del proyecto.
```
DB_USERNAME={username de la base de datos}
DB_PASSWORD={password de la base de datos}
DB_NAME={nombre de la base de datos}
REDIS_PASSWORD=redis
DB_HOST=db
DB_PORT=5432
EMAIL=gr6arqui@hotmail.com
EMAIL_PASSWORD=grupo6arqui
```
4. Correr ```docker compose build```.
5. Correr las migraciones en docker con ```docker compose run app yarn sequelize db:migrate```.
6. Correr el proyecto con ```docker compose up```.
## Otros
Link: http://arquitectmiguelecero.tk/ <-- api a la cual se conecta el front

El diagrama UML está en el repositorio del frontend.

La dificultad llega al mail, la otra forma de comprobar que se estan creando es con el siguiente comando:
sudo docker-compose run db psql -h db -U DB_USERNAME DB_NAME y luego poner DB_PASSWORD para revisarlo especificamente con SELECT * from difficulties.

