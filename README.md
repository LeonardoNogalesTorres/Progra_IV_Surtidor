#  Sistema de Gestión de Estación de Servicio

Sistema multiplataforma para el monitoreo en tiempo real de surtidores de combustible, registro de ventas, control de inventario y gestión de alertas críticas.

**Autor:** Leonardo Nogales Torres

---

##  Stack Tecnológico

* **Frontend:** VanillaJS
* **Backend & Base de Datos:** Supabase
* **Arquitectura:** MVC + Patrones de Diseño
* **UI / Diseño:** [Ver prototipo en Figma](https://www.figma.com/design/YXk5gWIib7JWlLfUCoCAQD/Surtidor?node-id=0-1&t=MfZh1w3OqIcVFnFr-1)
* **Despliegue:** Vercel
* **Calidad & Testing:** *(En desarrollo)*

---

## Vista previa del proyecto

![Google Stitch Preview](assets/screen_2.png)

---

##  Credenciales de Acceso para Pruebas

Para explorar el sistema sin necesidad de registrarte, puedes iniciar sesión con alguno de los siguientes perfiles:

* **👑 Administrador**
  * **Email:** `admin@gasadmin.com`
  * **Password:** `admin123`

* **👤 Usuario Estándar**
  * **Email:** `juan@gmail.com`
  * **Password:** `user123`

---

##  Arquitectura y Patrones de Diseño *(En desarrollo, dispuesto a cambio)*

El núcleo de la aplicación utiliza tres patrones de diseño fundamentales para garantizar escalabilidad y desacoplamiento:

1. **Factory Pattern (Creacional):** Instanciación dinámica de objetos de la clase `Surtidor` según el tipo de combustible (*Gasolina Premium, Especial, Diesel, GNV*).
2. **Adapter Pattern (Estructural):** Abstracción de la capa de persistencia (`DatabaseAdapter`) para alternar fluidamente entre almacenamiento local (*SQLite*) y almacenamiento en la nube (*Supabase*).
3. **Observer Pattern (Comportamiento):** Suscripción en tiempo real a los eventos de los surtidores para el disparo de alertas instantáneas cuando el nivel cae por debajo del umbral crítico.

###  Lógica de Bajo Nivel (Aritmética Binaria) *(En desarrollo, dispuesto a cambio)*

Los estados operativos del surtidor (*Activo, Inactivo, Mantenimiento, Alerta Nivel Bajo, Fuga*) se almacenan comprimidos mediante **máscaras de bits (bitmasks)** en la columna `estado_mask`. Los reportes ejecutan decodificadores con operaciones *bitwise* (`&`, `|`, `>>`) para descomprimir y presentar el diagnóstico.

---

## 📅 Cronograma de Desarrollo

| Fase | Contenido | Estado |
|---|---|---|
| **Fase 1 – Setup, Base de Datos & Roles** | Repositorio GitHub, Esquema relacional en Supabase (PostgreSQL), Triggers automáticos, Control RLS y Sistema de Autenticación por Roles (*Admin / Cliente*). | ✅ Completado |
| **Fase 2 – UI/UX & Maquetación Web** | Prototipado e interfaz Web Responsive en Vanilla JS + Tailwind CSS (Dashboard, Surtidores, Punto de Venta, Panel de Alertas y Reportes). | ✅ Completado |
| **Fase 3 – Patrones de Diseño & Lógica MVC** | Implementación de **Factory** (Instanciación de Surtidores), **Adapter** (Persistencia Supabase) y **Observer** (Alertas en Tiempo Real) integrados en controladores MVC. | 🔄 En curso |
| **Fase 4 – Núcleo Binario & Diagnóstico** | Funciones de Aritmética Binaria Operadores **Bitwise** y Decodificador de `estado_mask` para reportes técnicos de hardware. | 🔄 En curso |
| **Fase 5 – Calidad, Testing & Deploy** | Pruebas unitarias en Jest, análisis estático de código en SonarQube y despliegue continuo en Vercel/Render. | ⬜ Pendiente |

---
