# Arquitetura MVC com DTOs e DAOs

Este documento descreve a nova arquitetura do sistema de saúde mental, seguindo o padrão MVC (Model-View-Controller) com DTOs (Data Transfer Objects) e DAOs (Data Access Objects).

## Estrutura do Projeto

```
src/
├── models/           # Modelos de dados (Entidades)
├── views/            # Views (para API REST, esta pasta contém templates para emails e outros)
├── controllers/      # Controladores que processam as requisições
├── daos/             # Objetos de Acesso a Dados (DAOs)
│   └── impl/         # Implementações específicas dos DAOs (MongoDB, etc.)
├── dtos/             # Objetos de Transferência de Dados (DTOs)
├── services/         # Serviços para lógica de negócios reutilizável
│   └── impl/         # Implementações específicas dos serviços
├── middlewares/      # Middlewares para Express
├── routes/           # Rotas da API
├── utils/            # Utilitários e funções auxiliares
├── config/           # Configurações da aplicação
├── app.ts            # Configuração da aplicação Express
└── server.ts         # Inicialização do servidor
```

## Padrões de Design Implementados

### 1. MVC (Model-View-Controller)

- **Models**: Representam as entidades e regras de negócio básicas.
- **Views**: Em uma API REST, são as respostas JSON retornadas.
- **Controllers**: Recebem requisições, coordenam a lógica de negócio e retornam respostas.

### 2. DTO (Data Transfer Objects)

- Objetos simples para transferência de dados entre camadas.
- Usados para validação de entrada e formatação de saída.
- Exemplos: `LoginUserDTO`, `RegisterUserDTO`, `UserResponseDTO`.

### 3. DAO (Data Access Objects)

- Abstraem o acesso a dados e operações de persistência.
- Permitem trocar a implementação do banco de dados sem afetar o resto da aplicação.
- Exemplos: `UserDAO`, `HumorDAO`, `TarefaDAO`.

## Fluxo de Requisição

1. O cliente faz uma requisição HTTP para uma rota.
2. O roteador direciona a requisição para o controlador adequado.
3. Middlewares processam a requisição (autenticação, validação, etc.).
4. O controlador recebe a requisição e converte os dados de entrada em DTOs.
5. O controlador usa DAOs para acessar e manipular dados no banco.
6. O controlador processa a lógica de negócio, possivelmente usando serviços.
7. O controlador formata a resposta usando DTOs e a envia de volta ao cliente.

## Principais Componentes

### Models

Modelos representam as entidades do sistema:
- `User`: Modelo base para usuários
- `Paciente`: Modelo específico para pacientes
- `Profissional`: Modelo específico para profissionais
- `Humor`: Modelo para registro de humor
- `Tarefa`: Modelo para tarefas atribuídas
- `Consulta`: Modelo para consultas/atendimentos

### DTOs

DTOs são usados para transferência de dados:
- `LoginUserDTO`: Dados para login
- `RegisterUserDTO`: Dados para registro de usuário
- `UserResponseDTO`: Dados de resposta após autenticação
- `RegistroHumorDTO`: Dados para registrar humor

### DAOs

DAOs abstraem o acesso aos dados:
- `UserDAO`: Acesso a dados de usuários
- `HumorDAO`: Acesso a dados de humor
- `TarefaDAO`: Acesso a dados de tarefas
- `ConsultaDAO`: Acesso a dados de consultas

### Controllers

Controladores gerenciam as requisições:
- `AuthController`: Autenticação e registro
- `UserController`: Gerenciamento de perfil
- `PacienteController`: Operações específicas para pacientes
- `ProfissionalController`: Operações específicas para profissionais

### Services

Serviços implementam lógica de negócio reutilizável:
- `AuthService`: Serviço de autenticação
- `EmailService`: Serviço de envio de emails

### Middlewares

Middlewares processam requisições:
- `authMiddleware`: Verifica autenticação
- `errorMiddleware`: Trata erros globalmente

## Vantagens da Nova Arquitetura

1. **Separação de Responsabilidades**: Cada componente tem uma função clara.
2. **Facilidade de Manutenção**: Código mais organizado e modular.
3. **Testabilidade**: Componentes podem ser testados isoladamente.
4. **Flexibilidade de Banco de Dados**: DAOs permitem trocar o banco sem alterar o resto da aplicação.
5. **Validação de Dados**: DTOs centralizam a validação.
6. **Reutilização de Código**: Serviços encapsulam lógica comum.

## Comparação com a Arquitetura Anterior (DDD)

| Aspecto | MVC com DTO/DAO | DDD |
|---------|-----------------|-----|
| Foco | Separação técnica | Separação por domínio de negócio |
| Complexidade | Menor | Maior |
| Escalabilidade | Adequada para projetos médios | Melhor para projetos complexos |
| Acoplamento | Acoplamento por camadas | Acoplamento por contexto |
| Manutenção | Mais simples | Pode ser mais complexa |
| Adequação | Projetos CRUD e APIs simples | Sistemas com regras de negócio complexas |
