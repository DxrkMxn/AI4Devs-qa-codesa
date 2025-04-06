/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Comando personalizado para simular el arrastre en react-beautiful-dnd
 * @param {string} targetSelector - Selector CSS del elemento contenedor destino
 * @param {string} targetText - Texto que contiene el elemento destino
 */
Cypress.Commands.add('dragTo', { prevSubject: true }, (subject, targetSelector, targetText) => {
  // Obtener el elemento destino
  cy.get(targetSelector).contains(targetText).parents('.card').find('.card-body').then(target => {
    // Coordenadas del origen
    const { left: subjectLeft, top: subjectTop } = subject[0].getBoundingClientRect();
    
    // Coordenadas del destino
    const { left: targetLeft, top: targetTop } = target[0].getBoundingClientRect();
    
    // Simular el evento dragstart
    cy.wrap(subject)
      .trigger('mousedown', { which: 1, button: 0 })
      .trigger('mousemove', { clientX: subjectLeft, clientY: subjectTop, force: true })
      .wait(300); // Pausa para asegurar que react-beautiful-dnd registre el inicio de arrastre
    
    // Simular el movimiento del mouse hacia el destino
    cy.wrap(subject)
      .trigger('mousemove', { clientX: targetLeft, clientY: targetTop, force: true })
      .wait(300); // Pausa para asegurar que react-beautiful-dnd registre el movimiento
    
    // Simular soltar en el destino
    cy.wrap(target)
      .trigger('mouseup', { force: true });
    
    // Retornar el subject para permitir encadenamiento
    return cy.wrap(subject);
  });
}); 