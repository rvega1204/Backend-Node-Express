// Configuración inicial para Jest
// Este archivo se ejecuta antes de todos los tests

// Establecer variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.PORT = 5000;

// Aumentar el timeout global si es necesario
jest.setTimeout(10000);

// Suprimir logs en tests (opcional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
