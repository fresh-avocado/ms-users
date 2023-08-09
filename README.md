# ms-users

Este microservicio se encarga de manejar el registro e inicio de sesión de los usuarios de tipo `Cliente` y `OnRoad`. Crea la sesión de cada usuario en Redis, la cual los demás microservicios (`ms-chat`, `ms-itinerary`) usan para autorizar sus acciones.
