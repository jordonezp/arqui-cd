# IIC2173 - E1 - ERT DIY
*aka. Equipos de respuesta temprana, versión hazlo tu mismo*

Después de un alto éxito en la recuperación de datos de emergencia, su consultora LegitBusiness les ha pedido que pasen a una versión mas poderosa de su plataforma. Dado que el despliegue de un equipo ERT tiene un coste altísimo en una emergencia, se les ha pedido que realicen un sistema para buscar<sup>1</sup>y ver la evaluación de las emergencias que podrían tomar los equipos ERT. Para simplificar la plataforma lo más posible para sus usuarios, se les ha pedido que entreguen esta evaluación en forma de índice.

## Objetivo

Deben extender su plataforma web para que sea capaz de calcular índices de dificultad en base a los últimos mensajes recibidos

Utilizando a la conexión que ya poseen con el broker de eventos, su app debe seguir recolectando los datos según el formato de la E0

```json
{
    "type":"string",
    "lat":float,
    "lon":float,
    "location":"string",
    "message":"string",
    "level":int
}
```

Usando esta data, le presentará a los usuarios una lista de los eventos, de forma paginada. Los usuarios podrán escoger un evento y solicitar un **cálculo de complejidad** *I<sub>comp</sub>* que se explicará en la siguiente sección.

Adicionalmente, para empezar a lograr un proceso de implementación más expedita de su proyecto, se les pedirá que separen su solución en frontend y backend, además de implementar un proceso de *continuous integration*.

### *Cálculo de I<sub>comp</sub>*

El índice de complejidad se construye mediante la obtención de la suma de la distancia de los eventos a menos de 3 kilómetros de un evento seleccionado, teniendo cada distancia ponderada por el nivel de ese evento dividido por 100, considerando los últimos 2000 eventos. En fórmula sería así:

<center>
    <img width="20%" src="https://i.imgur.com/SxdiIpH.png">
</center>

Donde n = 1999, l_i es el nivel del evento i y d<sub>i</sub> es la distancia al evento seleccionado

Este cálculo tomará tiempo por lo que deberá hacerse mediante workers para no detener el flujo principal de su aplicación.

## Implementacion de los workers

Un worker es una instancia de un código generada específicamente para cumplir una tarea asignada, luego de lo cual podría tomar otra, esperar o desaparecer, en base a la alimentación que reciba de una cola de órdenes.

Estos workers se coordinan con un broker y una instancia maestra de coordinación

Afortunadamente, existen paquetes de software que simplifican el trabajo de la implementación de workers.

Recomendamos las siguientes implementaciones para los siguientes lenguajes

* FastAPI, Django
    * Celery
* Node
    * Bull
* Ruby on rails
    * Sideqik

Estos workers deben estar coordinados por un maestro independiente de su aplicación. Este maestro es completamente separado de su aplicación y ofrece una API HTTP para recibir las órdenes y ver los resultados. Ofrecerá tres endpoints 

* **GET** /job/(:id)
    * :id representa el id de un job creado

* **POST** /job
    * Recibe los datos necesarios para el cálculo y entrega un id del job creado

* **GET** /heartbeat
    * Indica si el servicio está operativo (devuelve `true`)

Pueden agregar los datos que deseen (u otros endpoints) mientras se calcule el indice que se solicite. Es clave recalcar que se adhieran al *single responsability principle*, y hagan este servicio lo más pequeño posible.

Debe estar disponible en otro container y debe llevar el tracking de los trabajos, cosa que se los puede proporcionar el framework que usen (usualmente es así por defecto).

En un diagrama simplificado, se vería así

