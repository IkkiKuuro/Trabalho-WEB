export interface Tarefa {
  id: string;             
  id_paciente: string;    // int NN (assumindo que 'int' no diagrama para uuid é um erro e é 'uuid' como 'id')
  id_profissional: string; // int NN (assumindo 'uuid' como 'id_paciente')
  descricao: string;      
  data_criacao: Date;     
  data_limite: Date;      
  status: string;         
  observacoes_paciente: string | null; // text (pode ser null)
}