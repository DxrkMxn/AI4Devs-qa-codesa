# Pruebas E2E con Cypress

Este directorio contiene las pruebas End-to-End (E2E) utilizando Cypress para la aplicación de reclutamiento.

## Estructura

- `e2e/`: Contiene las especificaciones de prueba
  - `position.cy.js`: Pruebas para la interfaz de posición (modo demostración)
  - `position.real.cy.js`: Pruebas completas para la interfaz de posición (requiere servidor activo)
- `fixtures/`: Contiene los datos de prueba
  - `position-flow.json`: Datos de ejemplo para el flujo de entrevistas
  - `position-candidates.json`: Datos de ejemplo para los candidatos
- `support/`: Contiene funciones de soporte para Cypress
  - `commands.js`: Comandos personalizados (dragTo)
  - `e2e.js`: Configuración para pruebas E2E

## Cómo ejecutar las pruebas

Para ejecutar las pruebas, tienes varias opciones:

### Usando la interfaz gráfica de Cypress

```bash
npm run cypress:open
```

Esto abrirá la interfaz gráfica de Cypress donde podrás seleccionar y ejecutar pruebas específicas.

### Ejecutando todas las pruebas E2E

```bash
npm run test:e2e
```

### Ejecutando pruebas específicas

#### Modo demostración (no requiere servidor)

```bash
npx cypress run --spec "cypress/e2e/position.cy.js"
```

#### Modo real (requiere servidor activo)

```bash
# Primero, inicia el servidor frontend
npm start

# En otra terminal, ejecuta las pruebas reales
npx cypress run --spec "cypress/e2e/position.real.cy.js"
```

## Modo de demostración vs Modo real

### Modo de demostración (`position.cy.js`)

El modo de demostración:

1. No requiere que el servidor frontend esté en ejecución
2. Simula el DOM y las verificaciones básicas
3. Describe cómo funcionarían las pruebas en un entorno real

Este modo es útil para verificar que Cypress está configurado correctamente sin necesidad de ejecutar la aplicación.

### Modo real (`position.real.cy.js`)

El modo real implementa todas las funcionalidades requeridas en el ejercicio:

1. Visita la página real de posiciones
2. Verifica el título, columnas y candidatos 
3. Simula el arrastre de candidatos entre columnas usando el comando personalizado `dragTo`
4. Verifica las llamadas al backend y sus respuestas

Para ejecutar el modo real, debes:

1. Iniciar el servidor frontend: `npm start`
2. En caso necesario, descomenta la línea `baseUrl` en `cypress.config.js`
3. Ejecutar las pruebas: `npx cypress run --spec "cypress/e2e/position.real.cy.js"`

## Notas sobre la implementación

1. **Simulación de arrastre**: Se ha implementado un comando personalizado `dragTo` en `commands.js` para simular el arrastre de tarjetas entre columnas, ya que la aplicación utiliza `react-beautiful-dnd`.

2. **Fixtures**: Los datos de prueba se han separado en archivos de fixture para facilitar su mantenimiento y reutilización.

3. **Interceptación de API**: En el modo real, se interceptan las llamadas API para proporcionar datos de prueba consistentes y verificar las llamadas realizadas durante la prueba.

4. **Estructura de pruebas**: Las pruebas están organizadas siguiendo las mejores prácticas de Cypress:
   - `describe` para agrupar pruebas relacionadas
   - `it` para pruebas individuales
   - Intercepciones de red para mockear respuestas
   - Alias para elementos DOM y variables

## Solución de problemas

Si encuentras errores al ejecutar las pruebas:

1. **Error "Could not verify that this server is running"**: Asegúrate de que el servidor frontend está en ejecución o usa el modo de demostración.

2. **Problemas con PowerShell y el operador `&&`**: En PowerShell, usa comandos separados en lugar de concatenarlos con `&&`.

3. **Problemas con `cy` no definido**: Asegúrate de que tienes la referencia `/// <reference types="cypress" />` al comienzo de tus archivos de prueba. 