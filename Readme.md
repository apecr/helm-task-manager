# Practica_4_Recuperacion_helm

[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/mca-03-02-practica4-recuperacion)](https://artifacthub.io/packages/search?repo=mca-03-02-practica4-recuperacion)
![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.16.0](https://img.shields.io/badge/AppVersion-1.16.0-informational?style=flat-square)

A Helm chart for Kubernetes

#### Arrancar el minikube y la chart

```
minikube start --memory 8192 --cpus 4 --driver=hyperkit
minikube addons enable ingress
helm repo add alberto.eyo https://apecr.github.io/helm-task-manager/
helm install task-manager-01 alberto.eyo/Practica_4_Recuperacion_helm
helm upgrade task-manager-01 -f helm/without-ingress.yml alberto.eyo/Practica_4_Recuperacion_helm
```