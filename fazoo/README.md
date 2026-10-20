# Fazoo: site vitrine

Site estático da Fazoo, feito com [Astro](https://astro.build). Mostra os produtos de impressão 3D e bottons, com contato pelo WhatsApp e Instagram e links para os marketplaces.

## Rodar no computador

Precisa do Node.js 22 ou mais novo.

```bash
npm install      # só na primeira vez
npm run dev      # abre em http://localhost:4321
npm run build    # gera o site final na pasta dist/
```

## Onde mexer

| O que mudar | Arquivo |
| --- | --- |
| WhatsApp, Instagram e links dos marketplaces | `src/config.ts` |
| Produtos | `src/content/produtos/` (um arquivo `.md` por produto) |
| Categorias | `src/config.ts` e a lista `categoria` em `src/content.config.ts` |
| Fotos dos produtos | `src/assets/produtos/` |
| Cores e fontes | `src/styles/global.css` |
| Logo, ícone e imagem de compartilhamento | `public/`, gerados por `scripts/extrair-logo.mjs` |

### Ativar um marketplace

Em `src/config.ts`, cole o link da loja no campo `url`. Enquanto estiver vazio, o site mostra "Em breve".

### Adicionar um produto

1. Coloque as fotos em `src/assets/produtos/`, por exemplo `luminaria-lua-1.jpg`.
2. Crie `src/content/produtos/luminaria-lua.md`. O nome do arquivo vira o endereço `/produtos/luminaria-lua`.
3. Preencha assim:

```markdown
---
titulo: Luminária Lua
categoria: impressao-3d        # impressao-3d, bottons, personalizados ou natal
resumo: Frase curta que aparece no cartão do produto.
fotos:
  - ../../assets/produtos/luminaria-lua-1.jpg
  - ../../assets/produtos/luminaria-lua-2.jpg
detalhes:
  - "Material: PLA"            # use aspas quando tiver dois-pontos
  - "Diâmetro: 12 cm"
ordem: 6                       # posição na vitrine, do menor para o maior
links:
  mercadoLivre: https://...
  shopee: https://...
---

Descrição completa do produto, que aparece na página dele.
```

Sem fotos, o produto mostra uma ilustração provisória da categoria. A linha `exemplo: true` exibe a etiqueta "Exemplo", útil para testar o layout.

As fotos aparecem inteiras, sem cortes, então artes com texto funcionam bem. Elas são reduzidas e convertidas automaticamente no `npm run build`. Prefira imagens com até 2000 px de largura. Os arquivos originais das artes ficam guardados em `marca/originais-produtos/`.

## Publicar

O site é estático, então serve em qualquer hospedagem gratuita, como Cloudflare Pages, Vercel ou Netlify. Conecte o repositório do GitHub e use:

- Comando de build: `npm run build`
- Pasta publicada: `dist`

Quando tiver o domínio definitivo, ajuste o campo `site` em `astro.config.mjs`.
