# GEMINI.md - Contexto do Projeto

Este documento fornece um contexto abrangente sobre o projeto "site_edneypugliese", destinado a ser utilizado como referência para futuras interações com o Gemini CLI.

## Visão Geral do Projeto

O projeto "site_edneypugliese" é um website de portfólio pessoal para Edney Pugliese, desenvolvido para apresentar suas habilidades, projetos, fotos e informações de contato. O site possui suporte a múltiplos idiomas, permitindo que o conteúdo seja exibido em Português, Inglês, Espanhol e Italiano.

## Tecnologias Principais

*   **HTML5:** Estrutura e conteúdo das páginas web.
*   **CSS3:** Estilização e design responsivo do site.
*   **JavaScript:** Funcionalidades dinâmicas, interatividade, manipulação do DOM e lógica de internacionalização.
*   **Font Awesome:** Biblioteca de ícones utilizada em todo o site.
*   **Bootstrap:** Framework CSS utilizado em `localizacao.html` para componentes de UI.
*   **JSON:** Utilizado para armazenar as traduções de conteúdo em diferentes idiomas (`lang/*.json`).

## Arquitetura do Projeto

O projeto segue uma arquitetura de frontend estático, onde as páginas são servidas diretamente como arquivos HTML, CSS e JavaScript.

*   **Frontend:** Consiste em arquivos HTML estáticos (`index.html`, `portfolio.html`, `fotos.html`, `habilidades.html`, `localizacao.html`) que são estilizados por `style.css`.
*   **Conteúdo Dinâmico/Interatividade:** O arquivo `script.js` é responsável por:
    *   Carregamento e aplicação de traduções baseadas em atributos `data-i18n`.
    *   Alternância do menu hambúrguer para navegação mobile.
    *   Adição dinâmica de links de redes sociais (informações obtidas de `base/redes.txt`).
    *   Efeitos de fade-in para imagens.
    *   Lógica de carrossel (mencionado em `script.js` como movido de `fotos.html`).
    *   Funcionalidade de modal para itens do portfólio, incluindo um lightbox para visualização de imagens em tamanho maior.
*   **Suporte Multilíngue:** Implementado através de atributos `data-i18n` nos elementos HTML, que são preenchidos dinamicamente com base em arquivos JSON de tradução localizados no diretório `lang`.
*   **Ativos de Imagem:** Organizados no diretório `img`, com subdiretórios para diferentes seções do site (ex: `img/home`, `img/portfolio`).

## Estrutura de Diretórios

```
.
├── base/
│   └── redes.txt
├── img/
│   ├── fotos/
│   ├── home/
│   └── portfolio/
├── lang/
│   ├── en.json
│   ├── es.json
│   ├── it.json
│   └── pt.json
├── .gitignore
├── cel1.jpg
├── cel2.jpg
├── CNAME
├── fotos.html
├── habilidades.html
├── index.html
├── localizacao.html
├── portfolio.html
├── script.js
├── site.png
├── site2.png
├── site3.png
├── site4.png
└── style.css
```

## Construção e Execução

Este é um website estático e não requer etapas de construção explícitas (como compilação ou empacotamento) além de servir os arquivos HTML, CSS e JavaScript.

*   **Para Executar:** Basta abrir qualquer arquivo HTML (ex: `index.html`) em um navegador web.

## Convenções de Desenvolvimento

*   **Suporte Multilíngue:** Utiliza atributos `data-i18n` em elementos HTML para texto traduzível, com as traduções armazenadas em arquivos JSON no diretório `lang`.
*   **Versionamento de Ativos:** Arquivos CSS e JavaScript são linkados com um parâmetro de versão (ex: `style.css?v=1.38`, `script.js?v=1.7`) para gerenciar o cache do navegador e garantir que as versões mais recentes sejam carregadas.
*   **Configuração de Redes Sociais:** Links de redes sociais são configurados em `base/redes.txt` e são carregados dinamicamente pelo `script.js`.

## Inconsistências e Melhorias Potenciais

*   **Versionamento de Script Inconsistente:** As versões do `script.js` linkadas em diferentes arquivos HTML (`index.html?v=1.5`, `habilidades.html?v=1.1`, `localizacao.html?v=1.2`, `portfolio.html?v=1.7`) são inconsistentes. Para garantir que a versão mais recente do script seja sempre utilizada e para evitar problemas de cache, é recomendável que todos os arquivos HTML referenciem a mesma e mais recente versão do `script.js`.
*   **Traduções Incompletas/Incorretas:** Houve problemas anteriores com traduções ausentes ou incorretas em arquivos JSON, que foram corrigidos. É importante manter a consistência e a precisão das traduções em todos os idiomas.
*   **Estrutura do Modal:** A estrutura do modal do portfólio e a lógica de preenchimento no `script.js` foram ajustadas para serem compatíveis.
*   **Funcionalidade de Lightbox:** Adicionada funcionalidade de lightbox para visualização de imagens em tamanho maior no modal do portfólio.
