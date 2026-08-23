import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, BriefcaseMedical, ChevronRight, CircleUserRound,
  FileText, FlaskConical, Home as HomeIcon, Info, LayoutGrid, LockKeyhole, Mail,
  Microscope, Search, ShieldCheck, Users, X, ZoomIn, ZoomOut, RotateCcw,
  Maximize2, GraduationCap, Menu, Plus, Minus
} from "lucide-react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchLaminas, fetchIsAdmin, createLamina, updateLamina, removeLamina } from "./lib/laminas";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const LaminasContext = createContext(null);

function LaminasProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    try {
      const data = await fetchLaminas();
      setItems(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar o acervo. Verifique a configuração do banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  return <LaminasContext.Provider value={{ items, setItems, reload, loading, error }}>{children}</LaminasContext.Provider>;
}

function useLaminas() {
  return useContext(LaminasContext);
}

const navItems = [
  { label: "Início", path: "/", icon: HomeIcon },
  { label: "Lâminas Histológicas", path: "/laminas", icon: Microscope },
  { label: "Casos Clínicos", path: "/casos", icon: BriefcaseMedical },
  { label: "Materiais", path: "/materiais", icon: BookOpen },
  { label: "Sobre o NUCAO", path: "/sobre", icon: Users },
  { label: "Contato", path: "/contato", icon: Mail }
];

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="NUCAO - início">
      <span className="logo-mark">
        <span>NUCAO</span>
        <small>NÚCLEO DE CÂNCER ORAL</small>
      </span>
      <span className="logo-name">NUCAO</span>
    </Link>
  );
}

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className={open ? "main-nav open" : "main-nav"}>
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} className={location.pathname === path ? "nav-link active" : "nav-link"}>
              <Icon size={17} />
              {label}
            </Link>
          ))}
          <Link to="/admin" className="admin-button"><LockKeyhole size={16} /> Área Administrativa</Link>
        <a
  href="https://www.uefs.br/"
  target="_blank"
  rel="noopener noreferrer"
  className="uefs-logo-link"
  title="Universidade Estadual de Feira de Santana"
>
  <img
    src="/logos/uefs.png"
    alt="Universidade Estadual de Feira de Santana"
    className="uefs-logo"
  />
</a>
</nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
  <Logo />
</div>
          <p>Acervo digital para estudo, pesquisa e ensino sobre câncer oral.</p>
        </div>
        <div className="footer-links">
          <Link to="/laminas">Lâminas</Link>
          <Link to="/casos">Casos clínicos</Link>
          <Link to="/materiais">Materiais</Link>
          <Link to="/sobre">Sobre</Link>
        </div>
        <div className="footer-copy">© {new Date().getFullYear()} NUCAO</div>
      </div>
    </footer>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </div>
  );
}

