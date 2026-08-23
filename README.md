# NUCAO — Acervo Digital

Site do Núcleo de Câncer Oral (NUCAO), com catálogo de lâminas histológicas e visualizador com zoom/pan.

## O que já funciona

- Página inicial responsiva inspirada na interface aprovada.
- Catálogo de lâminas com busca e filtros.
- Página individual com descrição, patologia, achados e visualizador de imagem.
- Zoom por rolagem, zoom por botões, arrastar/pan e tela cheia.
- Área administrativa preparada para **produção**, com autenticação, banco de dados e upload de imagens via Supabase.
- CRUD de lâminas: cadastrar, editar e excluir.
- GitHub Actions para publicar no GitHub Pages.
- A primeira lâmina de demonstração é a **Pigmentação por Amálgama / Tatuagem por amálgama**.

## 1. Rodar localmente

Tenha Node.js instalado.

```bash
npm install
npm run dev
```

Sem Supabase configurado, o site usa o acervo local de demonstração. Para ativar o gerenciamento real, siga os passos abaixo.

## 2. Criar o backend real no Supabase

1. Crie um projeto no Supabase.
2. Abra **SQL Editor**.
3. Copie todo o conteúdo de `supabase/schema.sql` e execute.
4. Em **Authentication → Users**, crie o usuário que será o administrador.
5. Depois de criar o usuário, execute no SQL Editor, substituindo o e-mail:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'SEU_EMAIL_ADMIN');
```

6. Em **Project Settings → API**, copie a URL do projeto e a chave `anon`.
7. Na raiz do projeto, crie `.env` a partir de `.env.example`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

8. Rode novamente:

```bash
npm run dev
```

9. Entre em **Área Administrativa** usando o e-mail e a senha do usuário criado no Supabase.

### Importante sobre autenticação

Não existe senha fixa escondida no código. A autenticação é feita pelo Supabase Auth e a permissão de administrador é controlada pela tabela `profiles` + Row Level Security (RLS).

## 3. Como cadastrar uma lâmina

Na Área Administrativa:

1. Clique em **+ Nova**.
2. Informe nome e patologia.
3. Preencha tecido, coloração e aumento.
4. Escreva a descrição da lâmina.
5. Escreva a descrição da patologia.
6. Adicione os principais achados.
7. Informe as tags separadas por vírgulas.
8. Escolha a imagem da lâmina.
9. Clique em **Cadastrar lâmina**.

A imagem é enviada para o bucket privado de escrita/público de leitura `laminas`, e os dados são gravados na tabela `public.laminas`.

## 4. Publicar no GitHub Pages

O workflow em `.github/workflows/deploy.yml` já está preparado.

No repositório do GitHub, crie os **Repository secrets**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Depois faça o push para a branch `main`. O GitHub Actions gera e publica o site.

No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como fonte.

### Git no computador

Dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Cria acervo NUCAO com gerenciamento real"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/nucao-acervo.git
git push -u origin main
```

## Segurança

- A chave `anon` do Supabase pode aparecer no JavaScript público; a segurança depende das políticas RLS.
- **Nunca coloque a `service_role` key no Vite, no GitHub ou no navegador.**
- A tabela de lâminas permite leitura pública, mas somente usuários com `profiles.role = 'admin'` podem inserir, editar ou excluir.
- O Storage permite leitura pública das imagens do acervo, mas upload/alteração/exclusão exigem administrador.

## Próximas evoluções

O mesmo padrão pode ser aplicado a Casos Clínicos e Materiais Acadêmicos, com tabelas próprias, upload de documentos/imagens e gerenciamento pelo mesmo painel.
