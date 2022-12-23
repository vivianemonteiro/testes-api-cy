/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     let nameFaker = faker.name.fullName()
     let emailFaker = faker.internet.email()

     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(15)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(token, nameFaker, emailFaker, "Teste123", "true")
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, nameFaker, "bst@qa", "Teste123", "true")
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.email).to.equal('email deve ser um email válido')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario(token, nameFaker, emailFaker, "Teste123", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": nameFaker,
                              "email": emailFaker,
                              "password": "testeedicao",
                              "administrador": "true"
                         }
                    }).then((response) => {
                         expect(response.status).to.equal(200)
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })

               })

     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario(token, nameFaker, emailFaker, "Teste123", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then((response) => {
                         expect(response.status).to.equal(200)
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                    })

               })

     });

})
