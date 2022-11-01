# IIC2173 - E2 - ERT HQV

*aka. Equipos de respuesta temprana, high quality version*

## Objetivo

La entrega está intencionada para que creen un diseño sólido de una aplicación utilizando diversas herramientas clave a la hora de ofrecer una aplicación cualquiera. Además, se introducirá el uso de Serverless como tecnología altamente útil y escalable.

## Enunciado

Felicidades! Al haber logrado el MVP de la primera parte de la solución, el CEEEEO (Chief Executive Expectations Excellence Efficience Officer segun dice) de LegitBusiness, el mas alto cargo de la organización, les ha pedido que continuen con su proyecto para que lo enfoquen a una instancia colaborativa.
Antes de implementar la parte más importante de su sistema (la que vendrá en la siguiente iteración), el CEEEEO les pide que ofrezcan una base técnica potente, la cual será clave para que su solución sea mantenible, escalable y segura. 

Finalmente, les han pedido la capacidad de emitir reportes en PDF para ofrecer capacidades de reportería y archivado, tan comunes en los sistemas interconectados

## Especificaciones

**Si un requisito está marcado como *crit*, el no cumplirlo en un grado mínimo (al menos un punto) reducirá la nota máxima a *4.0*. NO se revisaran entregas que no estén en la nube**

Por otro lado, debido a que esta entrega presenta una buena cantidad de *bonus*, la nota no puede sumar más de 8, para que decidan bien que les gustaría aprovechar.

Para esta entrega, deben completar todos los requisitos de la entrega pasada marcados como **Esencial**, puesto que son necesarios para completar esta entrega. **Cada feature *Esencial* faltante, incurre en un descuento de *0.4 pto***

Al final de la entrega, la idea es que se pongan de acuerdo con su ayudante para agendar una hora y hacer una demo en vivo para su corrección.

### Requisitos funcionales (8 ptos)

* **RF01** (**8 ptos**) ***crit***: Cada punto debe tener la opción de generar un PDF como reporte de situación del punto. Este reporte trae una foto del mapa, los datos en un formato accesible y un timestamp.


### Requisitos no funcionales (47 ptos)

* **RNF01** (***8 ptos***) ***crit*** : Su app debe estar detrás de una AWS API gateway tipo REST, con los endpoints declarados en esta. Debe asociarse un subdominio a esta (e.g. api.miapp.com) y debe tener CORS correctamente configurado.

* **RNF02** (***9 ptos***) ***crit***: Deben implementar un servicio de autenticacion/autorización (auth). Este servicio puede ser en base a un servicio de tercros como Auth0, cognito o pueden hacerlo ustedes. Si hacen un servicio ustedes desde 0, tienen un bonus de **5 ptos**. Este RNF requiere que ustedes extraigan toda la lógica de los usuarios de la app principal y la trasladen a el servicio hecho por ustedes o el externo. Recomendamos fuertemente usar el modelo Oauth o como mínimo intercambiar tokens JWT con la audiencia e issuer correctos.

* **RNF03** (***3 ptos***): Su frontend debe estar desplegado en S3 con una distribución Cloudfront. Todos los assets de su aplicación Web, tales como imágenes, iconos, videos y archivos dinámicos (incluyendo los del RF4) deben estar en un bucket en AWS S3 standard.

* **RNF04** (***3 ptos***): Su API Gateway debe poder usar al servicio del RNF02 para autenticar a los usuarios directamente.

* **RNF05** (***9 ptos***): La aplicación tiene que ofrecer un servicio de generacion de reportes PDF desde AWS Lambda, según lo explicado en las secciones anteriores. Este reporte debe almacenarse en S3 y se le debe entregar al usuario un enlace público para descargarlo desde S3. Deben utilizar Serverless.js o AWS SAM para manejar y desplegar esta función. Crear un pipe CI/CD para  tiene un bonus de **4 ptos**

* **RNF06** (***3 ptos***) ***crit*** : Su app debe ofrecer su backend y frontend utilizando HTTPS

* **RNF07** (***5 ptos***): Deben implementar CD en su pipeline CI/CD para **backend**. Como proveedores aceptados de CI están Github Actions, Codebuild y CircleCI. Para deployment deben usar AWS codedeploy.

* **RNF08** (***5 ptos***): Deben implementar CD en su pipeline CI/CD para **frontend**. Como proveedores aceptados de CI están Github Actions, Codebuild y CircleCI. Para deployment deben subir su frontend a AWS S3 e invalidar la caché de Cloudfront que sirve su frontend

### Documentación (5 ptos)

* **RDOC1 *(5 ptos)* crit:** Deben actualizar los documentos en `/docs` para reflejar
    * Como subir su aplicación en Serverless/SAM, paso a paso
    * Documentaci''on de su API Gateway
* 
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

# Apoyo

Cada grupo tendrá un ayudante asignado el cuál podrán elegir mediante un link que se les mandará oportunamente. Este ayudante está encargado de hacerles seguimiento y orientar sus dudas para responderlas ellos mismos y el equipo de ayudantes. Les recomendamos **fuertemente** que pregunten sus dudas a su ayudante de seguimiento puesto que conocen del proyecto o pueden dirigir sus dudas a otros ayudantes. Puede ser de enunciado, código o algún tópico que tenga que ver con el proyecto

Dado que cada ayudante puede tener pequeñas diferencias en sus correcciones, queda a criterio de este hacer relajos o hacer mas estrictas ciertas particularidades. Intenten tener un flujo de comunicación directo con sus ayudantes para aclarar posibles diferencias o decisiones de diseño.

Pueden usar el Slack del curso para dudas más rápidas. Usen el [canal #e1](https://arqui-software.slack.com/archives/C037YKULFQF) para sus dudas.

Las ayudantías programadas relevantes para esto por ahora son:

* S3 Upload
* API Gateway
* Serverless SAM
* CD

También está presupuestada una sala de ayuda para el proyecto con fecha a anunciarse.

Se les avisará con antelación cuándo son y si habrá más.
