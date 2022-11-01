
# TODO
- [ ] Cola de órdenes. Si no hay nada en cola bajar el worker
- [ ] Broker
- [ ] Instancia maestra de coordinación que ofrezca API HTTP
  - [ ] Endpoint POST (job)
      - [ ] Obtener de la BD los eventos a menos de 3 km
      - [ ] Calcular complejidad pedida
      - [ ] Notificar vía mail
  - [ ] Endpoint GET (job)
  - [ ] Endpoint GET (heartbeat)
- [ ] Llevar tracking de los jobs
- [ ] DockerFile y DockerCompose


# Tareas
- [ ] Conectar BD
- [ ] Pensar en la query para encontrar los eventos cercanos
- [ ] Migración Table jobs
- [ ] Agregar rails a las dependencias
- [ ] 


# Referencias
Workers
- https://www.youtube.com/watch?v=Gcp7triXFjg
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
  
Bull
- https://github.com/OptimalBits/bull
- https://dev.to/franciscomendes10866/how-to-create-a-job-queue-using-bull-and-redis-in-nodejs-20ck
- https://optimalbits.github.io/bull/