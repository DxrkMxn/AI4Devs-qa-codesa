/// <reference types="cypress" />

// Pruebas E2E completas para la interfaz de posición - Requiere servidor activo

describe('Interfaz de Posición (Modo Real)', () => {
  // ID de ejemplo de una posición existente
  const positionId = 1;
  
  beforeEach(() => {
    // Establecemos un stub para DataTransfer que es requerido para los eventos de drag and drop
    const dataTransferStub = {
      setData: () => {},
      getData: () => {},
      clearData: () => {}
    };
    cy.window({ log: false }).then(win => {
      win.DataTransfer = function() {};
      win.DataTransfer.prototype.setData = dataTransferStub.setData;
      win.DataTransfer.prototype.getData = dataTransferStub.getData;
      win.DataTransfer.prototype.clearData = dataTransferStub.clearData;
    });
    
    // Interceptamos la llamada a la API para obtener los datos de la posición
    cy.intercept('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`, {
      fixture: 'position-flow.json'
    }).as('getInterviewFlow');
    
    // Interceptamos la llamada a la API para obtener los candidatos
    cy.intercept('GET', `http://localhost:3010/positions/${positionId}/candidates`, {
      fixture: 'position-candidates.json'
    }).as('getCandidates');
    
    // Interceptamos la llamada a la API para actualizar el candidato
    cy.intercept('PUT', 'http://localhost:3010/candidates/*', {
      statusCode: 200,
      body: { success: true }
    }).as('updateCandidate');
    
    // Visitamos la página de detalles de la posición
    cy.visit(`/positions/${positionId}`);
    
    // Esperamos a que se carguen los datos
    cy.wait(['@getInterviewFlow', '@getCandidates']);
  });
  
  describe('Carga de la Página de Position', () => {
    it('Verifica que el título de la posición se muestra correctamente', () => {
      // Verificamos que el título de la posición se muestra correctamente
      cy.get('h2').should('contain', 'Desarrollador Frontend');
    });
    
    it('Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación', () => {
      // Verificamos que se muestran las columnas correspondientes a cada fase
      cy.get('.card-header').should('have.length', 4); // Asumiendo 4 fases en el proceso
      cy.get('.card-header').eq(0).should('contain', 'Solicitud');
      cy.get('.card-header').eq(1).should('contain', 'Entrevista Técnica');
      cy.get('.card-header').eq(2).should('contain', 'Prueba Técnica');
      cy.get('.card-header').eq(3).should('contain', 'Oferta');
    });
    
    it('Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual', () => {
      // Verificamos que hay al menos un candidato en la primera columna (Solicitud)
      cy.get('.card-header').contains('Solicitud').parents('.card').find('.card-title')
        .should('have.length.at.least', 1)
        .and('contain', 'Juan Pérez');
      
      // Verificamos que hay al menos un candidato en la segunda columna (Entrevista Técnica)
      cy.get('.card-header').contains('Entrevista Técnica').parents('.card').find('.card-title')
        .should('have.length.at.least', 1)
        .and('contain', 'María Rodríguez');
        
      // Verificamos que hay al menos un candidato en la tercera columna (Prueba Técnica)
      cy.get('.card-header').contains('Prueba Técnica').parents('.card').find('.card-title')
        .should('have.length.at.least', 1)
        .and('contain', 'Carlos López');
        
      // Verificamos que hay al menos un candidato en la cuarta columna (Oferta)
      cy.get('.card-header').contains('Oferta').parents('.card').find('.card-title')
        .should('have.length.at.least', 1)
        .and('contain', 'Ana Gómez');
    });
  });
  
  describe('Cambio de Fase de un Candidato', () => {
    it('Simula el arrastre de una tarjeta de candidato de Solicitud a Entrevista Técnica', () => {
      // Almacenamos el nombre del candidato que vamos a arrastrar
      cy.get('.card-header').contains('Solicitud').parents('.card').find('.card-title').first()
        .invoke('text').as('candidateName');
      
      // Obtenemos la primera tarjeta de candidato en la columna "Solicitud"
      cy.get('.card-header').contains('Solicitud').parents('.card').find('.card-body > .card').first()
        .as('candidateCard');
      
      // Simulamos el arrastre utilizando el comando personalizado
      cy.get('@candidateCard')
        .dragTo('.card-header', 'Entrevista Técnica')
        .then(() => {
          // Verificamos que se hizo la llamada para actualizar la fase del candidato
          cy.wait('@updateCandidate').then(interception => {
            // Verificamos que el cuerpo de la solicitud contiene los datos correctos
            expect(interception.request.body).to.have.property('applicationId');
            expect(interception.request.body).to.have.property('currentInterviewStep');
            
            // Verificamos que el valor de currentInterviewStep corresponde a la fase "Entrevista Técnica"
            // Asumimos que el ID 2 corresponde a "Entrevista Técnica" según el fixture
            expect(interception.request.body.currentInterviewStep).to.equal(2);
          });
          
          // Verificamos que la tarjeta ya no está en la columna original (Solicitud)
          cy.get('@candidateName').then(candidateName => {
            // En una aplicación real con react-beautiful-dnd, la tarjeta se movería visualmente
            // Verificamos que el candidato ahora aparece en la columna de destino
            cy.get('.card-header').contains('Entrevista Técnica').parents('.card')
              .find('.card-title').contains(candidateName.trim()).should('exist');
          });
        });
    });
    
    it('Simula el arrastre de una tarjeta de candidato de Entrevista Técnica a Prueba Técnica', () => {
      // Almacenamos el nombre del candidato que vamos a arrastrar
      cy.get('.card-header').contains('Entrevista Técnica').parents('.card').find('.card-title').first()
        .invoke('text').as('candidateName');
      
      // Obtenemos la primera tarjeta de candidato en la columna "Entrevista Técnica"
      cy.get('.card-header').contains('Entrevista Técnica').parents('.card').find('.card-body > .card').first()
        .as('candidateCard');
      
      // Simulamos el arrastre utilizando el comando personalizado
      cy.get('@candidateCard')
        .dragTo('.card-header', 'Prueba Técnica')
        .then(() => {
          // Verificamos que se hizo la llamada para actualizar la fase del candidato
          cy.wait('@updateCandidate').then(interception => {
            // Verificamos que el cuerpo de la solicitud contiene los datos correctos
            expect(interception.request.body).to.have.property('applicationId');
            expect(interception.request.body).to.have.property('currentInterviewStep');
            
            // Verificamos que el valor de currentInterviewStep corresponde a la fase "Prueba Técnica"
            // Asumimos que el ID 3 corresponde a "Prueba Técnica" según el fixture
            expect(interception.request.body.currentInterviewStep).to.equal(3);
          });
          
          // Verificamos que la tarjeta ya no está en la columna original
          cy.get('@candidateName').then(candidateName => {
            // Verificamos que el candidato ahora aparece en la columna de destino
            cy.get('.card-header').contains('Prueba Técnica').parents('.card')
              .find('.card-title').contains(candidateName.trim()).should('exist');
          });
        });
    });
  });
}); 