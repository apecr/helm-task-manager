# Practica_4_Recuperacion_helm

[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/mca-03-02-practica4-recuperacion)](https://artifacthub.io/packages/search?repo=mca-03-02-practica4-recuperacion)
![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: >1.0.0](https://img.shields.io/badge/AppVersion->1.0.0-informational?style=flat-square)

A Helm chart for Kubernetes

## Configuración de las password por defecto de los serivcios de persistencia

En este caso solamente hemos configurado la password de MySQL porque el servicio `worker` tiene la posibilidad de configurarse tanto el usuario como la password del servicio MySQL. Para `rabbit`y `mongo`, los servicios que los consumen no tienen la habilidad de parametrizar sus datos de conexión.

Para no generar nuevas imágenes del `server` y el `external-service`, hemos decidido solamente configurar la password y el username de MySQL.

## Arrancar el minikube y la chart

```
minikube start --memory 8192 --cpus 4 --driver=hyperkit
minikube addons enable ingress
helm repo add torres.eyo https://apecr.github.io/helm-task-manager/
helm install task-manager-01 torres.eyo/Practica_4_Recuperacion_helm
helm upgrade task-manager-01 -f helm/without-ingress.yml torres.eyo/Practica_4_Recuperacion_helm
```