# Original

`Codigo_e_Sinais_de_Transito_1_1.apk`: a app original «Código e Sinais de Trânsito» (30 exames × 25 perguntas), encomendada pelo dono do projeto.

Serve só como **referência de trabalho** para as sessões lerem as perguntas e as imagens originais ao reescrever cada exame.

- O site **não** serve este ficheiro nem o conteúdo original: usa só as perguntas reescritas em `data/exames/`.
- Dentro do APK há também `assets/sinais.pdf` (sinais) e `assets/codigodeestrada.pdf` (Código da Estrada).
- Enquanto o repositório for público, qualquer pessoa pode descarregar este ficheiro (decisão do dono, 2026-11-09).

## Cópias dos PDFs (2026-11-14)

`original/referencia/sinais.pdf` e `original/referencia/codigodeestrada.pdf` são os mesmos ficheiros que vão dentro do APK (`assets/`), copiados para que as sessões os possam ler sem abrir o APK. Os exames já extraídos estão em `original/extraido/` (ver `RELATORIO.md`).

## Documentos de referência extraídos do APK (`original/documentos/`)

Cópias byte a byte dos dois PDFs que vêm dentro do APK, para as sessões que não conseguem abrir ficheiros dentro de um APK (2026-11-16, GER-014). Servem só de referência de trabalho, como o APK.

| Ficheiro | Origem no APK | Páginas | Tamanho | SHA-256 |
|---|---|---|---|---|
| `original/documentos/sinais.pdf` | `assets/sinais.pdf` | 69 | 9 953 947 bytes | `6e0f4155abe30c7a86747fed16cfaad0659c7f684c9ffc5a2edea82dd5096c24` |
| `original/documentos/codigodeestrada.pdf` | `assets/codigodeestrada.pdf` | 85 | 795 357 bytes | `9e5e7a70e327b7de24eff3a2a0be37686ca473831d9ee3f6f161774a61407fd5` |

- `codigodeestrada.pdf` tem texto extraível (`pdftotext`).
- `sinais.pdf` **não tem texto extraível**: os códigos e as designações estão desenhados. É preciso ler as páginas como imagem (por exemplo, `pdftoppm -r 130 -f 21 -l 21 -png sinais.pdf pagina`). O índice dos quadros por página e a conferência dos sinais usados no ESTRADA estão em `docs/referencia-sinais.md`.
