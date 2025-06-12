// Factory for creating DAO instances
import { UserDAO } from '../daos/UserDAO';
import { HumorDAO } from '../daos/HumorDAO';
import { TarefaDAO } from '../daos/TarefaDAO';
import { ConsultaDAO } from '../daos/ConsultaDAO';

import { MongoUserDAO } from '../daos/impl/MongoUserDAO';
import { MongoHumorDAO } from '../daos/impl/MongoHumorDAO';
import { MongoTarefaDAO } from '../daos/impl/MongoTarefaDAO';
import { MongoConsultaDAO } from '../daos/impl/MongoConsultaDAO';

// DAO Factory to create DAO instances
// This allows easy switching between different implementations
// (e.g. MongoDB to another database) without changing application code
export class DAOFactory {
  // Singleton instances
  private static userDAO: UserDAO;
  private static humorDAO: HumorDAO;
  private static tarefaDAO: TarefaDAO;
  private static consultaDAO: ConsultaDAO;

  // Get UserDAO instance
  static getUserDAO(): UserDAO {
    if (!this.userDAO) {
      this.userDAO = new MongoUserDAO();
    }
    return this.userDAO;
  }

  // Get HumorDAO instance
  static getHumorDAO(): HumorDAO {
    if (!this.humorDAO) {
      this.humorDAO = new MongoHumorDAO();
    }
    return this.humorDAO;
  }

  // Get TarefaDAO instance
  static getTarefaDAO(): TarefaDAO {
    if (!this.tarefaDAO) {
      this.tarefaDAO = new MongoTarefaDAO();
    }
    return this.tarefaDAO;
  }

  // Get ConsultaDAO instance
  static getConsultaDAO(): ConsultaDAO {
    if (!this.consultaDAO) {
      this.consultaDAO = new MongoConsultaDAO();
    }
    return this.consultaDAO;
  }
}
