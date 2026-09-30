# MVP de Calculator

## Objetivo

Construir una aplicación web de calculadora moderna y responsive que refuerce
los fundamentos de frontend con una arquitectura simple y mantenible de React y
TypeScript.

## Problema y justificación

Este es el primer proyecto de un recorrido progresivo de aprendizaje de
desarrollo de software. La implementación debe mantener las reglas de la
calculadora separadas de la presentación en React para que la lógica en
JavaScript, las garantías de TypeScript y las responsabilidades de React
permanezcan visibles y enseñables.

## Alcance

- Aritmética: suma, resta, multiplicación y división.
- Entrada decimal, cambio de signo, borrar todo y eliminar el último dígito
  ingresado.
- Visualización de la operación y del resultado.
- Manejo de división por cero y de entradas inválidas.
- Interacción por botones y por teclado básico.
- Interfaz moderna y responsive.
- Pruebas enfocadas de lógica y de componentes.
- README del proyecto y preparación del Git local.

## Fuera de alcance

- Backend, base de datos, autenticación, operaciones científicas o servicios
  externos.
- Abstracciones prematuras, librerías de estado o dependencias innecesarias.
- Creación de repositorio remoto, push o creación de pull requests.

## Restricciones y decisiones

- Stack: React, TypeScript, Vite, CSS, Vitest, React Testing Library, Git.
- Mantener las dependencias al mínimo y usar la configuración estándar de Vite
  para React con TypeScript.
- Usar un módulo pequeño de estado puro de calculadora para el comportamiento
  del dominio, y React para el renderizado y el cableado de eventos.
- Los artefactos técnicos y los textos de la interfaz usan inglés, según la
  convención de idioma de artefactos del proyecto.
- Modo TDD: no configurado; usar verificaciones ordinarias de implementación
  comportamiento-primero sin declarar evidencia RED/GREEN.
- El commit, la creación del repositorio y el push inicial están autorizados
  para el primer límite de versionado; las operaciones remotas posteriores
  siguen requiriendo autorización explícita del usuario.
- Destino en GitHub: repositorio privado `JTGNzdev/calculator` con `origin`
  local configurado por HTTPS.
- Estrategia de entrega: `ask-on-risk`; pronóstico de aproximadamente 650–850
  líneas modificadas de autoría entre implementación, pruebas, CSS y
  documentación. El bootstrap inicial del repositorio es un único límite inicial
  autorizado explícitamente; no se solicita pull request.

## Tareas

- [x] **CALC-01 — Preparar la aplicación y el entorno de pruebas**
  - Ruta: agente de escritura delegado (escritura de múltiples archivos y
    disparador de preparación).
  - Crear un proyecto mínimo de Vite con React y TypeScript y configurar Vitest
    con jsdom y React Testing Library.
  - Establecer los scripts de desarrollo, build, pruebas y verificación
    enfocada sin cobertura.
  - Inicializar un repositorio Git local y preservar `.atl/` como estado
    local ignorado.
  - Verificaciones: la instalación de dependencias funciona; la ejecución
    inicial de pruebas arranca; el build de TypeScript/Vite funciona.
  - Commit sugerido: `chore: bootstrap React calculator project`.

- [x] **CALC-02 — Implementar el comportamiento tipado de la calculadora**
  - Ruta: agente de escritura delegado (la lógica más las pruebas enfocadas
    tocan varios archivos).
  - Implementar transiciones de estado puras y tipadas para dígitos, entrada
    decimal, operadores, igual, cambio de signo, borrar, eliminar y errores.
  - Cubrir aritmética, encadenamiento, manejo de decimales, entrada inválida
    repetida, división por cero y recuperación de errores.
  - Verificaciones: pasan las pruebas enfocadas de la lógica de la calculadora;
    el build de TypeScript funciona.
  - Commit sugerido: `feat: implement calculator state and arithmetic`.

- [x] **CALC-03 — Construir la interfaz responsive de React**
  - Ruta: agente de escritura delegado (componente, estilos y pruebas de
    componente son una unidad de múltiples archivos).
  - Renderizar las visualizaciones de operación/resultado y los controles de
    la calculadora.
  - Cablear los eventos de botones y la entrada básica de teclado con etiquetas
    accesibles y un comportamiento de foco razonable.
  - Agregar CSS moderno responsive sin una librería de componentes.
  - Verificar el comportamiento relevante de interacción, teclado,
    visualización y errores con React Testing Library.
  - Verificaciones: pasan las pruebas de componentes; el build de producción
    funciona; no hay desbordamiento visible de layout en anchos estrechos.
  - Commit sugerido: `feat: add responsive calculator interface`.

- [x] **CALC-04 — Documentar y verificar el proyecto**
  - Ruta: agente de escritura delegado para el README; la ruta de verificación
    fue determinada por evaluación nativa después del retorno del agente de
    escritura.
  - Escribir las secciones del README: descripción, stack, instalación,
    scripts, uso, funcionalidades, estructura del proyecto, límites de
    aprendizaje y publicación futura.
  - Ejecutar la suite completa de pruebas y el build de producción.
  - Revisar el estado del repositorio y documentar los límites de commit
    propuestos sin hacer commit.
  - Verificaciones: pasan todas las pruebas; pasa el build de producción; los
    comandos del README coinciden con los scripts del paquete.
  - Commit sugerido: `docs: document calculator setup and usage`.

## Criterios de aceptación

- Cada acción solicitada de la calculadora funciona mediante botones visibles.
- Los controles básicos de teclado funcionan para dígitos, decimales,
  operadores, Enter/igual, Backspace, Escape y cambio de signo.
- La pantalla distingue claramente la expresión actual del valor o error
  actual.
