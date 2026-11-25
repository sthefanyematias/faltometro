
# Faltômetro

Aplicação mobile para controle de presenças por disciplina. O aluno cadastra a disciplina informando a carga horária do semestre; o sistema calcula o limite de 25% de faltas, quantas horas e quantos dias de aula ainda pode faltar, e sinaliza quando o limite é excedido.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React Native (Expo), Context API, AsyncStorage, Axios |
| Backend | Spring Boot, Spring Security (JWT), Spring Data JPA |
| Banco de dados | MySQL 8 |

## Pré-requisitos

- JDK 17 ou superior
- MySQL 8 em execução
- Node.js 18 ou superior
- Expo Go no celular (Android ou iOS) ou emulador

## Backend

1. Configure o acesso ao banco em `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=SUA_SENHA
```

O banco `faltometro` é criado automaticamente na primeira execução.

2. Execute a aplicação:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

3. A API estará disponível em `http://localhost:8080`.

## Frontend

1. Instale as dependências:

```bash
cd frontend
npm install
```

2. Exponha o backend em uma URL pública, necessária para que o celular acesse a API:

```bash
cloudflared tunnel --url http://localhost:8080
```

Copie a URL gerada, no formato `https://algum-nome.trycloudflare.com`.

3. Em `frontend/src/api/api.js`, informe essa URL:

```js
export const api = axios.create({
  baseURL: 'https://algum-nome.trycloudflare.com',
});
```

4. Inicie o aplicativo:

```bash
npx expo start
```

5. Abra o projeto no Expo Go lendo o QR Code exibido no terminal.

O frontend também pode ser aberto diretamente no [Snack](https://snack.expo.dev), importando o conteúdo da pasta `frontend`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/cadastro` | Cadastra usuário e retorna o token JWT |
| POST | `/auth/login` | Autentica usuário e retorna o token JWT |
| GET | `/disciplinas` | Lista as disciplinas do usuário autenticado |
| GET | `/disciplinas/{id}` | Retorna uma disciplina com o cálculo de faltas |
| POST | `/disciplinas` | Cadastra disciplina |
| PUT | `/disciplinas/{id}` | Atualiza disciplina |
| DELETE | `/disciplinas/{id}` | Exclui disciplina e suas faltas |
| GET | `/disciplinas/{id}/faltas` | Lista as faltas da disciplina |
| POST | `/disciplinas/{id}/faltas` | Registra falta |
| DELETE | `/faltas/{id}` | Exclui falta |

Todas as rotas, exceto `/auth/*`, exigem o cabeçalho `Authorization: Bearer <token>`.

## Regra de negócio

O limite de faltas corresponde a 25% da carga horária da disciplina:

```
limite = floor(cargaHoraria * 0.25)
```

Cada falta é registrada em horas. A conversão em dias considera 4 horas de aula por dia:

```
dias restantes = floor(horas restantes / 4)
```

O sistema indica três estados: regular até 50% do limite, atenção entre 50% e 70%, e limite excedido acima de 70%, com aviso de reprovação por falta quando as horas ultrapassam o limite.

## Integrantes

| Nome completo | RM | Responsabilidades |
|---|---|---|
| Geovanna de Lima Novais | 1143171431 | Modelagem do banco de dados (entidades Usuario, Disciplina e Falta), repositórios JPA, CRUD de disciplinas e faltas nos controllers e services, e implementação da regra de cálculo do limite de 25% da carga horária |
| Guilherme dos Santos Araújo | 1143152757 | Autenticação e segurança: geração e validação do token JWT, configuração do Spring Security, filtro de autenticação por requisição, criptografia de senha com BCrypt e endpoints de login e cadastro |
| Patrícia de Queiroz Oliveira | 1143083560 | Telas de login e cadastro em React Native, tema visual do aplicativo, componentes reutilizáveis (botão e campo de texto), gerenciamento de estado com Context API e persistência do token com AsyncStorage |
| Sthefany Evangelista Matias | 1141327712 | Telas de listagem, formulário e detalhe da disciplina, navegação entre telas com transição animada, cálculo de dias de falta, validação de datas no padrão brasileiro, README e documentação do projeto |

## Observações

- A URL do túnel muda a cada reinício do `cloudflared`; ao reiniciar, atualize o `baseURL` em `frontend/src/api/api.js`.
- O token JWT tem validade de 2 horas; após expirar, é necessário autenticar novamente.
- A senha do banco não deve ser versionada; ajuste-a localmente após clonar o repositório.
