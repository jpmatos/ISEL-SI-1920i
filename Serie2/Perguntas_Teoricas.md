1
1.1- Um esquema de assinatura digital é usado para verificar que a mensagem não foi modificada durante a transmissão e autêntica que a entidade que enviou a mensagem é a original. Poderia ser substituído por um esquema MAC, mas este apenas ia garantir que a mensagem não foi manipulada, no entanto iria ser necessário na mesma uma assinatura digital para garantir a autenticidade.

1.2- As chaves de sessão referidas são as chaves temporárias que são usadas para encriptar simetricamente uma sessão de comunicação apenas. São usadas apenas uma vez para encriptar e desencriptar os dados, no futuro, caso houvesse mais alguma conversação entre o emissor e receptor serão criadas mais chaves de sessão. O atacante não conseguirá atacar tão facilmente estas sessões devido à constante mudança de chaves para a comunicação entre Emissor/Receptor, em futuras comunicações é sempre gerada uma chave que é única. Se por alguma razão o atacante conseguir descodificar esta chave, este apenas iria conseguir ver informação que é daquela específica sessão, nenhuma informação que tenha sido enviada em sessões anteriores ou posteriores.


2
O papel do salt neste processo serve para adicionar informação aleatória ao input da função hash para garantir um output único, fazendo com que a sua complexidade aumente prevenindo ataques à password.


3
Uma aplicação web para garantir a autenticidade dos cookies que usa para manter o estado da sessão necessita primeiro que tudo que seja enviado um request onde irá conter tanto o nome do usuário como a sua password, a aplicação web ao receber estes dados irá aplicar um hash à password antes de armazenar as credenciais na base de dados do servidor, prevenindo que algum ataque à base de dados não comprometa as supostas passwords dos utilizadores. Neste momento o servidor irá validar acesso caso a password inserida seja igual à que foi anteriormente aplicada o hash, tendo essa validação será criado um token de acesso que irá identificar o utilizador à sessão actual. Após a criação do token este é armazenado na base de dados interligado com o username suposto, de seguida este será anexado a uma cookie de resposta ao cliente juntamente com um tempo de expiração da sessão. Apartir daqui, sempre que um pedido é feito à aplicação, esta recebe o token de acesso que está associado à cookie e verifica quanto às credenciais que tem associadas a esse utilizador, caso seja válido, é dado acesso.

4
4.1- O parâmetro scope tem como objectivo limitar o acesso que uma aplicação tem à conta do utilizador, deixando o próprio definir o poder que a aplicação tem para ver a conta do mesmo.

4.2- Não, no browser o que existe é um code temporário enviado por um identity provider que trabalha a autenticação do utilizador na aplicação web. O client_secret e o client_id são apenas trocados entre o replying party e o identity provider juntamente com o code para que ele receba o token de autorização, deixando assim o secret e o id em segurança e não serem obtidos.

4.3- Neste contexto, a aplicação não recebe qualquer identidade do cliente, após a autorização da aplicação é criado um token de acesso referente ao cliente que irá servir para o próprio ser autenticado sempre que for aceder à aplicação.

5
Um ID_Token serve para ser usado em eventos de autenticação e identificação de utilizadores, é usado para uma autenticação baseada em tokens que guarda a informação do utilizador e providencia à aplicação as preferências do utilizador. A aplicação só recebe um ID Token após o utilizador ter feito um login com sucesso, que com esse mesmo token consegue aceder às informações do mesmo, como por exemplo, nome e email. Um exemplo disto será quando fazemos um registo com sucesso e queremos mandar depois um email automático ao utilizador a dizer que se registou com sucesso.
