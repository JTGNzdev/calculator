# Calculator

Una aplicación web de calculadora moderna y responsive. Es el primer proyecto
de un recorrido progresivo de aprendizaje de desarrollo de software: el objetivo
no es la calculadora en sí, sino practicar fundamentos de frontend con una
arquitectura pequeña y mantenible donde cada capa tiene una responsabilidad
clara y enseñable.

## Objetivos de aprendizaje

- Mantener las reglas aritméticas en funciones puras y simples, sin
  dependencias de la interfaz.
- Dejar que TypeScript describa el estado y las acciones sin implementar
  comportamiento.
- Mantener a React responsable únicamente del renderizado y del cableado de
  eventos.
- Escribir pruebas centradas en el comportamiento, por separado para la lógica
  y para la interfaz.

## Funcionalidades

- Cuatro operaciones aritméticas: suma, resta, multiplicación y división.
- Entrada decimal, cambio de signo (`±`), borrar todo (`C`) y eliminar el
  último dígito ingresado (`DEL`).
- Visualización separada de la expresión y del resultado, para que siempre se muestre
  lo que se escribió y a qué se evalúa.
- Encadenamiento inmediato: presionar otro operador evalúa primero la
  expresión pendiente, estrictamente de izquierda a derecha.
- Reemplazo de operador: cambiar el operador antes de escribir el segundo
  operando simplemente lo reemplaza.
- Errores recuperables: la división por cero y los resultados fuera de rango
  muestran un mensaje claro; sólo la acción de borrar (`C` o `Escape`) sale del
  estado de error, de modo que un error nunca corrompe el estado.
- Interfaz responsive y accesible que funciona en anchos de escritorio y
  móviles, con entrada tanto por botones como por teclado.

### Fuera de alcance

Sin backend, base de datos, autenticación, operaciones científicas,
servicios externos, librerías de estado ni dependencias extra más allá de la
herramienta estándar de Vite con React y TypeScript.

## Stack

