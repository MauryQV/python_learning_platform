import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

//no meter cosas innecesarias en el log, solo errores y advertencias :VVVVVVVVVVVVVVVVVVVVV


export default prisma;