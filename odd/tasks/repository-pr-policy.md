# Preparación de la política de issues y pull requests

## Objetivo

Agregar la gobernanza mínima de issues y pull requests necesaria para abrir el PR del MVP de Calculator con aprobación trazable, clasificación por tipo y una decisión explícita sobre su tamaño de revisión.

## Problema y justificación

El repositorio nuevo de GitHub no tiene un formulario YAML para issues y carece de las etiquetas protegidas exigidas por el flujo activo de pull requests. La rama terminada no puede producir un PR conforme hasta que esos controles existan en la rama principal y haya un issue aprobado vinculado.

## Alcance

- Agregar un formulario YAML para solicitudes de funcionalidad en la rama principal.
- Crear las etiquetas faltantes `status:approved`, `type:feature` y `size:exception`.
- Crear un issue de funcionalidad a partir del formulario, luego de buscar duplicados y revisar la privacidad del contenido.
- Solicitar autorización explícita del mantenedor antes de aplicar las etiquetas protegidas de aprobación y excepción de tamaño.
- Traducir al español la documentación Markdown existente antes de abrir el PR.
- Abrir un pull request desde `feat/calculator-interface` hacia `main`, vinculado al issue aprobado y con exactamente una etiqueta `type:*`.
- Verificar el issue, las etiquetas, los metadatos del PR, el límite del diff y los checks disponibles.

## Restricciones y decisiones

- Destino: `github.com/JTGNzdev/calculator`.
- El actor autenticado tiene permisos `admin` y `maintain` en el repositorio.
- El repositorio es privado y tiene Issues habilitados.
- El usuario autorizó explícitamente preparar la política mínima del repositorio.
- El formulario de issues y este registro deben llegar a `main` antes de crear el issue, porque los formularios sólo son autoridad desde la rama principal.
- Toda la documentación Markdown, incluida la existente, debe estar en español. La comunicación interna entre agentes puede permanecer en inglés.
- La rama de Calculator no se modifica hasta que termine la preparación de la política en `main`.
- El PR de Calculator contiene aproximadamente 1.045 líneas modificadas. Una división honesta todavía deja la unidad cohesiva de interfaz, tests y CSS por encima de 400 líneas; por eso se requiere una `size:exception` documentada, en lugar de separar artificialmente código y pruebas.
- No se crea ni fusiona un pull request sin la autorización explícita correspondiente.

## Tareas

- [x] **PRPOL-01 — Preparar la política en la rama principal**
  - Ruta: writer delegado para el formulario YAML; el padre administra las etiquetas y la entrega Git.
  - Agregar `.github/ISSUE_TEMPLATE/feature.yml` con controles obligatorios de problema, resultado, alcance, aceptación y verificación.
  - Crear las etiquetas faltantes con descripciones claras.
  - Verificar la estructura YAML y subir el commit de política a `main`.
  - Checks: el formulario se puede interpretar; existen los controles y etiquetas esperados; `main` queda sincronizada.
  - Commit autorizado: `chore: add repository issue workflow`.

- [ ] **PRPOL-02 — Crear y aprobar el issue de Calculator**
  - Ruta: flujo de GitHub administrado por el padre mediante el formulario del repositorio.
  - Buscar duplicados entre issues abiertos y cerrados.
  - Materializar el issue con evidencia verificada del proyecto y crearlo una sola vez.
  - Solicitar autorización exacta para las etiquetas protegidas cuando exista el número de issue.
  - Aplicar y releer `status:approved` y `size:exception` únicamente después de la autorización explícita.
  - Checks: el cuerpo coincide con el formulario; las etiquetas y el estado se verifican en GitHub.

- [ ] **PRPOL-03 — Traducir la documentación y abrir el pull request**
  - Ruta: writer delegado para traducir los Markdown; flujo de GitHub administrado por el padre.
  - Traducir `README.md` y el registro activo de Calculator sin alterar comandos, nombres de archivos ni comportamiento documentado.
  - Integrar la política de `main` en `feat/calculator-interface` sin cambiar el comportamiento de la aplicación.
  - Abrir un PR hacia `main` que cierre el issue aprobado, incluya la justificación de tamaño, resuma los cambios y registre el plan de pruebas.
  - Agregar exactamente una etiqueta de tipo: `type:feature`.
  - Verificar metadatos, base/head, etiquetas y checks disponibles.
  - Checks: URL estable del PR; vínculo correcto al issue; conjunto exacto de etiquetas; rama sin fusionar.

## Criterios de aceptación

- La rama principal contiene un formulario YAML válido para solicitudes de funcionalidad.
- Existen las etiquetas necesarias con descripciones inequívocas.
- El issue vinculado se crea desde el formulario y recibe aprobación explícita de un mantenedor autorizado.
- La excepción de tamaño es explícita y está justificada por la unidad cohesiva de interfaz, tests y CSS.
- Toda la documentación Markdown del proyecto queda en español.
- El PR apunta a `main`, sale de `feat/calculator-interface`, vincula el issue y tiene exactamente una etiqueta `type:*`.
- No se realiza ningún merge.

## Progreso y evidencia

- Descubrimiento inicial: no había archivos `.github`, issues ni PR existente para la rama de funcionalidad.
- Las etiquetas existentes son únicamente las predeterminadas de GitHub; faltan las etiquetas del flujo.
- Capacidad del repositorio: el actor autenticado tiene permisos `admin` y `maintain`.
- Evidencia de la aplicación: pasan 63 tests y el build de producción; la rama de funcionalidad está sincronizada con su remoto.
- Preferencia de idioma confirmada: todos los Markdown existentes y futuros deben estar en español.
- PRPOL-01: el formulario contiene cinco campos obligatorios en español y sólo aplica `enhancement` al crear el issue; la verificación estructural independiente fue aceptada en `main`.
- Etiquetas creadas y verificadas en GitHub: `status:approved`, `type:feature` y `size:exception`, con descripciones en español.
- Incidente resuelto: un checkout posterior había devuelto el worktree a la rama de funcionalidad; el reflog permitió diagnosticarlo y se recuperó `main` sin perder los archivos no rastreados.
- Los archivos `.DS_Store` no relacionados permanecen sin rastrear y no se incluyeron en el alcance.

## Próximo paso

Crear y subir el commit de preparación en `main`; luego buscar duplicados y crear el issue de Calculator mediante el formulario.
