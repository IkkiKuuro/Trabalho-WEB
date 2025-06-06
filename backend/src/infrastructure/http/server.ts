import { startApp } from '../../app';
import logger from '../utils/logger';

// Iniciar a aplicação
(async () => {
  try {
    await startApp();
  } catch (error) {
    logger.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
})();