const base = import.meta.env.BASE_URL;

export const laminas = [
  {
    id: "local-amalgama",
    name: "Pigmentação por Amálgama",
    pathology: "Tatuagem por amálgama",
    tissue: "Mucosa oral",
    stain: "Informação a confirmar",
    magnification: "Informação a confirmar",
    description:
      "Lâmina histológica demonstrativa de pigmentação por amálgama, destinada ao estudo da presença de material pigmentado associado aos tecidos da mucosa oral.",
    pathologyDescription:
      "A tatuagem por amálgama é uma pigmentação exógena adquirida decorrente da implantação de partículas de amálgama nos tecidos da mucosa oral. A descrição definitiva dos achados deve ser conferida com o material da disciplina ou do laboratório responsável pela lâmina.",
    keyFindings: ["Depósitos de material pigmentado", "Pigmentação no tecido conjuntivo"],
    tags: ["Pigmentação", "Amálgama", "Mucosa oral"],
    image: `${base}laminas/tatuagem-amalgama.png`
  },
  {
    id: "local-01",
    name: "Carcinoma Espinocelular",
    pathology: "Carcinoma espinocelular oral",
    tissue: "Mucosa oral",
    stain: "Hematoxilina e Eosina (HE)",
    magnification: "40×",
    description:
      "Lâmina demonstrativa destinada ao estudo dos principais achados histopatológicos associados a uma neoplasia epitelial maligna da cavidade oral.",
    pathologyDescription:
      "Neoplasia maligna de origem epitelial, caracterizada por proliferação de células escamosas atípicas, podendo apresentar invasão do tecido conjuntivo, pleomorfismo e alterações na arquitetura epitelial.",
    keyFindings: [
      "Atipias citológicas",
      "Pleomorfismo celular",
      "Perda da arquitetura epitelial",
      "Invasão do tecido conjuntivo"
    ],
    tags: ["Neoplasia", "Malignidade", "Mucosa oral"],
    image: `${base}laminas/placeholder.svg`
  },
  {
    id: "local-02",
    name: "Leucoplasia",
    pathology: "Leucoplasia oral",
    tissue: "Mucosa oral",
    stain: "Hematoxilina e Eosina (HE)",
    magnification: "10×",
    description:
      "Lâmina demonstrativa para reconhecimento das alterações epiteliais que podem acompanhar uma lesão branca da mucosa oral.",
    pathologyDescription:
      "Lesão predominantemente branca que não pode ser caracterizada como outra doença ou condição conhecida. Histologicamente, pode apresentar hiperqueratose, acantose e diferentes graus de displasia.",
    keyFindings: [
      "Hiperqueratose",
      "Acantose",
      "Alterações da maturação epitelial",
      "Possível displasia"
    ],
    tags: ["Lesão branca", "Potencialmente maligna", "Epitélio"],
    image: `${base}laminas/placeholder.svg`
  },
  {
    id: "local-03",
    name: "Cisto Odontogênico",
    pathology: "Cisto odontogênico inflamatório",
    tissue: "Tecido conjuntivo / epitélio",
    stain: "Hematoxilina e Eosina (HE)",
    magnification: "20×",
    description:
      "Lâmina demonstrativa para estudo da organização microscópica de uma cavidade cística revestida por epitélio.",
    pathologyDescription:
      "Lesão cística caracterizada por uma cavidade revestida por epitélio e uma parede de tecido conjuntivo. O aspecto varia conforme o tipo de cisto e a intensidade do processo inflamatório.",
    keyFindings: [
      "Cavidade cística",
      "Revestimento epitelial",
      "Parede de tecido conjuntivo",
      "Inflamação variável"
    ],
    tags: ["Cisto", "Odontogênica", "Inflamação"],
    image: `${base}laminas/placeholder.svg`
  },
  {
    id: "local-04",
    name: "Displasia Epitelial",
    pathology: "Displasia epitelial oral",
    tissue: "Epitélio escamoso estratificado",
    stain: "Hematoxilina e Eosina (HE)",
    magnification: "40×",
    description:
      "Lâmina para estudo das alterações arquiteturais e citológicas que podem indicar progressão de uma lesão potencialmente maligna.",
    pathologyDescription:
      "Alteração pré-neoplásica caracterizada por desorganização arquitetural e atipias citológicas do epitélio, classificada de acordo com a intensidade e a extensão das alterações.",
    keyFindings: [
      "Desorganização arquitetural",
      "Hipercromatismo",
      "Aumento da relação núcleo/citoplasma",
      "Mitoses anormais"
    ],
    tags: ["Displasia", "Pré-neoplasia", "Epitélio"],
    image: `${base}laminas/placeholder.svg`
  }
];