![](https://i.imgur.com/ryNOto2.png)

Para el requisito de continuous integration, les recomendamos usar los siguientes proveedores junto a su repo de GitHub

* CircleCI
    * (*Habra ayudantia disponible*)
* Github Actions

## Ejemplo de flujo

Un usuario ingresa en la plataforma con credenciales creadas anteriormente a su aplicación. Este va a una lista de eventos disponibles y los revisa página por página. Para comenzar, escogera un trabajo y revisara el detalle de este. Aparecera el mensaje y un índice de dificultad. Pulsara un botón de "calcular dificultad" y se marcara el índice como pendiente. Despues de refrescar la página, podrá pasar que el índice esté calculado o no. Mientras se calcule, aparecera como "pendiente", pero si está calculado aparecera como listo.

## Especificaciones

**Si un requisito está marcado como *crit*, el no cumplirlo en un grado mínimo (al menos un punto) reducirá la nota máxima a *4.0*. NO se revisaran entregas que no estén en la nube**

Por otro lado, debido a que esta entrega presenta una buena cantidad de *bonus*, la nota no puede sumar más de 8, para que decidan bien que les gustaría aprovechar.

Al final de la entrega, la idea es que se pongan de acuerdo con su ayudante para agendar una hora y hacer una demo en vivo para su corrección.


### Requisitos funcionales (14 ptos)

* **RF1 *(2 ptos)*:** Sus usuarios deben poder registrarse en la plataforma con datos de contacto y un correo electrónico
* **RF2 *(2 ptos)*:** Los usuarios deben poder ver una lista paginada (de a 25 eventos) de los eventos disponibles en el servidor por orden de llegada.
    * Mostrar un mapa con los eventos de esa página tiene un bonus<sup>2</sup>  de (5 ptos)
* **RF3 *(7 ptos)*:** Debe poder verse el detalle de cada mensaje y pedir el cálculo del índice de complejidad
* **RF4 *(3 ptos)*:** Debe haber un indicador que muestre si el ***servicio*** maestro de workers está disponible.


### Requisitos no funcionales (38 ptos)

* **RNF1 *(6 ptos) (Esencial)*:** Deben usar un formato de Backend-Frontend separado: una API con respuestas JSON y un frontend. Esto es muy importante puesto que es crítico para las siguientes entregas. Usen un combo como Koa-React, Express-Flutter, FastAPI-Vue o cualquier otra combinación que les acomode.
* **RNF2 *(3 ptos) (Esencial)*:** Sus aplicaciones en backend deben estar en un container docker, cada una. Debe coordinarse el levantamiento mediante docker compose
* **RNF4 *(2 ptos) (Esencial)*:** Deben tener configuradas *Budget alerts*, para no alejarse del Free tier de AWS.
* **RNF5 *(8 ptos)*:** Deben implementar un pipeline de CI. Como proveedores aceptados están CircleCI, Github Actions y AWS codebuild. Recomendamos los dos primeros porque los ayudantes tienen experiencia en estos dos. Esta implementación debe correr un script que genere una imagen para containers de su servicio
    * Implementar un test trivial que pueda fallar (tipo `assert false` o similar) tiene un bonus de **3 ptos**

* **RNF5** (**15 ptos**): Deben crear el servicio que calcula los índices solicitados en el enunciado, el cual asigna tareas a *workers*, lleva el registro de trabajos y los resultados. Este servicio existe en un container *independiente*, se conecta via HTTP ofreciendo una API REST y posee workers conectados mediante un broker con capacidad de encolado/pubsub (redis/rabbitMQ), así como conexión a la base de datos del backend principal.
    * Separar los workers en contenedores propios tiene un bonus de **5 ptos**
* **RNF6** (***4 ptos***): Una vez que el cálculo de índices asociado a su solicitud de ping esté listo, deberán enviar una notificación vía correo a los usuarios que lo solicitaron. Este envío lo hace el servicio de cálculo de índices.

### Documentación (8 ptos)

* **RDOC1 *(4 ptos)*:** Deben crear un diagrama UML  de componentes de la entrega, con **explicaciones y detalle** sobre el sistema. Esto deben tenerlo para la fecha final de entrega y lo deben dejar dentro de su repositorio de Github en una carpeta `/docs`.
* **RDOC2 *(2 ptos)*:** Deben documentar los pasos necesarios para replicar el pipe CI/CD que usaron en su aplicación.
* **RDOC3 *(2 ptos)*:** Deben documentar alguna forma de correr su aplicación en un ambiente local para propósitos de testeo.


## Recomendaciones

* Comiencen la entrega lo antes posible, puesto que es mas sencillo ir trabajando de a partes y seguro tendrán dudas. Se les dio plazo extra para que se adecuen a sus equipos de trabajo.
* Planifiquen con antelación: pregunten dudas o ambigüedades a sus ayudantes.
* Ojo con los deploys a última hora, la maldición de la demo es muy real.
* Ocupen el Free Tier de AWS, que tiene capacidad para todos estos requerimientos. Deberían usar los siguientes servicios:
	* **EC2**: AWS les proporciona una instancia t2.micro gratuita al mes.
	* **S3**: Tienen 5 GB de almacenamiento y 20000 solicitudes GET.
	* **RDS** (Opcional, Recomendado): Tienen 20GB y una instancia básica al mes.
	* **API Gateway**: 1 MM de llamadas al mes
	* **Lambda (Opcional)**: Tienen 400K GB/s y 1 MM de solicitudes.
	* **EBS**: 30 GB al mes para almacenamiento de discos de sistema.
	* **Cloudfront**: 50 GB al mes de transferencia.
	* **Amazon SES**: 62000 mensajes salientes / mes.
* **NO** está planificado hacer devolución por uso de dolares en AWS. Para la entrega el free tier de AWS es suficiente para conseguir todos los puntos. En caso de utilizar dólares en su solución, el curso no puede hacerles devolución de estos bajo ninguna causa.
* Usen una cuenta nueva o de alguien que no tenga otras cargas en AWS, para evitar cargos por ahora, además de usar una tarjeta prepago y los budget alerts de AWS para evitar costos oculto<sup>4</sup> .
* **USEN LEAFLET** para los mapas, o la API de google maps que tiene un free tier bastante generoso.

### Consideraciones

No se considerarán entregas:
* Con componentes que corran en sus computadores o servidores que no sean los básicos de Azure/AWS/GCP/Cloudfront. Algunos ejemplos, los servicios de AWS serían:
    * EC2
    * VPC
    * IAM
    * S3
    * Lambda
* Montadas en Heroku/Firebase/Elastic beanstalk/Lightsail/Netlify o similares.
* Que no estén documentadas.


# Puntaje

### Atraso

Para esta entrega se les descontará 0.5 puntos en la nota máxima por horas Fibonacci con F1 = 6 y F2 = 6. 

Se considerará como atraso cualquier modificación en features o implementación que tenga que ver solo con lo que se pide en esta entrega.

| Fibonacci | Hora               | Nota maxima |
|-----------|--------------------|-------------|
| 6         | 0:01 - 5:59        | 6.5         |
| 6         | 6:00 - 11:59       | 6           |
| 12        | 12:00 - 23:59      | 5           |
| 18        | 24:00 - 41:59      | 4.5         |
| 30        | 42:00 - 71:59      | 4           |
| ...       | 72:00 en adelante  | 1           |

### Grupal

La nota se calcula como:

**E<sub>1 grupal</sub> = 1 + E<sub>1 RF</sub> + E<sub>1 RNF</sub> + E<sub>1 RDOC</sub>**

Siendo **E<sub>1 RF</sub>** el puntaje ponderado de los requisitos funcionales, y **E<sub>1 RNF</sub>** el correspondiente a los requisitos no funcionales y **E<sub>1 RDOC</sub>** de la documentación.

### Individual

Segun el programa del curso<sup>5</sup> , esto se evalua como:

**E<sub>1</sub> = 1 + ((E<sub>1 grupal</sub> - 1) * F<sub>g</sub>)**			
Donde F<sub>g</sub> es un factor de coevaluación asignado por el grupo que va de 0 a 1.2. Para esto se enviará un form de coevaluación donde cada integrante deberá evaluar a sus compañeros de grupo con una puntuación entre 1 y 5. 

**No podrán asignarle 5 puntos a más de un compañero, y sí lo hacen, se considerará que se entregó un máximo de 4 puntos a cada compañero**.

De no realizar la coevaluación, asumiremos que se le entregó el mismo puntaje de coevaluación a cada integrante, es decir 4 puntos.

## Links útiles

* [Documentación de Celery](https://docs.celeryq.dev)
* [Documentación de Bull](https://optimalbits.github.io/bull/)
* [Circle CI Blogs - CI para Django](https://circleci.com/blog/continuous-integration-for-django-projects/)

## Apoyo

Cada grupo tendrá un ayudante asignado el cuál podrán elegir mediante un link que se les mandará oportunamente. Este ayudante está encargado de hacerles seguimiento y orientar sus dudas para responderlas ellos mismos y el equipo de ayudantes. Les recomendamos **fuertemente** que pregunten sus dudas a su ayudante de seguimiento puesto que conocen del proyecto o pueden dirigir sus dudas a otros ayudantes. Puede ser de enunciado, código o algún tópico<sup>3</sup>  que tenga que ver con el proyecto

Dado que cada ayudante puede tener pequeñas diferencias en sus correcciones, queda a criterio de este hacer relajos o hacer mas estrictas ciertas particularidades. Intenten tener un flujo de comunicación directo con sus ayudantes para aclarar posibles diferencias o decisiones de diseño.

Pueden usar el Slack del curso para dudas más rápidas. Usen el [canal #e1](https://arqui-software.slack.com/archives/C037YKULFQF) para sus dudas.

Las ayudantías programadas relevantes para esto por ahora son:

* CronJobs y Workers (Cápsula)
* Continuous Integration

También está presupuestada una sala de ayuda para el proyecto con fecha a anunciarse.

Se les avisará con antelación cuándo son y si habrá más.

***rsYdA0bMwMoF9eWuEM6z***