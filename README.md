# Bot de capítulos de Re:Zero

Esse bot foi construído com o intuito de notificar quando ocorrem atualizações na Web Novel Japonesa de Re:Zero por parte do autor, Tappei Nagatsuki.

## Funcionalidades
### Auto verificar e contar caracteres
Após a execução, o bot executa as requisições e verificações de novos capítulos a cada 15 minutos.
Ao encontrar uma mudança não publicada na Novel, ele notifica de que um capítulo está para sair. Quando a novel for de fato atualizada, ele cria uma publicação comentando sobre ela e informa a contagem de caracteres. Como a API do ncode não fornece a contagem diretamente, o "banco de dados" do bot é construído ao longo das publicações, registrando as alterações na contagem geral para obter o valor por capítulo novo.

### Atualizar
Esse comando pode ser acessado através de **/atualizar**, e fornece dados para o usuário sobre o último capítulo postado, bem como a contagem de caracteres dele (se o banco estiver devidamente alimentado com os dados de capítulos anteriores).

### Exportar
Esse comando pode ser acessado através de **/exportar**, e exporta o arquivo CSV do banco de dados do bot para ser baixado como maneira de realizar um backup, caso o bot esteja sendo movido para outro provedor, ou para permitir a análise do conteúdo.

## Ideias a serem testadas

- [ ] Permitir a configuração de channelId e Ncode através de uma variável .env
- [ ] Criar comandos de arcos específicos (depende da real utilidade disso)
- [ ] Conectar com os grupos de tradução (Pleiades e Witch Cult)
- [ ] Pemitir que o mesmo deploy seja usado em vários servidores diferentes (Como vou mudar a manipulação atual de IDs?)
