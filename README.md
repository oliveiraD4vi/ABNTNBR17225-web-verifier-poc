# Verificador de Acessibilidade Web ABNT NBR 17225 (PoC)

## 1. Descrição do Projeto
Esta extensão de navegador é uma **Prova de Conceito (PoC)** desenvolvida para validar a automatização da avaliação de páginas web com base na norma **ABNT NBR 17225:2025 – Acessibilidade em conteúdo e aplicações web**.

A norma NBR 17225 estabelece critérios essenciais para garantir que conteúdos digitais sejam perceptíveis, operáveis, compreensíveis e robustos para pessoas com deficiência. Ela organiza-se em 146 itens, sendo 96 requisitos obrigatórios (alinhados aos níveis A e AA da WCAG) e 50 recomendações adicionais (nível AAA). Esta ferramenta visa facilitar o diagnóstico de conformidade técnica, auxiliando desenvolvedores e auditores na identificação de barreiras de acessibilidade.

## 2. Estrutura e Arquitetura
O projeto foi construído utilizando a arquitetura **Manifest V3**, garantindo alta performance e segurança. A estrutura está organizada de forma modular para permitir a expansão das regras de verificação:

*   **Motor de Auditoria (`scripts/content/engine.js`)**: O núcleo da extensão que gerencia a execução das regras e consolida os resultados.
*   **Sistema de Regras (`scripts/rules/`)**: Implementações individuais para cada categoria da norma, incluindo:
    *   `headings.js`: Validação de hierarquia de cabeçalhos.
    *   `forms.js` e `buttons-and-controls.js`: Verificação de rótulos e controles interativos.
    *   `colors-usage.js`: Análise de contraste e uso semântico de cores.
    *   `keyboard-interaction.js`: Garantia de navegabilidade via teclado.
*   **Interface do Usuário (`popup/`)**: Painel de controle para iniciar auditorias, visualizar o sumário de erros e acessar relatórios detalhados.
*   **Relatórios e Exportação**: Funcionalidade para gerar relatórios em HTML (`report/`) e exportar dados brutos em formato JSON para análises externas.

## 3. Funcionalidades Principais
| Funcionalidade | Descrição |
| :--- | :--- |
| **Auditoria em Tempo Real** | Analisa o DOM da página ativa em busca de violações. |
| **Destaque Visual** | Marca diretamente na página os elementos que apresentam falhas de acessibilidade. |
| **Classificação de Severidade** | Diferencia entre **Requisitos (Erros Críticos)** e **Recomendações (Avisos)**. |
| **Exportação JSON** | Permite salvar os resultados para documentação técnica ou integração com outras ferramentas. |

## 4. Como Instalar e Executar
Para testar a extensão em seu próprio navegador (Chrome, Edge ou Brave), siga os passos abaixo:

1.  **Download**: Baixe e extraia o código-fonte deste repositório em uma pasta local.
2.  **Acessar Extensões**: No navegador, digite `chrome://extensions/` na barra de endereços.
3.  **Modo Desenvolvedor**: Ative a chave **"Modo do desenvolvedor"** no canto superior direito.
4.  **Carregar Extensão**: Clique no botão **"Carregar sem compactação"** e selecione a pasta onde você extraiu os arquivos do projeto.
5.  **Execução**: 
    *   Clique no ícone da extensão na barra de ferramentas - você deve ver um ícone de acessibilidade com fundo branco.
    *   Você deve ver o PopUp com o botão **"Verificar Página"**, clique nele para iniciar a análise da página atual.
    *   Utilize o botão **"Relatório detalhado"** para ver detalhes técnicos ou **"Mostrar na Página"** para localizar os erros visualmente.
    *   Você pode ainda utilizar o botão **"Exportar JSON"** para exportar os resultados em formato JSON
    *   Os botões para refazer a análise ou excluí-la se encontram no canto superior direito do PopUp com ícones equivalentes

---
*Projeto desenvolvido como Prova de Conceito para fins acadêmicos e de pesquisa em acessibilidade digital.*
