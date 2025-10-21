// tests/unit/math.test.js
import  {sum, multiply}  from '../../src/utils/math.js';

describe('Funciones matemáticas', () => {
  test('suma correctamente dos números', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('multiplica correctamente dos números', () => {
    expect(multiply(4, 5)).toBe(20);
  });
});