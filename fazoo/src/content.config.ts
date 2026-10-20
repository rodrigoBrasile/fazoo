import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada produto é um arquivo .md em src/content/produtos.
// O nome do arquivo vira o endereço da página: vaso-geometrico.md -> /produtos/vaso-geometrico
const produtos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produtos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      categoria: z.enum(['impressao-3d', 'bottons', 'personalizados', 'natal']),
      resumo: z.string(),
      // Caminhos relativos ao arquivo, por exemplo: ../../assets/produtos/vaso-1.jpg
      fotos: z.array(image()).default([]),
      detalhes: z.array(z.string()).default([]),
      destaque: z.boolean().default(false),
      ordem: z.number().default(100),
      // Marca produtos fictícios usados enquanto as fotos reais não chegam.
      exemplo: z.boolean().default(false),
      links: z
        .object({
          mercadoLivre: z.url().optional(),
          shopee: z.url().optional(),
          amazon: z.url().optional(),
        })
        .default({}),
    }),
});

export const collections = { produtos };
