#!/usr/bin/env python3
"""Extractor do banco de perguntas do APK original «Código e Sinais de Trânsito».

As perguntas, as alternativas, as respostas certas e as imagens não estão em ficheiros de texto:
estão dentro do código compilado (classe BaseDadosExame, método <init>), em arrays construídos
instrução a instrução. Este extractor interpreta esse bytecode (sem executar a app) e recupera
os dados tal como estão no APK, sem os alterar nem os adaptar.

Uso (a partir da raiz do repositório):
    pip install androguard pillow
    python3 tools/extrair_apk.py --exames 1-20

Saída em original/extraido/ (ver docs/extracao/LEIAME.md).
"""
import argparse, csv, hashlib, io, json, os, re, sys
from collections import Counter

VERSAO = "1.0"
APK_PADRAO = "original/Codigo_e_Sinais_de_Transito_1_1.apk"
SAIDA_PADRAO = "original/extraido"
CAMPOS = ("img", "pergunta", "opcoes", "respostaCorrecta", "exame")
PERGUNTAS_POR_EXAME = 25
AMBITO_DA_TAREFA = list(range(1, 31))   # DADOS-054: exames 1 a 10; DADOS-059: 11 a 20; DADOS-061: 21 a 30 (todo o APK)


def carregar_androguard():
    try:
        from androguard.core.apk import APK
        from androguard.core.dex import DEX
    except ImportError:
        sys.exit("Falta o androguard: pip install androguard pillow")
    return APK, DEX


def analisar_exames_pedidos(texto):
    pedidos = set()
    for parte in texto.split(","):
        parte = parte.strip()
        if "-" in parte:
            a, b = parte.split("-")
            pedidos.update(range(int(a), int(b) + 1))
        elif parte:
            pedidos.add(int(parte))
    return sorted(pedidos)


def interpretar_bytecode(apk, DEX):
    """Devolve (campos, estatisticas). campos[nome] = {indice_global: valor}."""
    metodo = None
    for raw in apk.get_all_dex():
        dex = DEX(raw)
        for classe in dex.get_classes():
            if classe.get_name().endswith("/BaseDadosExame;"):
                for m in classe.get_methods():
                    if m.get_name() == "<init>":
                        metodo, nome_classe = m, classe.get_name()
    if metodo is None:
        sys.exit("Não encontrei BaseDadosExame.<init> no APK.")

    val = {}          # registo -> valor (int ou str)
    arrays = {}       # registo -> {"tipo": str, "itens": {indice: valor}}
    campos = {}       # nome do campo -> {indice: valor}
    ultimo_arg = None
    nao_interpretadas = Counter()
    n_instrucoes = 0

    for ins in metodo.get_code().get_bc().get_instructions():
        n_instrucoes += 1
        nome, saida = ins.get_name(), ins.get_output()
        if nome.startswith("const-string"):
            reg = saida.split(",")[0].strip()
            val[reg] = ins.get_string()
            arrays.pop(reg, None)
        elif nome in ("const/4", "const/16", "const", "const/high16"):
            m = re.match(r"(v\d+), (-?\d+)", saida)
            val[m.group(1)] = int(m.group(2))
            arrays.pop(m.group(1), None)
        elif nome == "new-array":
            m = re.match(r"(v\d+), (v\d+), (\[.*)$", saida)
            arrays[m.group(1)] = {"tipo": m.group(3), "itens": {}}
        elif nome == "aput-object":
            v, a, i = [x.strip() for x in saida.split(",")]
            if arrays[a]["tipo"].startswith("[["):   # matriz de matrizes (opções)
                arrays[a]["itens"][val[i]] = dict(arrays[v]["itens"])
            else:
                arrays[a]["itens"][val[i]] = val[v]
        elif nome.startswith("invoke-static") and "Integer;->valueOf" in saida:
            ultimo_arg = val[saida.split(",")[0].strip()]
        elif nome == "move-result-object":
            if ultimo_arg is not None:
                val[saida.strip()] = ultimo_arg
                arrays.pop(saida.strip(), None)
                ultimo_arg = None
        elif nome == "iput-object":
            m = re.match(r"(v\d+), v\d+, .*->(\w+) ", saida)
            campos[m.group(2)] = dict(arrays[m.group(1)]["itens"])
        elif nome in ("return-void", "invoke-direct", "iget-object", "move-object"):
            pass
        else:
            nao_interpretadas[nome] += 1
    estat = {"classe": nome_classe, "instrucoes": n_instrucoes,
             "nao_interpretadas": dict(nao_interpretadas)}
    return campos, estat


