const request = require('supertest')
const app = require('../index')
jest.setTimeout(40000);


// Testeo el endpoint de autenticacion
describe('Envio credenciales esperando obtener token', () => {
  it('Obtengo token de autenticacioj', async () => {
    let mockedArrayData = ["f319", "3720", "4e3e", "46ec", "c7df", "c1c7", "80fd", "c4ea"];
    const mock = jest
    .fn()
    .mockReturnValue(mockedArrayData);

    // Get token
    let token = await app.getToken("lograssofede@gmail.com");
  

    const result = await app.check(getArrayData(token), "b93ac073-eae4-405d-b4ef-bb82e0036a1d");
        // Esperamos que el resultado sea como este array
    let expected = ["f319", "46ec", "c1c7", "3720", "c7df", "c4ea", "4e3e", "80fd"];


    expect(result.join('') != expected.join('')).toBeFalsy();
    
    
  })
})