function Home() {
  const stats = [
    [Microscope, "48", "Lâminas Histológicas"],
    [BriefcaseMedical, "23", "Casos Clínicos"],
    [BookOpen, "35", "Materiais Acadêmicos"],
    [Users, "6", "Linhas de Atuação"]
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-welcome">Bem-vindo ao</span>
            <h1>NUCAO</h1>
            <h2>Núcleo de Câncer Oral</h2>
            <p>
              Acervo digital dedicado ao estudo, pesquisa e ensino sobre câncer oral.
              Explore lâminas histológicas, casos clínicos e materiais acadêmicos
              organizados para apoiar a formação e a prática baseada em evidências.
            </p>
            <div className="hero-actions">
              <Link to="/laminas" className="primary-button"><Microscope size={19} /> Explorar o acervo</Link>
              <Link to="/sobre" className="secondary-button"><BookOpen size={19} /> Conhecer o NUCAO</Link>
            </div>
          </div>
          <div className="hero-note">
            <Info size={24} />
            <h3>O que significa NUCAO?</h3>
            <p>
              NUCAO é a sigla para Núcleo de Câncer Oral, dedicado à promoção do
              conhecimento, diagnóstico precoce e prevenção do câncer que acomete a cavidade oral.
            </p>
            <Link to="/sobre">Saiba mais <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="quick-grid container">
        {[
          [Microscope, "Lâminas Histológicas", "Explore nosso acervo de lâminas com imagens de alta qualidade e informações detalhadas.", "/laminas"],
          [BriefcaseMedical, "Casos Clínicos", "Casos clínicos reais para estudo e discussão, com diagnóstico e condutas.", "/casos"],
          [BookOpen, "Materiais Acadêmicos", "Apostilas, artigos, guias e outros materiais de apoio para alunos e profissionais.", "/materiais"],
          [Users, "Sobre o NUCAO", "Conheça nossa missão, equipe, linhas de atuação e objetivos.", "/sobre"]
        ].map(([Icon, title, text, path]) => (
          <Link to={path} className="quick-card" key={title}>
            <span className="icon-bubble"><Icon size={32} /></span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="text-link">Acessar <ArrowRight size={16} /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="about-preview container">
        <div className="about-text">
          <SectionTitle title="Sobre o NUCAO" />
          <p>
            O NUCAO (Núcleo de Câncer Oral) é um grupo acadêmico-científico vinculado
            à Universidade Estadual de Feira de Santana (UEFS), com foco no estudo,
            pesquisa e extensão na área do câncer oral.
          </p>
          <p>
            Nosso objetivo é promover o conhecimento científico, incentivar o diagnóstico
            precoce e contribuir para a prevenção e o tratamento do câncer que acomete a cavidade oral.
          </p>
          <div className="pill-grid">
            <span><GraduationCap /> Ensino<small>Formação acadêmica de qualidade</small></span>
            <span><FlaskConical /> Pesquisa<small>Produção científica e inovação</small></span>
            <span><Users /> Extensão<small>Impacto na comunidade e na saúde pública</small></span>
            <span><ShieldCheck /> Prevenção<small>Diagnóstico precoce e conscientização</small></span>
          </div>
        </div>
        <div className="stats-card">
          <h2>Nosso Acervo em Números</h2>
          <div className="stats-grid">
            {stats.map(([Icon, number, label]) => (
              <div className="stat" key={label}>
                <Icon />
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="quote">“Conhecimento compartilhado salva vidas.”<small>NUCAO — Núcleo de Câncer Oral</small></div>
        </div>
      </section>
    </>
  );
}

function LaminaCard({ lamina }) {
  return (
    <Link to={`/laminas/${lamina.id}`} className="lamina-card">
      <div className="lamina-thumb">
        <img src={lamina.image} alt={`Lâmina de ${lamina.name}`} />
        <span>{lamina.magnification}</span>
      </div>
      <div className="lamina-card-body">
        <div className="tag-row">{lamina.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div>
        <h3>{lamina.name}</h3>
        <p>{lamina.pathology}</p>
        <span className="text-link">Ver lâmina <ArrowRight size={16} /></span>
      </div>
    </Link>
  );
}

function Laminas() {
  const { items, loading, error } = useLaminas();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const categories = ["Todas", ...new Set(items.flatMap(l => l.tags))];
  const filtered = useMemo(() => items.filter(l => {
    const q = search.toLowerCase();
    const matchesSearch = !q || [l.name, l.pathology, l.tissue, ...l.tags].join(" ").toLowerCase().includes(q);
    const matchesCategory = category === "Todas" || l.tags.includes(category);
    return matchesSearch && matchesCategory;
  }), [items, search, category]);

  return (
    <div className="page container">
      <SectionTitle
        eyebrow="ACERVO DIGITAL"
        title="Lâminas Histológicas"
        text="Explore as lâminas do acervo e consulte a descrição histológica, a patologia relacionada e os principais achados."
      />
      <div className="catalog-toolbar">
        <div className="search-box">
          <Search size={19} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar lâmina, patologia ou tecido..." />
        </div>
        <div className="filters">
          {categories.map(c => <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>{c}</button>)}
        </div>
      </div>
      {loading && <div className="loading-state">Carregando acervo…</div>}
      {error && <div className="error-banner">{error}</div>}
      {!loading && <><div className="results-info">{filtered.length} {filtered.length === 1 ? "lâmina encontrada" : "lâminas encontradas"}</div>
      <div className="lamina-grid">
        {filtered.map(l => <LaminaCard key={l.id} lamina={l} />)}
      </div></>}
      {!filtered.length && <div className="empty"><Search size={38} /><h3>Nenhuma lâmina encontrada</h3><p>Tente outro termo de busca ou remova os filtros.</p></div>}
    </div>
  );
}

function SlideViewer({ image, alt }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 6;
  const STEP = 0.25;

  const changeZoom = (amount) => {
    setZoom((current) => {
      const next = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, +(current + amount).toFixed(2))
      );

      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }

      return next;
    });
  };

  const reset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const onWheel = (e) => {
    e.preventDefault();
    changeZoom(e.deltaY < 0 ? 0.15 : -0.15);
  };

  const onPointerDown = (e) => {
    if (zoom <= 1) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);

    setStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onPointerMove = (e) => {
    if (!dragging) return;

    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  const onDoubleClick = () => {
    if (zoom < 2) {
      setZoom(2);
    } else {
      reset();
    }
  };

  const handleKeyboard = (e) => {
    if (e.key === "+" || e.key === "=") {
      changeZoom(STEP);
    }

    if (e.key === "-") {
      changeZoom(-STEP);
    }

    if (e.key === "0") {
      reset();
    }
  };

  return (
    <div
      className={fullscreen ? "viewer fullscreen" : "viewer"}
      onKeyDown={handleKeyboard}
    >
      <div className="viewer-top">
        <div>
          <strong>Visualizador de lâmina</strong>
          <span className="viewer-zoom-label">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFullscreen(!fullscreen)}
          title={fullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"}
          aria-label={fullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"}
        >
          <Maximize2 size={19} />
        </button>
      </div>

      <div
        className={`viewer-stage ${
          dragging ? "dragging" : ""
        } ${zoom > 1 ? "can-drag" : ""}`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        tabIndex={0}
        aria-label="Visualizador interativo da lâmina histológica"
      >
        <img
          src={image}
          alt={alt}
          draggable="false"
          className="viewer-image"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
          }}
        />
      </div>

      <div className="viewer-controls">
        <button
          type="button"
          onClick={() => changeZoom(-STEP)}
          disabled={zoom <= MIN_ZOOM}
          title="Diminuir zoom"
          aria-label="Diminuir zoom"
        >
          <ZoomOut size={20} />
        </button>

        <button
          type="button"
          className="zoom-value"
          onClick={reset}
          title="Clique para voltar a 100%"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={() => changeZoom(STEP)}
          disabled={zoom >= MAX_ZOOM}
          title="Aumentar zoom"
          aria-label="Aumentar zoom"
        >
          <ZoomIn size={20} />
        </button>

        <div className="viewer-control-separator" />

        <button
          type="button"
          onClick={reset}
          title="Centralizar e redefinir zoom"
          aria-label="Redefinir visualização"
        >
          <RotateCcw size={19} />
        </button>

        <div className="viewer-help">
          <span>🖱️ Role para ampliar</span>
          <span>✋ Arraste quando ampliada</span>
          <span>＋ / − para zoom</span>
          <span>0 para redefinir</span>
        </div>
      </div>
    </div>
  );
}

function LaminaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: laminas, loading } = useLaminas();
  const lamina = laminas.find(l => l.id === id);
  if (loading) return <div className="page container"><div className="loading-state">Carregando lâmina…</div></div>;
  if (!lamina) return <div className="page container"><div className="empty"><h2>Lâmina não encontrada</h2><button className="primary-button" onClick={() => navigate("/laminas")}>Voltar ao acervo</button></div></div>;

  return (
    <div className="page container">
      <button className="back-link" onClick={() => navigate("/laminas")}>← Voltar para o acervo</button>
      <div className="detail-head">
        <div>
          <div className="tag-row">{lamina.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <h1>{lamina.name}</h1>
          <p>{lamina.pathology}</p>
        </div>
        <div className="meta-box"><span>Coloração</span><strong>{lamina.stain}</strong><span>Ampliação registrada</span><strong>{lamina.magnification}</strong></div>
      </div>
      <div className="detail-layout">
        <SlideViewer image={lamina.image} alt={`Lâmina histológica: ${lamina.name}`} />
        <aside className="detail-info">
          <section><h2>Sobre a lâmina</h2><p>{lamina.description}</p></section>
          <section><h2>Sobre a patologia</h2><p>{lamina.pathologyDescription}</p></section>
          <section><h2>Principais achados</h2><ul>{lamina.keyFindings.map(item => <li key={item}><span>✓</span>{item}</li>)}</ul></section>
          <div className="study-note"><Info size={20} /><div><strong>Estudo ativo</strong><p>Use o zoom para observar detalhes e compare os achados microscópicos com a descrição.</p></div></div>
        </aside>
      </div>
    </div>
  );
}

function PlaceholderPage({ icon: Icon, eyebrow, title, text, cards }) {
  return (
    <div className="page container">
      <SectionTitle eyebrow={eyebrow} title={title} text={text} />
      <div className="feature-grid">
        {cards.map((card, i) => (
          <article className="feature-card" key={i}>
            <span className="icon-bubble"><Icon size={28} /></span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <span className="status">Em desenvolvimento</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function Sobre() {
  return <PlaceholderPage icon={Users} eyebrow="O NÚCLEO" title="Sobre o NUCAO" text="Espaço para apresentar a história, missão, equipe, linhas de atuação, projetos e objetivos do Núcleo de Câncer Oral." cards={[
    { title: "Ensino", text: "Formação acadêmica e produção de materiais para apoiar estudantes e profissionais." },
    { title: "Pesquisa", text: "Produção científica e incentivo à investigação em câncer oral." },
    { title: "Extensão", text: "Ações de impacto na comunidade e promoção da saúde." },
    { title: "Prevenção", text: "Educação em saúde, conscientização e diagnóstico precoce." }
  ]} />;
}

function Casos() {
  return <PlaceholderPage icon={BriefcaseMedical} eyebrow="ESTUDO DE CASOS" title="Casos Clínicos" text="Área preparada para cadastrar casos clínicos, imagens, anamnese, diagnóstico diferencial, diagnóstico final e conduta." cards={[
    { title: "Casos para discussão", text: "Apresente a história clínica e permita que o estudante analise o caso antes de revelar o diagnóstico." },
    { title: "Diagnóstico", text: "Organize hipótese diagnóstica, exames complementares e diagnóstico definitivo." },
    { title: "Conduta", text: "Registre a conduta adotada e os principais pontos de aprendizagem." }
  ]} />;
}

function Materiais() {
  return <PlaceholderPage icon={BookOpen} eyebrow="BIBLIOTECA" title="Materiais Acadêmicos" text="Área para reunir artigos, apostilas, guias, protocolos, referências e outros materiais de apoio." cards={[
    { title: "Artigos científicos", text: "Organize referências por tema, ano e área de interesse." },
    { title: "Guias e protocolos", text: "Disponibilize documentos essenciais para estudo e prática." },
    { title: "Apostilas", text: "Crie uma biblioteca de materiais próprios do NUCAO." }
  ]} />;
}

function Contato() {
  return (
    <div className="page container">
      <SectionTitle eyebrow="FALE CONOSCO" title="Contato" text="Espaço para informações institucionais e canais oficiais de contato." />
      <div className="contact-card">
        <Mail size={34} />
        <div><h2>NUCAO — Núcleo de Câncer Oral</h2><p>Universidade Estadual de Feira de Santana (UEFS)</p><p>Inclua aqui e-mail institucional, redes sociais, localização e outros canais oficiais.</p></div>
      </div>
    </div>
  );
}

const emptyForm = {
  name: "",
  pathology: "",
  tissue: "",
  stain: "",
  magnification: "",
  description: "",
  pathologyDescription: "",
  keyFindings: [""],
  tagsText: ""
};

function Admin() {
  const { items: laminas, setItems, reload } = useLaminas();
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) { setChecking(false); return undefined; }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const user = data.session?.user || null;
      setSession(data.session || null);
      if (user) setIsAdmin(await fetchIsAdmin(user.id));
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession?.user) setIsAdmin(await fetchIsAdmin(nextSession.user.id));
      else setIsAdmin(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const login = async (e) => {
    e.preventDefault(); setError(""); setMessage("");
    if (!supabase) { setError("O banco ainda não está conectado. Configure o Supabase e as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."); return; }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : authError.message);
  };

  const logout = async () => { await supabase?.auth.signOut(); setSession(null); setIsAdmin(false); };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setFile(null); setMessage(""); setError(""); };
  const openEdit = (lamina) => {
    setEditingId(lamina.id);
    setForm({ ...emptyForm, ...lamina, tagsText: lamina.tags.join(", "), keyFindings: lamina.keyFindings.length ? lamina.keyFindings : [""] });
    setFile(null); setMessage(""); setError("");
  };
  const updateField = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const updateFinding = (index, value) => setForm(current => ({ ...current, keyFindings: current.keyFindings.map((item, i) => i === index ? value : item) }));
  const addFinding = () => setForm(current => ({ ...current, keyFindings: [...current.keyFindings, ""] }));
  const removeFinding = (index) => setForm(current => ({ ...current, keyFindings: current.keyFindings.filter((_, i) => i !== index) }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError(""); setMessage("");
    const payload = { ...form, keyFindings: form.keyFindings.map(x => x.trim()).filter(Boolean), tags: form.tagsText.split(",").map(x => x.trim()).filter(Boolean) };
    if (!payload.name || !payload.pathology) { setError("Preencha pelo menos o nome da lâmina e a patologia."); setSaving(false); return; }
    try {
      const saved = editingId ? await updateLamina(editingId, payload, file) : await createLamina(payload, file);
      setItems(current => editingId ? current.map(x => x.id === saved.id ? saved : x) : [saved, ...current]);
      setMessage(editingId ? "Lâmina atualizada com sucesso." : "Lâmina cadastrada com sucesso.");
      setEditingId(saved.id); setFile(null);
    } catch (err) { console.error(err); setError(err.message || "Não foi possível salvar a lâmina."); }
    finally { setSaving(false); }
  };

  const remove = async (lamina) => {
    if (!window.confirm(`Excluir “${lamina.name}”? Esta ação não pode ser desfeita.`)) return;
    try { await removeLamina(lamina.id); setItems(current => current.filter(x => x.id !== lamina.id)); setMessage("Lâmina excluída."); }
    catch (err) { setError(err.message || "Não foi possível excluir a lâmina."); }
  };

  if (checking) return <div className="admin-wrap"><div className="loading-state">Verificando acesso…</div></div>;
  if (!isSupabaseConfigured) return <div className="admin-wrap"><div className="admin-card setup-card"><div className="admin-icon"><LockKeyhole size={28} /></div><h1>Área Administrativa</h1><p>O painel já está pronto para produção, mas ainda precisa ser conectado ao Supabase.</p><div className="setup-steps"><strong>Para ativar:</strong><ol><li>Crie um projeto no Supabase.</li><li>Execute o arquivo <code>supabase/schema.sql</code>.</li><li>Crie o usuário administrador.</li><li>Copie a URL e a chave anônima para o arquivo <code>.env</code>.</li></ol></div><small>Depois disso, o login, banco de dados, upload de imagens e edição serão reais.</small></div></div>;
  if (!session || !isAdmin) return (
    <div className="admin-wrap"><form className="admin-card" onSubmit={login}><div className="admin-icon"><LockKeyhole size={28} /></div><h1>Área Administrativa</h1><p>Acesso restrito aos administradores do NUCAO.</p><label>E-mail</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@exemplo.com" autoComplete="username" required /><label>Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" autoComplete="current-password" required />{error && <div className="error">{error}</div>}<button className="primary-button" type="submit">Entrar</button><small>O acesso é protegido pelo Supabase Auth e pelas políticas do banco.</small></form></div>
  );

  return (
    <div className="page container admin-page">
      <div className="admin-heading"><div><SectionTitle eyebrow="ADMINISTRAÇÃO" title="Gerenciar acervo" text="Cadastre, edite e exclua lâminas sem precisar alterar o código do site." /></div><button className="secondary-button" onClick={logout}>Sair</button></div>
      <div className="admin-dashboard"><div className="dashboard-card"><Microscope /><strong>{laminas.length}</strong><span>Lâminas cadastradas</span></div><div className="dashboard-card"><Plus /><strong>{laminas.filter(x => x.image && !x.image.includes("placeholder")).length}</strong><span>Com imagem</span></div><div className="dashboard-card"><FileText /><strong>{new Set(laminas.flatMap(x => x.tags)).size}</strong><span>Tags no acervo</span></div></div>
      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="panel-head"><div><h2>{editingId ? "Editar lâmina" : "Nova lâmina"}</h2><p>Preencha os dados e, se desejar, envie uma imagem.</p></div>{editingId && <button className="text-button" onClick={openNew}>+ Nova</button>}</div>
          {message && <div className="success-banner">{message}</div>}{error && <div className="error-banner">{error}</div>}
          <form className="lamina-form" onSubmit={save}>
            <div className="form-grid two"><label>Nome da lâmina<input value={form.name} onChange={e => updateField("name", e.target.value)} required /></label><label>Patologia / alteração<input value={form.pathology} onChange={e => updateField("pathology", e.target.value)} required /></label></div>
            <div className="form-grid three"><label>Tecido<input value={form.tissue} onChange={e => updateField("tissue", e.target.value)} /></label><label>Coloração<input value={form.stain} onChange={e => updateField("stain", e.target.value)} /></label><label>Aumento<input value={form.magnification} onChange={e => updateField("magnification", e.target.value)} placeholder="Ex.: 40×" /></label></div>
            <label>Descrição da lâmina<textarea rows="4" value={form.description} onChange={e => updateField("description", e.target.value)} /></label>
            <label>Descrição da patologia<textarea rows="5" value={form.pathologyDescription} onChange={e => updateField("pathologyDescription", e.target.value)} /></label>
            <div><div className="field-title">Principais achados</div>{form.keyFindings.map((finding, index) => <div className="finding-row" key={index}><input value={finding} onChange={e => updateFinding(index, e.target.value)} placeholder={`Achado ${index + 1}`} />{form.keyFindings.length > 1 && <button type="button" className="icon-button" onClick={() => removeFinding(index)}><Minus size={16} /></button>}</div>)}<button type="button" className="text-button" onClick={addFinding}>+ Adicionar achado</button></div>
            <label>Tags <span className="label-help">separe por vírgulas</span><input value={form.tagsText} onChange={e => updateField("tagsText", e.target.value)} placeholder="Pigmentação, Amálgama, Mucosa oral" /></label>
            <label className="upload-box">Imagem da lâmina<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} />{file ? <span>✓ {file.name}</span> : <small>PNG, JPG ou WEBP. A imagem será armazenada no Supabase Storage.</small>}</label>
            <div className="form-actions"><button type="submit" className="primary-button" disabled={saving}>{saving ? "Salvando…" : editingId ? "Salvar alterações" : "Cadastrar lâmina"}</button>{editingId && <button type="button" className="secondary-button" onClick={openNew}>Cancelar edição</button>}</div>
          </form>
        </section>
        <section className="admin-panel"><div className="panel-head"><div><h2>Lâminas cadastradas</h2><p>{laminas.length} registros</p></div><button className="text-button" onClick={reload}>Atualizar</button></div><div className="admin-list">{laminas.map(l => <article className="admin-list-item" key={l.id}><div className="admin-list-thumb"><img src={l.image} alt="" /></div><div className="admin-list-info"><strong>{l.name}</strong><span>{l.pathology}</span><small>{l.tissue} • {l.magnification || "Sem aumento"}</small></div><div className="admin-list-actions"><button onClick={() => openEdit(l)}>Editar</button><button className="danger" onClick={() => remove(l)}>Excluir</button></div></article>)}</div></section>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LaminasProvider>
      <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/laminas" element={<Laminas />} />
        <Route path="/laminas/:id" element={<LaminaDetail />} />
        <Route path="/casos" element={<Casos />} />
        <Route path="/materiais" element={<Materiais />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      </AppLayout>
    </LaminasProvider>
  );
}
