import { PrismaClient } from '@prisma/client';

// Criando uma instância singleton do PrismaClient
const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Função para conectar ao banco de dados
export async function connectDatabase(): Promise<void> {
  try {
    await prismaClient.$connect();
    console.log('🚀 Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

// Função para desconectar do banco de dados
export async function disconnectDatabase(): Promise<void> {
  await prismaClient.$disconnect();
  console.log('🔌 Database disconnected');
}

// Exportando a instância do PrismaClient para ser usada nos repositórios
export default prismaClient;