- La división por cero y las entradas numéricas inválidas nunca rompen la
  aplicación y proveen un estado de error recuperable.
- El comportamiento puro de la calculadora se prueba de forma independiente de
  React.
- El comportamiento significativo de la interfaz se prueba sin aserciones sobre
  detalles de implementación.
- `npm test -- --run` y `npm run build` pasan antes de reportar la
  finalización.
- El layout se mantiene utilizable en anchos de escritorio y móviles.
- El README documenta con precisión la instalación y el uso.
- No se realiza ninguna operación Git remota.

## Progreso y evidencia

- Estado actual: CALC-01 a CALC-04 están implementadas, verificadas,
  commiteadas y listas en `feat/calculator-interface`.
- Resultado de CALC-01: estructura inicial mínima de Vite 6 + React 19 +
  TypeScript,
  Vitest 3 con jsdom y React Testing Library, referencias estrictas de
  proyecto, prueba inicial accesible de render, y artefactos de dependencias,
  build y entorno de ejecución ignorados.
- Verificación de CALC-01: `npm install`, pruebas enfocadas, build de
  producción, verificación independiente y comprobación del padre pasaron todos.
- Resultado de CALC-02: transiciones de estado puras y tipadas y formateadores
  de pantalla que soportan aritmética, decimales, cambio de signo, borrar,
  eliminar, encadenamiento inmediato, reemplazo de operador, igual,
  recuperación de división por cero, comportamiento post-resultado y protección
  contra valores no finitos.
- Verificación del agente de escritura de CALC-02: `npm test -- --run
  src/calculator` pasó
  (42 pruebas inicialmente, 48 tras la corrección); `npm run build` pasó.
- La verificación independiente de CALC-02 encontró inicialmente que una
  entrada directa sobredimensionada podía volverse `Infinity` y que las
  pruebas eludían el módulo público. Una corrección acotada agregó guardas de
  entrada finita e importaciones/pruebas a nivel del módulo público.
- La verificación independiente final de CALC-02 pasó (48 pruebas y build de
  producción); no quedaban blockers.
- Comprobación del padre: `npm test -- --run` completo pasó (2 archivos, 49
pruebas).
- Problema conocido no bloqueante: `npm install` reportó dos advisories moderados
  de dependencias transitivas de desarrollo en la cadena de jsdom; no se
  intentó ninguna mutación forzada de audit.
- Evidencia de commit: `ff90107` (`feat: bootstrap typed calculator core`)
  contiene el límite verificado de CALC-01 y CALC-02 y fue subido a
  `origin/main`.
- Evidencia del repositorio: `https://github.com/JTGNzdev/calculator`
  privado, rama por defecto `main`, `origin` por HTTPS, push limpio y
  sincronizado.
- Resultado de implementación de CALC-03: interfaz responsive de la calculadora
  en React, visualización accesible de expresión/resultado/error, controles
  por botones, mapeo de teclado, guardas de modificadoras, limpieza de
  listeners, CSS mobile-first y 15 pruebas de comportamiento de componentes.
- La verificación del agente de escritura de CALC-03 pasó (63 pruebas totales
  y build de producción). La verificación independiente encontró inicialmente semántica
  faltante de expresión en vivo y cobertura incompleta de regresión de
  teclado/ciclo de vida; una corrección acotada agregó anuncios corteses de
  expresión y cuatro pruebas dirigidas.
- La verificación independiente final de CALC-03 pasó sin blockers; la comprobación
  del padre `npm test -- --run` pasó (2 archivos, 63 pruebas), y la
  lectura estructural confirmó que React delega aritmética y formateo a la API
  pública del dominio.
- Evidencia de commit de CALC-03: `430f868`
  (`feat: add responsive calculator interface`) contiene la unidad cohesiva de
  interfaz, pruebas, CSS y actualización del registro; fue subido a
  `origin/feat/calculator-interface`. No se creó ningún pull request.
- Resultado de CALC-04: `README.md` documenta propósito, stack,
  instalación, scripts, funcionalidades, controles de teclado, estructura del
  proyecto, límites de aprendizaje, pruebas, contexto del repositorio e ideas
  futuras.
- La verificación del agente de escritura de CALC-04 pasó (63 pruebas y build
  de producción).
  La verificación independiente encontró una frase de recuperación inexacta
  (sólo `C`); el padre la corrigió a la acción de borrar (`C` o `Escape`).
- La verificación independiente final de CALC-04 aceptó el README y el proyecto;
  `npm test -- --run` y `npm run build` pasaron. La comprobación del padre
  también pasó las 63 pruebas.
- Evidencia de commit de CALC-04: `1a8d49f`
  (`docs: document calculator setup and usage`) contiene el README aceptado y
  el estado de finalización.
- Evidencia de la funcionalidad: pasan 63 pruebas, pasa el build de producción
  de TypeScript/Vite, y cada comportamiento solicitado del MVP está
  implementado.
- Estado de entrega: el commit `7717dea` quedó sincronizado con
  `origin/feat/calculator-interface` al completarse la funcionalidad; luego la
  rama integró la política de `main` mediante `d3c8a88` y subió la traducción
  documental en `d7be2cb`.
- Pull request: `#2`, `feat: completar el MVP de Calculator`, abierto en
  `https://github.com/JTGNzdev/calculator/pull/2` desde
  `feat/calculator-interface` hacia `main`, vinculado al issue aprobado `#1` y
  etiquetado con `type:feature` y `size:exception`. No se realizó ningún merge.

## Próximo paso

Revisar y fusionar el pull request `#2` cuando el usuario lo decida. El merge
sigue bajo control explícito del usuario.
