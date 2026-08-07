# Fale+ Confidence

Quero criar um aplicativo mobile moderno chamado "Fale+".

O objetivo do aplicativo é ajudar pessoas que possuem medo ou dificuldade para falar em público através de Inteligência Artificial, prática em grupo e eventos.

Não quero um aplicativo simples. Quero um design profissional, semelhante aos aplicativos Duolingo, Discord, Notion e Spotify, utilizando cores modernas, muito espaço em branco, cantos arredondados, animações suaves e componentes reutilizáveis.

O aplicativo deve ser desenvolvido utilizando React + Next.js + TailwindCSS + Shadcn/UI.

Toda a arquitetura deve ser organizada em componentes.

O sistema precisa possuir navegação entre telas, responsividade e código limpo.

=========================

IDENTIDADE VISUAL

=========================

Paleta:

- Azul (#2563EB)

- Roxo (#7C3AED)

- Branco

- Cinza claro

- Preto para textos

Estilo:

- Minimalista

- Moderno

- Elegante

- Tecnologia

- IA

- Saúde Mental

Ícones:

Lucide Icons.

Fonte:

Inter.

=========================

TELAS

=========================

1) LOGIN

Campos:

- Nome

- Email

- Senha

Botões:

Entrar

Cadastrar

Esqueci minha senha

Login Google

Tela limpa.

=========================

2) HOME

Mostrar:

Mensagem de boas-vindas

Cards:

• Salas de prática

• IA

• Eventos

• Exercícios

• Perfil

Na parte inferior:

Bottom Navigation

Home

Salas

IA

Eventos

Perfil

=========================

3) PERFIL

Foto

Nome

Quantidade de apresentações realizadas

Quantidade de salas criadas

Nível do usuário

Editar perfil

Configurações

=========================

4) SALAS

Tela mostrando:

Barra de pesquisa

Botão Criar Sala

Lista de salas

Cada sala mostra:

Nome

Descrição

Quantidade de participantes

Pública ou Privada

Categoria

Entrar

=========================

5) CRIAR SALA

Campos:

Nome

Descrição

Categoria

Número máximo de participantes

Privada/Pública

Senha opcional

Botão Criar Sala

=========================

6) DENTRO DA SALA

Tela semelhante ao Discord.

Mostrar:

Apresentador principal

Participantes

Chat

Botão levantar mão

Cronômetro

Botão iniciar apresentação

Botão finalizar

Área para feedback

=========================

7) PARTICIPANTES

Lista dos participantes

Foto

Nome

Status

Administrador

Convidado

Remover

Promover

=========================

8) CONFIGURAÇÕES DA SALA

Editar nome

Editar descrição

Alterar privacidade

Convites

Excluir sala

Salvar alterações

=========================

9) CONVITES

Gerar link

Copiar link

QR Code

Compartilhar

=========================

10) VISÃO GERAL DA SALA

Dashboard contendo:

Quantidade de participantes

Tempo médio

Número de apresentações

Avaliação média

Últimas atividades

=========================

11) IA

Tela principal da IA.

Mostrar avatar da IA.

Texto:

"Como posso ajudar você hoje?"

Botões:

Treinar apresentação

Gerar discurso

Responder perguntas

Controlar ansiedade

Exercícios

Feedback

Histórico

=========================

12) CHAT COM IA

Chat semelhante ao ChatGPT.

Campo de mensagem

Botão enviar

Mensagens do usuário

Mensagens da IA

Botão de voz

=========================

13) SUGESTÕES DA IA

Lista de sugestões.

Exemplos:

Melhore sua postura

Fale mais devagar

Olhe para o público

Respire antes de responder

Melhore sua introdução

=========================

14) EXERCÍCIOS

Lista de exercícios.

Exemplos:

Improviso

Pitch

Apresentação

Respiração

Controle da ansiedade

Leitura em voz alta

Cada exercício possui:

Descrição

Tempo

Nível

Botão iniciar

=========================

15) INSIGHTS

Dashboard contendo:

Pontos fortes

Pontos de melhoria

Gráfico de evolução

Confiança

Velocidade da fala

Uso de pausas

Contato visual

=========================

16) HISTÓRICO

Lista contendo todas as sessões.

Cada item mostra:

Data

Tempo

Pontuação

Tipo de treino

=========================

17) FEEDBACK

Após cada apresentação mostrar:

Nota geral

★★★★★

Comentários

Pontos positivos

Pontos negativos

Sugestões

Botão salvar

=========================

18) EVENTOS

Tela semelhante ao Meetup.

Pesquisar eventos

Categorias

Eventos online

Eventos presenciais

Cards mostrando:

Título

Local

Data

Horário

Participantes

Entrar

=========================

19) CRIAR EVENTO

Campos:

Título

Descrição

Online ou Presencial

Local

Data

Horário

Número máximo de participantes

Imagem

Criar Evento

=========================

20) EVENTO ONLINE

Mostrar:

Participantes

Vídeo principal

Chat

Compartilhamento de tela

Cronômetro

Feedback

=========================

21) EVENTO PRESENCIAL

Mostrar:

Mapa

Endereço

Descrição

Organizador

Participantes

Confirmação de presença

=========================

FUNCIONALIDADES FUTURAS

=========================

Adicionar arquitetura preparada para:

Firebase Authentication

Supabase

OpenAI API

Google Login

Upload de imagens

Notificações

Banco de dados

Realtime

=========================

OBJETIVO FINAL

O aplicativo deve transmitir sensação de segurança, acolhimento e evolução pessoal.

Cada tela deve possuir micro animações, transições suaves e aparência profissional.

O design precisa parecer um aplicativo pronto para publicação na Play Store e App Store.

Utilize componentes reutilizáveis, organização por pastas, boas práticas de UX/UI e acessibilidade.

Baseie toda a estrutura exatamente nas telas descritas acima, mantendo a mesma navegação e fluxo entre elas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fale-mais.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/471f31ad-25c0-46f0-8c9c-06be1bda35e8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
