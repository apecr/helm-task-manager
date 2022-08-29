# Practica_4_Recuperacion_helm

## Cambios en la aplicación

_Se debe implementar un cambio básico en el Worker. Después de convertir a mayúsculas la palabra usando el ExternalService, se añadirá un guión como primer y último carácter._

Cambio añadido en [TaskManager](https://github.com/apecr/helm-task-manager/blob/main/app/worker/src/main/java/es/codeurjc/mastercloudapps/p3/worker/TaskManager.java#L66)

		String result = upperCaseTask.toUpperCase(newTask.text);
		result = "-"+result+"-";

Usando la imagen [torrespro/mca-worker:2.0.0](https://hub.docker.com/layers/280201027/torrespro/mca-worker/2.0.0/images/sha256-6d3bd305a1bad37b3cdd832482d2ebd785f87cf3c1e1ad615544484dafc9f100?context=repo)

_Para realizar este cambio, se utilizará una herramienta de desarrollo en la que el servicio Worker se pueda ejecutar en modo depuración (con un punto de ruptura en el código que implementa la lógica de negocio) y el resto de servicios se ejecuten en el cluster Kubernetes._

Hemos usado [Okteto](https://www.okteto.com/) para el debug y el punto de ruptura, aquí el [fichero de configuración de Okteto][1].

## Helm CHart

[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/mca-03-02-practica4-recuperacion)](https://artifacthub.io/packages/search?repo=mca-03-02-practica4-recuperacion)
![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: >1.0.0](https://img.shields.io/badge/AppVersion->1.0.0-informational?style=flat-square)

A Helm chart for Kubernetes

### Configuración de la password por defecto de los servicios de persistencia

_Las contraseñas se deberán crear de forma aleatoria, pero también se podrán
parametrizar sus valores. En ese caso, cuando se especifique el valor de una contraseña, se usará ese valor tanto para el servicio en sí (p.e. MySQL) como para el cliente de ese servicio (p.e. el server) sin tener que duplicar la contraseña en la configuración._

En este caso solamente hemos configurado la password de MySQL porque el servicio `worker` tiene la posibilidad de configurarse tanto el usuario como la password del servicio MySQL. Para `rabbit`y `mongo`, los servicios que los consumen no tienen la habilidad de parametrizar sus datos de conexión.

Para no generar nuevas imágenes del `server` y el `external-service`, hemos decidido solamente configurar la password y el username de MySQL.

La documentación del Helm está en el [siguiente fichero][2].

### Arrancar el minikube y la chart

```
minikube start --memory 8192 --cpus 4 --driver=hyperkit
minikube addons enable ingress
helm repo add torres.eyo https://apecr.github.io/helm-task-manager/
helm install task-manager-01 torres.eyo/Practica_4_Recuperacion_helm
helm upgrade task-manager-01 -f helm/without-ingress.yml torres.eyo/Practica_4_Recuperacion_helm
```

[1]: app/worker/okteto.yml
[2]: helm/README.md
