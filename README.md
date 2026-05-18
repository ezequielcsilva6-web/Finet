# Finet

Finet é uma plataforma financeira premium construída com React, Vite e Node.js. O projeto inclui:

- Interface moderna e responsiva com design fintech
- Cadastro e login seguro com validação de CPF
- Dashboard financeiro com gráficos, metas e previsões
- Controle de transações e histórico financeiro
- Sistema de metas e planejamento de conquistas
- Área de investimentos com simulação inteligente
- Backend seguro com autenticação JWT e banco SQLite integrado

## Como rodar o projeto

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o backend:

```bash
npm run server
```

4. Em outra aba, inicie o frontend:

```bash
npm run dev
```

5. Acesse em `http://localhost:5173`

## Endpoints principais

- `POST /auth/register` — cadastramento de usuário
- `POST /auth/login` — login com JWT
- `POST /auth/forgot-password` — recuperação de senha
- `GET /finance/summary` — resumo financeiro
- `GET /finance/transactions` — lista de movimentações
- `POST /finance/transactions` — criar transação
- `GET /goals` — metas do usuário
- `POST /goals` — criar nova meta
- `GET /investments/market` — dados de mercado
- `POST /investments/simulate` — simular investimento

## Observações

- O backend usa SQLite para persistência local em `server/data/finet.db`.
- A arquitetura está preparada para evoluir para PostgreSQL/MySQL com ajustes mínimos.
- O design do frontend foi construído com Tailwind CSS e componentes React.
