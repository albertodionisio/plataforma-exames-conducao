"""Testes dos dados extraídos do APK (original/extraido/).

Executar a partir da raiz do repositório:
    python3 -m unittest tests/test_exames_originais.py -v
"""
import hashlib, json, os, subprocess, sys, tempfile, unittest

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTRAIDO = os.path.join(RAIZ, "original", "extraido")
AMBITO_PEDIDO = list(range(1, 31))


def ler(nome):
    with open(os.path.join(EXTRAIDO, nome), encoding="utf-8") as f:
        return json.load(f)


ESTADO = ler("ESTADO.json")
PUBLICADOS = ESTADO["publicados"]


class TestEstado(unittest.TestCase):
    def test_ficheiros_correspondem_ao_estado(self):
        existentes = sorted(int(f[5:-5]) for f in os.listdir(EXTRAIDO)
                            if f.startswith("exame") and f.endswith(".json"))
        self.assertEqual(existentes, PUBLICADOS)

    def test_ambito_pedido(self):
        self.assertEqual(ESTADO["ambito_da_tarefa"], AMBITO_PEDIDO)
        self.assertTrue(set(PUBLICADOS) <= set(AMBITO_PEDIDO), "o APK só tem 30 exames")

    def test_completo_so_quando_os_30_exames_existem(self):
        if ESTADO["completo"]:
            self.assertEqual(PUBLICADOS, AMBITO_PEDIDO)


class TestExames(unittest.TestCase):
    def test_cada_exame(self):
        for n in PUBLICADOS:
            d = ler(f"exame{n}.json")
            ps = d["perguntas"]
            with self.subTest(exame=n):
                self.assertEqual(d["exame"], n)
                self.assertEqual(len(ps), 25)
                self.assertEqual([p["numero"] for p in ps], list(range(1, 26)))
                self.assertEqual([p["indice_global"] for p in ps], list(range((n - 1) * 25, n * 25)),
                                 "ordem original preservada")

    def test_perguntas(self):
        for n in PUBLICADOS:
            for p in ler(f"exame{n}.json")["perguntas"]:
                with self.subTest(exame=n, pergunta=p["numero"]):
                    self.assertTrue(p["enunciado"].strip())
                    self.assertEqual(len(p["alternativas"]), 4)
                    self.assertIn(p["resposta_correcta"], list("ABCD"))
                    self.assertEqual(p["resposta_correcta_indice"], "ABCD".index(p["resposta_correcta"]))
                    self.assertTrue(p["alternativas"][p["resposta_correcta_indice"]].strip(),
                                    "a resposta certa não pode ser uma alternativa vazia")
                    self.assertIsNone(p["explicacao"], "o APK não tem explicações: nada inventado")
                    self.assertIsNone(p["tema"], "o APK não tem tema: nada inventado")
                    self.assertEqual(set(p["origem"]["campos"]), {"img", "pergunta", "opcoes", "respostaCorrecta", "exame"})

    def test_imagens_ligadas_pelo_indice(self):
        for n in PUBLICADOS:
            for p in ler(f"exame{n}.json")["perguntas"]:
                with self.subTest(exame=n, pergunta=p["numero"]):
                    im = p["imagem"]
                    self.assertEqual(im["recurso"], f"drawable/exame{n}_{p['numero']}")
                    caminho = os.path.join(EXTRAIDO, im["ficheiro"])
                    self.assertTrue(os.path.isfile(caminho))
                    with open(caminho, "rb") as f:
                        self.assertEqual(hashlib.sha256(f.read()).hexdigest(), im["sha256"])


class TestMapeamento(unittest.TestCase):
    def test_mapeamento_coerente(self):
        mapa = ler("mapeamento.json")
        self.assertEqual(len(mapa), 25 * len(PUBLICADOS))
        for m in mapa:
            p = ler(f"exame{m['exame']}.json")["perguntas"][m["pergunta"] - 1]
            self.assertEqual(m["indice_global"], p["indice_global"])
            self.assertEqual(m["ficheiro_imagem"], p["imagem"]["ficheiro"])
            self.assertEqual(m["resposta_correcta"], p["resposta_correcta"])


class TestReproducibilidade(unittest.TestCase):
    def test_extractor_gera_os_mesmos_dados(self):
        try:
            import androguard, PIL  # noqa: F401
        except ImportError:
            self.skipTest("instalar androguard e pillow para este teste")
        apk = os.path.join(RAIZ, "original", "Codigo_e_Sinais_de_Transito_1_1.apk")
        if not os.path.isfile(apk):
            self.skipTest("APK original não encontrado")
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run([sys.executable, os.path.join(RAIZ, "tools", "extrair_apk.py"),
                            "--exames", ",".join(map(str, PUBLICADOS)), "--saida", tmp],
                           check=True, capture_output=True, cwd=RAIZ)
            for n in PUBLICADOS:
                with open(os.path.join(tmp, f"exame{n}.json"), encoding="utf-8") as f:
                    novo = json.load(f)
                self.assertEqual(novo, ler(f"exame{n}.json"), f"exame {n} diferente ao voltar a extrair")


if __name__ == "__main__":
    unittest.main()