def nomes_de_recursos(apk, ids):
    recursos = apk.get_android_resources()
    return {i: recursos.get_resource_xml_name(i).split("/")[-1] for i in ids}


def caminho_da_imagem(apk, nome):
    candidatos = [f for f in apk.get_files()
                  if re.fullmatch(r"res/drawable[^/]*/" + re.escape(nome) + r"\.(jpg|jpeg|png|webp)", f)]
    candidatos.sort(key=lambda f: (f.split("/")[1] != "drawable", f))
    return candidatos


def analisar_imagem(dados):
    from PIL import Image, ImageStat
    im = Image.open(io.BytesIO(dados))
    cinza = im.convert("L")
    est = ImageStat.Stat(cinza)
    media, desvio = est.mean[0], est.stddev[0]
    return {"largura": im.width, "altura": im.height,
            "media_cinza": round(media, 1), "desvio_cinza": round(desvio, 1),
            "provavel_em_branco": bool(desvio < 2.5 and media > 235)}


def extrair(args):
    APK, DEX = carregar_androguard()
    apk = APK(args.apk)
    campos, estat = interpretar_bytecode(apk, DEX)

    erros = []
    for c in CAMPOS:
        if c not in campos:
            erros.append(f"campo em falta: {c}")
    if erros:
        sys.exit("; ".join(erros))
    n = len(campos["pergunta"])
    indices = sorted(campos["pergunta"])
    if indices != list(range(n)) or any(len(campos[c]) != n for c in CAMPOS):
        sys.exit("Os cinco campos não têm o mesmo número de entradas contíguas.")

    # exames pela ordem original dos índices
    por_exame = {}
    for i in indices:
        por_exame.setdefault(campos["exame"][i], []).append(i)
    ordem = sorted(por_exame, key=lambda e: por_exame[e][0])
    numero_de = {e: int(re.fullmatch(r"exame(\d+)", e).group(1)) for e in ordem}

    ids_img = sorted(set(campos["img"].values()))
    nome_img = nomes_de_recursos(apk, ids_img)
    sha_apk = hashlib.sha256(open(args.apk, "rb").read()).hexdigest()

    os.makedirs(args.saida, exist_ok=True)
    mapeamento, nao_recuperado, relatorio, publicados = [], [], [], []

    for e in ordem:
        num = numero_de[e]
        if num not in args.exames:
            continue
        idx = por_exame[e]
        perguntas = []
        enunciados = Counter(campos["pergunta"][i] for i in idx)
        pasta_img = os.path.join(args.saida, "imagens", e)
        os.makedirs(pasta_img, exist_ok=True)
        for k, i in enumerate(idx, 1):
            enun = campos["pergunta"][i]
            alts = [campos["opcoes"][i].get(j, "") for j in range(4)]
            letra = campos["respostaCorrecta"][i]
            rid = campos["img"][i]
            nome = nome_img[rid]
            caminhos = caminho_da_imagem(apk, nome)
            avisos = []
            imagem = {"recurso_id": rid, "recurso": "drawable/" + nome, "ficheiro": None}
            if caminhos:
                dados = apk.get_file(caminhos[0])
                ext = caminhos[0].rsplit(".", 1)[1]
                rel = f"imagens/{e}/{nome}.{ext}"
                with open(os.path.join(args.saida, rel), "wb") as f:
                    f.write(dados)
                imagem.update({"ficheiro": rel, "ficheiro_no_apk": caminhos[0],
                               "sha256": hashlib.sha256(dados).hexdigest()})
                imagem.update(analisar_imagem(dados))
                if imagem["provavel_em_branco"]:
                    avisos.append("imagem_provavel_em_branco")
            else:
                avisos.append("imagem_nao_encontrada_no_apk")
                nao_recuperado.append({"exame": num, "pergunta": k, "elemento": "imagem",
                                       "motivo": f"o recurso drawable/{nome} não existe como ficheiro no APK"})
            if letra not in "ABCD" or len(letra) != 1:
                avisos.append("resposta_correcta_invalida")
                ci = None
            else:
                ci = "ABCD".index(letra)
            vazias = [j for j, a in enumerate(alts) if not a.strip()]
            if vazias:
                avisos.append("alternativas_vazias:" + ",".join("ABCD"[j] for j in vazias))
            if ci is not None and ci in vazias:
                avisos.append("resposta_correcta_aponta_para_alternativa_vazia")
            reais = [a.strip() for a in alts if a.strip()]
            if len(reais) != len(set(reais)):
                avisos.append("alternativas_repetidas")
            if enunciados[enun] > 1:
                avisos.append("enunciado_repetido_no_exame")
            if k > 1 and enun == campos["pergunta"][idx[k - 2]]:
                avisos.append("enunciado_igual_ao_da_pergunta_anterior")
            perguntas.append({
                "numero": k,
                "indice_global": i,
                "enunciado": enun,
                "alternativas": alts,
                "resposta_correcta": letra,
                "resposta_correcta_indice": ci,
                "imagem": imagem,
                "explicacao": None,
                "tema": None,
                "estado": {
                    "enunciado_alternativas_resposta": "recuperado do APK (por validar legalmente)",
                    "explicacao": "não existe no APK",
                    "tema": "não existe no APK",
                    "imagem_associada_por": "mesmo índice nos arrays img e pergunta",
                },
                "avisos": avisos,
                "origem": {
                    "apk": os.path.basename(args.apk),
                    "classe": estat["classe"],
                    "metodo": "<init>",
                    "campos": {c: f"{c}[{i}]" for c in CAMPOS},
                },
            })
            mapeamento.append({
                "exame": num, "pergunta": k, "indice_global": i,
                "recurso_imagem": imagem["recurso"], "ficheiro_imagem": imagem["ficheiro"] or "",
                "resposta_correcta": letra, "avisos": ";".join(avisos)})
        doc = {
            "exame": num,
            "identificador_no_apk": e,
            "total_perguntas": len(perguntas),
            "fonte": {"apk": os.path.basename(args.apk), "sha256_apk": sha_apk,
                      "extractor": f"tools/extrair_apk.py v{VERSAO}"},
            "perguntas": perguntas,
        }
        with open(os.path.join(args.saida, f"exame{num}.json"), "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")
        publicados.append(num)
        relatorio.append((num, perguntas))

    # elementos que o APK não tem para NENHUMA pergunta (estrutural)
    estrutural = [
        {"elemento": "explicacao", "exames": publicados, "motivo": "o APK não guarda explicações; o campo fica null"},
        {"elemento": "tema", "exames": publicados, "motivo": "o APK não guarda tema ou matéria por pergunta; o campo fica null"},
    ]
    with open(os.path.join(args.saida, "nao-recuperado.json"), "w", encoding="utf-8") as f:
        json.dump({"estrutural": estrutural, "por_pergunta": nao_recuperado}, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with open(os.path.join(args.saida, "mapeamento.json"), "w", encoding="utf-8") as f:
        json.dump(mapeamento, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with open(os.path.join(args.saida, "mapeamento.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(mapeamento[0].keys()))
        w.writeheader()
        w.writerows(mapeamento)
    estado = {"ambito_da_tarefa": AMBITO_DA_TAREFA, "publicados": publicados,
              "completo": publicados == AMBITO_DA_TAREFA,
              "perguntas_por_exame": PERGUNTAS_POR_EXAME,
              "extractor": f"tools/extrair_apk.py v{VERSAO}", "sha256_apk": sha_apk,
              "exames_encontrados_no_apk": len(ordem), "entradas_no_apk": n}
    with open(os.path.join(args.saida, "ESTADO.json"), "w", encoding="utf-8") as f:
        json.dump(estado, f, ensure_ascii=False, indent=2)
        f.write("\n")
    escrever_relatorio(args, estat, estado, relatorio, nao_recuperado)
    return estado


def escrever_relatorio(args, estat, estado, relatorio, nao_recuperado):
    L = ["# Relatório de extracção", "",
         f"- APK: `{os.path.basename(args.apk)}` (sha256 `{estado['sha256_apk'][:16]}…`)",
         f"- Extractor: `{estado['extractor']}`",
         f"- Classe: `{estat['classe']}`, método `<init>`: {estat['instrucoes']} instruções interpretadas",
         f"- Instruções não interpretadas: {estat['nao_interpretadas'] or 'nenhuma'}",
         f"- Entradas no APK: {estado['entradas_no_apk']} perguntas em {estado['exames_encontrados_no_apk']} exames",
         f"- Âmbito da tarefa: exames 1 a 30; publicados até agora: {estado['publicados']} (completo: {estado['completo']})",
         "", "## Resultado por exame", "",
         "| Exame | Perguntas | Alternativas vazias | Imagens ligadas | Imagens prováveis em branco | Avisos |",
         "|---|---|---|---|---|---|"]
    for num, ps in relatorio:
        vaz = sum(1 for p in ps if any(a.startswith("alternativas_vazias") for a in p["avisos"]))
        lig = sum(1 for p in ps if p["imagem"]["ficheiro"])
        bra = sum(1 for p in ps if "imagem_provavel_em_branco" in p["avisos"])
        outros = Counter(a.split(":")[0] for p in ps for a in p["avisos"]
                         if not a.startswith("alternativas_vazias") and a != "imagem_provavel_em_branco")
        L.append(f"| {num} | {len(ps)} | {vaz} | {lig} | {bra} | {dict(outros) or '—'} |")
    L += ["", "## O que não foi recuperado", "",
          "- **Explicações:** o APK não as contém. O campo `explicacao` fica `null` em todas as perguntas.",
          "- **Tema ou matéria:** o APK não o contém. O campo `tema` fica `null`.",
          f"- **Imagens não encontradas:** {len(nao_recuperado)}.",
          "", "## O que fica por validar", "",
          "- A resposta certa de cada pergunta é a que o APK indica. Não foi confrontada com o Código da Estrada de Moçambique.",
          "- Os avisos (`avisos`) são detecções automáticas objectivas (alternativa vazia, enunciado repetido, imagem quase branca); não substituem a revisão humana.",
          "", "## Como a imagem foi associada à pergunta", "",
          "O código do APK guarda cinco arrays com o mesmo índice (`img`, `pergunta`, `opcoes`, `respostaCorrecta`, `exame`). "
          "A imagem de uma pergunta é a entrada `img[i]` do mesmo `i` que `pergunta[i]`. Não houve associação por semelhança. "
          "O identificador numérico do recurso é convertido no nome do ficheiro (`drawable/exame1_1`) pela tabela de recursos do APK.", ""]
    with open(os.path.join(args.saida, "RELATORIO.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apk", default=APK_PADRAO)
    ap.add_argument("--saida", default=SAIDA_PADRAO)
    ap.add_argument("--exames", default="1-30", help="exemplo: 1-30 ou 1,3,5 (por omissão 1-30)")
    args = ap.parse_args()
    args.exames = analisar_exames_pedidos(args.exames)
    estado = extrair(args)
    print(f"Publicados: {estado['publicados']} | completo: {estado['completo']} | saída: {args.saida}")


if __name__ == "__main__":
    main()
