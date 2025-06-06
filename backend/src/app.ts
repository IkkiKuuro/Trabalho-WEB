import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './infrastructure/http/midalewares/errorMiddleware';
import authRouter from './infrastructure/http/routes/auth.routes';
import userRouter from './infrastructure/http/routes/user.routes';
import logger from './infrastructure/utils/logger';
import { connectDatabase } from './infrastructure/database/prisma/PrismaClientInstance';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o aplicativo Express
const app = express();

// Middlewares de segurança e utilidades
app.use(helmet()); // Adiciona cabeçalhos de segurança
app.use(cors()); // Habilita CORS
app.use(express.json()); // Parsing de JSON
app.use(express.urlencoded({ extended: true })); // Parsing de formulários

// Logging de requisições HTTP
app.use(morgan('dev'));

// Verificação de saúde do servidor
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// Middleware para rota não encontrada
app.use(notFoundHandler);

// Middleware de tratamento de erros (sempre deve ser o último middleware)
app.use(errorHandler);

// Função de inicialização do aplicativo
export async function startApp() {
  try {
    // Conectar ao banco de dados
    await connectDatabase();
    
    // Definir a porta para o servidor
    const PORT = process.env.PORT || 3000;
    
    // Iniciar o servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      logger.info(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Tratamento de encerramento adequado
    setupGracefulShutdown();
    
  } catch (error) {
    logger.error('❌ Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
}

// Configuração para encerramento adequado do servidor
function setupGracefulShutdown() {
  // Capturar sinais de encerramento
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, async () => {
      logger.info(`Recebido sinal ${signal}, encerrando graciosamente...`);
      
      try {
        // Fechar conexões de banco de dados
        await import('./infrastructure/database/prisma/PrismaClientInstance')
          .then(({ disconnectDatabase }) => disconnectDatabase());
        
        logger.info('Servidor encerrado com sucesso');
        process.exit(0);
      } catch (error) {
        logger.error('Erro ao encerrar servidor:', error);
        process.exit(1);
      }
    });
  });
}

// Exportando o app para testes
export default app;