- [React](https://react.dev) 19 — presentación y cableado de eventos
- [TypeScript](https://www.typescriptlang.org) ~5.8 — garantías a nivel de tipos
- [Vite](https://vite.dev) 6 — servidor de desarrollo y bundler de producción
- CSS puro — estilos sin una librería de componentes
- [Vitest](https://vitest.dev) 3 con jsdom y
  [React Testing Library](https://testing-library.com) — pruebas de comportamiento

## Requisitos previos

- [Node.js](https://nodejs.org) (una versión LTS reciente)
- npm (incluido con Node.js)
- Git (sólo si desea clonar este repositorio por su cuenta)

## Primeros pasos

Clone (el repositorio es privado por ahora) e instale las dependencias:

```bash
git clone https://github.com/JTGNzdev/calculator.git
cd calculator
npm install
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite con hot reload |
| `npm test` | Ejecuta la suite de pruebas en modo watch (Vitest) |
| `npm test -- --run` | Ejecuta la suite completa de pruebas una vez y termina |
| `npm run build` | Verifica tipos con `tsc -b` y genera el build de producción |
| `npm run preview` | Sirve el build de producción localmente |

## Uso

Haga clic en los botones del teclado numérico o use el teclado físico:

| Tecla | Acción |
| --- | --- |
| `0`–`9` | Ingresar un dígito |
| `.` | Punto decimal |
| `+` `-` `*` `/` | Operadores |
| `Enter` o `=` | Evaluar |
| `Backspace` | Borrar el último carácter ingresado |
| `Escape` | Borrar todo |
| `N` | Cambiar el signo del operando actual |

Los atajos de teclado se ignoran mientras se mantiene `Ctrl`, `Alt` o
`⌘`/`Meta`, de modo que los atajos del navegador y del sistema operativo
siguen funcionando. Lo mismo aplica a los botones: `C` borra todo, `±` cambia
el signo y `DEL` elimina el último carácter.

Ejemplo: presione `1 2 . 5`, luego `+`, luego `3` y luego `Enter`. La pantalla
muestra la expresión `12.5 + 3 =` arriba del resultado `15.5`.

## Estructura del proyecto

```text
calculator/
├── index.html                  # Entrada HTML de Vite
├── package.json               # Scripts y dependencias
├── vite.config.ts              # Configuración de Vite + Vitest (jsdom)
├── tsconfig*.json              # Configuración del proyecto TypeScript
├── src/
│   ├── main.tsx                # Montaje de la raíz de React
│   ├── App.tsx                 # Interfaz de la calculadora: botones, teclado, pantalla
│   ├── App.test.tsx            # Pruebas de comportamiento del componente
│   ├── styles.css              # Estilos responsive
│   └── calculator/             # Lógica de dominio pura (sin React, sin DOM)
│       ├── types.ts            # Sólo garantías a nivel de tipos
│       ├── calculator.ts       # Todas las reglas aritméticas y de formateo
│       ├── index.ts            # Módulo público del dominio
│       └── calculator.test.ts  # Pruebas de comportamiento de la lógica
└── odd/tasks/calculator-mvp.md # Planificación y seguimiento de la funcionalidad
```

## El límite educativo

El proyecto separa deliberadamente tres clases de responsabilidad:

1. **Lógica pura al estilo JavaScript** (`src/calculator/calculator.ts`): todo
   el comportamiento de la calculadora vive en funciones simples sobre un
   objeto de estado explícito — `applyAction` devuelve el siguiente estado y
   el estado nunca se muta. Aquí no hay React, ni DOM, ni clases, de modo que
   las reglas se pueden leer y probar de forma aislada.
2. **Garantías de TypeScript** (`src/calculator/types.ts`): sólo tipos. Los
   tipos unión restringen los operadores y los dígitos a valores legales, la
   interfaz `CalculatorState` documenta las invariantes del estado (la entrada
   actual siempre se parsea a un número finito; el estado se congela mientras
   hay un error activo) y `CalculatorAction` es una unión discriminada de las
   interacciones del usuario. Los tipos prometen qué pueden ser los valores;
   las funciones simples deciden qué sucede.
3. **Presentación y cableado de eventos en React** (`src/App.tsx`): el
   renderizado de la pantalla y del teclado numérico, el mapeo de los clics
   en botones y de las teclas del teclado a acciones del dominio, y los
   atributos de accesibilidad. El componente no contiene aritmética ni
   reglas de formateo — delega todo a la API pública del dominio a través de
   `src/calculator/index.ts`.

## Pruebas

Las pruebas se centran en el comportamiento observable, no en detalles de
implementación:

- `src/calculator/calculator.test.ts` cubre el dominio puro de forma aislada:
  ingreso de dígitos y decimales, cambio de signo, borrado, las cuatro
  operaciones, evaluación encadenada, reemplazo de operador, comportamiento
  después de `=`, no-ops seguros, división por cero, resultados fuera de rango
  y recuperación mediante `clear`.
- `src/App.test.tsx` cubre la interfaz renderizada con React Testing Library:
  interacciones con botones, entrada por teclado (incluido el cambio de signo
  con `N` y las guardas de teclas modificadoras), visualización de expresión y
  resultado, renderizado de errores y limpieza de listeners.

Ejecute todo una vez con:

```bash
npm test -- --run
```

## Contexto del repositorio

Este es un repositorio privado de GitHub
([JTGNzdev/calculator](https://github.com/JTGNzdev/calculator)). No hay
deployment, ni publicación pública, ni paquete publicado — el proyecto es un
ejercicio de aprendizaje local en desarrollo activo.

## Posibles próximos pasos

Son sólo ideas; ninguna está implementada todavía:

- Teclas de porcentaje y memoria.
- Un panel de historial de cálculos.
- Publicar el repositorio o hacer deploy de la app (una decisión para más
  adelante).
