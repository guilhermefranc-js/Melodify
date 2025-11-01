<img width="1920" height="999" alt="image" src="https://github.com/user-attachments/assets/c6ae100f-7c31-4762-ae00-d2b0fcc27161" />

🚀 Sobre o Projeto

O Melodify é um leitor de música de página única (SPA) construído inteiramente com tecnologias web fundamentais (HTML, CSS e JavaScript), sem o uso de frameworks. Ele transforma o navegador numa experiência de música pessoal, permitindo ao utilizador carregar e gerir a sua própria biblioteca de áudio local para uma sessão.
Este projeto foi construído de forma iterativa, focando-se num design limpo, responsivo e repleto de funcionalidades modernas.


✨ Funcionalidades Principais
O Melodify não é apenas um design; é um leitor de música funcional que inclui:

🎧 Leitor de Música Completo: Controlos de Play/Pause, Próxima Faixa e Faixa Anterior.

🎹 Funções Avançadas de Player:

Modo Aleatório (Shuffle).

Modo Repetir (Desligado, Repetir Todas, Repetir Uma).

Avançar e Retroceder 10 segundos.

Barra de Progresso clicável (seek) que atualiza em tempo real.



📤 Upload Local de Músicas:

Clique em "Criar nova playlist" para carregar ficheiros de áudio (.mp3, .wav, etc.) do seu computador.

Seleção Múltipla: Carregue várias músicas de uma só vez.

Anti-Duplicados: O script verifica e impede que músicas com o mesmo nome de ficheiro sejam adicionadas duas vezes.




💅 Interface Moderna e Interativa:

Modo Claro e Escuro: Um botão na sidebar para alternar entre os temas, mantendo os gradientes da marca.

Navegação Suave (Scroll-Spy): Clicar nas abas da biblioteca ("Todos os sons", "Recentemente adicionados") rola suavemente para a secção correspondente.

Design Personalizado: Inclui um logótipo com gradiente e um ícone de site (favicon) SVG personalizado.




🎶 Gestão de Faixas:

Menu de Opções: Cada música na lista tem um menu de 3 pontinhos.

Excluir Música: Remova músicas da sua lista da sessão atual.

Item Ativo: A música que está a tocar fica destacada a roxo na lista.




🛠️ Tecnologias Utilizadas

Este projeto foi construído "do zero" usando apenas o essencial:

HTML5: Para a estrutura semântica do site.

CSS3: Para toda a estilização, incluindo layout Flexbox, Modo Claro/Escuro (com variáveis CSS) e animações.

JavaScript (ES6+): Para toda a lógica funcional, incluindo a API de Áudio (<audio>), a API de Ficheiros (FileReader, createObjectURL), manipulação do DOM e gestão de estado (música atual, modo de repetição, etc.).

Phosphor Icons: Para todos os ícones da interface, carregados via CDN.




🏁 Como Executar

Como este projeto é 100% client-side (não necessita de um servidor) e não tem dependências de npm, executá-lo é muito simples:

Certifique-se de que tem os 4 ficheiros essenciais na mesma pasta:

index.html

style.css

script.js

melodify-icon.svg (o ícone do site)

Abra o ficheiro index.html no seu navegador web preferido (Chrome, Firefox, Edge, etc.).

Clique em "Criar nova playlist", adicione as suas músicas e desfrute!
