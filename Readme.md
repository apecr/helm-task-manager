### Ingress
* Se realiza la configuración del servicio ingress para la url: http://cluster-ip/ en el archivo k8s\2.server.yml

Para comprobar el correcto funcionamiento:
1. Se configura en el host local el dominio http://cluster-ip/
2. Se realizan diferentes pruebas con la aplicación 

### PersistentVolumes
* Se modifica la aplicacion server para poder consultar el histórico de datos almacenados en mongo
* Se realiza la configuración necesaria para que los servicios mysql y mongodb hagan uso de PersistentVolumes:
  * **1.mongo.yml**: Se realiza la configuracion del PersistentVolume, PersistentVolumeClaim y el volumen del container (hostPath: /db/mongo)
  * **1.mysql.yml**: Se realiza la configuracion del PersistentVolume, PersistentVolumeClaim y el volumen del container (hostPath: /db/mysql)  

Para comprobar el correcto funcionamiento:
1. Se crea una tarea
2. Se consulta el histórico
3. Se borra el pod del servicio mongo
4. Una vez recreado el pod del servicio mongo, se consulta el histórico y se comprueba que los datos son los mismos que en el punto 2

### Cambio de usuario en la ejecución de los contenedores
* Se realizan las siguientes modificaciones en los archivos: 2.external-service.yml, 2.server.yml y 2.worker.yml:
  * Se configura el deployment para que los pod y contenedores se ejecuten con el usuario 1001
  * Se configura el contenedor para que no se ejecuten comandos como root
  
Para comprobar el correcto funcionamiento:
1. Se lanza la aplicación
2. Se realiza una conexión a la shell de los container y se comprueba con whoami que el usuario es 1001

### Network polices
Se generan las siguientes network polices en el fichero k8s\3.network-policies.yml:
1. **default-deny**: Se deniega todo el tráfico externo
2. **allow-external**: Se permite el tráfico externo a la aplicación server
3. **rabbit-allow**: Se permite el tráfico interno al servicio rabbitmq de las aplicaciones server y worker
4. **mongo-allow**: Se permite el tráfico interno al servicio mongo de la aplicación server 
5. **mysql-allow**: Se permite el tráfico interno al servicio mysql de la aplicación worker
6. **external-service-2-worker**: Se permite el tráfico interno a la aplicación external-service de la aplicacion worker
7. **worker-2-external-service**: Se permite el tráfico interno a la aplicación worker de la aplicacion external-service
8. **worker-2-mysql**: Se permite el tráfico interno a la aplicación worker de la aplicacion mysql
9. **worker-2-mongo**: Se permite el tráfico interno a la aplicación worker de la aplicacion mongo

Para comprobar el correcto funcionamiento: se van aplicando cada una de las network policies y se comprueba si la aplicación funciona correctamente

#### Desplegar la aplicación en k8s: 
```
 kubectl apply -f .\k8s\
```

#### Eliminar el namespace creado:
```
kubectl delete namespace mca-app
```

```
helm repo add httpd-server https://apecr.github.io/helm-task-manager/
helm install task-manager-01 httpd-server/Practica_4_Recuperacion_helm
```


