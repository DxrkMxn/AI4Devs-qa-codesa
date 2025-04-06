const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Para el modo real, descomenta la siguiente línea:
    baseUrl: 'http://localhost:3000',
    // Para el modo demostración, comenta la línea anterior y descomenta las siguientes:
    // experimentalRunAllSpecs: true,
    // experimentalStudio: true,
    viewportWidth: 1280,
    viewportHeight: 800,
    supportFile: 'cypress/support/e2e.js',
  },
}) 