import { useState, useCallback, useEffect } from "react";

// ══════════════════════════════════════════════════
// IDENTIDADE VISUAL — VirtualPlan
// ══════════════════════════════════════════════════
const VP={azul:"#004AF7",ciano:"#00D0FF",dark:"#1C1B29",cinza:"#CACACA",fundo:"#F2F7FF",
  grad:"linear-gradient(-48deg,#004AF7 0%,#00D0FF 100%)",gradR:"linear-gradient(-48deg,#00D0FF 0%,#004AF7 100%)"};

function LogoVP({size=32,showText=true,dark=false}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:showText?10:0}}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <defs><linearGradient id="vpg" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={VP.azul}/><stop offset="100%" stopColor={VP.ciano}/>
        </linearGradient></defs>
        <circle cx="20" cy="20" r="15" stroke="url(#vpg)" strokeWidth="2.5" fill="none"/>
        <path d="M20 5 C14 10 14 30 20 35" stroke="url(#vpg)" strokeWidth="1.8" fill="none"/>
        <path d="M20 5 C26 10 26 30 20 35" stroke="url(#vpg)" strokeWidth="1.8" fill="none"/>
        <path d="M5.5 15 Q20 12 34.5 15" stroke="url(#vpg)" strokeWidth="1.8" fill="none"/>
        <path d="M5.5 25 Q20 28 34.5 25" stroke="url(#vpg)" strokeWidth="1.8" fill="none"/>
        <circle cx="31" cy="10" r="7" fill={VP.dark}/>
        <path d="M28 10 L34 10 M31 7 L34 10 L31 13" stroke={VP.ciano} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      {showText&&<div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:800,fontSize:size*.45,color:dark?"#fff":VP.dark,letterSpacing:"-.5px",lineHeight:1}}>
          <span style={{color:VP.azul}}>V</span>irtual<span style={{color:VP.ciano}}>Plan</span>
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:size*.22,color:dark?VP.ciano:VP.azul,letterSpacing:"1.5px",fontWeight:500,lineHeight:1,marginTop:1}}>IMPORTAÇÃO</div>
      </div>}
    </div>
  );
}

// ══════════════════════════════════════════════════
// BANCO DE DADOS — Supabase + localStorage fallback
// ══════════════════════════════════════════════════
const SUPA_URL="https://eijimmuammkdjvwbkuxl.supabase.co";
const SUPA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpamltbXVhbW1rZGp2d2JrdXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjMwOTMsImV4cCI6MjA5NjIzOTA5M30.YweVQ-fekvdITxe1P8NU_hLBoIUErAf_31S--nmN810";
const hdr=()=>({"Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`});
const LK=k=>`vpfinal_${k}`;
const LG=k=>{try{return JSON.parse(localStorage.getItem(LK(k))||"[]");}catch{return[];}};
const LS=(k,v)=>{try{localStorage.setItem(LK(k),JSON.stringify(v));}catch{}};
const UID=()=>crypto.randomUUID?crypto.randomUUID():"id_"+Date.now()+"_"+Math.random().toString(36).slice(2);

const TRANSP_SEED=[
  {id:"tr01",nome:"Maersk",pais:"Dinamarca",modal:"Marítimo",site:"www.maersk.com",telefone:"+45 33 63 33 63",email:"customer@maersk.com",codigo_scac:"MAEU",observacoes:"Maior armadora do mundo"},
  {id:"tr02",nome:"MSC Mediterranean Shipping",pais:"Suíça",modal:"Marítimo",site:"www.msc.com",codigo_scac:"MSCU",observacoes:"2ª maior armadora mundial"},
  {id:"tr03",nome:"CMA CGM",pais:"França",modal:"Marítimo",site:"www.cma-cgm.com",codigo_scac:"CMDU",observacoes:"3ª maior armadora mundial"},
  {id:"tr04",nome:"Evergreen Line",pais:"Taiwan",modal:"Marítimo",site:"www.evergreen-line.com",codigo_scac:"EGLV",observacoes:"Principal armadora taiwanesa"},
  {id:"tr05",nome:"COSCO Shipping",pais:"China",modal:"Marítimo",site:"www.cosco.com",codigo_scac:"COSU",observacoes:"Maior armadora chinesa"},
  {id:"tr06",nome:"Hapag-Lloyd",pais:"Alemanha",modal:"Marítimo",site:"www.hapag-lloyd.com",codigo_scac:"HLCU",observacoes:"Principal armadora alemã"},
  {id:"tr07",nome:"Yang Ming",pais:"Taiwan",modal:"Marítimo",site:"www.yangming.com",codigo_scac:"YMLU"},
  {id:"tr08",nome:"ONE Ocean Network Express",pais:"Japão",modal:"Marítimo",site:"www.one-line.com",codigo_scac:"ONEY"},
  {id:"tr09",nome:"DHL Express",pais:"Alemanha",modal:"Aéreo/Expresso",site:"www.dhl.com",observacoes:"Líder mundial em expresso"},
  {id:"tr10",nome:"FedEx International",pais:"EUA",modal:"Aéreo/Expresso",site:"www.fedex.com",observacoes:"Líder expresso americano"},
  {id:"tr11",nome:"UPS Supply Chain",pais:"EUA",modal:"Aéreo/Expresso",site:"www.ups.com"},
  {id:"tr12",nome:"Kuehne+Nagel",pais:"Suíça",modal:"Aéreo/Marítimo",site:"www.kuehne-nagel.com",observacoes:"Maior freight forwarder do mundo"},
  {id:"tr13",nome:"DB Schenker",pais:"Alemanha",modal:"Multimodal",site:"www.dbschenker.com"},
  {id:"tr14",nome:"DSV Panalpina",pais:"Dinamarca",modal:"Aéreo/Marítimo",site:"www.dsv.com"},
  {id:"tr15",nome:"LATAM Cargo",pais:"Chile",modal:"Aéreo",site:"www.latamcargo.com",observacoes:"Principal aérea da América Latina"},
];

function seedLocal(){
  if(localStorage.getItem("vpfinal_seeded"))return;
  const eId=UID();
  LS("empresas",[{id:eId,nome:"VirtualPlan Importadora",cnpj:"",plano:"enterprise",valor_mensal:600,ativo:true,criado_em:new Date().toISOString()}]);
  LS("usuarios",[
    {id:UID(),empresa_id:null,nome:"Admin Sistema",email:"superadmin@virtualplan.com.br",senha:"super@2026",perfil:"superadmin",ativo:true,criado_em:new Date().toISOString()},
    {id:UID(),empresa_id:eId,nome:"Admin VirtualPlan",email:"admin@virtualplan.com.br",senha:"admin123",perfil:"admin",ativo:true,criado_em:new Date().toISOString()}
  ]);
  LS("transportadoras",TRANSP_SEED.map(t=>({...t,criado_em:new Date().toISOString()})));
  ["clientes","fornecedores","corretoras_cambio","despachantes","agenda","agenda_updates",
   "simulacoes","simulacao_produtos","documentos_importacao",
   "produtos_importados","simulacao_preco_venda","simulacao_preco_itens","analise_viabilidade"
  ].forEach(t=>LS(t,[]));
  localStorage.setItem("vpfinal_seeded","1");
}
seedLocal();

const lsdb={
  get:(t,f={})=>Promise.resolve(LG(t).filter(r=>Object.entries(f).every(([k,v])=>r[k]===v)).sort((a,b)=>new Date(b.criado_em||0)-new Date(a.criado_em||0))),
  getAll:(t)=>Promise.resolve([...LG(t)].sort((a,b)=>new Date(b.criado_em||0)-new Date(a.criado_em||0))),
  insert:(t,d)=>{const r={...d,id:UID(),criado_em:new Date().toISOString(),atualizado_em:new Date().toISOString()};LS(t,[...LG(t),r]);return Promise.resolve(r);},
  update:(t,id,d)=>{const rows=LG(t).map(r=>r.id===id?{...r,...d,atualizado_em:new Date().toISOString()}:r);LS(t,rows);return Promise.resolve(rows.find(r=>r.id===id)||null);},
  delete:(t,id)=>{LS(t,LG(t).filter(r=>r.id!==id));return Promise.resolve(true);},
  getOne:(t,f={})=>lsdb.get(t,f).then(r=>r[0]||null),
};
let _loc=false;
const db={
  async get(t,f={}){if(_loc)return lsdb.get(t,f);try{let u=`${SUPA_URL}/rest/v1/${t}?select=*&order=criado_em.desc`;Object.entries(f).forEach(([k,v])=>{u+=`&${k}=eq.${encodeURIComponent(v)}`;});const r=await fetch(u,{headers:hdr(),signal:AbortSignal.timeout(4000)});if(!r.ok)throw 0;return r.json();}catch{_loc=true;return lsdb.get(t,f);}},
  async getAll(t){if(_loc)return lsdb.getAll(t);try{const r=await fetch(`${SUPA_URL}/rest/v1/${t}?select=*&order=criado_em.desc`,{headers:hdr(),signal:AbortSignal.timeout(4000)});if(!r.ok)throw 0;return r.json();}catch{_loc=true;return lsdb.getAll(t);}},
  async insert(t,d){if(_loc)return lsdb.insert(t,d);try{const r=await fetch(`${SUPA_URL}/rest/v1/${t}`,{method:"POST",headers:{...hdr(),"Prefer":"return=representation"},body:JSON.stringify(d),signal:AbortSignal.timeout(4000)});if(!r.ok)throw 0;const res=await r.json();return Array.isArray(res)?res[0]:res;}catch{_loc=true;return lsdb.insert(t,d);}},
  async update(t,id,d){if(_loc)return lsdb.update(t,id,d);try{const r=await fetch(`${SUPA_URL}/rest/v1/${t}?id=eq.${id}`,{method:"PATCH",headers:{...hdr(),"Prefer":"return=representation"},body:JSON.stringify(d),signal:AbortSignal.timeout(4000)});if(!r.ok)throw 0;const res=await r.json();return Array.isArray(res)?res[0]:res;}catch{_loc=true;return lsdb.update(t,id,d);}},
  async delete(t,id){if(_loc)return lsdb.delete(t,id);try{await fetch(`${SUPA_URL}/rest/v1/${t}?id=eq.${id}`,{method:"DELETE",headers:hdr(),signal:AbortSignal.timeout(4000)});return true;}catch{_loc=true;return lsdb.delete(t,id);}},
  async getOne(t,f={}){if(_loc)return lsdb.getOne(t,f);try{let u=`${SUPA_URL}/rest/v1/${t}?select=*&limit=1`;Object.entries(f).forEach(([k,v])=>{u+=`&${k}=eq.${encodeURIComponent(v)}`;});const r=await fetch(u,{headers:hdr(),signal:AbortSignal.timeout(4000)});if(!r.ok)throw 0;const res=await r.json();return Array.isArray(res)?(res[0]||null):res;}catch{_loc=true;return lsdb.getOne(t,f);}},
};
const sess={
  get:()=>{try{return JSON.parse(sessionStorage.getItem("vp_sess_f")||"null");}catch{return null;}},
  set:v=>{try{sessionStorage.setItem("vp_sess_f",JSON.stringify(v));}catch{}},
  clear:()=>{try{sessionStorage.removeItem("vp_sess_f");}catch{}}
};

// ══════════════════════════════════════════════════
// CONSTANTES
// ══════════════════════════════════════════════════
const REGIMES=["Simples Nacional","Lucro Presumido","Lucro Real"];
const MODALIDADES=["Formal","Simplificada"];
const ESTADOS_ICMS={AC:17,AL:17,AM:20,AP:18,BA:20,CE:20,DF:20,ES:17,GO:17,MA:20,MG:18,MS:17,MT:17,PA:17,PB:20,PE:20.5,PI:17,PR:19,RJ:22,RN:20,RO:17.5,RR:17,RS:17,SC:17,SE:20,SP:18,TO:20};
const STATUS_AGENDA=[
  "Em Produção","Aguardando Embarque","Em Trânsito",
  "Chegada ao Porto","Descarga Concluída","Em Armazenagem",
  "DUIMP Registrada","Parametrização","Fiscalização",
  "Desembaraçada","Aguardando Retirada","Em Transporte Nacional",
  "Entregue","Cancelado"
];
const STATUS_COR={
  "Em Produção":"#8B5CF6",
  "Aguardando Embarque":"#F59E0B",
  "Em Trânsito":"#3B82F6",
  "Chegada ao Porto":"#0EA5E9",
  "Descarga Concluída":"#06B6D4",
  "Em Armazenagem":"#F97316",
  "DUIMP Registrada":"#A855F7",
  "Parametrização":"#EC4899",
  "Fiscalização":"#EF4444",
  "Desembaraçada":"#10B981",
  "Aguardando Retirada":"#14B8A6",
  "Em Transporte Nacional":"#6366F1",
  "Entregue":"#22C55E",
  "Cancelado":"#94A3B8"
};
const STATUS_ICONE={
  "Em Produção":"🏭","Aguardando Embarque":"📦","Em Trânsito":"🚢",
  "Chegada ao Porto":"⚓","Descarga Concluída":"🏗️","Em Armazenagem":"🏬",
  "DUIMP Registrada":"📋","Parametrização":"🔍","Fiscalização":"🔎",
  "Desembaraçada":"✅","Aguardando Retirada":"🚛","Em Transporte Nacional":"🛣️",
  "Entregue":"🎯","Cancelado":"❌"
};
// Próximo status na sequência
const PROXIMO_STATUS={
  "Em Produção":"Aguardando Embarque",
  "Aguardando Embarque":"Em Trânsito",
  "Em Trânsito":"Chegada ao Porto",
  "Chegada ao Porto":"Descarga Concluída",
  "Descarga Concluída":"Em Armazenagem",
  "Em Armazenagem":"DUIMP Registrada",
  "DUIMP Registrada":"Parametrização",
  "Parametrização":"Fiscalização",
  "Fiscalização":"Desembaraçada",
  "Desembaraçada":"Aguardando Retirada",
  "Aguardando Retirada":"Em Transporte Nacional",
  "Em Transporte Nacional":"Entregue",
  "Entregue":null,"Cancelado":null
};
const PLANOS={pro:{nome:"Pro",valor:199.90},enterprise:{nome:"Enterprise",valor:600}};
const MODAIS_TRANSP=["Todos","Marítimo","Aéreo","Aéreo/Expresso","Aéreo/Marítimo","Multimodal","Rodoviário"];
const MODAL_COR={"Marítimo":VP.azul,"Aéreo/Expresso":"#F59E0B","Aéreo":"#8B5CF6","Multimodal":"#10B981","Aéreo/Marítimo":VP.ciano,"Rodoviário":"#EF4444"};
const GRUPOS_DOC={
  "Comerciais":["Pedido de Compra","Contrato Comercial","Proforma Invoice","Invoice","Packing List"],
  "Logísticos":["Conhecimento de Embarque (BL/AWB)","Certificado de Origem","Licenças e LPCOs","Romaneio de Embarque"],
  "Aduaneiros":["DUIMP / DI","Comprovantes de Tributos","Comprovante de Nacionalização","Laudo de Conferência"],
  "Fiscais":["Nota Fiscal de Entrada","Relatório de Custos da Operação","Relatório de Recebimento da Mercadoria"],
  "Regulatórios":["Registros Anvisa","Certificados (Conformidade/Inmetro/BPF)","Manuais Técnicos e IFUs","Declarações de Conformidade"],
  "Financeiros":["Contrato de Câmbio","Fechamento de Câmbio","Swift Bancário","Comprovante de Pagamento Internacional","Carta de Crédito (LC)","Cobrança Documentária"],
};

// Benefícios Fiscais por Estado — base pré-carregada
const BENEF_FISCAL={
  ES:{nm:"Espírito Santo",icms:17,prog:"Fundap/Invest-ES",desc:0.40,porto:"Porto de Vitória",obs:"Crédito presumido até 60% do ICMS. Um dos mais atrativos do Brasil para importação."},
  SC:{nm:"Santa Catarina",icms:17,prog:"Tratamento Diferenciado SC",desc:0.30,porto:"Porto de Itajaí/Navegantes",obs:"Diferimento parcial do ICMS. Porto de Itajaí muito movimentado."},
  CE:{nm:"Ceará",icms:20,prog:"FDI / Porto do Pecém",desc:0.35,porto:"Porto do Pecém",obs:"Diferimento via FDI. Porto do Pecém em expansão como hub nordestino."},
  BA:{nm:"Bahia",icms:20,prog:"DESENVOLVE BA",desc:0.30,porto:"Porto de Salvador/Aratu",obs:"Crédito presumido até 75% do ICMS para importadores com operações no estado."},
  AM:{nm:"Amazonas",icms:20,prog:"Zona Franca de Manaus",desc:0.95,porto:"Porto de Manaus",obs:"Máximo benefício: isenção de II, IPI e ICMS para produtos fabricados na ZFM. Exige industrialização local."},
  PE:{nm:"Pernambuco",icms:20.5,prog:"PRODEPE",desc:0.30,porto:"Porto de Suape",obs:"Crédito presumido PRODEPE. Porto de Suape é hub estratégico do Nordeste."},
  GO:{nm:"Goiás",icms:17,prog:"PRODUZIR / Diferimento",desc:0.25,porto:"Porto Seco Anápolis",obs:"Diferimento do ICMS para insumos industriais. Forte via porto seco."},
  AP:{nm:"Amapá",icms:18,prog:"Zona Franca Especial Macapá",desc:0.25,porto:"Porto de Santana",obs:"Zona Franca Especial de Macapá com benefícios para importação."},
  AL:{nm:"Alagoas",icms:17,prog:"PRODESIN",desc:0.22,porto:"Porto de Maceió",obs:"Crédito presumido de ICMS para industrias com operações de importação."},
  MT:{nm:"Mato Grosso",icms:17,prog:"PRODEIC",desc:0.20,porto:"Porto Seco Cuiabá",obs:"Diferimento ICMS para importações industriais e agronegócio."},
  RS:{nm:"Rio Grande do Sul",icms:17,prog:"FUNDOPEM",desc:0.20,porto:"Porto de Rio Grande",obs:"Diferimento para industrialização. FUNDOPEM para investimentos industriais."},
  RJ:{nm:"Rio de Janeiro",icms:22,prog:"RIOLOG",desc:0.20,porto:"Porto do Rio de Janeiro",obs:"Crédito presumido RIOLOG para importadores estabelecidos no estado."},
  MA:{nm:"Maranhão",icms:20,prog:"FDI / Porto do Itaqui",desc:0.20,porto:"Porto do Itaqui",obs:"Porto do Itaqui referência no norte do Brasil. Diferimento ICMS industrial."},
  PA:{nm:"Pará",icms:17,prog:"PROIND",desc:0.20,porto:"Porto de Vila do Conde/Belém",obs:"Diferimento ICMS industrial, forte em mineração e agro."},
  SE:{nm:"Sergipe",icms:20,prog:"PSDI",desc:0.18,porto:"Porto de Sergipe",obs:"Diferimento ICMS para importações vinculadas à industrialização."},
  RN:{nm:"Rio Grande do Norte",icms:20,prog:"PROADI",desc:0.18,porto:"Porto de Natal",obs:"Diferimento e crédito presumido para indústrias importadoras."},
  MS:{nm:"Mato Grosso do Sul",icms:17,prog:"FUNDEMS",desc:0.18,porto:"Porto Seco Campo Grande",obs:"Diferimento ICMS com industrialização no estado."},
  PR:{nm:"Paraná",icms:19,prog:"Paraná Competitivo",desc:0.15,porto:"Porto de Paranaguá",obs:"Diferimento para bens de capital e matéria-prima. Porto Paranaguá relevante."},
  MG:{nm:"Minas Gerais",icms:18,prog:"ICMS Diferido / BDMG",desc:0.15,porto:"Porto Seco BH / Santos",obs:"Diferimento para bens de capital e insumos industriais."},
  TO:{nm:"Tocantins",icms:20,prog:"PROAT",desc:0.15,porto:"Porto Seco Palmas",obs:"Diferimento agro e industrial. Logística terrestre para o centro-norte."},
  PB:{nm:"Paraíba",icms:20,prog:"PROIND",desc:0.15,porto:"Porto de Cabedelo",obs:"Diferimento ICMS para importações com industrialização."},
  PI:{nm:"Piauí",icms:17,prog:"FDI Piauí",desc:0.15,porto:"Sem porto marítimo",obs:"Incentivos FDI para instalação industrial. Pouca infraestrutura portuária."},
  SP:{nm:"São Paulo",icms:18,prog:"Pró-SP / ICMS Diferido",desc:0.10,porto:"Porto de Santos",obs:"Menor benefício fiscal, mas maior infraestrutura logística. Porto de Santos é o maior do Brasil."},
  DF:{nm:"Distrito Federal",icms:20,prog:"PRÓ-DF II",desc:0.12,porto:"Porto Seco Brasília",obs:"Incentivos para empresas no DF. Menor atrativo que ES e SC."},
  RO:{nm:"Rondônia",icms:17.5,prog:"FDI Rondônia",desc:0.12,porto:"Porto fluvial",obs:"Menor estrutura logística para importação."},
  AC:{nm:"Acre",icms:17,prog:"Incentivos estaduais",desc:0.10,porto:"Sem porto marítimo",obs:"Logística desafiadora para importação."},
  RR:{nm:"Roraima",icms:17,prog:"Incentivos estaduais",desc:0.10,porto:"Sem porto marítimo",obs:"Pouco utilizado para desembaraço de importações."},
};

const fmtBRL=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v||0);
// Converte input do usuário (vírgula ou ponto) para número JS
const toNum=v=>parseFloat(String(v||"0").replace(/[^0-9,.-]/g,"").replace(",",".").replace(/^\./,"0."))||0;
// Formata número para exibição em pt-BR (ex: 0.84 → "0,84")
const fmtNum=(v,dec=2)=>v===0||v===""?"":Number(v).toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:dec});
const fmtUSD=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"USD"}).format(v||0);
const fmtDate=d=>d?new Date(d).toLocaleDateString("pt-BR"):"—";
const fmtDT=d=>d?new Date(d).toLocaleString("pt-BR"):"—";
const hoje=()=>new Date().toISOString().slice(0,10);

// ══════════════════════════════════════════════════
// IA HELPERS
// ══════════════════════════════════════════════════
async function callIA(system,user,maxTokens=900){
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,system,messages:[{role:"user",content:user}]})
    });
    const d=await r.json();
    if(d.error){throw new Error(d.error.message||JSON.stringify(d.error));}
    return(d.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
  }catch(e){console.error("IA erro:",e);return "Erro ao chamar IA: "+e.message;}
}
async function iaNCM(ncm,desc){
  const prompt="Produto:"+desc+" NCM:"+ncm+" Retorne JSON: {ncm_validado:'',ncm_original_correto:false,descricao_tec:'',ii:0,ipi:0,pis:2.1,cofins:9.65,justificativa:''}";
  const txt=await callIA("Especialista TEC/TIPI brasileira. Responda SOMENTE JSON valido.",prompt);
  try{return JSON.parse(txt);}catch{return null;}
}
async function iaSugerirEstado(ncm,desc,valorUSD,regime){
  const top=Object.entries(BENEF_FISCAL).sort((a,b)=>b[1].desc-a[1].desc).slice(0,8);
  return callIA(
    "Especialista em planejamento tributario de importacao no Brasil. Resposta direta e pratica.",
    `Produto: "${desc||"nao informado"}" | NCM: ${ncm||"nao informado"} | Valor: USD ${valorUSD||0} | Regime: ${regime}\n\nTop estados por beneficio fiscal disponivel:\n${top.map(([uf,e])=>`${uf} (${e.nm}): ${e.prog} — desconto ~${(e.desc*100).toFixed(0)}% ICMS — Porto: ${e.porto}`).join("\n")}\n\nRetorne:\n1. TOP 3 melhores estados para este produto com justificativa\n2. Estado #1 recomendado e economia estimada em R$ vs SP\n3. Requisitos praticos para usar o beneficio\n4. Alertas: guerra fiscal, necessidade de estabelecimento, riscos`
  ,1200);
}
async function iaDetalharBeneficio(uf,ncm,desc){
  const b=BENEF_FISCAL[uf];
  return callIA("Especialista em beneficios fiscais estaduais para importacao no Brasil.",
    `Estado: ${uf} (${b?.nm||uf}) | Programa: ${b?.prog||"—"}\nProduto: "${desc||"—"}" | NCM: ${ncm||"—"}\n\nDetalhe:\n1. Base legal do beneficio atual (lei, decreto, portaria)\n2. Percentual exato de reducao do ICMS\n3. Requisitos para usar (estabelecimento, volume, setor)\n4. NCMs elegiveis ou excluidos\n5. Comparacao: vale mais desembarcar aqui que em SP ou RJ?`
  ,1000);
}
async function iaViabilidade(dados){
  return callIA("Especialista em comercio exterior e analise de viabilidade de importacao. Resposta em portugues, direta e executiva.",
    `SIMULACAO DE IMPORTACAO:\n${JSON.stringify(dados.simulacao,null,1)}\n\nCONCORRENTES INFORMADOS:\n${dados.concorrentes.map((c,i)=>`${i+1}. Produto concorrente: "${c.pc}" | Meu produto: "${c.mp}" | Preco concorrente: ${fmtBRL(parseFloat(c.pp||0))} | Meu preco: ${fmtBRL(parseFloat(c.mpr||0))}`).join("\n")}\n\nRetorne:\n1. VEREDITO: Viavel / Atencao / Inviavel\n2. SCORE: 0-100\n3. ANALISE: competitividade, margem e riscos\n4. RECOMENDACOES: 3 a 5 acoes praticas`
  ,1500);
}

// ══════════════════════════════════════════════════
// PDF EXPORT
// ══════════════════════════════════════════════════
// PDF gerado por função nativa no HTML (fora do Babel)
// Ver <script> no HTML antes do Babel
function gerarPDF(cfg){
  if(window._vpPDF){window._vpPDF(cfg);}
  else{alert("Função de PDF não encontrada. Recarregue a página.");}
  return Promise.resolve();
}
const abrirWA=(tel,msg)=>window.open(`https://wa.me/55${tel.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`,"_blank");
// Expõe gerarPDF no window para contornar restrição do Babel sandbox
if(typeof window!=="undefined") window._vpGerarPDF=gerarPDF;

// ══════════════════════════════════════════════════
// ESTILOS GLOBAIS
// ══════════════════════════════════════════════════
const GS="@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}body{font-family:'DM Sans',sans-serif;background:#F2F7FF;} input,select,textarea,button{font-family:'DM Sans',sans-serif;}input::placeholder,textarea::placeholder{color:#94a3b8;} ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#F2F7FF;}::-webkit-scrollbar-thumb{background:#CACACA;border-radius:3px;} @keyframes spin{to{transform:rotate(360deg)}}@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.card{animation:fi .22s ease}";

// ── UI ATOMS ──
const iSty={width:"100%",padding:"9px 11px",borderRadius:8,border:"1px solid #D1D5DB",background:"#fff",color:"#1C1B29",fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color .15s"};
const bsSty={display:"inline-flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:7,border:"1px solid #D1D5DB",background:"#fff",color:"#475569",cursor:"pointer",fontSize:11,fontWeight:500};
function SC({t,children}){return<div style={{background:"#fff",borderRadius:12,padding:"15px 17px",boxShadow:"0 2px 10px rgba(0,74,247,.05)",border:"1px solid #E5E7EB",marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:VP.azul,letterSpacing:"1px",marginBottom:10,textTransform:"uppercase"}}>{t}</div>{children}</div>;}
function SL({c}){return<div style={{fontSize:10,color:"#6B7280",fontWeight:600,marginBottom:3}}>{c}</div>;}
function SI({v,s,ph,tp="text"}){return<input value={v} onChange={e=>s(e.target.value)} placeholder={ph} type={tp} style={iSty} onFocus={e=>e.target.style.borderColor=VP.azul} onBlur={e=>e.target.style.borderColor="#D1D5DB"}/>;}
// Input numérico com formatação pt-BR automática
function NI({v,s,ph,dec=4}){
  const[raw,setRaw]=React.useState(v!==undefined&&v!==""?String(v):"");
  React.useEffect(()=>{
    if(v===undefined||v==="")setRaw("");
  },[v]);
  function handleChange(e){
    let val=e.target.value;
    // Permite apenas números, vírgula, ponto e sinal negativo
    val=val.replace(/[^0-9,.-]/g,"");
    // Troca ponto por vírgula (normaliza separador decimal para pt-BR)
    val=val.replace(/\./g,",");
    // Permite apenas uma vírgula
    const parts=val.split(",");
    if(parts.length>2) val=parts[0]+","+parts.slice(1).join("");
    setRaw(val);
    // Passa o valor numérico (com ponto) para o pai
    const num=parseFloat(val.replace(",","."))||0;
    s(num);
  }
  function handleBlur(){
    if(raw===""||raw==="-")return;
    // Ao sair do campo: se digitou ,10 → mostra 0,10
    let val=raw;
    if(val.startsWith(",")) val="0"+val;
    if(val.endsWith(",")) val=val.slice(0,-1);
    const num=parseFloat(val.replace(",","."))||0;
    // Formata com até `dec` casas, remove zeros desnecessários
    const formatted=num.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:dec});
    setRaw(formatted);
    s(num);
  }
  return<input value={raw} onChange={handleChange} onBlur={handleBlur} placeholder={ph} style={iSty} onFocus={e=>{e.target.style.borderColor=VP.azul;}} />;
}
function SF({l,children}){return<div style={{marginBottom:9}}><SL c={l}/>{children}</div>;}
function LF({l,children}){return<div style={{marginBottom:12}}><SL c={l}/>{children}</div>;}
function LI({val,set,ph,tp="text"}){return<input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={tp} style={{...iSty,padding:"11px 13px",fontSize:13}} onFocus={e=>e.target.style.borderColor=VP.azul} onBlur={e=>e.target.style.borderColor="#D1D5DB"}/>;}
function BG({onClick,disabled,children}){return<button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"10px",borderRadius:9,border:"none",cursor:disabled?"not-allowed":"pointer",background:VP.grad,color:"#fff",fontSize:13,fontWeight:700,boxShadow:"0 4px 13px rgba(0,74,247,.22)",opacity:disabled?.6:1}}>{children}</button>;}
function BS({onClick,children}){return<button onClick={onClick} style={{...bsSty,padding:"7px 13px",fontSize:11}}>{children}</button>;}
function Err({children}){return<div style={{padding:"9px 12px",borderRadius:7,background:"#FEF2F2",border:"1px solid #FCA5A5",color:"#DC2626",fontSize:11,marginBottom:11}}>{children}</div>;}
function Vazio({txt}){return<div style={{padding:36,textAlign:"center",color:"#9CA3AF",fontSize:13}}>{txt}</div>;}
function Spin({size=34}){return<div style={{display:"flex",justifyContent:"center",padding:16}}><div style={{width:size,height:size,borderRadius:"50%",border:"3px solid #F2F7FF",borderTop:`3px solid ${VP.azul}`,animation:"spin 1s linear infinite"}}/></div>;}
function IB({l,v,d,s}){return<div style={{padding:"6px 8px",borderRadius:7,background:d?`${VP.azul}07`:"#F9FAFB",border:`1px solid ${d?`${VP.azul}20`:"#E5E7EB"}`}}><div style={{fontSize:8,color:d?VP.azul:"#9CA3AF",fontWeight:700,textTransform:"uppercase",marginBottom:1}}>{l}</div><div style={{fontSize:11,fontWeight:s?800:500,color:s?"#1C1B29":"#6B7280"}}>{v}</div></div>;}
function SBadge({s,grande}){return<span style={{padding:grande?"6px 13px":"3px 9px",borderRadius:20,fontSize:grande?12:9,fontWeight:700,background:`${STATUS_COR[s]||VP.cinza}18`,color:STATUS_COR[s]||VP.cinza,border:`1px solid ${STATUS_COR[s]||VP.cinza}35`,whiteSpace:"nowrap"}}>{s||"—"}</span>;}
function PH({titulo,sub,children}){return<div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}><div><h1 style={{margin:0,fontSize:19,fontWeight:800,color:"#1C1B29"}}>{titulo}</h1>{sub&&<p style={{margin:"3px 0 0",fontSize:10,color:"#9CA3AF"}}>{sub}</p>}</div>{children&&<div>{children}</div>}</div>;}

// ══════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════
export default function App(){
  const[sessao,setSessao]=useState(()=>sess.get());
  return(<><style>{GS}</style>{!sessao?<Login onLogin={s=>{sess.set(s);setSessao(s);}}/>:<Sistema sessao={sessao} onLogout={()=>{sess.clear();setSessao(null);}}/>}</>);
}

// ══════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════
function Login({onLogin}){
  const[tab,setTab]=useState("login");
  const[email,setEmail]=useState("");const[senha,setSenha]=useState("");
  const[nNome,setNNome]=useState("");const[nEmail,setNEmail]=useState("");const[nSenha,setNSenha]=useState("");const[nEmp,setNEmp]=useState("");const[nPlano,setNPlano]=useState("pro");
  const[erro,setErro]=useState("");const[load,setLoad]=useState(false);
  async function entrar(){if(!email||!senha){setErro("Preencha email e senha.");return;}setLoad(true);setErro("");try{const u=await db.getOne("usuarios",{email});if(!u||u.senha!==senha||!u.ativo){setErro("Email ou senha incorretos.");setLoad(false);return;}onLogin({userId:u.id,nome:u.nome,perfil:u.perfil,empresaId:u.empresa_id});}catch(e){setErro("Erro: "+e.message);}setLoad(false);}
  async function cadastrar(){if(!nNome||!nEmail||!nSenha||!nEmp){setErro("Preencha todos os campos.");return;}setLoad(true);setErro("");try{const ex=await db.getOne("usuarios",{email:nEmail});if(ex){setErro("Email já cadastrado.");setLoad(false);return;}const emp=await db.insert("empresas",{nome:nEmp,plano:nPlano,valor_mensal:PLANOS[nPlano].valor,ativo:true});const u=await db.insert("usuarios",{empresa_id:emp.id,nome:nNome,email:nEmail,senha:nSenha,perfil:"admin",ativo:true});onLogin({userId:u.id,nome:u.nome,perfil:u.perfil,empresaId:u.empresa_id});}catch(e){setErro("Erro: "+e.message);}setLoad(false);}
  return(
    <div style={{minHeight:"100vh",background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{background:"#fff",borderRadius:20,padding:40,boxShadow:"0 24px 60px rgba(0,74,247,.18)"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><LogoVP size={50} showText dark={false}/></div>
            <p style={{fontSize:12,color:"#94a3b8"}}>Consultoria em Gestão de Negócios</p>
          </div>
          <div style={{display:"flex",gap:4,marginBottom:22,background:"#F2F7FF",borderRadius:10,padding:4}}>
            {["login","cadastro"].map(t=><button key={t} onClick={()=>{setTab(t);setErro("");}} style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:tab===t?VP.grad:"transparent",color:tab===t?"#fff":"#64748b"}}>{t==="login"?"Entrar":"Criar Conta"}</button>)}
          </div>
          {tab==="login"?(
            <><LF l="Email"><LI val={email} set={setEmail} ph="seu@email.com.br" tp="email"/></LF>
            <LF l="Senha"><LI val={senha} set={setSenha} ph="••••••••" tp="password"/></LF>
            {erro&&<Err>{erro}</Err>}<BG onClick={entrar} disabled={load}>{load?"Entrando…":"Entrar"}</BG>
            <p style={{textAlign:"center",fontSize:9,color:"#94a3b8",marginTop:10}}>admin@virtualplan.com.br / admin123 &nbsp;|&nbsp; superadmin@virtualplan.com.br / super@2026</p></>
          ):(
            <><LF l="Nome"><LI val={nNome} set={setNNome} ph="Seu nome"/></LF>
            <LF l="Email"><LI val={nEmail} set={setNEmail} ph="seu@empresa.com.br" tp="email"/></LF>
            <LF l="Senha"><LI val={nSenha} set={setNSenha} ph="••••••••" tp="password"/></LF>
            <LF l="Empresa"><LI val={nEmp} set={setNEmp} ph="Nome da empresa"/></LF>
            <LF l="Plano"><select value={nPlano} onChange={e=>setNPlano(e.target.value)} style={iSty}><option value="pro">Pro — R$199,90/mês</option><option value="enterprise">Enterprise — R$600,00/mês</option></select></LF>
            {erro&&<Err>{erro}</Err>}<BG onClick={cadastrar} disabled={load}>{load?"Criando…":"Criar Conta"}</BG></>
          )}
        </div>
        <p style={{textAlign:"center",color:"rgba(255,255,255,.6)",fontSize:11,marginTop:14}}>© 2026 VirtualPlan — Excelência em resultados</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// SISTEMA PRINCIPAL
// ══════════════════════════════════════════════════
function Sistema({sessao,onLogout}){
  const[pag,setPag]=useState("dashboard");
  const[menu,setMenu]=useState(true);
  const isSA=sessao.perfil==="superadmin";
  const eId=sessao.empresaId;
  const[clientes,setClientes]=useState([]);
  const[fornecedores,setFornecedores]=useState([]);
  const[transportadoras,setTransportadoras]=useState([]);
  const[corretoras,setCorretoras]=useState([]);
  const[despachantes,setDespachantes]=useState([]);
  const[agenda,setAgenda]=useState([]);
  const[simulacoes,setSimulacoes]=useState([]);
  const[produtos,setProdutos]=useState([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    (isSA
      ?db.getAll("transportadoras").then(tr=>setTransportadoras(tr||[]))
      :Promise.all([
          db.get("clientes",{empresa_id:eId}),db.get("fornecedores",{empresa_id:eId}),
          db.getAll("transportadoras"),db.get("corretoras_cambio",{empresa_id:eId}),
          db.get("agenda",{empresa_id:eId}),db.get("simulacoes",{empresa_id:eId}),
          db.get("produtos_importados",{empresa_id:eId}),
          db.get("despachantes",{empresa_id:eId}),
        ]).then(([cl,fn,tr,co,ag,si,pr,dp])=>{
          setClientes(cl||[]);setFornecedores(fn||[]);setTransportadoras(tr||[]);
          setCorretoras(co||[]);setAgenda(ag||[]);setSimulacoes(si||[]);setProdutos(pr||[]);
          setDespachantes(dp||[]);
        })
    ).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const navSA=[{id:"dashboard",l:"Painel Admin",ic:"🏠"},{id:"transportadoras",l:"Transportadoras",ic:"🚢"}];
  const navN=[
    {id:"dashboard",l:"Dashboard",ic:"🏠"},{id:"agenda",l:"Agenda Kanban",ic:"📋"},
    {id:"simulacoes_lista",l:"Simulações",ic:"📊"},{id:"simulador",l:"Novo Simulador",ic:"⚡"},
    {id:"preco_venda",l:"Preço de Venda",ic:"💰"},{id:"viabilidade",l:"Inteligência IA",ic:"🧠"},
    {id:"beneficios",l:"Benefícios Fiscais",ic:"🗺️"},
    {id:"clientes",l:"Clientes",ic:"🏢"},{id:"fornecedores",l:"Fornecedores",ic:"🏭"},
    {id:"despachantes",l:"Despachantes",ic:"⚓"},
    {id:"transportadoras",l:"Transportadoras",ic:"🚢"},{id:"corretoras",l:"Corretoras Câmbio",ic:"💱"},
    {id:"produtos",l:"Produtos",ic:"📦"},
    {id:"ncm",l:"Tabela NCM",ic:"📑"},{id:"moedas_cad",l:"Moedas",ic:"💵"},{id:"bancos_cad",l:"Bancos",ic:"🏦"},
    {id:"usuarios",l:"Usuários",ic:"👥"},
  ];
  const nav=isSA?navSA:navN;

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#F2F7FF",fontFamily:"'DM Sans',sans-serif"}}>
      {/* SIDEBAR */}
      <div style={{width:menu?248:68,minHeight:"100vh",background:VP.dark,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",transition:"width .22s",flexShrink:0,zIndex:50,overflow:"hidden"}}>
        <div style={{padding:"18px 13px 12px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
          {menu?<LogoVP size={32} showText dark/>:<div style={{width:36,height:36,borderRadius:9,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",margin:"0 auto"}}>VP</div>}
          {isSA&&menu&&<div style={{marginTop:7,padding:"2px 8px",borderRadius:4,background:"rgba(0,208,255,.15)",color:VP.ciano,fontSize:8,fontWeight:700,letterSpacing:"1px",display:"inline-block"}}>SUPERADMIN</div>}
        </div>
        <div style={{flex:1,padding:"7px 6px",overflowY:"auto"}}>
          {nav.map(n=><button key={n.id} onClick={()=>setPag(n.id)} title={n.l} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:pag===n.id?VP.grad:"transparent",color:pag===n.id?"#fff":"#9CA3AF",fontSize:11,fontWeight:pag===n.id?700:400,textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",transition:"all .12s"}}>
            <span style={{fontSize:14,flexShrink:0}}>{n.ic}</span>{menu&&<span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{n.l}</span>}
          </button>)}
        </div>
        <div style={{padding:"7px 6px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
          {menu&&<div style={{padding:"8px 10px",borderRadius:8,background:"rgba(255,255,255,.05)",marginBottom:5}}><div style={{fontSize:10,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sessao.nome}</div><div style={{fontSize:8,color:VP.ciano,marginTop:1,textTransform:"uppercase",letterSpacing:".5px"}}>{sessao.perfil}</div></div>}
          <button onClick={()=>setMenu(v=>!v)} style={{...bsSty,width:"100%",justifyContent:"center",background:"rgba(255,255,255,.05)",border:"none",color:"#9CA3AF",fontSize:9,marginBottom:4}}>{menu?"◀ Recolher":"▶"}</button>
          <button onClick={onLogout} style={{...bsSty,width:"100%",justifyContent:"center",background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.28)",color:"#EF4444",fontSize:9}}>{menu?"Sair":"✕"}</button>
        </div>
      </div>
      {/* CONTEÚDO */}
      <div style={{flex:1,overflow:"auto"}}>
        <div style={{background:"#fff",borderBottom:"1px solid #F3F4F6",padding:"0 22px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40,boxShadow:"0 1px 6px rgba(0,74,247,.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:VP.dark}}>{nav.find(n=>n.id===pag)?.l||pag}</div>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{fontSize:10,color:"#9CA3AF"}}>{new Date().toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</div>
            <div style={{width:30,height:30,borderRadius:"50%",background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12}}>{sessao.nome.charAt(0)}</div>
          </div>
        </div>
        {loading?<Spin/>:(
          <div style={{maxWidth:1160,margin:"0 auto",padding:"20px"}}>
            {isSA?(<>
              {pag==="dashboard"&&<SuperAdminDash/>}
              {pag==="transportadoras"&&<Transportadoras tr={transportadoras} setTr={setTransportadoras}/>}
            </>):(<>
              {pag==="dashboard"&&<Dashboard agenda={agenda} clientes={clientes} fornecedores={fornecedores} simulacoes={simulacoes} sessao={sessao}/>}
              {pag==="agenda"&&<Agenda agenda={agenda} setAgenda={setAgenda} clientes={clientes} sessao={sessao}/>}
              {pag==="simulacoes_lista"&&<SimulacoesLista simulacoes={simulacoes} setSimulacoes={setSimulacoes} setPag={setPag} sessao={sessao}/>}
              {pag==="simulador"&&<Simulador clientes={clientes} fornecedores={fornecedores} transportadoras={transportadoras} corretoras={corretoras} setSimulacoes={setSimulacoes} setProdutos={setProdutos} sessao={sessao}/>}
              {pag==="preco_venda"&&<PrecoVenda simulacoes={simulacoes} sessao={sessao}/>}
              {pag==="viabilidade"&&<Viabilidade simulacoes={simulacoes} sessao={sessao}/>}
              {pag==="beneficios"&&<BeneficiosFiscais/>}
              {pag==="clientes"&&<Clientes clientes={clientes} setClientes={setClientes} sessao={sessao}/>}
              {pag==="fornecedores"&&<Fornecedores fornecedores={fornecedores} setFornecedores={setFornecedores} sessao={sessao}/>}
              {pag==="transportadoras"&&<Transportadoras tr={transportadoras} setTr={setTransportadoras}/>}
              {pag==="corretoras"&&<Corretoras corretoras={corretoras} setCorretoras={setCorretoras} sessao={sessao}/>}
              {pag==="despachantes"&&<Despachantes despachantes={despachantes} setDespachantes={setDespachantes} sessao={sessao}/>}
              {pag==="produtos"&&<Produtos produtos={produtos} setProdutos={setProdutos} fornecedores={fornecedores}/>}
              {pag==="usuarios"&&<Usuarios sessao={sessao}/>}
              {pag==="ncm"&&<CadNCM sessao={sessao}/>}
              {pag==="moedas_cad"&&<CadMoedas/>}
              {pag==="bancos_cad"&&<CadBancos sessao={sessao}/>}
              {pag==="ncm"&&<CadNCM sessao={sessao}/>}
              {pag==="moedas_cad"&&<CadMoedas/>}
              {pag==="bancos_cad"&&<CadBancos sessao={sessao}/>}
            </>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// SUPERADMIN DASHBOARD
// ══════════════════════════════════════════════════
function SuperAdminDash(){
  const[empresas,setEmpresas]=useState([]);const[usuarios,setUsuarios]=useState([]);const[sims,setSims]=useState([]);const[load,setLoad]=useState(true);
  useEffect(()=>{Promise.all([db.getAll("empresas"),db.getAll("usuarios"),db.getAll("simulacoes")]).then(([e,u,s])=>{setEmpresas(e||[]);setUsuarios(u||[]);setSims(s||[]);}).finally(()=>setLoad(false));},[]);
  if(load)return<Spin/>;
  const empAtivas=empresas.filter(e=>e.ativo!==false);
  const recMensal=empAtivas.reduce((s,e)=>{const u=usuarios.filter(x=>x.empresa_id===e.id&&x.ativo).length;return s+(e.plano==="enterprise"?600:199.90+Math.max(0,u-1)*50);},0);
  const totalUsers=usuarios.filter(u=>u.empresa_id&&u.ativo).length;
  const mes=new Date().toISOString().slice(0,7);
  const qtdPro=empAtivas.filter(e=>e.plano!=="enterprise").length;
  const qtdEnt=empAtivas.filter(e=>e.plano==="enterprise").length;
  const meses=[];for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);meses.push({m:d.toISOString().slice(0,7),l:d.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})});}
  const maxS=Math.max(...meses.map(m=>sims.filter(s=>s.criado_em?.startsWith(m.m)).length),1);
  return(
    <div className="card">
      <PH titulo="Painel Administrativo" sub="Visão geral de assinaturas, receita e uso da plataforma"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        {[["Receita Mensal",fmtBRL(recMensal),VP.azul,"💰"],["Empresas Ativas",empAtivas.length,"#10B981","🏢"],["Usuários Ativos",totalUsers,VP.ciano,"👥"],["Simulações/mês",sims.filter(s=>s.criado_em?.startsWith(mes)).length,"#8B5CF6","⚡"]].map(([l,v,c,ic])=>(
          <div key={l} style={{background:"#fff",borderRadius:12,padding:"16px 18px",boxShadow:"0 2px 10px rgba(0,74,247,.05)",borderLeft:`3px solid ${c}`}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#6B7280",fontWeight:600,marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div></div><span style={{fontSize:20,opacity:.5}}>{ic}</span></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <SC t="Por Plano">
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            {[["Pro",qtdPro,qtdPro*199.90,VP.azul],["Enterprise",qtdEnt,qtdEnt*600,VP.ciano]].map(([n,q,v,c])=>(
              <div key={n} style={{flex:1,padding:"12px",borderRadius:9,background:"#F2F7FF",border:`1px solid ${c}22`,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#6B7280",fontWeight:600}}>{n}</div>
                <div style={{fontSize:20,fontWeight:800,color:c,margin:"3px 0"}}>{q}</div>
                <div style={{fontSize:11,fontWeight:600,color:c}}>{fmtBRL(v)}/mês</div>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px",borderRadius:8,background:VP.grad,color:"#fff"}}>
            <div style={{fontSize:9,opacity:.8,fontWeight:600}}>FATURAMENTO MENSAL TOTAL</div>
            <div style={{fontSize:22,fontWeight:800,marginTop:2}}>{fmtBRL(recMensal)}</div>
          </div>
        </SC>
        <SC t="Simulações — Últimos 6 Meses">
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:106,marginBottom:6}}>
            {meses.map(m=>{const n=sims.filter(s=>s.criado_em?.startsWith(m.m)).length;return(
              <div key={m.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:8,color:"#6B7280"}}>{n}</span>
                <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:m.m===mes?VP.azul:`${VP.azul}35`,height:`${Math.max((n/maxS)*100,4)}px`}}/>
              </div>
            );})}
          </div>
          <div style={{display:"flex",gap:5}}>{meses.map(m=><div key={m.m} style={{flex:1,textAlign:"center",fontSize:7,color:"#9CA3AF"}}>{m.l}</div>)}</div>
        </SC>
      </div>
      <SC t={`Empresas Cadastradas (${empAtivas.length})`}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:"1px solid #F3F4F6"}}>{["Empresa","Plano","Usuários","Valor/mês","Simulações","Desde","Status"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontSize:9,fontWeight:700,color:"#6B7280",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{empAtivas.map(e=>{const u=usuarios.filter(x=>x.empresa_id===e.id&&x.ativo).length;const v=e.plano==="enterprise"?600:199.90+Math.max(0,u-1)*50;const sE=sims.filter(s=>s.empresa_id===e.id).length;return(
              <tr key={e.id} style={{borderBottom:"1px solid #F9FAFB"}}>
                <td style={{padding:"8px"}}><div style={{fontWeight:600,color:VP.dark}}>{e.nome}</div><div style={{fontSize:9,color:"#9CA3AF"}}>{e.cnpj||"—"}</div></td>
                <td style={{padding:"8px"}}><span style={{padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:700,background:e.plano==="enterprise"?`${VP.ciano}18`:`${VP.azul}12`,color:e.plano==="enterprise"?VP.ciano:VP.azul}}>{e.plano==="enterprise"?"Enterprise":"Pro"}</span></td>
                <td style={{padding:"8px",fontWeight:600,color:VP.dark}}>{u}</td>
                <td style={{padding:"8px",fontWeight:700,color:VP.azul}}>{fmtBRL(v)}</td>
                <td style={{padding:"8px",color:"#6B7280"}}>{sE}</td>
                <td style={{padding:"8px",color:"#9CA3AF"}}>{fmtDate(e.criado_em)}</td>
                <td style={{padding:"8px"}}><span style={{padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:700,background:"#F0FDF4",color:"#16A34A"}}>Ativo</span></td>
              </tr>
            );})}
            </tbody>
          </table>
        </div>
      </SC>
    </div>
  );
}

// ══════════════════════════════════════════════════
// DASHBOARD EXECUTIVO
// ══════════════════════════════════════════════════
function Dashboard({agenda,clientes,fornecedores,simulacoes,sessao}){
  const hj=hoje();
  const emTransito=agenda.filter(a=>a.status==="Em Trânsito");
  const aduana=agenda.filter(a=>a.status==="Aduana");
  const atrasados=agenda.filter(a=>a.previsao_chegada&&a.previsao_chegada<hj&&!["Entregue","Cancelado"].includes(a.status));
  const demurrage=agenda.filter(a=>a.criado_em?.startsWith(new Date().getFullYear().toString())).reduce((s,a)=>s+(parseFloat(a.demurrage)||0),0);
  const porStatus=STATUS_AGENDA.map(s=>({s,n:agenda.filter(a=>a.status===s).length})).filter(x=>x.n>0);
  const mes=new Date().toISOString().slice(0,7);
  const meses=[];for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);meses.push({m:d.toISOString().slice(0,7),l:d.toLocaleDateString("pt-BR",{month:"short"})});}
  const maxA=Math.max(...meses.map(m=>agenda.filter(a=>a.criado_em?.startsWith(m.m)).length),1);
  return(
    <div className="card">
      <PH titulo={`Olá, ${sessao.nome.split(" ")[0]}! 👋`} sub="Dashboard executivo de importações"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:13}}>
        {[{l:"Total na Agenda",v:agenda.length,c:VP.azul,ic:"📋"},{l:"Clientes",v:clientes.length,c:"#10B981",ic:"🏢"},{l:"Fornecedores",v:fornecedores.length,c:"#8B5CF6",ic:"🏭"},{l:"Demurrage no Ano",v:fmtBRL(demurrage),c:"#EF4444",ic:"⚠️"}].map(({l,v,c,ic})=>(
          <div key={l} style={{background:"#fff",borderRadius:11,padding:"14px 16px",boxShadow:"0 2px 10px rgba(0,74,247,.05)",borderLeft:`3px solid ${c}`}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#6B7280",fontWeight:600,marginBottom:3}}>{l}</div><div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div></div><span style={{fontSize:18,opacity:.5}}>{ic}</span></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:13}}>
        {[{l:"Em Trânsito",v:emTransito.length,val:fmtUSD(emTransito.reduce((s,a)=>s+(parseFloat(a.valor_invoice)||0),0)),c:VP.azul},
          {l:"Porto / Aduana",v:aduana.length,val:fmtUSD(aduana.reduce((s,a)=>s+(parseFloat(a.valor_invoice)||0),0)),c:"#8B5CF6"},
          {l:"Embarques Atrasados",v:atrasados.length,val:atrasados.length>0?"⚠ Verificar urgente":"✓ Em dia",c:atrasados.length>0?"#EF4444":"#10B981"},
          {l:"Simulações este mês",v:simulacoes.filter(s=>s.criado_em?.startsWith(mes)).length,val:"realizadas",c:"#F59E0B"},
        ].map(({l,v,val,c})=>(
          <div key={l} style={{background:"#fff",borderRadius:11,padding:"14px 16px",boxShadow:"0 2px 10px rgba(0,74,247,.05)",border:`1px solid ${c}22`}}>
            <div style={{fontSize:10,color:"#6B7280",fontWeight:600,marginBottom:3}}>{l}</div>
            <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
            {val&&<div style={{fontSize:10,fontWeight:600,color:c,marginTop:2}}>{val}</div>}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:13}}>
        <SC t="Status das Importações">
          {porStatus.length===0?<Vazio txt="Nenhuma importação ainda"/>:porStatus.map(({s,n})=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:STATUS_COR[s],flexShrink:0}}/>
              <span style={{flex:1,fontSize:11,color:VP.dark}}>{s}</span>
              <span style={{fontSize:11,fontWeight:700,color:STATUS_COR[s]}}>{n}</span>
              <div style={{width:60,height:3,borderRadius:2,background:"#F3F4F6"}}><div style={{width:`${(n/agenda.length)*100}%`,height:"100%",borderRadius:2,background:STATUS_COR[s]}}/></div>
            </div>
          ))}
        </SC>
        <SC t="Volume Mensal de Processos">
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:100,marginBottom:6}}>
            {meses.map(m=>{const n=agenda.filter(a=>a.criado_em?.startsWith(m.m)).length;return(
              <div key={m.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:8,color:"#6B7280"}}>{n}</span>
                <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:m.m===mes?VP.azul:`${VP.azul}35`,height:`${Math.max((n/maxA)*100,4)}px`}}/>
              </div>
            );})}
          </div>
          <div style={{display:"flex",gap:5}}>{meses.map(m=><div key={m.m} style={{flex:1,textAlign:"center",fontSize:7,color:"#9CA3AF"}}>{m.l}</div>)}</div>
        </SC>
      </div>
      {atrasados.length>0&&<SC t="⚠ Embarques Atrasados">{atrasados.map(a=>(
        <div key={a.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:8,background:"#FEF2F2",border:"1px solid #FCA5A5",marginBottom:5}}>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:VP.dark}}>{a.titulo}</div><div style={{fontSize:9,color:"#9CA3AF"}}>{a.cliente_nome||"—"} · Previsão: {fmtDate(a.previsao_chegada)}</div></div>
          <span style={{fontSize:11,fontWeight:700,color:"#EF4444"}}>+{Math.floor((new Date()-new Date(a.previsao_chegada))/86400000)} dia(s) de atraso</span>
        </div>
      ))}</SC>}
      <SC t="Últimas Importações">
        {agenda.slice(0,6).length===0?<Vazio txt="Nenhuma importação ainda"/>:agenda.slice(0,6).map(a=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:8,background:"#F9FAFB",marginBottom:4}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:STATUS_COR[a.status]||VP.cinza,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:VP.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.titulo}</div><div style={{fontSize:9,color:"#9CA3AF"}}>{a.cliente_nome||"—"} · {fmtDate(a.criado_em)}{a.valor_invoice?` · ${fmtUSD(a.valor_invoice)}`:""}</div></div>
            <SBadge s={a.status}/>
          </div>
        ))}
      </SC>
    </div>
  );
}

// ══════════════════════════════════════════════════
// BENEFÍCIOS FISCAIS POR ESTADO
// ══════════════════════════════════════════════════
function BeneficiosFiscais(){
  const todos=Object.entries(BENEF_FISCAL).map(([uf,e])=>({...e,uf}));
  const[sel,setSel]=useState(null);
  const[consultando,setConsultando]=useState(false);
  const[analise,setAnalise]=useState("");
  const[ncmQ,setNcmQ]=useState("");const[descQ,setDescQ]=useState("");
  const[busca,setBusca]=useState("");const[ordem,setOrdem]=useState("desc");
  const cor=d=>d>=0.3?"#10B981":d>=0.15?"#F59E0B":"#EF4444";
  const filtrado=[...todos]
    .filter(e=>!busca||e.nm.toLowerCase().includes(busca.toLowerCase())||e.uf.toLowerCase().includes(busca.toLowerCase())||e.prog.toLowerCase().includes(busca.toLowerCase()))
    .sort((a,b)=>ordem==="desc"?b.desc-a.desc:a.uf.localeCompare(b.uf));
  async function consultar(){
    if(!sel)return;setConsultando(true);setAnalise("");
    const r=await iaDetalharBeneficio(sel.uf,ncmQ,descQ);
    setAnalise(r);setConsultando(false);
  }
  return(
    <div className="card">
      <PH titulo="🗺️ Benefícios Fiscais por Estado" sub="Mapa completo de incentivos para desembaraço aduaneiro — todos os 27 estados"/>
      <div style={{padding:"10px 14px",borderRadius:9,background:"rgba(0,74,247,.05)",border:`1px solid ${VP.azul}22`,fontSize:11,color:"#475569",marginBottom:16,lineHeight:1.7}}>
        <strong>Como usar:</strong> Consulte os benefícios antes de definir o estado de desembaraço. <strong style={{color:"#10B981"}}>ES (-40%), CE (-35%), BA/SC (-30%)</strong> oferecem economias expressivas. No Simulador, ative "Estado de desembaraço diferente" para calcular com o estado que tem melhor benefício.
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar estado, cidade ou programa..." style={{...iSty,flex:"1 1 180px",padding:"8px 11px"}}/>
        {[["desc","Maior benefício"],["alfa","A–Z"]].map(([o,l])=><button key={o} onClick={()=>setOrdem(o)} style={{...bsSty,background:ordem===o?VP.grad:"#fff",color:ordem===o?"#fff":"#64748b",border:ordem===o?"none":"1px solid #D1D5DB",fontSize:10}}>{l}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:9,marginBottom:18}}>
        {filtrado.map(e=>(
          <div key={e.uf} onClick={()=>setSel(sel?.uf===e.uf?null:e)} style={{padding:"11px 13px",borderRadius:10,background:"#fff",border:`2px solid ${sel?.uf===e.uf?VP.azul:"#E5E7EB"}`,cursor:"pointer",transition:"all .12s",boxShadow:sel?.uf===e.uf?`0 4px 14px rgba(0,74,247,.15)`:"none"}}
            onMouseEnter={ev=>{if(sel?.uf!==e.uf)ev.currentTarget.style.borderColor=`${VP.azul}55`;}}
            onMouseLeave={ev=>{if(sel?.uf!==e.uf)ev.currentTarget.style.borderColor="#E5E7EB";}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
              <div><span style={{fontSize:15,fontWeight:800,color:VP.azul,marginRight:4}}>{e.uf}</span><span style={{fontSize:9,color:"#6B7280"}}>{e.nm}</span></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:cor(e.desc)}}>-{(e.desc*100).toFixed(0)}%</div><div style={{fontSize:7,color:"#9CA3AF"}}>ICMS ef.</div></div>
            </div>
            <div style={{fontSize:9,fontWeight:600,color:VP.dark,marginBottom:2}}>{e.prog}</div>
            <div style={{fontSize:8,color:"#6B7280",marginBottom:4}}>📦 {e.porto}</div>
            <div style={{height:2.5,borderRadius:2,background:"#F3F4F6"}}><div style={{width:`${e.desc*100}%`,height:"100%",borderRadius:2,background:cor(e.desc)}}/></div>
          </div>
        ))}
      </div>
      {sel&&<SC t={`🔍 Análise — ${sel.uf}: ${sel.nm}`}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:11,padding:"11px 13px",borderRadius:9,background:"#F2F7FF"}}>
          <div><div style={{fontSize:8,color:"#9CA3AF",fontWeight:600,marginBottom:2}}>ICMS BASE</div><div style={{fontSize:18,fontWeight:800,color:VP.dark}}>{ESTADOS_ICMS[sel.uf]}%</div></div>
          <div><div style={{fontSize:8,color:"#9CA3AF",fontWeight:600,marginBottom:2}}>DESCONTO EFETIVO</div><div style={{fontSize:18,fontWeight:800,color:cor(sel.desc)}}>-{(sel.desc*100).toFixed(0)}%</div></div>
          <div><div style={{fontSize:8,color:"#9CA3AF",fontWeight:600,marginBottom:2}}>PORTO PRINCIPAL</div><div style={{fontSize:10,fontWeight:600,color:VP.dark,lineHeight:1.3}}>{sel.porto}</div></div>
        </div>
        <div style={{padding:"9px 12px",borderRadius:8,background:"#fff",border:"1px solid #E5E7EB",fontSize:11,color:"#475569",marginBottom:12,lineHeight:1.6}}>{sel.obs}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
          <div><SL c="NCM do produto (para análise específica)"/><SI v={ncmQ} s={setNcmQ} ph="Ex: 8525.80.19"/></div>
          <div><SL c="Descrição do produto"/><SI v={descQ} s={setDescQ} ph="Ex: Câmera IP 4K"/></div>
        </div>
        <button onClick={consultar} disabled={consultando} style={{...bsSty,background:VP.grad,color:"#fff",border:"none",padding:"9px 20px",fontWeight:600,fontSize:12}}>
          {consultando?"🤖 Consultando IA…":"🧠 Análise detalhada com IA"}
        </button>
        {consultando&&<Spin/>}
        {analise&&<div style={{marginTop:12,padding:"13px 16px",borderRadius:10,background:"#fff",border:`1px solid ${VP.azul}18`,fontSize:12,color:"#475569",lineHeight:1.8,whiteSpace:"pre-line"}}>{analise}</div>}
      </SC>}
    </div>
  );
}

// ══════════════════════════════════════════════════
// SIMULADOR — com estado de desembaraço + sugestão IA
// ══════════════════════════════════════════════════
function SugestaoEstado({ncm,desc,valorUSD,regime,estadoAtual,onUsar}){
  const[load,setLoad]=useState(false);const[txt,setTxt]=useState("");const[open,setOpen]=useState(false);
  async function sugerir(){if(!ncm&&!desc)return;setLoad(true);setTxt("");setOpen(true);const r=await iaSugerirEstado(ncm,desc,valorUSD,regime);setTxt(r);setLoad(false);}
  const ufs=Object.keys(BENEF_FISCAL);
  const match=txt?ufs.find(s=>new RegExp(`(?:^|[\\s\\(])${s}(?:[\\s\\)\\.,]|$)`).test(txt)):null;
  return(
    <div style={{padding:"10px 13px",borderRadius:9,background:"rgba(0,74,247,.04)",border:`1px solid ${VP.azul}20`,marginTop:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
        <span style={{fontSize:10,fontWeight:600,color:VP.azul}}>🤖 IA: Sugere o melhor estado para desembaraço</span>
        <div style={{display:"flex",gap:5}}>
          {match&&match!==estadoAtual&&<button onClick={()=>onUsar(match)} style={{...bsSty,background:VP.grad,color:"#fff",border:"none",fontSize:10,padding:"4px 10px"}}>✓ Usar {match}</button>}
          <button onClick={sugerir} disabled={load||(!ncm&&!desc)} style={{...bsSty,background:"#fff",color:VP.azul,border:`1px solid ${VP.azul}28`,fontSize:10,padding:"4px 10px",opacity:(!ncm&&!desc)?.4:1}}>{load?"Analisando…":"🤖 Sugerir estado"}</button>
        </div>
      </div>
      {load&&<Spin size={20}/>}
      {txt&&open&&<div style={{marginTop:8,fontSize:10,color:"#475569",lineHeight:1.7,whiteSpace:"pre-line",padding:"8px 10px",borderRadius:7,background:"#fff",border:"1px solid #E5E7EB"}}>
        {txt}<br/><button onClick={()=>setOpen(false)} style={{...bsSty,marginTop:5,fontSize:9}}>▲ Recolher</button>
      </div>}
      {!open&&txt&&<button onClick={()=>setOpen(true)} style={{...bsSty,marginTop:4,fontSize:9,color:VP.azul,border:`1px solid ${VP.azul}18`}}>▼ Ver análise completa</button>}
    </div>
  );
}

function Simulador({clientes,fornecedores,transportadoras,corretoras,setSimulacoes,setProdutos,sessao}){
  const[clienteId,setClienteId]=useState("");const[fornecedorId,setFornecedorId]=useState("");
  const[transportadoraId,setTransportadoraId]=useState("");const[corretoraId,setCorretoraId]=useState("");
  const[regime,setRegime]=useState("Lucro Presumido");const[modalidade,setModalidade]=useState("Formal");
  const[destinacao,setDestinacao]=useState("revenda");
  const[moedaSim,setMoedaSim]=useState("USD");
  const[estadoCliente,setEstadoCliente]=useState("MT");
  const[usarDesembaraco,setUsarDesembaraco]=useState(false);
  const[estadoDesembaraco,setEstadoDesembaraco]=useState("MT");
  const[cambioAuto,setCambioAuto]=useState(null);const[cambioFixo,setCambioFixo]=useState("");const[margem,setMargem]=useState("0");const[loadC,setLoadC]=useState(false);
  const[frete,setFrete]=useState("");const[seguro,setSeguro]=useState("");const[despachante,setDespachante]=useState("");const[alfandega,setAlfandega]=useState("");
  const[comPct,setComPct]=useState("");const[comBase,setComBase]=useState("total");
  const[prods,setProds]=useState([{id:1,desc:"",ncm:"",qtd:"",peso:"",vUnit:"",al:null,loadNCM:false,aviso:null}]);
  const[res,setRes]=useState(null);const[calc,setCalc]=useState(false);
  const[nome,setNome]=useState("");const[salvando,setSalvando]=useState(false);const[gerandoPDF,setGerandoPDF]=useState(false);

  const estadoCalculo=usarDesembaraco?estadoDesembaraco:estadoCliente;
  const benefD=BENEF_FISCAL[estadoDesembaraco];

  useEffect(()=>{const c=clientes.find(x=>x.id===clienteId);if(c){if(c.regime)setRegime(c.regime);if(c.estado){setEstadoCliente(c.estado);if(!usarDesembaraco)setEstadoDesembaraco(c.estado);}};},[clienteId]);

  async function buscarCambio(){
    setLoadC(true);
    try{
      const par=moedaSim+"-BRL";
      const key=moedaSim+"BRL";
      const r=await fetch("https://economia.awesomeapi.com.br/json/last/"+par,{signal:AbortSignal.timeout(6000)});
      const j=await r.json();
      const taxa=parseFloat(j[key].bid);
      setCambioAuto(taxa);
      setCambioFixo(taxa.toFixed(4));
    }catch(e){
      alert("Não foi possível buscar a cotação. Informe o câmbio fixo manualmente.");
    }
    setLoadC(false);
  }
  const getCambio=useCallback(()=>{const b=cambioFixo?parseFloat(cambioFixo):(cambioAuto||0);return b*(1+parseFloat(margem||0)/100);},[cambioFixo,cambioAuto,margem]);

  async function consultarNCM(idx){
    const p=prods[idx];if(!p.ncm&&!p.desc)return;
    setProds(prev=>prev.map((x,i)=>i===idx?{...x,loadNCM:true,aviso:null}:x));
    const r=await iaNCM(p.ncm,p.desc);
    setProds(prev=>prev.map((x,i)=>i!==idx?x:{...x,ncm:r?.ncm_validado||x.ncm,al:{II:r?.ii??0,IPI:r?.ipi??0,PIS:r?.pis??0,COFINS:r?.cofins??0,dt:r?.descricao_tec,jus:r?.justificativa,ncmV:r?.ncm_validado,ok:r?.ncm_original_correto},loadNCM:false,aviso:r?.ncm_original_correto===false?`⚠ Sugerido: ${r?.ncm_validado}`:`✓ NCM ${r?.ncm_validado} confirmado`}));
  }
  const updP=(idx,k,v)=>setProds(prev=>prev.map((x,i)=>i===idx?{...x,[k]:v}:x));

  function calcular(){
    // Lê câmbio diretamente aqui — evita problema de closure no setTimeout
    const cambioBase=cambioFixo?parseFloat(cambioFixo):(cambioAuto||0);
    const cambio=cambioBase*(1+parseFloat(margem||0)/100);
    if(!cambio||cambio<=0){alert("Informe o câmbio antes de calcular. Clique em Buscar PTAX ou preencha o campo Câmbio fixo.");return;}
    setCalc(true);
    setTimeout(()=>{try{
      const fN=Number(frete)||0,sN=Number(seguro)||0,dN=Number(despachante)||0,aN=Number(alfandega)||0;
      const cT=fN+sN+dN+aN; // custos adicionais em USD
      const tI=prods.reduce((s,p)=>s+(Number(p.qtd)||0)*(Number(p.vUnit)||0),0);
      const tPeso=prods.every(p=>(Number(p.peso)||0)>0);
      const pT=prods.reduce((s,p)=>s+(Number(p.peso)||0)*(Number(p.qtd)||0),0);
      const icms=ESTADOS_ICMS[estadoCalculo]/100;
      const cP=parseFloat(comPct||0)/100;
      const ps=prods.map(p=>{
        const q=Number(p.qtd)||0;
        const v=Number(p.vUnit)||0;
        const vt=q*v; // valor total produto em USD
        const pp=(Number(p.peso)||0)*q;
        // rateio dos custos adicionais proporcional ao valor ou peso
        const fr=tPeso&&pT>0?pp/pT:(tI>0?vt/tI:0);
        const cr=cT*fr; // custo rateado em USD
        const al=p.al||{II:0,IPI:0,PIS:0,COFINS:0};
        let imp={},tImpUSD=0,creditoBRL=0;
        // ════════════════════════════════════════════════════════════
        // BASE ADUANEIRA (Valor Aduaneiro — VA)
        // VA = valor da mercadoria (CIF) + frete + seguro rateados
        // ════════════════════════════════════════════════════════════
        const base=vt+cr; // VA em USD

        // Créditos por imposto (zerados por padrão)
        let credII=0,credIPI=0,credPIS=0,credCOFINS=0,credICMS=0;
        let imp={},tImpUSD=0;

        if(modalidade==="Simplificada"){
          // ── SIMPLIFICADA ─────────────────────────────────────────
          // II unificado = 60% do VA. Sem IPI, PIS, COFINS separados.
          // Sem direito a créditos.
          const ii=base*0.60;
          const bI=(base+ii)/(1-icms);
          const ic=bI*icms;
          imp={II:ii*cambio,ICMS:ic*cambio};
          tImpUSD=ii+ic;

        }else{
          // ── FORMAL ────────────────────────────────────────────────

          // ── II — Imposto de Importação ────────────────────────────
          // Base: VA em USD | Alíquota: TEC por NCM
          const ii=base*(al.II/100);
          // II NUNCA gera crédito — é custo definitivo.

          // ── IPI — Imposto sobre Produtos Industrializados ─────────
          // Base: (VA + II) | Alíquota: TIPI por NCM
          const ipi=(base+ii)*(al.IPI/100);
          // CRÉDITO DE IPI:
          //   Destino REVENDA  → NÃO gera crédito (IPI integra custo)
          //   Destino PRODUÇÃO → GERA crédito integral (RIPI art. 226)
          //   Simples Nacional → Sem crédito
          if(destinacao==="producao" && regime!=="Simples Nacional"){
            credIPI=ipi*cambio;
          }

          // ── PIS e COFINS — Contribuições sobre Importação ────────
          // Lei 10.865/2004 — base = VA (USD)
          // Alíquotas padrão: PIS 2,10% | COFINS 9,65%
          // Alguns NCMs têm alíquotas diferenciadas (monofásicos, ST etc.)
          let aliqPIS=2.10, aliqCOFINS=9.65;
          if(regime==="Simples Nacional"){
            aliqPIS=0; aliqCOFINS=0; // Simples: isento na importação
          }else if(al.PIS>0||al.COFINS>0){
            aliqPIS=al.PIS; aliqCOFINS=al.COFINS; // IA retornou específico
          }
          const pis=base*(aliqPIS/100);
          const cof=base*(aliqCOFINS/100);
          // CRÉDITO DE PIS/COFINS:
          //   Simples Nacional → Sem crédito
          //   Lucro Presumido  → Sem crédito (sistema cumulativo)
          //   Lucro Real       → GERA crédito (não cumulativo, Lei 10.865 art. 15)
          //   Destino: tanto revenda quanto produção geram crédito no Lucro Real
          if(regime==="Lucro Real"){
            // Base do crédito = VA em BRL (art. 15 §1º Lei 10.865/2004)
            credPIS  = base*cambio*(aliqPIS/100);
            credCOFINS = base*cambio*(aliqCOFINS/100);
          }

          // ── ICMS — Imposto sobre Circulação de Mercadorias ───────
          // Base ICMS = (VA + II + IPI + PIS + COFINS + desp.aduaneiras) / (1 - alíq)
          const bI=(base+ii+ipi+pis+cof)/(1-icms);
          const ic=bI*icms;
          // CRÉDITO DE ICMS:
          //   Simples Nacional → Sem crédito (salvo SIMEI com exceção)
          //   Lucro Presumido  → GERA crédito quando destino é revenda ou produção
          //   Lucro Real       → GERA crédito quando destino é revenda ou produção
          //   Uso/consumo próprio → SEM crédito (ICMS integra custo)
          if(regime!=="Simples Nacional" && (destinacao==="revenda"||destinacao==="producao")){
            credICMS=ic*cambio; // Crédito integral do ICMS recolhido
          }

          imp={II:ii*cambio,IPI:ipi*cambio,PIS:pis*cambio,COFINS:cof*cambio,ICMS:ic*cambio};
          tImpUSD=ii+ipi+pis+cof+ic;
        }

        // Total de créditos tributários
        const creditoTotalBRL=credIPI+credPIS+credCOFINS+credICMS;
        const creditos={IPI:credIPI,PIS:credPIS,COFINS:credCOFINS,ICMS:credICMS};

        // Converter impostos USD → BRL
        const tImpBRL=tImpUSD*cambio;
        // Custo bruto = base CIF em BRL + TODOS os impostos pagos
        const custoBrutoBRL=base*cambio+tImpBRL;
        // Custo líquido = custo bruto - créditos tributários recuperáveis
        const custoLiquidoBRL=custoBrutoBRL-creditoTotalBRL;
        // Comissão sobre base escolhida
        const com=cP>0?(comBase==="total"?custoLiquidoBRL*cP:base*cambio*cP):0;
        const ct=custoLiquidoBRL+com;
        return{...p,vt,cr,imp,creditos,creditoTotalBRL,custoBrutoBRL,com,ct,cu:q>0?ct/q:0};
      });
      setRes({
        cambio,
        tI,
        tIbrl:tI*cambio,
        cT:cT*cambio,
        tImp:ps.reduce((s,p)=>s+p.tImp,0),
        tCredito:ps.reduce((s,p)=>s+(p.creditoTotalBRL||0),0),
        tCom:ps.reduce((s,p)=>s+p.com,0),
        tG:ps.reduce((s,p)=>s+p.ct,0),
        prods:ps
      });
    }catch(e){console.error("Erro no cálculo:",e);alert("Erro no cálculo: "+e.message);}
    setCalc(false);},80);
  }

  async function salvar(){
    if(!nome||!res)return;setSalvando(true);
    try{
      const cl=clientes.find(c=>c.id===clienteId);const fn=fornecedores.find(f=>f.id===fornecedorId);
      const tr=transportadoras.find(t=>t.id===transportadoraId);const co=corretoras.find(c=>c.id===corretoraId);
      const sim=await db.insert("simulacoes",{empresa_id:sessao.empresaId,cliente_id:clienteId||null,cliente_nome:cl?.nome||"",fornecedor_id:fornecedorId||null,fornecedor_nome:fn?.nome||"",transportadora_id:transportadoraId||null,transportadora_nome:tr?.nome||"",corretora_id:corretoraId||null,corretora_nome:co?.nome||"",nome,regime,modalidade,destinacao,moeda:moedaSim,estado:estadoCalculo,estado_cliente:estadoCliente,estado_desembaraco:usarDesembaraco?estadoDesembaraco:null,cambio:res.cambio,frete:parseFloat(frete||0),seguro:parseFloat(seguro||0),despachante:parseFloat(despachante||0),alfandega:parseFloat(alfandega||0),comissao_pct:parseFloat(comPct||0),comissao_base:comBase,comissao_valor:res.tCom,total_invoice_usd:res.tI,total_invoice_brl:res.tIbrl,custos_totais_brl:res.cT,total_impostos_brl:res.tImp,total_geral_brl:res.tG,status:"finalizada"});
      await Promise.all(res.prods.map(p=>db.insert("simulacao_produtos",{simulacao_id:sim.id,descricao:p.desc,ncm:p.ncm,qtd:parseFloat(p.qtd||0),peso:parseFloat(p.peso||0),valor_unit_usd:parseFloat(p.vUnit||0),valor_total_usd:p.vt,custo_rateado_usd:p.cr,aliq_ii:p.al?.II||0,aliq_ipi:p.al?.IPI||0,aliq_pis:p.al?.PIS||2.1,aliq_cofins:p.al?.COFINS||9.65,total_impostos_brl:p.tImp,credito_pis_cofins_brl:p.creditoBRL||0,custo_bruto_brl:p.custoBrutoBRL||p.ct,comissao_brl:p.com,custo_total_brl:p.ct,custo_unit_brl:p.cu,descricao_tec:p.al?.dt||"",justificativa_ncm:p.al?.jus||"",ncm_validado:p.al?.ncmV||""})));
      for(const p of res.prods){if(!p.desc)continue;const ex=await db.getOne("produtos_importados",{empresa_id:sessao.empresaId,ncm:p.ncm});if(!ex){const np=await db.insert("produtos_importados",{empresa_id:sessao.empresaId,simulacao_id:sim.id,descricao:p.desc,ncm:p.ncm,unidade:"UN",custo_medio_brl:p.cu,custo_unit_ultima_sim:p.cu,ativo:true});setProdutos(prev=>[np,...prev]);}}
      setSimulacoes(prev=>[sim,...prev]);alert(`✓ "${nome}" salva! Produtos criados automaticamente.`);
    }catch(e){alert("Erro ao salvar: "+e.message);}setSalvando(false);
  }

  // Câmbio calculado diretamente no render — sempre reflete o valor atual
  const cambioBase=cambioFixo?parseFloat(cambioFixo):(cambioAuto||0);
  const cambio=cambioBase>0?cambioBase*(1+parseFloat(margem||0)/100):0;
  const clSel=clientes.find(c=>c.id===clienteId);
  const totalInvoiceUSD=prods.reduce((s,p)=>s+(parseFloat(p.qtd||0)*parseFloat(p.vUnit||0)),0);

  return(
    <div className="card" style={{display:"flex",flexDirection:"column",gap:12}}>
      <PH titulo="Simulador de Importação" sub="Calcule custos, impostos, comissão e escolha o melhor estado de desembaraço"/>
      <SC t="Vínculos (opcionais)">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9}}>
          <div><SL c="Cliente"/><select value={clienteId} onChange={e=>setClienteId(e.target.value)} style={iSty}><option value="">— Avulso —</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select>{clSel&&<div style={{fontSize:9,color:VP.azul,marginTop:2}}>✓ {clSel.regime} · {clSel.estado}</div>}</div>
          <div><SL c="Fornecedor"/><select value={fornecedorId} onChange={e=>setFornecedorId(e.target.value)} style={iSty}><option value="">— Selecionar —</option>{fornecedores.map(f=><option key={f.id} value={f.id}>{f.nome}</option>)}</select></div>
          <div><SL c="Transportadora"/><select value={transportadoraId} onChange={e=>setTransportadoraId(e.target.value)} style={iSty}><option value="">— Selecionar —</option>{transportadoras.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
          <div><SL c="Corretora de Câmbio"/><select value={corretoraId} onChange={e=>setCorretoraId(e.target.value)} style={iSty}><option value="">— Selecionar —</option>{corretoras.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
        </div>
      </SC>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:11}}>
        <SC t="Destino da Mercadoria">
          <select value={destinacao} onChange={e=>setDestinacao(e.target.value)} style={{...iSty,fontWeight:600,borderColor:VP.azul}}>
            <option value="revenda">🏪 Revenda</option>
            <option value="producao">🏭 Produção / Insumo</option>
            <option value="uso_consumo">📦 Uso e Consumo Próprio</option>
            <option value="ativo">🔧 Ativo Imobilizado</option>
          </select>
          <div style={{fontSize:9,color:"#64748b",marginTop:4}}>Define quais créditos tributários são recuperáveis</div>
        </SC>
        <SC t="Regime Tributário"><select value={regime} onChange={e=>setRegime(e.target.value)} style={iSty}>{REGIMES.map(r=><option key={r} value={r}>{r}</option>)}</select></SC>
        <SC t="Modalidade"><select value={modalidade} onChange={e=>setModalidade(e.target.value)} style={iSty}>{MODALIDADES.map(m=><option key={m} value={m}>{m}</option>)}</select></SC>
        <SC t="Estado do Cliente (ICMS Destino)"><select value={estadoCliente} onChange={e=>{setEstadoCliente(e.target.value);if(!usarDesembaraco)setEstadoDesembaraco(e.target.value);}} style={iSty}>{Object.keys(ESTADOS_ICMS).sort().map(s=><option key={s} value={s}>{s} — {ESTADOS_ICMS[s]}%</option>)}</select></SC>
      </div>

      {/* ── ESTADO DE DESEMBARAÇO COM IA ── */}
      <SC t="🗺️ Planejamento Tributário — Estado de Desembaraço">
        <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:11,fontWeight:600,color:VP.azul,marginBottom:10}}>
          <input type="checkbox" checked={usarDesembaraco} onChange={e=>{setUsarDesembaraco(e.target.checked);if(!e.target.checked)setEstadoDesembaraco(estadoCliente);}} style={{accentColor:VP.azul,width:14,height:14}}/>
          Desembaraçar em estado diferente do cliente (para aproveitar benefício fiscal)
        </label>
        {usarDesembaraco&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <SL c="Estado de desembaraço (base do cálculo de ICMS)"/>
              <select value={estadoDesembaraco} onChange={e=>setEstadoDesembaraco(e.target.value)} style={{...iSty,border:`2px solid ${VP.azul}`,fontWeight:600}}>
                {Object.entries(BENEF_FISCAL).sort((a,b)=>b[1].desc-a[1].desc).map(([uf,e])=><option key={uf} value={uf}>{uf} — {e.prog} (-{(e.desc*100).toFixed(0)}% ICMS)</option>)}
              </select>
            </div>
            {benefD&&<div style={{padding:"10px 12px",borderRadius:8,background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.25)"}}>
              <div style={{fontSize:9,color:"#6B7280",fontWeight:600,marginBottom:3}}>BENEFÍCIO {estadoDesembaraco}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#10B981",marginBottom:2}}>{benefD.prog}</div>
              <div style={{fontSize:10,color:"#64748b"}}>{benefD.porto}</div>
              <div style={{fontSize:10,marginTop:2}}>Desconto efetivo: <strong style={{color:"#10B981"}}>-{(benefD.desc*100).toFixed(0)}% ICMS</strong> · ICMS base: {ESTADOS_ICMS[estadoDesembaraco]}%</div>
            </div>}
          </div>
        </>}
        <SugestaoEstado
          ncm={prods[0]?.ncm} desc={prods[0]?.desc}
          valorUSD={totalInvoiceUSD} regime={regime}
          estadoAtual={estadoDesembaraco}
          onUsar={uf=>{setEstadoDesembaraco(uf);setUsarDesembaraco(true);}}
        />
        {usarDesembaraco&&estadoDesembaraco!==estadoCliente&&<div style={{marginTop:9,padding:"8px 12px",borderRadius:7,background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.25)",fontSize:10,color:"#475569"}}>
          <strong style={{color:"#10B981"}}>✓ Calculando com desembaraço em {estadoDesembaraco}</strong> — ICMS base: {ESTADOS_ICMS[estadoDesembaraco]}%{benefD?` · ${benefD.prog}`:""}. Estado do cliente: {estadoCliente}.
        </div>}
      </SC>

      <SC t="Câmbio e Moeda da Invoice">
        <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div style={{width:90}}><SL c="Moeda"/><select value={moedaSim} onChange={e=>setMoedaSim(e.target.value)} style={{...iSty,fontWeight:700,color:VP.azul}}><option value="USD">🇺🇸 USD</option><option value="EUR">🇪🇺 EUR</option><option value="CNY">🇨🇳 CNY</option><option value="GBP">🇬🇧 GBP</option><option value="JPY">🇯🇵 JPY</option><option value="AUD">🇦🇺 AUD</option></select></div>
          <div style={{flex:"1 1 140px"}}><SL c="PTAX Banco Central"/><div style={{display:"flex",gap:5}}><div style={{flex:1,padding:"8px 10px",borderRadius:7,background:"#F2F7FF",border:`1px solid ${VP.azul}25`,fontSize:11,fontWeight:600,color:cambioAuto?VP.azul:"#9CA3AF"}}>{cambioAuto?`R$ ${cambioAuto.toFixed(4)}`:"—"}</div><button onClick={buscarCambio} disabled={loadC} style={{padding:"0 12px",borderRadius:7,border:"none",cursor:"pointer",background:VP.grad,color:"#fff",fontSize:11,fontWeight:600}}>{loadC?"…":"Buscar"}</button></div></div>
          <div style={{flex:"1 1 95px"}}><SL c="Câmbio fixo"/><input value={cambioFixo} onChange={e=>setCambioFixo(e.target.value.replace(",","."))} placeholder="5,85" style={iSty} onFocus={e=>e.target.style.borderColor=VP.azul} onBlur={e=>{e.target.style.borderColor="#D1D5DB";if(e.target.value.startsWith(","))setCambioFixo("0"+e.target.value.replace(",","."));}} /></div>
          <div style={{width:100}}><SL c="Margem (%)"/><input value={margem} onChange={e=>setMargem(e.target.value.replace(",","."))} placeholder="2" style={iSty} onFocus={e=>e.target.style.borderColor=VP.azul} onBlur={e=>e.target.style.borderColor="#D1D5DB"}/></div>
          {cambio>0&&<div style={{padding:"8px 12px",borderRadius:7,background:"#F0FDF4",border:"1px solid #86EFAC",color:"#16A34A",fontSize:12,fontWeight:700}}>R$ {cambio.toFixed(4)}</div>}
        </div>
      </SC>
      <SC t="Custos Adicionais (USD)">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
          {[["Frete",frete,setFrete],["Seguro",seguro,setSeguro],["Despachante",despachante,setDespachante],["Alfândega",alfandega,setAlfandega]].map(([l,v,s])=><div key={l}><SL c={l}/><NI v={v} s={s} ph="0,00"/></div>)}
        </div>
      </SC>
      <SC t="Comissão do Importador">
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:11,alignItems:"end"}}>
          <div><SL c="% de Comissão"/><NI v={comPct} s={setComPct} ph="Ex: 5" dec={2}/></div>
          <div><SL c="Base de cálculo"/>
            <div style={{display:"flex",gap:14,marginTop:2}}>
              {[["total","Total geral (mercadoria + frete + impostos)"],["mercadoria","Mercadoria + frete apenas"]].map(([val,lbl])=>(
                <label key={val} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11,color:comBase===val?VP.azul:"#64748b",fontWeight:comBase===val?600:400}}>
                  <input type="radio" checked={comBase===val} onChange={()=>setComBase(val)} style={{accentColor:VP.azul}}/>{lbl}
                </label>
              ))}
            </div>
          </div>
        </div>
      </SC>
      <SC t="Produtos da Invoice">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {prods.map((p,idx)=>(
            <div key={p.id} style={{padding:12,borderRadius:9,background:"#F9FAFB",border:"1px solid #E5E7EB"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:9,color:VP.azul,fontWeight:700}}>PRODUTO {idx+1}</span>{prods.length>1&&<button onClick={()=>setProds(prev=>prev.filter((_,i)=>i!==idx))} style={{background:"none",border:"none",color:"#DC2626",cursor:"pointer",fontSize:10}}>✕</button>}</div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1.4fr 0.7fr 0.7fr 1fr",gap:7,marginBottom:8}}>
                <div><SL c="Descrição"/><SI v={p.desc} s={v=>updP(idx,"desc",v)} ph="Ex: Câmera IP 4K"/></div>
                <div><SL c="NCM"/><div style={{display:"flex",gap:4}}><SI v={p.ncm} s={v=>updP(idx,"ncm",v)} ph="0000.00.00"/><button onClick={()=>consultarNCM(idx)} disabled={p.loadNCM||(!p.ncm&&!p.desc)} style={{padding:"0 8px",borderRadius:7,border:"none",cursor:"pointer",background:VP.grad,color:"#fff",fontSize:10,fontWeight:700,minWidth:38,opacity:(!p.ncm&&!p.desc)?.4:1}}>{p.loadNCM?"…":"IA"}</button></div></div>
                <div><SL c="Qtd"/><NI v={p.qtd} s={v=>updP(idx,"qtd",v)} ph="0" dec={0}/></div>
                <div><SL c="Peso(kg)"/><NI v={p.peso} s={v=>updP(idx,"peso",v)} ph="0,0" dec={3}/></div>
                <div><SL c="Valor unit.(USD)"/><NI v={p.vUnit} s={v=>updP(idx,"vUnit",v)} ph="0,00" dec={4}/></div>
              </div>
              {p.aviso&&<div style={{padding:"4px 9px",borderRadius:6,marginBottom:7,background:p.aviso.startsWith("⚠")?"#FFFBEB":"#F0FDF4",border:`1px solid ${p.aviso.startsWith("⚠")?"#FCD34D":"#86EFAC"}`,fontSize:10,fontWeight:500,color:p.aviso.startsWith("⚠")?"#92400E":"#166534"}}>{p.aviso}</div>}
              {p.al&&<div style={{padding:"8px 11px",borderRadius:8,background:"#fff",border:`1px solid ${VP.azul}18`}}>
                {p.al.dt&&<div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TEC: {p.al.dt}</div>}
                <div style={{display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}><span style={{fontSize:9,color:VP.azul,fontWeight:700}}>ALÍQUOTAS</span>
                  {["II","IPI","PIS","COFINS"].map(k=>p.al[k]!==undefined&&(<div key={k} style={{display:"flex",gap:2,alignItems:"center"}}><span style={{fontSize:9,color:"#9CA3AF",fontWeight:600}}>{k}</span><input value={p.al[k]} onChange={e=>updP(idx,"al",{...p.al,[k]:parseFloat(e.target.value)||0})} style={{width:40,padding:"2px 5px",borderRadius:5,border:`1px solid ${VP.azul}25`,background:"#F2F7FF",color:VP.azul,fontSize:10,textAlign:"center",fontWeight:600}}/><span style={{fontSize:8,color:"#9CA3AF"}}>%</span></div>))}
                </div>
              </div>}
            </div>
          ))}
          <button onClick={()=>setProds(p=>[...p,{id:Date.now(),desc:"",ncm:"",qtd:"",peso:"",vUnit:"",al:null,loadNCM:false,aviso:null}])} style={{padding:10,borderRadius:8,border:`2px dashed ${VP.azul}35`,background:"transparent",color:VP.azul,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Adicionar produto</button>
        </div>
      </SC>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:1,minWidth:180}}><SI v={nome} s={setNome} ph="Nome da simulação (ex: Câmeras China Jun/2026)"/></div>
        <button onClick={calcular} disabled={calc} style={{padding:"10px 20px",borderRadius:9,border:"none",cursor:calc?"not-allowed":"pointer",background:VP.grad,color:"#fff",fontSize:13,fontWeight:700,boxShadow:"0 4px 13px rgba(0,74,247,.28)",opacity:calc?.7:1}}>{calc?"Calculando…":"⚡ Calcular"}</button>
        {res&&nome&&<button onClick={salvar} disabled={salvando} style={{...bsSty,background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",padding:"10px 16px"}}>{salvando?"Salvando…":"💾 Salvar"}</button>}
        {res&&<button onClick={async()=>{
  setGerandoPDF(true);
  try{
    const cfg={cambio:res.cambio,res,nome,regime,modalidade,estado:estadoCalculo,
      cliente:clientes.find(c=>c.id===clienteId)?.nome||"",
      fornecedor:fornecedores.find(f=>f.id===fornecedorId)?.nome||""};
    // Chama função nativa fora do Babel (evita bloqueio de download)
    if(window._vpImprimirSimulacao){
      window._vpImprimirSimulacao(cfg);
    }else{
      await gerarPDF(cfg);
    }
  }catch(e){
    console.error("PDF erro:",e);
    alert("Erro: "+e.message);
  }
  setGerandoPDF(false);
}} disabled={gerandoPDF} style={{...bsSty,background:"#F5F3FF",color:"#7C3AED",border:"1px solid #C4B5FD",padding:"10px 16px"}}>{gerandoPDF?"Gerando…":"⬇ PDF"}</button>}
      </div>
      {res&&<>
        <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0"}}><div style={{flex:1,height:2,background:VP.grad,borderRadius:1}}/><span style={{fontSize:9,fontWeight:700,color:VP.azul,letterSpacing:"1px"}}>RESULTADO DA SIMULAÇÃO</span><div style={{flex:1,height:2,background:VP.gradR,borderRadius:1}}/></div>
        {/* KPIs principais */}
        <div style={{display:"grid",gridTemplateColumns:`repeat(${res.tCredito>0?6:5},1fr)`,gap:10}}>
          {[["Invoice BRL",fmtBRL(res.tIbrl),VP.azul],["Custos Adicionais",fmtBRL(res.cT),"#64748b"],["Total Impostos",fmtBRL(res.tImp),"#EF4444"],...(res.tCredito>0?[["Créditos Trib.","-"+fmtBRL(res.tCredito),"#15803D"]]:[]),["Comissão",fmtBRL(res.tCom),"#F59E0B"],["Total Geral",fmtBRL(res.tG),"#10B981"]].map(([l,v,c])=>(
            <div key={l} style={{padding:"12px 14px",borderRadius:10,background:"#fff",border:`2px solid ${c}18`}}>
              <div style={{fontSize:9,color:"#6B7280",fontWeight:600,marginBottom:3}}>{l}</div>
              <div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        {res.prods.map((p,idx)=>(
          <div key={idx} style={{padding:14,borderRadius:10,background:"#fff",border:"1px solid #E5E7EB"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div><div style={{fontWeight:700,fontSize:13,color:VP.dark}}>{p.desc||`Produto ${idx+1}`}</div><div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>NCM {p.ncm} · {p.qtd} un · {modalidade} · {estadoCalculo}: {ESTADOS_ICMS[estadoCalculo]}%{usarDesembaraco&&estadoDesembaraco!==estadoCliente?` (desembaraço)`:""}
</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#9CA3AF"}}>Custo unitário</div><div style={{fontSize:20,fontWeight:800,color:VP.azul}}>{fmtBRL(p.cu)}</div></div>
            </div>
            {p.al?.jus&&<div style={{padding:"4px 9px",borderRadius:6,marginBottom:8,background:"#F2F7FF",border:`1px solid ${VP.azul}14`,fontSize:9,color:"#64748b",fontStyle:"italic"}}>⚖ {p.al.jus}</div>}

            {/* Alíquotas aplicadas — info transparente */}
            <div style={{padding:"7px 10px",borderRadius:7,background:"#F9FAFB",border:"1px solid #E5E7EB",marginBottom:8,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:9,fontWeight:700,color:"#6B7280"}}>ALÍQUOTAS APLICADAS:</span>
              {Object.entries(p.imp).filter(([,v])=>v>0).map(([k])=>{
                const aliqMap={II:p.al?.II,IPI:p.al?.IPI,PIS:p.al?.PIS||2.1,COFINS:p.al?.COFINS||9.65,ICMS:ESTADOS_ICMS[estadoCalculo]};
                return <span key={k} style={{fontSize:9,color:"#64748b"}}><span style={{fontWeight:700,color:VP.azul}}>{k}</span> {aliqMap[k]?.toFixed(2)||"—"}%</span>;
              })}
              <span style={{fontSize:9,color:"#6B7280"}}>| Base: <span style={{fontWeight:700}}>CIF (mercadoria + frete rateado)</span></span>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:5}}>
              <IB l="Mercadoria BRL" v={fmtBRL(p.vt*res.cambio)}/>
              <IB l="Frete rateado BRL" v={fmtBRL(p.cr*res.cambio)}/>
              {Object.entries(p.imp).filter(([,v])=>v>0).map(([k,v])=><IB key={k} l={k} v={fmtBRL(v)} d/>)}
              <IB l="Total impostos" v={fmtBRL(p.tImp)} d s/>
              {p.com>0&&<IB l={`Comissão (${comPct}%)`} v={fmtBRL(p.com)} d/>}
              <IB l="Custo bruto" v={fmtBRL(p.custoBrutoBRL)} s/>
            </div>

            {/* ── PAINEL DE CRÉDITOS TRIBUTÁRIOS ── */}
            {(p.creditoTotalBRL||0)>0&&(
              <div style={{marginTop:10,borderRadius:10,overflow:"hidden",border:"1px solid #86EFAC"}}>
                {/* Header verde */}
                <div style={{background:"#15803D",padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{color:"#fff",fontWeight:700,fontSize:12}}>✅ Créditos Tributários Recuperáveis</div>
                  <div style={{color:"#BBF7D0",fontSize:11}}>Destino: <strong style={{color:"#fff"}}>{({revenda:"Revenda",producao:"Produção",uso_consumo:"Uso/Consumo",ativo:"Ativo Imobilizado"})[destinacao]||destinacao}</strong> · {regime}</div>
                </div>
                {/* Grid de créditos */}
                <div style={{background:"#F0FDF4",padding:"10px 14px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,marginBottom:10}}>
                    {Object.entries(p.creditos||{}).filter(([,v])=>v>0).map(([k,v])=>(
                      <div key={k} style={{background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #86EFAC"}}>
                        <div style={{fontSize:9,color:"#166534",fontWeight:700,marginBottom:2}}>Crédito {k}</div>
                        <div style={{fontSize:14,fontWeight:800,color:"#15803D"}}>{fmtBRL(v)}</div>
                        <div style={{fontSize:8,color:"#6B7280",marginTop:1}}>
                          {k==="IPI"&&"RIPI art. 226 — produção"}
                          {k==="PIS"&&"Lei 10.865/04 art. 15 — Lucro Real"}
                          {k==="COFINS"&&"Lei 10.865/04 art. 15 — Lucro Real"}
                          {k==="ICMS"&&"RICMS — revenda/produção"}
                        </div>
                      </div>
                    ))}
                    {/* Total crédito */}
                    <div style={{background:"#15803D",borderRadius:7,padding:"8px 10px"}}>
                      <div style={{fontSize:9,color:"#BBF7D0",fontWeight:700,marginBottom:2}}>TOTAL CRÉDITO</div>
                      <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{fmtBRL(p.creditoTotalBRL)}</div>
                      <div style={{fontSize:8,color:"#86EFAC",marginTop:1}}>abate o custo efetivo</div>
                    </div>
                  </div>
                  {/* Custo bruto → líquido */}
                  <div style={{background:"#fff",borderRadius:8,padding:"9px 12px",border:"1px solid #86EFAC",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div style={{fontSize:11,color:"#64748b"}}>Custo bruto: <strong style={{color:VP.dark}}>{fmtBRL(p.custoBrutoBRL)}</strong></div>
                    <div style={{fontSize:11,color:"#15803D",fontWeight:700}}>− Créditos: {fmtBRL(p.creditoTotalBRL)}</div>
                    <div style={{marginLeft:"auto",fontSize:14,fontWeight:800,color:"#15803D"}}>= Custo líquido: {fmtBRL(p.ct)}</div>
                  </div>
                  <div style={{fontSize:9,color:"#6B7280",marginTop:8,lineHeight:1.5}}>
                    ⚠ <strong>Atenção:</strong> Os créditos dependem de habilitação junto à RFB, escrituração no SPED e não se aplicam a produtos monofásicos, ST ou com vedação específica. IPI: apenas para industrialização. ICMS: conforme regulamento do estado.
                  </div>
                </div>
              </div>
            )}
            {/* Quando NÃO há crédito — explicar por quê */}
            {(p.creditoTotalBRL||0)===0&&destinacao!=="revenda"&&destinacao!=="producao"&&regime!=="Simples Nacional"&&(
              <div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"#FFF7ED",border:"1px solid #FED7AA",fontSize:10,color:"#92400E"}}>
                ℹ️ <strong>Sem crédito tributário</strong> — destino "Uso e Consumo / Ativo Imobilizado": IPI e ICMS integram o custo. PIS/COFINS: crédito de ativo imobilizado é diferido em 48 meses (Lucro Real).
              </div>
            )}
            {(p.creditoTotalBRL||0)===0&&regime==="Simples Nacional"&&(
              <div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"#F0F9FF",border:"1px solid #BAE6FD",fontSize:10,color:"#0369A1"}}>
                ℹ️ <strong>Simples Nacional</strong> — sem aproveitamento de créditos de IPI, ICMS e PIS/COFINS na entrada. Todos os impostos integram o custo da mercadoria.
              </div>
            )}
          </div>
        ))}
        <div style={{padding:"7px 11px",borderRadius:7,background:"#F2F7FF",border:`1px solid ${VP.azul}15`,fontSize:10,color:"#64748b"}}>
          💡 Câmbio: R$ {res.cambio.toFixed(4)} · {regime} · {modalidade} · ICMS {estadoCalculo}: {ESTADOS_ICMS[estadoCalculo]}%{comPct?` · Comissão: ${comPct}% sobre ${comBase==="total"?"total geral":"mercadoria+frete"}`:""}
          {usarDesembaraco&&estadoDesembaraco!==estadoCliente?` · Desembaraço: ${estadoDesembaraco} | Cliente: ${estadoCliente}`:""}
        </div>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════
// SIMULAÇÕES LISTA + DOCUMENTOS
// ══════════════════════════════════════════════════
function SimulacoesLista({simulacoes,setSimulacoes,setPag,sessao}){
  const[busca,setBusca]=useState("");const[sel,setSel]=useState(null);
  const[docs,setDocs]=useState([]);const[nd,setNd]=useState({grupo:"Comerciais",tipo:"Invoice",nome:"",link:"",descricao:"",data_documento:"",numero_documento:""});
  const[savDoc,setSavDoc]=useState(false);const[editD,setEditD]=useState("");const[savD,setSavD]=useState(false);

  async function abrir(s){setSel(s);setEditD(s.demurrage||"0");try{const d=await db.get("documentos_importacao",{simulacao_id:s.id});setDocs(d||[]);}catch{setDocs([]);}}
  async function excluir(id){if(!window.confirm("Excluir simulação?"))return;try{await db.delete("simulacoes",id);setSimulacoes(p=>p.filter(s=>s.id!==id));}catch{alert("Erro.");}}
  async function clonar(sim){
    if(!window.confirm(`Clonar simulação "${sim.nome}"?`))return;
    try{
      const novaSim=await db.insert("simulacoes",{...sim,id:undefined,criado_em:undefined,atualizado_em:undefined,nome:sim.nome+" (Cópia)",status:"finalizada"});
      const prods=await db.get("simulacao_produtos",{simulacao_id:sim.id});
      await Promise.all((prods||[]).map(p=>db.insert("simulacao_produtos",{...p,id:undefined,criado_em:undefined,simulacao_id:novaSim.id})));
      setSimulacoes(prev=>[novaSim,...prev]);
      alert(`✓ Simulação clonada como "${novaSim.nome}"!`);
    }catch(e){alert("Erro ao clonar: "+e.message);}
  }
  async function converterProcesso(sim){
    if(sim.convertida_processo){alert("Esta simulação já foi convertida em processo.");return;}
    if(!window.confirm(`Converter "${sim.nome}" em Processo de Importação?\nO processo entrará no Kanban em "Em Produção".`))return;
    try{
      // Gerar número do processo automático
      const ano=new Date().getFullYear();
      const todos=await db.get("importacoes",{empresa_id:sessao.empresaId});
      const seq=String((todos||[]).length+1).padStart(3,"0");
      const numero="IMP-"+ano+"-"+seq;
      // Criar processo de importação
      const proc=await db.insert("importacoes",{
        empresa_id:sessao.empresaId,
        numero_processo:numero,
        simulacao_id:sim.id,
        fornecedor_id:sim.fornecedor_id||null,
        fornecedor_nome:sim.fornecedor_nome||"",
        comprador_id:sim.cliente_id||null,
        comprador_nome:sim.cliente_nome||"",
        transportadora_id:sim.transportadora_id||null,
        transportadora_nome:sim.transportadora_nome||"",
        corretora_id:sim.corretora_id||null,
        corretora_nome:sim.corretora_nome||"",
        moeda:sim.moeda||"USD",
        incoterm:"FOB",
        cambio:sim.cambio,
        valor_fob:sim.total_invoice_usd||0,
        valor_frete:sim.frete||0,
        valor_seguro:sim.seguro||0,
        valor_cif:(sim.total_invoice_usd||0)+(sim.frete||0)+(sim.seguro||0),
        total_impostos:sim.total_impostos_brl||0,
        total_creditos:sim.total_creditos_brl||0,
        custo_total_brl:sim.total_geral_brl||0,
        status:"Em Produção",
        destinacao:sim.destinacao||"revenda",
        regime_tributario:sim.regime,
        estado_desembaraco:sim.estado_desembaraco||sim.estado,
        modal:"Marítimo",
        data_abertura:new Date().toISOString().slice(0,10),
        observacoes:"Convertido da simulação: "+sim.nome
      });
      // Criar item na agenda/kanban
      await db.insert("agenda",{
        empresa_id:sessao.empresaId,
        importacao_id:proc.id,
        cliente_id:sim.cliente_id||null,
        cliente_nome:sim.cliente_nome||"Sem cliente",
        titulo:numero+" — "+(sim.nome||"Importação"),
        referencia:numero,
        status:"Em Produção",
        modal:"Marítimo",
        valor_invoice:sim.total_invoice_usd||0,
        demurrage:0
      });
      // Marcar simulação como convertida
      await db.update("simulacoes",sim.id,{convertida_processo:true,processo_id:proc.id});
      setSimulacoes(prev=>prev.map(s=>s.id===sim.id?{...s,convertida_processo:true,processo_id:proc.id}:s));
      alert(`✅ Processo ${numero} criado com sucesso!\nAcesse a Agenda para acompanhar no Kanban.`);
    }catch(e){alert("Erro ao converter: "+e.message);}
  }
  async function salvarD(){setSavD(true);try{const a=await db.update("simulacoes",sel.id,{demurrage:parseFloat(editD||0)});setSel(a);setSimulacoes(p=>p.map(s=>s.id===sel.id?a:s));alert("✓ Demurrage salvo!");}catch(e){alert("Erro: "+e.message);}setSavD(false);}
  async function addDoc(){
    if(!nd.nome||!nd.link){alert("Nome e link são obrigatórios.");return;}setSavDoc(true);
    try{const d=await db.insert("documentos_importacao",{tipo_grupo:nd.grupo,tipo_documento:nd.tipo,nome_arquivo:nd.nome,link_arquivo:nd.link,descricao:nd.descricao,data_documento:nd.data_documento,numero_documento:nd.numero_documento,simulacao_id:sel.id,empresa_id:sessao.empresaId,id_importacao:sel.nome});setDocs(p=>[d,...p]);setNd(p=>({...p,nome:"",link:"",descricao:"",numero_documento:"",data_documento:""}));}
    catch(e){alert("Erro: "+e.message);}setSavDoc(false);
  }
  async function remDoc(id){if(!window.confirm("Remover?"))return;try{await db.delete("documentos_importacao",id);setDocs(p=>p.filter(d=>d.id!==id));}catch{alert("Erro.");}}

  const itens=simulacoes.filter(s=>!busca||s.nome?.toLowerCase().includes(busca.toLowerCase())||s.cliente_nome?.toLowerCase().includes(busca.toLowerCase()));

  if(sel)return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <BS onClick={()=>setSel(null)}>← Voltar</BS>
        <button onClick={async()=>{
          // Busca produtos da simulação para montar cfg
          try{
            const prods=await db.get("simulacao_produtos",{simulacao_id:sel.id});
            const cfg={
              cambio:parseFloat(sel.cambio||0),
              nome:sel.nome,
              regime:sel.regime,
              modalidade:sel.modalidade,
              estado:sel.estado,
              cliente:sel.cliente_nome||"",
              fornecedor:sel.fornecedor_nome||"",
              res:{
                tI:parseFloat(sel.total_invoice_usd||0),
                tIbrl:parseFloat(sel.total_invoice_brl||0),
                cT:parseFloat(sel.custos_totais_brl||0),
                tImp:parseFloat(sel.total_impostos_brl||0),
                tCom:parseFloat(sel.comissao_valor||0),
                tG:parseFloat(sel.total_geral_brl||0),
                prods:(prods||[]).map(p=>({
                  desc:p.descricao,
                  vt:parseFloat(p.valor_total_usd||0),
                  cr:parseFloat(p.custo_rateado_usd||0),
                  imp:{
                    ...(p.imposto_ii>0?{II:parseFloat(p.imposto_ii)}:{}),
                    ...(p.imposto_ipi>0?{IPI:parseFloat(p.imposto_ipi)}:{}),
                    ...(p.imposto_pis>0?{PIS:parseFloat(p.imposto_pis)}:{}),
                    ...(p.imposto_cofins>0?{COFINS:parseFloat(p.imposto_cofins)}:{}),
                    ...(p.imposto_icms>0?{ICMS:parseFloat(p.imposto_icms)}:{})
                  },
                  tImp:parseFloat(p.total_impostos_brl||0),
                  com:parseFloat(p.comissao_brl||0),
                  ct:parseFloat(p.custo_total_brl||0),
                  cu:parseFloat(p.custo_unit_brl||0)
                }))
              }
            };
            if(window._vpImprimirSimulacao) window._vpImprimirSimulacao(cfg);
            else alert("Funcao de impressao nao disponivel.");
          }catch(e){alert("Erro ao imprimir: "+e.message);}
        }} style={{...bsSty,background:"#F5F3FF",color:"#7C3AED",border:"1px solid #C4B5FD",fontWeight:600}}>
          🖨️ Imprimir / PDF
        </button>
        <PH titulo={sel.nome} sub={`${sel.cliente_nome||"Avulsa"} · ${fmtDate(sel.criado_em)}`}/>
        <button onClick={()=>{
          // Busca produtos da simulação e gera PDF
          db.get("simulacao_produtos",{simulacao_id:sel.id}).then(prods=>{
            const cfg={
              cambio:parseFloat(sel.cambio||0),
              regime:sel.regime,
              modalidade:sel.modalidade,
              estado:sel.estado,
              nome:sel.nome,
              cliente:sel.cliente_nome||"",
              fornecedor:sel.fornecedor_nome||"",
              res:{
                tI:parseFloat(sel.total_invoice_usd||0),
                tIbrl:parseFloat(sel.total_invoice_brl||0),
                cT:parseFloat(sel.custos_totais_brl||0),
                tImp:parseFloat(sel.total_impostos_brl||0),
                tCom:parseFloat(sel.comissao_valor||0),
                tG:parseFloat(sel.total_geral_brl||0),
                prods:(prods||[]).map(p=>({
                  desc:p.descricao,ncm:p.ncm,qtd:p.qtd,
                  vt:parseFloat(p.valor_total_usd||0),
                  cr:parseFloat(p.custo_rateado_usd||0),
                  imp:{II:parseFloat(p.imposto_ii||0),IPI:parseFloat(p.imposto_ipi||0),PIS:parseFloat(p.imposto_pis||0),COFINS:parseFloat(p.imposto_cofins||0),ICMS:parseFloat(p.imposto_icms||0)},
                  tImp:parseFloat(p.total_impostos_brl||0),
                  com:parseFloat(p.comissao_brl||0),
                  ct:parseFloat(p.custo_total_brl||0),
                  cu:parseFloat(p.custo_unit_brl||0)
                }))
              }
            };
            if(window._vpPDF) window._vpPDF(cfg);
            else alert("Função de PDF não disponível.");
          }).catch(e=>alert("Erro ao buscar produtos: "+e.message));
        }} style={{...bsSty,background:"#F5F3FF",color:"#7C3AED",border:"1px solid #C4B5FD",padding:"7px 14px",fontWeight:600,fontSize:11}}>⬇ PDF</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <SC t="Resumo da Simulação">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {[["Regime",sel.regime],["Modalidade",sel.modalidade],["Estado cálculo",sel.estado],["Câmbio",`R$ ${parseFloat(sel.cambio||0).toFixed(4)}`],["Invoice BRL",fmtBRL(sel.total_invoice_brl)],["Impostos",fmtBRL(sel.total_impostos_brl)],["Comissão",sel.comissao_pct?`${sel.comissao_pct}% / ${sel.comissao_base==="total"?"total":"mercadoria"}`:"—"],["Total Geral",fmtBRL(sel.total_geral_brl)],["Fornecedor",sel.fornecedor_nome||"—"],["Transportadora",sel.transportadora_nome||"—"]].map(([l,v])=>(
              <div key={l}><div style={{fontSize:9,color:"#9CA3AF",fontWeight:600,marginBottom:1}}>{l}</div><div style={{fontSize:11,fontWeight:500,color:VP.dark}}>{v||"—"}</div></div>
            ))}
          </div>
          {sel.estado_desembaraco&&sel.estado_desembaraco!==sel.estado_cliente&&<div style={{marginTop:9,padding:"6px 10px",borderRadius:6,background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.25)",fontSize:10,color:"#475569"}}>Desembaraço em <strong style={{color:"#10B981"}}>{sel.estado_desembaraco}</strong> · Cliente: {sel.estado_cliente}</div>}
        </SC>
        <SC t="Demurrage Pago">
          <div style={{padding:"8px 11px",borderRadius:7,background:"rgba(239,68,68,.05)",border:"1px solid rgba(239,68,68,.18)",fontSize:10,color:"#6B7280",marginBottom:10,lineHeight:1.5}}>Informe o valor de demurrage pago nesta importação para totalizar no dashboard anual.</div>
          <SF l="Demurrage pago (R$)"><SI v={editD} s={setEditD} ph="0.00"/></SF>
          <button onClick={salvarD} disabled={savD} style={{...bsSty,background:VP.grad,color:"#fff",border:"none",padding:"7px 16px",fontWeight:600,fontSize:11}}>{savD?"Salvando…":"💾 Salvar Demurrage"}</button>
          {sel.demurrage>0&&<div style={{marginTop:8,fontSize:12,fontWeight:700,color:"#EF4444"}}>Valor atual: {fmtBRL(sel.demurrage)}</div>}
        </SC>
      </div>

      <SC t="📎 Documentos da Importação — Sistema de Links">
        <div style={{padding:"9px 12px",borderRadius:7,background:"rgba(0,74,247,.05)",border:`1px solid ${VP.azul}20`,fontSize:10,color:"#475569",marginBottom:14,lineHeight:1.6}}>
          <strong>Como funciona:</strong> Salve seus arquivos no seu servidor, Google Drive, Dropbox ou qualquer armazenamento. Cole o link abaixo. O sistema indexa por grupo e tipo de documento. Índice desta importação: <strong>{sel.nome}</strong>
        </div>
        <div style={{background:"#F9FAFB",borderRadius:10,padding:13,marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:700,color:VP.azul,marginBottom:10,textTransform:"uppercase",letterSpacing:".5px"}}>Adicionar Documento</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
            <div><SL c="Grupo"/><select value={nd.grupo} onChange={e=>{const g=e.target.value;setNd(p=>({...p,grupo:g,tipo:GRUPOS_DOC[g][0]||""}));}} style={iSty}>{Object.keys(GRUPOS_DOC).map(g=><option key={g} value={g}>{g}</option>)}</select></div>
            <div><SL c="Tipo de Documento"/><select value={nd.tipo} onChange={e=>setNd(p=>({...p,tipo:e.target.value}))} style={iSty}>{(GRUPOS_DOC[nd.grupo]||[]).map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div><SL c="Nome do arquivo"/><SI v={nd.nome} s={v=>setNd(p=>({...p,nome:v}))} ph="Invoice_CHN_2026_001.pdf"/></div>
            <div><SL c="🔗 Link do arquivo *"/><SI v={nd.link} s={v=>setNd(p=>({...p,link:v}))} ph="https://drive.google.com/... ou link do servidor"/></div>
            <div><SL c="Número do documento"/><SI v={nd.numero_documento} s={v=>setNd(p=>({...p,numero_documento:v}))} ph="DI 2026/000001"/></div>
            <div><SL c="Data do documento"/><input type="date" value={nd.data_documento} onChange={e=>setNd(p=>({...p,data_documento:e.target.value}))} style={iSty}/></div>
            <div style={{gridColumn:"1/-1"}}><SL c="Descrição"/><SI v={nd.descricao} s={v=>setNd(p=>({...p,descricao:v}))} ph="Observações sobre este documento"/></div>
          </div>
          <button onClick={addDoc} disabled={savDoc||!nd.nome||!nd.link} style={{...bsSty,background:VP.grad,color:"#fff",border:"none",padding:"8px 18px",fontWeight:600,fontSize:11,opacity:(!nd.nome||!nd.link)?.5:1}}>{savDoc?"Salvando…":"+ Adicionar documento"}</button>
        </div>
        {Object.keys(GRUPOS_DOC).map(grupo=>{
          const gd=docs.filter(d=>(d.tipo_grupo||d.grupo)===grupo);
          if(!gd.length)return null;
          return(<div key={grupo} style={{marginBottom:13}}>
            <div style={{fontSize:9,fontWeight:700,color:VP.azul,marginBottom:6,textTransform:"uppercase",letterSpacing:".5px",display:"flex",alignItems:"center",gap:6}}>
              <span>{grupo}</span><span style={{background:`${VP.azul}12`,color:VP.azul,padding:"1px 7px",borderRadius:10,fontSize:8}}>{gd.length}</span>
            </div>
            {gd.map(d=><div key={d.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:8,background:"#fff",border:"1px solid #E5E7EB",marginBottom:4}}>
              <span style={{fontSize:16}}>📄</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600,color:VP.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.nome_arquivo}</div>
                <div style={{fontSize:9,color:"#9CA3AF"}}>{d.tipo_documento||d.tipo}{d.numero_documento&&` · Nº ${d.numero_documento}`}{d.data_documento&&` · ${fmtDate(d.data_documento)}`}</div>
                {d.descricao&&<div style={{fontSize:9,color:"#6B7280",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.descricao}</div>}
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                <a href={d.link_arquivo} target="_blank" rel="noreferrer" style={{...bsSty,background:"#EFF6FF",color:VP.azul,border:`1px solid ${VP.azul}28`,textDecoration:"none",fontSize:10}}>🔗 Abrir</a>
                <button onClick={()=>remDoc(d.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5",fontSize:10}}>✕</button>
              </div>
            </div>)}
          </div>);
        })}
        {docs.length===0&&<Vazio txt="Nenhum documento vinculado. Cole os links dos seus arquivos acima para indexar."/>}
      </SC>
    </div>
  );

  return(
    <div className="card">
      <PH titulo="Simulações Salvas" sub={`${simulacoes.length} simulação(ões)`}><BG onClick={()=>setPag("simulador")}>+ Nova Simulação</BG></PH>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar simulação..." style={{...iSty,maxWidth:380,marginBottom:13}}/>
      {itens.length===0?<Vazio txt="Nenhuma simulação salva. Crie uma no Simulador."/>:itens.map(s=>(
        <div key={s.id} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 15px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",marginBottom:7,boxShadow:"0 2px 7px rgba(0,74,247,.04)"}}>
          <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>abrir(s)}>
            <div style={{fontWeight:700,fontSize:13,color:VP.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.nome}</div>
            <div style={{fontSize:9,color:"#9CA3AF",marginTop:2}}>
              {s.cliente_nome||"Avulsa"}{s.fornecedor_nome&&` · ${s.fornecedor_nome}`} · {s.regime} · {s.modalidade} · {fmtDate(s.criado_em)}
              {s.estado_desembaraco&&s.estado_desembaraco!==s.estado_cliente&&<span style={{color:"#10B981",marginLeft:4}}>· Desemb. {s.estado_desembaraco}</span>}
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginRight:7}}>
            <div style={{fontSize:9,color:"#9CA3AF"}}>Total geral</div>
            <div style={{fontSize:15,fontWeight:800,color:VP.azul}}>{fmtBRL(s.total_geral_brl)}</div>
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>abrir(s)} style={{...bsSty,background:"#EFF6FF",color:VP.azul,border:`1px solid ${VP.azul}28`,fontSize:10}}>📎 Docs</button>
            <button onClick={()=>clonar(s)} style={{...bsSty,background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",fontSize:10}}>⎘ Clonar</button>
            <button onClick={()=>converterProcesso(s)} style={{...bsSty,background:"#FFF7ED",color:"#C2410C",border:"1px solid #FED7AA",fontSize:10}}>🏭 Processo</button>
            <button onClick={()=>excluir(s.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5",fontSize:10}}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════
// PREÇO DE VENDA
// ══════════════════════════════════════════════════
function PrecoVenda({simulacoes,sessao}){
  const[simId,setSimId]=useState("");const[load,setLoad]=useState(false);const[saving,setSaving]=useState(false);
  const[itens,setItens]=useState([]);
  async function carregar(id){
    if(!id)return;setLoad(true);
    try{const ps=await db.get("simulacao_produtos",{simulacao_id:id});
    setItens((ps||[]).map(p=>({id:p.id,desc:p.descricao,ncm:p.ncm,custo:Number(p.custo_unit_brl)||0,mg:"",mk:"",pMg:0,pMk:0,pDef:""})));}
    catch(e){alert("Erro: "+e.message);}setLoad(false);
  }
  function calc(idx,field,raw){
    setItens(prev=>prev.map((it,i)=>{
      if(i!==idx)return it;
      const u={...it,[field]:raw};
      const custo=Number(u.custo)||0;
      if(field==="mg"){
        const mg=parseFloat(raw||0)/100;
        u.pMg=mg>0&&mg<1?custo/(1-mg):0;
        u.mk=mg>0&&mg<1?((mg/(1-mg))*100).toFixed(2):"";
        u.pMk=u.mk?custo*(1+parseFloat(u.mk)/100):0;
        u.pDef=u.pMg>0?u.pMg.toFixed(2):u.pDef;
      }else if(field==="mk"){
        const mk=parseFloat(raw||0)/100;
        u.pMk=mk>0?custo*(1+mk):0;
        u.mg=mk>0?((mk/(1+mk))*100).toFixed(2):"";
        u.pMg=u.mg?custo/(1-parseFloat(u.mg)/100):0;
        u.pDef=u.pMk>0?u.pMk.toFixed(2):u.pDef;
      }else if(field==="pDef"){
        const pf=parseFloat(raw||0);
        if(pf>0&&custo>0){
          u.mg=((pf-custo)/pf*100).toFixed(2);
          u.mk=((pf-custo)/custo*100).toFixed(2);
          u.pMg=pf;u.pMk=pf;
        }
      }
      return u;
    }));
  }
  async function salvar(){
    if(!simId){alert("Selecione uma simulacao.");return;}
    if(!itens.length){alert("Carregue os produtos.");return;}
    setSaving(true);
    try{
      const nomeSim=simulacoes.find(s=>s.id===simId)?.nome||"";
      const sv=await db.insert("simulacao_preco_venda",{empresa_id:sessao.empresaId,simulacao_id:simId,nome:"Preco — "+nomeSim});
      if(!sv?.id)throw new Error("Falha ao criar registro");
      await Promise.all(itens.map(it=>db.insert("simulacao_preco_itens",{simulacao_preco_id:sv.id,simulacao_produto_id:it.id,descricao:it.desc,custo_unit_brl:Number(it.custo)||0,margem_pct:parseFloat(it.mg||0),markup_pct:parseFloat(it.mk||0),preco_venda_margem:Number(it.pMg)||0,preco_venda_markup:Number(it.pMk)||0,preco_venda_definido:parseFloat(it.pDef||0)})));
      alert("✓ Simulacao de preco salva!");
    }catch(e){alert("Erro ao salvar: "+e.message);}setSaving(false);
  }
  return(
    <div className="card">
      <PH titulo="Simulação de Preço de Venda" sub="Margem e markup sincronizados automaticamente"/>
      <SC t="Selecionar Simulação Base">
        <SL c="Simulação de importação"/>
        <div style={{display:"flex",gap:8}}>
          <select value={simId} onChange={e=>{setSimId(e.target.value);carregar(e.target.value);}} style={{...iSty,maxWidth:460}}>
            <option value="">— Selecionar simulação —</option>
            {simulacoes.map(s=><option key={s.id} value={s.id}>{s.nome} · {fmtBRL(s.total_geral_brl)} · {fmtDate(s.criado_em)}</option>)}
          </select>
          {load&&<Spin size={22}/>}
        </div>
      </SC>
      {itens.length>0&&<>
        <SC t="Precificação por Produto">
          <div style={{fontSize:10,color:"#64748b",marginBottom:10,padding:"7px 10px",borderRadius:7,background:"#F0FDF4",border:"1px solid #86EFAC"}}>
            💡 <strong>Margem:</strong> % do preço que é lucro. <strong>Markup:</strong> % sobre o custo. Ao preencher um, o outro é calculado automaticamente.
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:"2px solid #E5E7EB",background:"#F9FAFB"}}>
                {["Produto","NCM","Custo Unit.","Margem (%)","Preço s/Margem","Markup (%)","Preço s/Markup","Preço Definido","Margem Real"].map(h=><th key={h} style={{padding:"8px",textAlign:"left",fontSize:9,fontWeight:700,color:"#6B7280",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}
              </tr></thead>
              <tbody>{itens.map((it,idx)=>{
                const pf=parseFloat(it.pDef||0),cu=Number(it.custo)||0;
                const mr=pf>0&&cu>0?((pf-cu)/pf*100):0;
                return(
                  <tr key={it.id} style={{borderBottom:"1px solid #F3F4F6"}}>
                    <td style={{padding:"8px",fontWeight:600,color:VP.dark,maxWidth:150}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.desc||"—"}</div></td>
                    <td style={{padding:"8px",color:"#6B7280",fontSize:10}}>{it.ncm||"—"}</td>
                    <td style={{padding:"8px",fontWeight:700,color:VP.azul,whiteSpace:"nowrap"}}>{fmtBRL(cu)}</td>
                    <td style={{padding:"6px 8px"}}><input value={it.mg} onChange={e=>calc(idx,"mg",e.target.value)} placeholder="ex: 40" style={{...iSty,width:65,padding:"5px 7px",background:"#EFF6FF"}}/></td>
                    <td style={{padding:"8px",color:"#10B981",fontWeight:600,whiteSpace:"nowrap"}}>{it.pMg>0?fmtBRL(it.pMg):"—"}</td>
                    <td style={{padding:"6px 8px"}}><input value={it.mk} onChange={e=>calc(idx,"mk",e.target.value)} placeholder="ex: 65" style={{...iSty,width:65,padding:"5px 7px",background:"#F5F3FF"}}/></td>
                    <td style={{padding:"8px",color:"#8B5CF6",fontWeight:600,whiteSpace:"nowrap"}}>{it.pMk>0?fmtBRL(it.pMk):"—"}</td>
                    <td style={{padding:"6px 8px"}}><input value={it.pDef} onChange={e=>calc(idx,"pDef",e.target.value)} placeholder="Preço final" style={{...iSty,width:100,padding:"5px 7px",fontWeight:700,color:VP.azul}}/></td>
                    <td style={{padding:"8px"}}><span style={{fontWeight:700,fontSize:12,color:mr>30?"#10B981":mr>15?"#F59E0B":"#EF4444"}}>{pf>0?mr.toFixed(1)+"%":"—"}</span></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </SC>
        <button onClick={salvar} disabled={saving} style={{width:"100%",padding:"11px",borderRadius:9,border:"none",cursor:saving?"not-allowed":"pointer",background:VP.grad,color:"#fff",fontSize:13,fontWeight:700,boxShadow:"0 4px 13px rgba(0,74,247,.22)",opacity:saving?.6:1}}>
          {saving?"Salvando…":"💾 Salvar Simulação de Preço"}
        </button>
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════════
// VIABILIDADE IA
// ══════════════════════════════════════════════════
function Viabilidade({simulacoes,sessao}){
  const[simId,setSimId]=useState("");
  const[conc,setConc]=useState([{pc:"",mp:"",pp:"",mpr:""}]);
  const[analisando,setAnalisando]=useState(false);const[resultado,setResultado]=useState(null);const[erro,setErro]=useState("");
  const updC=(idx,k,v)=>setConc(prev=>prev.map((c,i)=>i===idx?{...c,[k]:v}:c));
  const addC=()=>setConc(p=>[...p,{pc:"",mp:"",pp:"",mpr:""}]);
  const remC=idx=>setConc(p=>p.filter((_,i)=>i!==idx));
  async function analisar(){
    if(!simId){setErro("Selecione uma simulação.");return;}
    const validos=conc.filter(c=>c.pc&&c.mp&&c.pp);
    if(!validos.length){setErro("Informe ao menos um concorrente com produto e preço.");return;}
    setAnalisando(true);setErro("");setResultado(null);
    const sim=simulacoes.find(s=>s.id===simId);
    const prods=await db.get("simulacao_produtos",{simulacao_id:simId});
    const r=await iaViabilidade({simulacao:{nome:sim?.nome,regime:sim?.regime,modalidade:sim?.modalidade,estado:sim?.estado,cambio:sim?.cambio,total_invoice_brl:sim?.total_invoice_brl,total_geral_brl:sim?.total_geral_brl,produtos:prods.map(p=>({descricao:p.descricao,ncm:p.ncm,qtd:p.qtd,custo_unit_brl:p.custo_unit_brl}))},concorrentes:validos});
    await db.insert("analise_viabilidade",{empresa_id:sessao.empresaId,simulacao_id:simId,nome:`Análise — ${sim?.nome}`,analise_completa:r});
    setResultado(r);setAnalisando(false);
  }
  const veredito=resultado?(resultado.toLowerCase().includes("inviável")?"Inviável":resultado.toLowerCase().includes("atenção")?"Atenção":resultado.toLowerCase().includes("viável")?"Viável":null):null;
  const vCor={Viável:"#10B981",Atenção:"#F59E0B",Inviável:"#EF4444"};
  return(
    <div className="card">
      <PH titulo="🧠 Inteligência IA — Viabilidade" sub="Analise a competitividade da sua importação com inteligência artificial"/>
      <SC t="Simulação Base">
        <SL c="Selecionar simulação de importação"/>
        <select value={simId} onChange={e=>setSimId(e.target.value)} style={{...iSty,maxWidth:440}}>
          <option value="">— Selecionar —</option>
          {simulacoes.map(s=><option key={s.id} value={s.id}>{s.nome} · {fmtBRL(s.total_geral_brl)} · {fmtDate(s.criado_em)}</option>)}
        </select>
      </SC>
      <SC t="Grid de Concorrentes">
        <div style={{fontSize:10,color:"#64748b",marginBottom:12}}>Informe o produto do concorrente, seu produto equivalente, o preço praticado pelo concorrente e seu preço simulado. A IA irá comparar e avaliar a viabilidade.</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:"1px solid #E5E7EB"}}>
              {["Produto do Concorrente","Meu Produto Equivalente","Preço Concorrente (R$)","Meu Preço Simulado (R$)",""].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontSize:9,fontWeight:700,color:"#6B7280",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}
            </tr></thead>
            <tbody>{conc.map((c,idx)=>(
              <tr key={idx} style={{borderBottom:"1px solid #F9FAFB"}}>
                <td style={{padding:"5px 6px"}}><SI v={c.pc} s={v=>updC(idx,"pc",v)} ph="Ex: Câmera XYZ da Marca ABC"/></td>
                <td style={{padding:"5px 6px"}}><SI v={c.mp} s={v=>updC(idx,"mp",v)} ph="Ex: Câmera IP 4K importada"/></td>
                <td style={{padding:"5px 6px"}}><SI v={c.pp} s={v=>updC(idx,"pp",v)} ph="0.00"/></td>
                <td style={{padding:"5px 6px"}}><SI v={c.mpr} s={v=>updC(idx,"mpr",v)} ph="0.00"/></td>
                <td style={{padding:"5px 6px"}}>{conc.length>1&&<button onClick={()=>remC(idx)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5",fontSize:10}}>✕</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <button onClick={addC} style={{...bsSty,marginTop:8,border:`1px dashed ${VP.azul}40`,color:VP.azul,fontSize:10}}>+ Adicionar concorrente</button>
      </SC>
      {erro&&<Err>{erro}</Err>}
      <button onClick={analisar} disabled={analisando} style={{width:"100%",padding:"11px",borderRadius:9,border:"none",cursor:analisando?"not-allowed":"pointer",background:VP.grad,color:"#fff",fontSize:14,fontWeight:700,boxShadow:"0 4px 13px rgba(0,74,247,.28)",opacity:analisando?.7:1}}>
        {analisando?"🤖 Analisando com IA…":"🧠 Analisar Viabilidade com IA"}
      </button>
      {resultado&&(
        <div style={{padding:"20px 22px",borderRadius:13,background:"#fff",border:`2px solid ${vCor[veredito]||VP.azul}35`,boxShadow:`0 8px 28px ${vCor[veredito]||VP.azul}12`}}>
          {veredito&&<div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 17px",borderRadius:20,background:`${vCor[veredito]}14`,color:vCor[veredito],fontWeight:800,fontSize:15,marginBottom:14,border:`1px solid ${vCor[veredito]}35`}}>
            {veredito==="Viável"?"✅":veredito==="Inviável"?"❌":"⚠️"} {veredito}
          </div>}
          <div style={{fontSize:12,color:"#475569",lineHeight:1.85,whiteSpace:"pre-line"}}>{resultado}</div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// CLIENTES, FORNECEDORES, TRANSPORTADORAS, CORRETORAS
// ══════════════════════════════════════════════════
function useCRUD(tabela,sessao,incluirEmpresa=true){
  const[items,setItems]=useState(null);
  async function load(filtros={}){const f=incluirEmpresa?{empresa_id:sessao.empresaId,...filtros}:filtros;const r=await db.get(tabela,f);setItems(r||[]);}
  async function save(form,editId){if(editId){const a=await db.update(tabela,editId,incluirEmpresa?{...form,empresa_id:sessao.empresaId}:form);setItems(p=>p.map(x=>x.id===editId?a:x));return a;}else{const n=await db.insert(tabela,incluirEmpresa?{...form,empresa_id:sessao.empresaId}:form);setItems(p=>[n,...p]);return n;}}
  async function remove(id){await db.delete(tabela,id);setItems(p=>p.filter(x=>x.id!==id));}
  return{items,load,save,remove};
}

// ══════════════════════════════════════════════════
// DESPACHANTES ADUANEIROS
// ══════════════════════════════════════════════════
function Despachantes({despachantes,setDespachantes,sessao}){
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);const[busca,setBusca]=useState("");
  const vazio={nome:"",cnpj:"",nome_contato:"",email:"",whatsapp:"",telefone:"",cidade:"",estado:"SP",registro_habilitacao:"",afrfb:"",especialidades:"",portos_atuacao:"",honorarios_fixos:"",percentual_ad_valorem:"",observacoes:"",ativo:true};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filtrado=despachantes.filter(d=>!busca||d.nome?.toLowerCase().includes(busca.toLowerCase())||d.cidade?.toLowerCase().includes(busca.toLowerCase())||d.especialidades?.toLowerCase().includes(busca.toLowerCase()));
  function abrir(d){setEdit(d||null);setForm(d?{...vazio,...d}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir despachante?"))return;try{await db.delete("despachantes",id);setDespachantes(p=>p.filter(d=>d.id!==id));}catch{alert("Erro.");}}
  async function salvar(){if(!form.nome)return;setSaving(true);try{if(edit){const a=await db.update("despachantes",edit.id,{...form,empresa_id:sessao.empresaId});setDespachantes(p=>p.map(d=>d.id===edit.id?a:d));}else{const n=await db.insert("despachantes",{...form,empresa_id:sessao.empresaId});setDespachantes(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Despachante":"Novo Despachante Aduaneiro"} sub="Credenciado pela Receita Federal — habilitado para desembaraço"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Razão Social / Nome *"><SI v={form.nome} s={v=>upd("nome",v)} ph="Ex: Despachos Rápidos Ltda"/></SF>
          <SF l="CNPJ / CPF"><SI v={form.cnpj} s={v=>upd("cnpj",v)} ph="00.000.000/0001-00"/></SF>
          <SF l="Registro de Habilitação (RFB)"><SI v={form.registro_habilitacao} s={v=>upd("registro_habilitacao",v)} ph="Número do registro na RFB"/></SF>
          <SF l="Código AFRFB (Auditor/Agente)"><SI v={form.afrfb} s={v=>upd("afrfb",v)} ph="Código do agente habilitado"/></SF>
          <SF l="Cidade"><SI v={form.cidade} s={v=>upd("cidade",v)} ph="Santos"/></SF>
          <SF l="Estado"><select value={form.estado} onChange={e=>upd("estado",e.target.value)} style={iSty}>{Object.keys(ESTADOS_ICMS).sort().map(s=><option key={s} value={s}>{s}</option>)}</select></SF>
        </SC>
        <SC t="Contato">
          <SF l="Nome do contato"><SI v={form.nome_contato} s={v=>upd("nome_contato",v)} ph="Nome do responsável"/></SF>
          <SF l="E-mail"><SI v={form.email} s={v=>upd("email",v)} ph="despacho@empresa.com.br" tp="email"/></SF>
          <SF l="WhatsApp"><SI v={form.whatsapp} s={v=>upd("whatsapp",v)} ph="(13) 99999-9999"/></SF>
          <SF l="Telefone"><SI v={form.telefone} s={v=>upd("telefone",v)} ph="(13) 3000-0000"/></SF>
        </SC>
        <SC t="Atuação e Especialidades">
          <SF l="Portos / Aeroportos de atuação"><SI v={form.portos_atuacao} s={v=>upd("portos_atuacao",v)} ph="Santos, Paranaguá, Itajaí, Guarulhos"/></SF>
          <SF l="Especialidades"><SI v={form.especialidades} s={v=>upd("especialidades",v)} ph="Eletrônicos, Alimentos, Produtos Médicos, Geral"/></SF>
        </SC>
        <SC t="Honorários">
          <SF l="Honorário fixo por processo (R$)"><SI v={form.honorarios_fixos} s={v=>upd("honorarios_fixos",v)} ph="Ex: 1500.00"/></SF>
          <SF l="Percentual ad valorem (%)"><SI v={form.percentual_ad_valorem} s={v=>upd("percentual_ad_valorem",v)} ph="Ex: 0.5 (sobre valor da importação)"/></SF>
        </SC>
        <div style={{gridColumn:"1/-1"}}><SC t="Observações"><textarea value={form.observacoes} onChange={e=>upd("observacoes",e.target.value)} rows={3} placeholder="Experiência, diferenciais, histórico de atendimento..." style={{...iSty,width:"100%",resize:"vertical"}}/></SC></div>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.nome||saving}>{saving?"Salvando…":"Salvar Despachante"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="⚓ Despachantes Aduaneiros" sub={`${despachantes.length} despachante(s) credenciado(s)`}><BG onClick={()=>abrir(null)}>+ Novo Despachante</BG></PH>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome, cidade ou especialidade..." style={{...iSty,maxWidth:400,marginBottom:13}}/>
      {filtrado.length===0?<Vazio txt="Nenhum despachante cadastrado"/>:filtrado.map(d=>(
        <div key={d.id} style={{padding:"12px 15px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:10,marginBottom:6,boxShadow:"0 2px 6px rgba(0,74,247,.04)"}}>
          <div style={{width:40,height:40,borderRadius:10,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>⚓</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,color:VP.dark}}>{d.nome}</div>
            <div style={{fontSize:10,color:"#9CA3AF",marginTop:1}}>
              📍 {d.cidade&&`${d.cidade} · `}{d.estado&&`${d.estado} · `}
              {d.portos_atuacao&&`Portos: ${d.portos_atuacao} · `}
              {d.especialidades&&`${d.especialidades}`}
            </div>
            <div style={{fontSize:10,color:"#64748b",marginTop:1}}>
              {d.nome_contato&&`👤 ${d.nome_contato}`}
              {d.honorarios_fixos&&` · Honorário: ${fmtBRL(d.honorarios_fixos)}`}
              {d.percentual_ad_valorem&&` · Ad valorem: ${d.percentual_ad_valorem}%`}
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>
            {d.whatsapp&&<a href={`https://wa.me/55${d.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{...bsSty,background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",textDecoration:"none",fontSize:10}}>WhatsApp</a>}
            <button onClick={()=>abrir(d)} style={bsSty}>Editar</button>
            <button onClick={()=>excluir(d.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}


function Clientes({clientes,setClientes,sessao}){
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);
  const vazio={nome:"",cnpj:"",inscricao_estadual:"",regime:"Lucro Presumido",estado:"MT",email:"",whatsapp:"",responsavel:"",endereco:"",cidade:"",cep:"",observacoes:""};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  function abrir(c){setEdit(c||null);setForm(c?{...vazio,...c}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir?"))return;try{await db.delete("clientes",id);setClientes(p=>p.filter(c=>c.id!==id));}catch{alert("Erro.");}}
  async function salvar(){if(!form.nome)return;setSaving(true);try{if(edit){const a=await db.update("clientes",edit.id,{...form,empresa_id:sessao.empresaId});setClientes(p=>p.map(c=>c.id===edit.id?a:c));}else{const n=await db.insert("clientes",{...form,empresa_id:sessao.empresaId});setClientes(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Cliente":"Novo Cliente"}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Dados da Empresa">
          <SF l="Razão Social *"><SI v={form.nome} s={v=>upd("nome",v)} ph="Nome da empresa"/></SF>
          <SF l="CNPJ"><SI v={form.cnpj} s={v=>upd("cnpj",v)} ph="00.000.000/0001-00"/></SF>
          <SF l="Inscrição Estadual"><SI v={form.inscricao_estadual} s={v=>upd("inscricao_estadual",v)} ph=""/></SF>
          <SF l="Regime Tributário"><select value={form.regime} onChange={e=>upd("regime",e.target.value)} style={iSty}>{REGIMES.map(r=><option key={r} value={r}>{r}</option>)}</select></SF>
          <SF l="Estado (ICMS)"><select value={form.estado} onChange={e=>upd("estado",e.target.value)} style={iSty}>{Object.keys(ESTADOS_ICMS).sort().map(s=><option key={s} value={s}>{s} — {ESTADOS_ICMS[s]}%</option>)}</select></SF>
        </SC>
        <SC t="Contato">
          <SF l="E-mail"><SI v={form.email} s={v=>upd("email",v)} ph="contato@empresa.com.br" tp="email"/></SF>
          <SF l="WhatsApp"><SI v={form.whatsapp} s={v=>upd("whatsapp",v)} ph="(65) 99999-9999"/></SF>
          <SF l="Responsável"><SI v={form.responsavel} s={v=>upd("responsavel",v)} ph="Nome do responsável"/></SF>
        </SC>
        <SC t="Endereço">
          <SF l="Endereço"><SI v={form.endereco} s={v=>upd("endereco",v)} ph="Rua, número"/></SF>
          <SF l="Cidade / UF"><SI v={form.cidade} s={v=>upd("cidade",v)} ph="Cuiabá / MT"/></SF>
          <SF l="CEP"><SI v={form.cep} s={v=>upd("cep",v)} ph="00000-000"/></SF>
        </SC>
        <SC t="Observações"><textarea value={form.observacoes} onChange={e=>upd("observacoes",e.target.value)} rows={5} style={{...iSty,resize:"vertical",width:"100%"}}/></SC>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.nome||saving}>{saving?"Salvando…":"Salvar Cliente"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="Clientes" sub={`${clientes.length} cliente(s)`}><BG onClick={()=>abrir(null)}>+ Novo Cliente</BG></PH>
      {clientes.length===0?<Vazio txt="Nenhum cliente cadastrado"/>:clientes.map(c=>(
        <div key={c.id} style={{padding:"11px 14px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>{c.nome.charAt(0)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,color:VP.dark}}>{c.nome}</div>
            <div style={{fontSize:10,color:"#9CA3AF",marginTop:1}}>{c.cnpj||"CNPJ não informado"} · {c.regime} · {c.estado}{c.whatsapp&&` · 📱 ${c.whatsapp}`}</div>
          </div>
          <div style={{display:"flex",gap:5}}>
            {c.whatsapp&&<a href={`https://wa.me/55${c.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{...bsSty,background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",textDecoration:"none",fontSize:10}}>WhatsApp</a>}
            <button onClick={()=>abrir(c)} style={bsSty}>Editar</button>
            <button onClick={()=>excluir(c.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Fornecedores({fornecedores,setFornecedores,sessao}){
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);const[busca,setBusca]=useState("");
  const vazio={nome:"",pais:"China",cidade:"",endereco:"",contato_nome:"",contato_email:"",contato_whatsapp:"",contato_wechat:"",site:"",telefone:"",moeda:"USD",prazo_producao:"",prazo_entrega:"",min_pedido:"",condicao_pagamento:"",banco_nome:"",banco_swift:"",banco_iban:"",banco_agencia:"",banco_beneficiario:"",ncms_habituais:"",categorias:"",certificacoes:"",observacoes:""};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filtrado=fornecedores.filter(f=>!busca||f.nome?.toLowerCase().includes(busca.toLowerCase())||f.pais?.toLowerCase().includes(busca.toLowerCase())||f.categorias?.toLowerCase().includes(busca.toLowerCase()));
  function abrir(c){setEdit(c||null);setForm(c?{...vazio,...c}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir?"))return;try{await db.delete("fornecedores",id);setFornecedores(p=>p.filter(f=>f.id!==id));}catch{alert("Erro.");}}
  async function salvar(){if(!form.nome)return;setSaving(true);try{if(edit){const a=await db.update("fornecedores",edit.id,{...form,empresa_id:sessao.empresaId});setFornecedores(p=>p.map(f=>f.id===edit.id?a:f));}else{const n=await db.insert("fornecedores",{...form,empresa_id:sessao.empresaId});setFornecedores(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Fornecedor":"Novo Fornecedor"} sub="Cadastro de fornecedor estrangeiro"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Nome / Razão Social *"><SI v={form.nome} s={v=>upd("nome",v)} ph="Shenzhen Electronics Co."/></SF>
          <SF l="País"><SI v={form.pais} s={v=>upd("pais",v)} ph="China"/></SF>
          <SF l="Cidade / Região"><SI v={form.cidade} s={v=>upd("cidade",v)} ph="Shenzhen, Guangdong"/></SF>
          <SF l="Endereço"><SI v={form.endereco} s={v=>upd("endereco",v)} ph="Rua, número"/></SF>
          <SF l="Site / Alibaba"><SI v={form.site} s={v=>upd("site",v)} ph="www.supplier.com"/></SF>
          <SF l="Telefone internacional"><SI v={form.telefone} s={v=>upd("telefone",v)} ph="+86 135 0000 0000"/></SF>
        </SC>
        <SC t="Contato Principal">
          <SF l="Nome do contato"><SI v={form.contato_nome} s={v=>upd("contato_nome",v)} ph="Mr. Li Wei"/></SF>
          <SF l="E-mail"><SI v={form.contato_email} s={v=>upd("contato_email",v)} ph="contact@supplier.com" tp="email"/></SF>
          <SF l="WhatsApp"><SI v={form.contato_whatsapp} s={v=>upd("contato_whatsapp",v)} ph="+86 135 0000 0000"/></SF>
          <SF l="WeChat ID"><SI v={form.contato_wechat} s={v=>upd("contato_wechat",v)} ph="wechat_id"/></SF>
          <SF l="Moeda de negociação"><select value={form.moeda} onChange={e=>upd("moeda",e.target.value)} style={iSty}>{["USD","EUR","CNY","GBP","JPY","AUD"].map(m=><option key={m}>{m}</option>)}</select></SF>
        </SC>
        <SC t="Condições Comerciais">
          <SF l="Prazo de produção"><SI v={form.prazo_producao} s={v=>upd("prazo_producao",v)} ph="30 dias após pagamento"/></SF>
          <SF l="Lead time (entrega)"><SI v={form.prazo_entrega} s={v=>upd("prazo_entrega",v)} ph="45-60 dias FOB Shanghai"/></SF>
          <SF l="MOQ (pedido mínimo)"><SI v={form.min_pedido} s={v=>upd("min_pedido",v)} ph="500 un ou USD 5.000"/></SF>
          <SF l="Condição de pagamento"><SI v={form.condicao_pagamento} s={v=>upd("condicao_pagamento",v)} ph="30% antecipado, 70% contra BL"/></SF>
        </SC>
        <SC t="Dados Bancários (Wire Transfer)">
          <SF l="Banco"><SI v={form.banco_nome} s={v=>upd("banco_nome",v)} ph="Bank of China"/></SF>
          <SF l="SWIFT / BIC"><SI v={form.banco_swift} s={v=>upd("banco_swift",v)} ph="BKCHCNBJ"/></SF>
          <SF l="IBAN / Conta"><SI v={form.banco_iban} s={v=>upd("banco_iban",v)} ph="CN1234567890"/></SF>
          <SF l="Agência"><SI v={form.banco_agencia} s={v=>upd("banco_agencia",v)} ph=""/></SF>
          <SF l="Beneficiário"><SI v={form.banco_beneficiario} s={v=>upd("banco_beneficiario",v)} ph="Nome exato na conta"/></SF>
        </SC>
        <SC t="Produtos e Categorias">
          <SF l="Categorias"><SI v={form.categorias} s={v=>upd("categorias",v)} ph="Eletrônicos, Câmeras, Acessórios"/></SF>
          <SF l="NCMs habituais"><SI v={form.ncms_habituais} s={v=>upd("ncms_habituais",v)} ph="8525.80.19, 8543.70.99"/></SF>
          <SF l="Certificações"><SI v={form.certificacoes} s={v=>upd("certificacoes",v)} ph="CE, FCC, ISO 9001, RoHS"/></SF>
        </SC>
        <SC t="Observações"><textarea value={form.observacoes} onChange={e=>upd("observacoes",e.target.value)} rows={6} placeholder="Histórico de negociações, qualidade, confiabilidade..." style={{...iSty,resize:"vertical",width:"100%"}}/></SC>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.nome||saving}>{saving?"Salvando…":"Salvar Fornecedor"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="Fornecedores" sub={`${fornecedores.length} fornecedor(es) — seus fornecedores estrangeiros`}><BG onClick={()=>abrir(null)}>+ Novo Fornecedor</BG></PH>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome, país ou categoria..." style={{...iSty,maxWidth:380,marginBottom:13}}/>
      {filtrado.length===0?<Vazio txt="Nenhum fornecedor cadastrado"/>:filtrado.map(f=>(
        <div key={f.id} style={{padding:"11px 14px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>{f.nome.charAt(0)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,color:VP.dark}}>{f.nome}</div>
            <div style={{fontSize:10,color:"#9CA3AF",marginTop:1}}>🌍 {f.pais}{f.cidade&&` · ${f.cidade}`}{f.categorias&&` · ${f.categorias}`}{f.moeda&&` · ${f.moeda}`}</div>
            {f.contato_nome&&<div style={{fontSize:10,color:"#6B7280",marginTop:1}}>👤 {f.contato_nome}{f.contato_email&&` · ${f.contato_email}`}</div>}
          </div>
          <div style={{display:"flex",gap:5}}>
            {f.contato_whatsapp&&<a href={`https://wa.me/${f.contato_whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{...bsSty,background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",textDecoration:"none",fontSize:10}}>WhatsApp</a>}
            <button onClick={()=>abrir(f)} style={bsSty}>Editar</button>
            <button onClick={()=>excluir(f.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Transportadoras({tr,setTr}){
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);
  const[busca,setBusca]=useState("");const[filtroModal,setFiltroModal]=useState("Todos");
  const vazio={nome:"",pais:"",modal:"Marítimo",site:"",telefone:"",email:"",codigo_scac:"",codigo_iata:"",agente_brasil:"",agente_tel:"",agente_email:"",tracking_url:"",observacoes:""};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filtrado=tr.filter(t=>(filtroModal==="Todos"||t.modal===filtroModal||t.modal?.includes(filtroModal.split("/")[0]))&&(!busca||t.nome?.toLowerCase().includes(busca.toLowerCase())||t.pais?.toLowerCase().includes(busca.toLowerCase())));
  function abrir(c){setEdit(c||null);setForm(c?{...vazio,...c}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir?"))return;try{await db.delete("transportadoras",id);setTr(p=>p.filter(t=>t.id!==id));}catch{alert("Erro.");}}
  async function salvar(){if(!form.nome)return;setSaving(true);try{if(edit){const a=await db.update("transportadoras",edit.id,form);setTr(p=>p.map(t=>t.id===edit.id?a:t));}else{const n=await db.insert("transportadoras",form);setTr(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Transportadora":"Nova Transportadora"} sub="Lista global — visível para todos os usuários"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Nome *"><SI v={form.nome} s={v=>upd("nome",v)} ph="Maersk"/></SF>
          <SF l="País"><SI v={form.pais} s={v=>upd("pais",v)} ph="Dinamarca"/></SF>
          <SF l="Modal"><select value={form.modal} onChange={e=>upd("modal",e.target.value)} style={iSty}>{MODAIS_TRANSP.filter(m=>m!=="Todos").map(m=><option key={m} value={m}>{m}</option>)}</select></SF>
          <SF l="Site"><SI v={form.site} s={v=>upd("site",v)} ph="www.transportadora.com"/></SF>
          <SF l="Telefone"><SI v={form.telefone} s={v=>upd("telefone",v)} ph="+45 33 63 33 63"/></SF>
          <SF l="E-mail"><SI v={form.email} s={v=>upd("email",v)} ph="customer@transp.com" tp="email"/></SF>
        </SC>
        <SC t="Códigos e Representante Brasil">
          <SF l="Código SCAC (marítimo)"><SI v={form.codigo_scac} s={v=>upd("codigo_scac",v)} ph="MAEU"/></SF>
          <SF l="Código IATA (aéreo)"><SI v={form.codigo_iata} s={v=>upd("codigo_iata",v)} ph="DL"/></SF>
          <SF l="URL de rastreamento"><SI v={form.tracking_url} s={v=>upd("tracking_url",v)} ph="https://track.transportadora.com"/></SF>
          <SF l="Agente no Brasil"><SI v={form.agente_brasil} s={v=>upd("agente_brasil",v)} ph="Nome do representante"/></SF>
          <SF l="Tel. agente Brasil"><SI v={form.agente_tel} s={v=>upd("agente_tel",v)} ph="(11) 99999-9999"/></SF>
          <SF l="E-mail agente Brasil"><SI v={form.agente_email} s={v=>upd("agente_email",v)} ph="agente@brasil.com"/></SF>
        </SC>
        <div style={{gridColumn:"1/-1"}}><SC t="Observações"><textarea value={form.observacoes} onChange={e=>upd("observacoes",e.target.value)} rows={3} placeholder="Rotas atendidas, pontos fortes, particularidades..." style={{...iSty,width:"100%",resize:"vertical"}}/></SC></div>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.nome||saving}>{saving?"Salvando…":"Salvar Transportadora"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="Transportadoras" sub={`${tr.length} cadastrada(s) — lista global, visível para todos`}><BG onClick={()=>abrir(null)}>+ Nova Transportadora</BG></PH>
      <div style={{padding:"8px 12px",borderRadius:7,background:"rgba(0,208,255,.07)",border:`1px solid ${VP.ciano}28`,fontSize:10,color:"#6B7280",marginBottom:13}}>ℹ️ Lista global mantida por todos — use no Simulador para vincular transportadora ao cálculo.</div>
      <div style={{display:"flex",gap:8,marginBottom:13,flexWrap:"wrap",alignItems:"center"}}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar transportadora..." style={{...iSty,flex:"1 1 160px",padding:"7px 10px"}}/>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{MODAIS_TRANSP.map(m=><button key={m} onClick={()=>setFiltroModal(m)} style={{...bsSty,background:filtroModal===m?VP.grad:"#fff",color:filtroModal===m?"#fff":"#64748b",border:filtroModal===m?"none":"1px solid #D1D5DB",fontSize:10}}>{m}</button>)}</div>
      </div>
      {filtrado.length===0?<Vazio txt="Nenhuma transportadora encontrada"/>:filtrado.map(t=>(
        <div key={t.id} style={{padding:"10px 13px",borderRadius:9,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
          <div style={{width:36,height:36,borderRadius:8,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0,textAlign:"center"}}>{t.codigo_scac||t.codigo_iata||t.nome.slice(0,2).toUpperCase()}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{fontWeight:700,fontSize:12,color:VP.dark}}>{t.nome}</div><span style={{padding:"1px 6px",borderRadius:20,fontSize:8,fontWeight:700,background:`${MODAL_COR[t.modal]||VP.azul}15`,color:MODAL_COR[t.modal]||VP.azul}}>{t.modal}</span></div>
            <div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>🌍 {t.pais}{t.codigo_scac&&` · SCAC: ${t.codigo_scac}`}{t.observacoes&&` · ${t.observacoes}`}</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            {t.site&&<a href={`https://${t.site}`} target="_blank" rel="noreferrer" style={{...bsSty,textDecoration:"none",fontSize:9}}>🌐</a>}
            {t.tracking_url&&<a href={t.tracking_url} target="_blank" rel="noreferrer" style={{...bsSty,background:"#EFF6FF",color:VP.azul,border:`1px solid ${VP.azul}25`,textDecoration:"none",fontSize:9}}>📦 Track</a>}
            <button onClick={()=>abrir(t)} style={bsSty}>Editar</button>
            <button onClick={()=>excluir(t.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Corretoras({corretoras,setCorretoras,sessao}){
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);
  const vazio={nome:"",cnpj:"",banco_correspondente:"",agencia:"",conta:"",swift:"",contato_nome:"",contato_email:"",contato_whatsapp:"",telefone:"",site:"",spread_medio:"",taxa_minima:"",limite_operacional:"",moedas_operadas:"USD, EUR, CNY",prazo_liquidacao:"D+1",banco_recebimento:"",swift_recebimento:"",iban_recebimento:"",beneficiario_recebimento:"",observacoes:""};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  function abrir(c){setEdit(c||null);setForm(c?{...vazio,...c}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir?"))return;try{await db.delete("corretoras_cambio",id);setCorretoras(p=>p.filter(c=>c.id!==id));}catch{alert("Erro.");}}
  async function salvar(){if(!form.nome)return;setSaving(true);try{if(edit){const a=await db.update("corretoras_cambio",edit.id,{...form,empresa_id:sessao.empresaId});setCorretoras(p=>p.map(c=>c.id===edit.id?a:c));}else{const n=await db.insert("corretoras_cambio",{...form,empresa_id:sessao.empresaId,ativo:true});setCorretoras(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Corretora":"Nova Corretora de Câmbio"}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Nome *"><SI v={form.nome} s={v=>upd("nome",v)} ph="Advanced Corretora de Câmbio"/></SF>
          <SF l="CNPJ"><SI v={form.cnpj} s={v=>upd("cnpj",v)} ph="00.000.000/0001-00"/></SF>
          <SF l="Site"><SI v={form.site} s={v=>upd("site",v)} ph="www.corretora.com.br"/></SF>
          <SF l="Telefone"><SI v={form.telefone} s={v=>upd("telefone",v)} ph="(11) 3000-0000"/></SF>
          <SF l="Moedas operadas"><SI v={form.moedas_operadas} s={v=>upd("moedas_operadas",v)} ph="USD, EUR, CNY"/></SF>
          <SF l="Prazo de liquidação"><SI v={form.prazo_liquidacao} s={v=>upd("prazo_liquidacao",v)} ph="D+0, D+1, D+2"/></SF>
        </SC>
        <SC t="Taxas e Contato">
          <SF l="Nome do contato"><SI v={form.contato_nome} s={v=>upd("contato_nome",v)} ph="Operador"/></SF>
          <SF l="E-mail"><SI v={form.contato_email} s={v=>upd("contato_email",v)} ph="cambio@corretora.com.br" tp="email"/></SF>
          <SF l="WhatsApp"><SI v={form.contato_whatsapp} s={v=>upd("contato_whatsapp",v)} ph="(11) 99999-9999"/></SF>
          <SF l="Spread médio (%)"><SI v={form.spread_medio} s={v=>upd("spread_medio",v)} ph="0.50"/></SF>
          <SF l="Taxa mínima (R$)"><SI v={form.taxa_minima} s={v=>upd("taxa_minima",v)} ph="150.00"/></SF>
          <SF l="Limite por operação (R$)"><SI v={form.limite_operacional} s={v=>upd("limite_operacional",v)} ph="500000.00"/></SF>
        </SC>
        <SC t="Dados no Exterior (para recebimento/envio)">
          <SF l="Banco no exterior"><SI v={form.banco_recebimento} s={v=>upd("banco_recebimento",v)} ph="Citibank N.A."/></SF>
          <SF l="SWIFT"><SI v={form.swift_recebimento} s={v=>upd("swift_recebimento",v)} ph="CITIUS33"/></SF>
          <SF l="IBAN / Conta"><SI v={form.iban_recebimento} s={v=>upd("iban_recebimento",v)} ph="Número da conta"/></SF>
          <SF l="Beneficiário"><SI v={form.beneficiario_recebimento} s={v=>upd("beneficiario_recebimento",v)} ph="Nome exato"/></SF>
        </SC>
        <SC t="Dados no Brasil">
          <SF l="Banco correspondente"><SI v={form.banco_correspondente} s={v=>upd("banco_correspondente",v)} ph="Banco Bradesco"/></SF>
          <SF l="Agência"><SI v={form.agencia} s={v=>upd("agencia",v)} ph="0000-0"/></SF>
          <SF l="Conta corrente"><SI v={form.conta} s={v=>upd("conta",v)} ph="00000-0"/></SF>
          <SF l="SWIFT Brasil"><SI v={form.swift} s={v=>upd("swift",v)} ph="BRASBRRJ"/></SF>
        </SC>
        <div style={{gridColumn:"1/-1"}}><SC t="Observações"><textarea value={form.observacoes} onChange={e=>upd("observacoes",e.target.value)} rows={3} placeholder="Vantagens, histórico de operações..." style={{...iSty,width:"100%",resize:"vertical"}}/></SC></div>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.nome||saving}>{saving?"Salvando…":"Salvar Corretora"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="Corretoras de Câmbio" sub={`${corretoras.length} corretora(s)`}><BG onClick={()=>abrir(null)}>+ Nova Corretora</BG></PH>
      {corretoras.length===0?<Vazio txt="Nenhuma corretora cadastrada"/>:corretoras.map(c=>(
        <div key={c.id} style={{padding:"11px 14px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>💱</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,color:VP.dark}}>{c.nome}</div>
            <div style={{fontSize:10,color:"#9CA3AF",marginTop:1}}>{c.moedas_operadas&&`${c.moedas_operadas} · `}{c.prazo_liquidacao&&`${c.prazo_liquidacao} · `}{c.spread_medio&&`Spread: ${c.spread_medio}% · `}{c.contato_nome}</div>
          </div>
          <div style={{display:"flex",gap:5}}>
            {c.contato_whatsapp&&<a href={`https://wa.me/55${c.contato_whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{...bsSty,background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",textDecoration:"none",fontSize:10}}>WhatsApp</a>}
            <button onClick={()=>abrir(c)} style={bsSty}>Editar</button>
            <button onClick={()=>excluir(c.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════
// PRODUTOS, AGENDA, USUÁRIOS
// ══════════════════════════════════════════════════
function Produtos({produtos,setProdutos,fornecedores,sessao}){
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);const[busca,setBusca]=useState("");
  const[ncms,setNcms]=useState([]);
  useEffect(()=>{db.get("ncm",{empresa_id:sessao.empresaId}).then(r=>setNcms(r||[])).catch(()=>{});},[]);
  const vazio={sku:"",descricao:"",descricao_ingles:"",marca:"",fabricante_id:"",ncm_id:"",ncm_codigo:"",unidade:"UN",peso_liquido:"",peso_bruto:"",comprimento:"",largura:"",altura:"",cubagem:"",requer_anvisa:false,numero_registro_anvisa:"",tipo_registro_anvisa:"",validade_registro_anvisa:"",requer_inmetro:false,numero_inmetro:"",requer_anatel:false,numero_anatel:"",custo_medio_brl:"",preco_venda:"",observacoes:"",ativo:true};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filtrado=produtos.filter(p=>!busca||p.descricao?.toLowerCase().includes(busca.toLowerCase())||p.sku?.toLowerCase().includes(busca.toLowerCase())||p.marca?.toLowerCase().includes(busca.toLowerCase()));

  function calcCubagem(){
    const cmp=parseFloat(form.comprimento||0),lrg=parseFloat(form.largura||0),alt=parseFloat(form.altura||0);
    if(cmp>0&&lrg>0&&alt>0){const cub=(cmp*lrg*alt)/1000000;upd("cubagem",cub.toFixed(4));}
  }
  function selecionarNCM(ncmId){
    const n=ncms.find(x=>x.id===ncmId);
    upd("ncm_id",ncmId);
    if(n)upd("ncm_codigo",n.codigo_ncm);
  }
  function abrir(p){setEdit(p||null);setForm(p?{...vazio,...p}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir produto?"))return;try{await db.delete("produtos_importados",id);setProdutos(p=>p.filter(x=>x.id!==id));}catch{try{await db.delete("produtos",id);setProdutos(p=>p.filter(x=>x.id!==id));}catch{alert("Erro.");}}}
  async function salvar(){if(!form.descricao)return;setSaving(true);
    try{
      const dados={...form,empresa_id:sessao.empresaId,
        peso_liquido:parseFloat(form.peso_liquido||0)||null,
        peso_bruto:parseFloat(form.peso_bruto||0)||null,
        comprimento:parseFloat(form.comprimento||0)||null,
        largura:parseFloat(form.largura||0)||null,
        altura:parseFloat(form.altura||0)||null,
        cubagem:parseFloat(form.cubagem||0)||null,
        custo_medio_brl:parseFloat(form.custo_medio_brl||0)||null,
        preco_venda:parseFloat(form.preco_venda||0)||null,
      };
      if(edit){const a=await db.update("produtos",edit.id,dados)||await db.update("produtos_importados",edit.id,dados);setProdutos(p=>p.map(x=>x.id===edit.id?{...x,...dados}:x));}
      else{const n=await db.insert("produtos",dados)||await db.insert("produtos_importados",dados);setProdutos(p=>[n,...p]);}
      setView("lista");
    }catch(e){alert("Erro: "+e.message);}setSaving(false);
  }

  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Produto":"Novo Produto"} sub="Cadastro completo com NCM, dimensões e registros regulatórios"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="SKU / Código interno"><SI v={form.sku||""} s={v=>upd("sku",v)} ph="Ex: CAM-IP-4K-01"/></SF>
          <SF l="Descrição em Português *"><SI v={form.descricao||""} s={v=>upd("descricao",v)} ph="Ex: Câmera IP 4K 8MP"/></SF>
          <SF l="Descrição em Inglês (Invoice)"><SI v={form.descricao_ingles||""} s={v=>upd("descricao_ingles",v)} ph="Ex: IP Camera 4K 8MP"/></SF>
          <SF l="Marca"><SI v={form.marca||""} s={v=>upd("marca",v)} ph="Ex: Hikvision"/></SF>
          <SF l="Fabricante"><select value={form.fabricante_id||""} onChange={e=>upd("fabricante_id",e.target.value)} style={iSty}><option value="">— Selecionar —</option>{fornecedores.map(f=><option key={f.id} value={f.id}>{f.nome}</option>)}</select></SF>
          <SF l="Unidade"><select value={form.unidade||"UN"} onChange={e=>upd("unidade",e.target.value)} style={iSty}>{["UN","KG","M2","M3","M","CX","PCT","PAR","JG","LT"].map(u=><option key={u} value={u}>{u}</option>)}</select></SF>
        </SC>
        <SC t="NCM e Tributação">
          <SF l="NCM (tabela cadastrada)">
            <select value={form.ncm_id||""} onChange={e=>selecionarNCM(e.target.value)} style={{...iSty,borderColor:form.ncm_id?VP.azul:"#D1D5DB"}}>
              <option value="">— Selecionar NCM cadastrado —</option>
              {ncms.map(n=><option key={n.id} value={n.id}>{n.codigo_ncm} — {n.descricao?.slice(0,60)}</option>)}
            </select>
          </SF>
          {form.ncm_codigo&&<div style={{padding:"7px 10px",borderRadius:7,background:"#EFF6FF",border:`1px solid ${VP.azul}25`,fontSize:10,marginBottom:8}}>
            <strong>NCM:</strong> {form.ncm_codigo}
            {ncms.find(n=>n.id===form.ncm_id)&&<> · II: {ncms.find(n=>n.id===form.ncm_id).aliquota_ii}% · IPI: {ncms.find(n=>n.id===form.ncm_id).aliquota_ipi}%</>}
          </div>}
          <SF l="NCM manual (se não cadastrado)"><SI v={form.ncm_codigo||""} s={v=>upd("ncm_codigo",v)} ph="0000.00.00"/></SF>
          <SF l="Custo médio BRL"><SI v={form.custo_medio_brl||""} s={v=>upd("custo_medio_brl",v)} ph="0.00"/></SF>
          <SF l="Preço de venda BRL"><SI v={form.preco_venda||""} s={v=>upd("preco_venda",v)} ph="0.00"/></SF>
        </SC>
        <SC t="Dimensões e Peso">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <SF l="Peso líquido (kg)"><SI v={form.peso_liquido||""} s={v=>upd("peso_liquido",v)} ph="0.000"/></SF>
            <SF l="Peso bruto (kg)"><SI v={form.peso_bruto||""} s={v=>upd("peso_bruto",v)} ph="0.000"/></SF>
            <SF l="Comprimento (cm)"><SI v={form.comprimento||""} s={v=>{upd("comprimento",v);}} ph="0.00"/></SF>
            <SF l="Largura (cm)"><SI v={form.largura||""} s={v=>upd("largura",v)} ph="0.00"/></SF>
            <SF l="Altura (cm)"><SI v={form.altura||""} s={v=>upd("altura",v)} ph="0.00"/></SF>
            <SF l="Cubagem (m³)">
              <div style={{display:"flex",gap:5}}>
                <SI v={form.cubagem||""} s={v=>upd("cubagem",v)} ph="Auto"/>
                <button onClick={calcCubagem} style={{...bsSty,padding:"0 10px",fontSize:10,background:"#EFF6FF",color:VP.azul,border:`1px solid ${VP.azul}28`}}>Calc</button>
              </div>
            </SF>
          </div>
        </SC>
        <SC t="Registros Regulatórios">
          {[["requer_anvisa","ANVISA","numero_registro_anvisa","tipo_registro_anvisa","validade_registro_anvisa"],["requer_inmetro","INMETRO","numero_inmetro","",""],["requer_anatel","ANATEL","numero_anatel","",""]].map(([chk,label,numField,tipoField,valField])=>(
            <div key={label} style={{marginBottom:10,padding:"8px 10px",borderRadius:8,background:form[chk]?"#F0FDF4":"#F9FAFB",border:`1px solid ${form[chk]?"#86EFAC":"#E5E7EB"}`}}>
              <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,fontWeight:600,color:form[chk]?"#15803D":"#64748b",marginBottom:form[chk]?6:0}}>
                <input type="checkbox" checked={!!form[chk]} onChange={e=>upd(chk,e.target.checked)} style={{accentColor:VP.azul,width:14,height:14}}/>{label}
              </label>
              {form[chk]&&<>
                <SF l="Número do registro"><SI v={form[numField]||""} s={v=>upd(numField,v)} ph="Número"/></SF>
                {tipoField&&<SF l="Tipo"><SI v={form[tipoField]||""} s={v=>upd(tipoField,v)} ph="Medicamento, Cosmético..."/></SF>}
                {valField&&<SF l="Validade"><input type="date" value={form[valField]||""} onChange={e=>upd(valField,e.target.value)} style={iSty}/></SF>}
              </>}
            </div>
          ))}
        </SC>
        <div style={{gridColumn:"1/-1"}}><SC t="Observações"><textarea value={form.observacoes||""} onChange={e=>upd("observacoes",e.target.value)} rows={3} style={{...iSty,width:"100%",resize:"vertical"}}/></SC></div>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.descricao||saving}>{saving?"Salvando…":"Salvar Produto"}</BG></div>
    </div>
  );

  return(
    <div className="card">
      <PH titulo="📦 Produtos Importados" sub={`${produtos.length} produto(s)`}><BG onClick={()=>abrir(null)}>+ Novo Produto</BG></PH>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por descrição, SKU ou marca..." style={{...iSty,maxWidth:400,marginBottom:13}}/>
      {filtrado.length===0?<Vazio txt="Nenhum produto cadastrado"/>:filtrado.map(p=>(
        <div key={p.id} style={{padding:"11px 14px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>📦</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{fontWeight:700,fontSize:12,color:VP.dark}}>{p.descricao}</div>
              {p.sku&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"#EFF6FF",color:VP.azul,fontWeight:600}}>{p.sku}</span>}
              {p.marca&&<span style={{fontSize:9,color:"#6B7280"}}>{p.marca}</span>}
            </div>
            <div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>
              NCM: {p.ncm_codigo||p.ncm||"—"} · {p.unidade||"UN"}
              {p.peso_liquido>0&&` · ${p.peso_liquido}kg`}
              {p.custo_medio_brl>0&&` · Custo: ${fmtBRL(p.custo_medio_brl)}`}
              {p.requer_anvisa&&<span style={{marginLeft:5,padding:"1px 5px",borderRadius:4,background:"rgba(239,68,68,.1)",color:"#EF4444",fontSize:8,fontWeight:700}}>ANVISA</span>}
              {p.requer_inmetro&&<span style={{marginLeft:3,padding:"1px 5px",borderRadius:4,background:"rgba(0,74,247,.1)",color:VP.azul,fontSize:8,fontWeight:700}}>INMETRO</span>}
              {p.requer_anatel&&<span style={{marginLeft:3,padding:"1px 5px",borderRadius:4,background:"rgba(139,92,246,.1)",color:"#7C3AED",fontSize:8,fontWeight:700}}>ANATEL</span>}
            </div>
          </div>
          {p.preco_venda>0&&<div style={{textAlign:"right",marginRight:6}}><div style={{fontSize:8,color:"#9CA3AF"}}>Preço venda</div><div style={{fontSize:12,fontWeight:700,color:"#10B981"}}>{fmtBRL(p.preco_venda)}</div></div>}
          <button onClick={()=>abrir(p)} style={{...bsSty,fontSize:10}}>Editar</button>
          <button onClick={()=>excluir(p.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5",fontSize:10}}>✕</button>
        </div>
      ))}
    </div>
  );
}

function Agenda({agenda,setAgenda,clientes,sessao}){
  const[view,setView]=useState("kanban");
  const[sel,setSel]=useState(null);
  const[updates,setUpdates]=useState([]);
  const[novoUpd,setNovoUpd]=useState("");
  const[novoStatus,setNovoStatus]=useState("");
  const[saving,setSaving]=useState(false);
  const[busca,setBusca]=useState("");
  const[dragItem,setDragItem]=useState(null);
  const[dragOver,setDragOver]=useState(null);
  const[editando,setEditando]=useState(false);
  const[formEdit,setFormEdit]=useState({});

  const hoje_str=hoje();

  async function verDetalhe(item){
    setSel(item);setNovoStatus(PROXIMO_STATUS[item.status]||item.status);
    setView("detalhe");
    try{const u=await db.get("agenda_updates",{agenda_id:item.id});setUpdates(u||[]);}
    catch{setUpdates([]);}
  }

  async function avancarStatus(item,novoSt){
    if(!novoSt)return;
    try{
      const att=await db.update("agenda",item.id,{status:novoSt});
      await db.insert("agenda_updates",{agenda_id:item.id,status:novoSt,texto:"Status avancado para: "+novoSt,autor:sessao.nome});
      setAgenda(p=>p.map(a=>a.id===item.id?{...a,status:novoSt}:a));
      if(sel?.id===item.id)setSel({...sel,status:novoSt});
    }catch(e){alert("Erro: "+e.message);}
  }

  async function moverParaStatus(item,novoSt){
    try{
      await db.update("agenda",item.id,{status:novoSt});
      await db.insert("agenda_updates",{agenda_id:item.id,status:novoSt,texto:"Movido via Kanban para: "+novoSt,autor:sessao.nome});
      setAgenda(p=>p.map(a=>a.id===item.id?{...a,status:novoSt}:a));
    }catch(e){alert("Erro ao mover: "+e.message);}
  }

  async function addUpdate(){
    if(!novoUpd.trim()||!sel)return;setSaving(true);
    try{
      const upd=await db.insert("agenda_updates",{agenda_id:sel.id,status:novoStatus,texto:novoUpd,autor:sessao.nome});
      await db.update("agenda",sel.id,{status:novoStatus});
      const att={...sel,status:novoStatus};
      setAgenda(p=>p.map(a=>a.id===sel.id?att:a));setSel(att);
      setUpdates(p=>[upd,...p]);setNovoUpd("");
      const cl=clientes.find(c=>c.id===sel.cliente_id);
      if(cl?.whatsapp&&window.confirm("Notificar "+cl.nome+" via WhatsApp?"))
        abrirWA(cl.whatsapp,"🚢 *VirtualPlan Importação*\n\nProcesso: "+sel.titulo+"\nStatus: "+novoStatus+"\n\n"+novoUpd+"\n\n"+new Date().toLocaleString("pt-BR"));
    }catch{alert("Erro.");}setSaving(false);
  }

  async function salvarEdicao(){
    if(!formEdit.titulo)return;setSaving(true);
    try{
      const cl=clientes.find(c=>c.id===formEdit.cliente_id);
      const att=await db.update("agenda",sel.id,{...formEdit,cliente_nome:cl?.nome||formEdit.cliente_nome||"",valor_invoice:parseFloat(formEdit.valor_invoice||0)||null,demurrage:parseFloat(formEdit.demurrage||0)});
      setAgenda(p=>p.map(a=>a.id===sel.id?att:a));setSel(att);setEditando(false);
    }catch(e){alert("Erro: "+e.message);}setSaving(false);
  }

  async function excluir(id){
    if(!window.confirm("Excluir este processo?"))return;
    try{await db.delete("agenda",id);setAgenda(p=>p.filter(a=>a.id!==id));setView("kanban");}
    catch{alert("Erro.");}
  }

  // ── Drag & Drop ──
  function onDragStart(e,item){setDragItem(item);e.dataTransfer.effectAllowed="move";}
  function onDragOver(e,status){e.preventDefault();setDragOver(status);}
  function onDrop(e,status){
    e.preventDefault();
    if(dragItem&&dragItem.status!==status)moverParaStatus(dragItem,status);
    setDragItem(null);setDragOver(null);
  }
  function onDragEnd(){setDragItem(null);setDragOver(null);}

  const itensKanban=agenda.filter(a=>!busca||a.titulo?.toLowerCase().includes(busca.toLowerCase())||a.cliente_nome?.toLowerCase().includes(busca.toLowerCase()));

  // ── TELA DE NOVO ──
  if(view==="novo")return <NovaImp clientes={clientes} sessao={sessao} onSalvar={i=>{setAgenda(p=>[i,...p]);setView("kanban");}} onVoltar={()=>setView("kanban")}/>;

  // ── TELA DE DETALHE ──
  if(view==="detalhe"&&sel)return(
    <div style={{animation:"fi .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <BS onClick={()=>setView("kanban")}>← Kanban</BS>
        <div style={{flex:1}}>
          <h1 style={{fontSize:17,fontWeight:800,color:VP.dark,margin:0}}>{sel.titulo}</h1>
          <div style={{fontSize:10,color:"#9CA3AF",marginTop:2}}>{sel.cliente_nome||"—"} · {sel.referencia||"—"} · Criado: {fmtDate(sel.criado_em)}</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {!editando&&<button onClick={()=>{setEditando(true);setFormEdit({...sel});}} style={{...bsSty,background:"#EFF6FF",color:VP.azul,border:`1px solid ${VP.azul}28`,fontSize:11}}>✏️ Editar</button>}
          <button onClick={()=>excluir(sel.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5",fontSize:11}}>🗑️ Excluir</button>
        </div>
      </div>

      {/* Progresso visual da sequência */}
      <div style={{background:"#fff",borderRadius:12,padding:"14px 16px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,74,247,.05)",border:"1px solid #E5E7EB",overflowX:"auto"}}>
        <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>Progresso do Processo</div>
        <div style={{display:"flex",alignItems:"center",gap:0,minWidth:"max-content"}}>
          {STATUS_AGENDA.filter(s=>s!=="Cancelado").map((s,i)=>{
            const ativo=s===sel.status;
            const concluido=STATUS_AGENDA.indexOf(s)<STATUS_AGENDA.indexOf(sel.status);
            const cor=STATUS_COR[s];
            return(
              <div key={s} style={{display:"flex",alignItems:"center"}}>
                <div onClick={()=>!ativo&&moverParaStatus(sel,s)} style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:ativo?"default":"pointer",opacity:concluido?0.5:1}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:concluido||ativo?cor:"#F1F5F9",border:`2px solid ${concluido||ativo?cor:"#E2E8F0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all .2s",boxShadow:ativo?`0 0 0 3px ${cor}30`:"none"}}>
                    {concluido?"✓":STATUS_ICONE[s]||"●"}
                  </div>
                  <div style={{fontSize:7,marginTop:3,color:ativo?cor:concluido?"#94A3B8":"#CBD5E1",fontWeight:ativo?700:400,textAlign:"center",maxWidth:48,lineHeight:1.2}}>{s}</div>
                </div>
                {i<STATUS_AGENDA.filter(s=>s!=="Cancelado").length-1&&(
                  <div style={{width:18,height:2,background:concluido?STATUS_COR[STATUS_AGENDA[i+1]]||"#E2E8F0":"#E2E8F0",marginBottom:14,transition:"all .3s"}}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* Formulário de edição */}
          {editando?(
            <SC t="✏️ Editar Processo">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                <SF l="Título *"><SI v={formEdit.titulo||""} s={v=>setFormEdit(p=>({...p,titulo:v}))} ph="Título do processo"/></SF>
                <SF l="Referência"><SI v={formEdit.referencia||""} s={v=>setFormEdit(p=>({...p,referencia:v}))} ph="INV-2026-001"/></SF>
                <SF l="Cliente"><select value={formEdit.cliente_id||""} onChange={e=>setFormEdit(p=>({...p,cliente_id:e.target.value}))} style={iSty}><option value="">— Selecionar —</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></SF>
                <SF l="Modal"><select value={formEdit.modal||"Marítimo"} onChange={e=>setFormEdit(p=>({...p,modal:e.target.value}))} style={iSty}>{["Marítimo","Aéreo","Rodoviário","Ferroviário"].map(m=><option key={m} value={m}>{m}</option>)}</select></SF>
                <SF l="Origem"><SI v={formEdit.origem||""} s={v=>setFormEdit(p=>({...p,origem:v}))} ph="Shanghai, China"/></SF>
                <SF l="Destino"><SI v={formEdit.destino||""} s={v=>setFormEdit(p=>({...p,destino:v}))} ph="Porto de Santos"/></SF>
                <SF l="Previsão de chegada"><input type="date" value={formEdit.previsao_chegada||""} onChange={e=>setFormEdit(p=>({...p,previsao_chegada:e.target.value}))} style={iSty}/></SF>
                <SF l="Valor Invoice (USD)"><SI v={formEdit.valor_invoice||""} s={v=>setFormEdit(p=>({...p,valor_invoice:v}))} ph="0.00"/></SF>
                <SF l="Demurrage (R$)"><SI v={formEdit.demurrage||""} s={v=>setFormEdit(p=>({...p,demurrage:v}))} ph="0.00"/></SF>
                <div style={{gridColumn:"1/-1"}}><SF l="Observações"><textarea value={formEdit.observacoes||""} onChange={e=>setFormEdit(p=>({...p,observacoes:e.target.value}))} rows={2} style={{...iSty,width:"100%",resize:"vertical"}}/></SF></div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:6}}>
                <button onClick={salvarEdicao} disabled={saving} style={{...bsSty,background:VP.grad,color:"#fff",border:"none",padding:"8px 18px",fontWeight:600}}>{saving?"Salvando…":"💾 Salvar"}</button>
                <button onClick={()=>setEditando(false)} style={bsSty}>Cancelar</button>
              </div>
            </SC>
          ):(
            <SC t="Informações do Processo">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                {[["Referência",sel.referencia],["Modal",sel.modal],["Origem",sel.origem],["Destino",sel.destino],["Previsão de chegada",fmtDate(sel.previsao_chegada)],["Valor Invoice",sel.valor_invoice?fmtUSD(sel.valor_invoice):"—"],["Demurrage",fmtBRL(sel.demurrage||0)],["Observações",sel.observacoes]].map(([l,v])=>v?(
                  <div key={l}><div style={{fontSize:9,color:"#9CA3AF",fontWeight:600,marginBottom:1}}>{l}</div><div style={{fontSize:11,fontWeight:500,color:VP.dark}}>{v}</div></div>
                ):null)}
              </div>
            </SC>
          )}

          {/* Timeline */}
          <SC t="📜 Timeline de Atualizações">
            {updates.length===0?<Vazio txt="Nenhuma atualização registrada"/>:updates.map((u,i)=>(
              <div key={u.id} style={{display:"flex",gap:9}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:11,height:11,borderRadius:"50%",background:STATUS_COR[u.status]||VP.azul,flexShrink:0,marginTop:2,border:"2px solid #fff",boxShadow:`0 0 0 2px ${STATUS_COR[u.status]||VP.azul}30`}}/>
                  {i<updates.length-1&&<div style={{width:2,flex:1,background:"#F1F5F9",margin:"3px 0"}}/>}
                </div>
                <div style={{flex:1,paddingBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <SBadge s={u.status}/>
                    <span style={{fontSize:9,color:"#9CA3AF"}}>{fmtDT(u.criado_em)} · {u.autor}</span>
                  </div>
                  <div style={{fontSize:11,color:"#475569",lineHeight:1.6,background:"#F9FAFB",padding:"7px 10px",borderRadius:7,border:"1px solid #F1F5F9"}}>{u.texto}</div>
                </div>
              </div>
            ))}
          </SC>
        </div>

        {/* Coluna direita */}
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {/* Status atual com badge */}
          <div style={{background:"#fff",borderRadius:11,padding:"14px 16px",border:"1px solid #E5E7EB",boxShadow:"0 2px 8px rgba(0,74,247,.04)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>Status Atual</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:9,background:STATUS_COR[sel.status]||VP.cinza,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{STATUS_ICONE[sel.status]||"●"}</div>
              <div>
                <div style={{fontWeight:800,fontSize:13,color:VP.dark}}>{sel.status}</div>
                {PROXIMO_STATUS[sel.status]&&<div style={{fontSize:9,color:"#9CA3AF"}}>Próximo: {PROXIMO_STATUS[sel.status]}</div>}
              </div>
            </div>
            {PROXIMO_STATUS[sel.status]&&(
              <button onClick={()=>avancarStatus(sel,PROXIMO_STATUS[sel.status])} style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${STATUS_COR[PROXIMO_STATUS[sel.status]]}50`,background:`${STATUS_COR[PROXIMO_STATUS[sel.status]]}12`,color:STATUS_COR[PROXIMO_STATUS[sel.status]],cursor:"pointer",fontSize:11,fontWeight:700}}>
                {STATUS_ICONE[PROXIMO_STATUS[sel.status]]} Avançar → {PROXIMO_STATUS[sel.status]}
              </button>
            )}
          </div>

          {/* Registrar atualização */}
          <SC t="💬 Registrar Atualização">
            <SF l="Status">
              <select value={novoStatus} onChange={e=>setNovoStatus(e.target.value)} style={iSty}>
                {STATUS_AGENDA.map(s=><option key={s} value={s}>{STATUS_ICONE[s]} {s}</option>)}
              </select>
            </SF>
            <SF l="Descrição">
              <textarea value={novoUpd} onChange={e=>setNovoUpd(e.target.value)} rows={4} placeholder="Descreva a atualização..." style={{...iSty,resize:"vertical",lineHeight:1.5}}/>
            </SF>
            <BG onClick={addUpdate} disabled={!novoUpd.trim()||saving}>{saving?"Salvando…":"Registrar"}</BG>
          </SC>

          {/* Cliente */}
          {(()=>{const cl=clientes.find(c=>c.id===sel.cliente_id);return cl?(<SC t="🏢 Cliente"><div style={{fontWeight:700,fontSize:12,color:VP.dark,marginBottom:2}}>{cl.nome}</div><div style={{fontSize:10,color:"#6B7280"}}>{cl.cnpj}</div>{cl.whatsapp&&<a href={`https://wa.me/55${cl.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:"#10B981",textDecoration:"none",marginTop:6,fontWeight:600,background:"#F0FDF4",padding:"5px 10px",borderRadius:7,border:"1px solid #86EFAC"}}>📱 WhatsApp</a>}</SC>):null;})()}
        </div>
      </div>
    </div>
  );

  // ── KANBAN ──
  return(
    <div style={{animation:"fi .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{fontSize:19,fontWeight:800,color:VP.dark,margin:0}}>Agenda de Importação</h1>
          <p style={{fontSize:10,color:"#9CA3AF",marginTop:2}}>{agenda.length} processo(s) · Arraste os cartões para mudar o status</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar processo..." style={{...iSty,width:200,padding:"7px 10px"}}/>
          <button onClick={()=>setView("novo")} style={{padding:"9px 16px",borderRadius:9,border:"none",cursor:"pointer",background:VP.grad,color:"#fff",fontSize:12,fontWeight:700,boxShadow:"0 4px 12px rgba(0,74,247,.22)",whiteSpace:"nowrap"}}>+ Nova Importação</button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{overflowX:"auto",paddingBottom:12}}>
        <div style={{display:"flex",gap:10,minWidth:"max-content",alignItems:"flex-start"}}>
          {STATUS_AGENDA.map(status=>{
            const itens=itensKanban.filter(a=>a.status===status);
            const cor=STATUS_COR[status];
            const isDragOver=dragOver===status;
            return(
              <div key={status}
                onDragOver={e=>onDragOver(e,status)}
                onDrop={e=>onDrop(e,status)}
                style={{
                  width:200,flexShrink:0,
                  background:isDragOver?`${cor}08`:"#F1F5F9",
                  borderRadius:12,
                  border:`2px solid ${isDragOver?cor:"transparent"}`,
                  transition:"all .15s",
                  minHeight:120
                }}>
                {/* Header da coluna */}
                <div style={{padding:"10px 12px",borderRadius:"10px 10px 0 0",background:isDragOver?`${cor}15`:"#E2E8F0"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:14}}>{STATUS_ICONE[status]}</span>
                      <span style={{fontSize:11,fontWeight:700,color:VP.dark,lineHeight:1.2}}>{status}</span>
                    </div>
                    <span style={{background:cor,color:"#fff",borderRadius:20,fontSize:9,fontWeight:700,padding:"2px 7px",minWidth:18,textAlign:"center"}}>{itens.length}</span>
                  </div>
                </div>

                {/* Cartões */}
                <div style={{padding:"8px",display:"flex",flexDirection:"column",gap:7,minHeight:80}}>
                  {itens.map(a=>{
                    const atrasado=a.previsao_chegada&&a.previsao_chegada<hoje_str&&!["Entregue","Cancelado"].includes(a.status);
                    return(
                      <div key={a.id}
                        draggable
                        onDragStart={e=>onDragStart(e,a)}
                        onDragEnd={onDragEnd}
                        onClick={()=>verDetalhe(a)}
                        style={{
                          background:"#fff",
                          borderRadius:9,
                          padding:"10px 12px",
                          border:`1px solid ${atrasado?"#FCA5A5":"#E5E7EB"}`,
                          cursor:"grab",
                          boxShadow:dragItem?.id===a.id?"0 8px 24px rgba(0,0,0,.15)":"0 1px 3px rgba(0,0,0,.06)",
                          opacity:dragItem?.id===a.id?.5:1,
                          transform:dragItem?.id===a.id?"rotate(2deg)":"none",
                          transition:"box-shadow .15s, opacity .15s",
                          borderLeft:`3px solid ${cor}`
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,74,247,.12)";e.currentTarget.style.borderColor=cor;}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.06)";e.currentTarget.style.borderColor=atrasado?"#FCA5A5":"#E5E7EB";}}>
                        {/* Título */}
                        <div style={{fontSize:11,fontWeight:700,color:VP.dark,marginBottom:4,lineHeight:1.3}}>{a.titulo}</div>
                        {/* Cliente */}
                        {a.cliente_nome&&<div style={{fontSize:9,color:"#6B7280",marginBottom:4,display:"flex",alignItems:"center",gap:3}}>🏢 {a.cliente_nome}</div>}
                        {/* Referência */}
                        {a.referencia&&<div style={{fontSize:9,color:"#9CA3AF",marginBottom:4}}>#{a.referencia}</div>}
                        {/* Valor Invoice */}
                        {a.valor_invoice>0&&<div style={{fontSize:9,fontWeight:600,color:VP.azul,marginBottom:4}}>{fmtUSD(a.valor_invoice)}</div>}
                        {/* Previsão */}
                        {a.previsao_chegada&&<div style={{fontSize:9,color:atrasado?"#EF4444":"#9CA3AF",fontWeight:atrasado?600:400,marginBottom:4,display:"flex",alignItems:"center",gap:3}}>
                          {atrasado?"⚠":"📅"} {fmtDate(a.previsao_chegada)}{atrasado?" (atrasado)":""}
                        </div>}
                        {/* Demurrage */}
                        {a.demurrage>0&&<div style={{fontSize:9,color:"#EF4444",fontWeight:600,marginBottom:4}}>💸 Demurrage: {fmtBRL(a.demurrage)}</div>}
                        {/* Botão avançar */}
                        {PROXIMO_STATUS[a.status]&&(
                          <button onClick={e=>{e.stopPropagation();avancarStatus(a,PROXIMO_STATUS[a.status]);}} style={{marginTop:4,width:"100%",padding:"4px",borderRadius:6,border:`1px solid ${STATUS_COR[PROXIMO_STATUS[a.status]]}40`,background:`${STATUS_COR[PROXIMO_STATUS[a.status]]}10`,color:STATUS_COR[PROXIMO_STATUS[a.status]],cursor:"pointer",fontSize:8.5,fontWeight:600}}>
                            → {PROXIMO_STATUS[a.status]}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {/* Drop zone vazia */}
                  {itens.length===0&&<div style={{padding:"16px 8px",textAlign:"center",color:"#CBD5E1",fontSize:10,border:`2px dashed ${isDragOver?cor:"#E2E8F0"}`,borderRadius:8,transition:"all .15s"}}>{isDragOver?"Soltar aqui":"Vazio"}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NovaImp({clientes,sessao,onSalvar,onVoltar}){
  const[f,setF]=useState({titulo:"",referencia:"",cliente_id:"",modal:"Marítimo",origem:"",destino:"",previsao_chegada:"",valor_invoice:"",observacoes:"",status:"Em Produção",demurrage:"0"});
  const[saving,setSaving]=useState(false);const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  async function salvar(){if(!f.titulo)return;setSaving(true);try{const cl=clientes.find(c=>c.id===f.cliente_id);const i=await db.insert("agenda",{...f,empresa_id:sessao.empresaId,cliente_nome:cl?.nome||"",valor_invoice:parseFloat(f.valor_invoice||0)||null,previsao_chegada:f.previsao_chegada||null,demurrage:parseFloat(f.demurrage||0)});onSalvar(i);}catch{alert("Erro.");}setSaving(false);}
  return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={onVoltar}>← Kanban</BS><PH titulo="Nova Importação" sub="Cadastrar novo processo na agenda Kanban"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Título *"><SI v={f.titulo} s={v=>upd("titulo",v)} ph="Ex: Câmeras IP — China Jun/2026"/></SF>
          <SF l="Referência"><SI v={f.referencia} s={v=>upd("referencia",v)} ph="INV-2026-001"/></SF>
          <SF l="Cliente"><select value={f.cliente_id} onChange={e=>upd("cliente_id",e.target.value)} style={iSty}><option value="">— Selecionar —</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></SF>
          <SF l="Status inicial">
            <select value={f.status} onChange={e=>upd("status",e.target.value)} style={iSty}>
              {STATUS_AGENDA.map(s=><option key={s} value={s}>{STATUS_ICONE[s]} {s}</option>)}
            </select>
          </SF>
        </SC>
        <SC t="Logística e Valores">
          <SF l="Modal"><select value={f.modal} onChange={e=>upd("modal",e.target.value)} style={iSty}>{["Marítimo","Aéreo","Rodoviário","Ferroviário"].map(m=><option key={m} value={m}>{m}</option>)}</select></SF>
          <SF l="Origem"><SI v={f.origem} s={v=>upd("origem",v)} ph="Shanghai, China"/></SF>
          <SF l="Destino"><SI v={f.destino} s={v=>upd("destino",v)} ph="Porto de Santos"/></SF>
          <SF l="Previsão de chegada"><input type="date" value={f.previsao_chegada} onChange={e=>upd("previsao_chegada",e.target.value)} style={iSty}/></SF>
          <SF l="Valor Invoice (USD)"><SI v={f.valor_invoice} s={v=>upd("valor_invoice",v)} ph="0.00"/></SF>
          <SF l="Demurrage (R$)"><SI v={f.demurrage} s={v=>upd("demurrage",v)} ph="0.00"/></SF>
        </SC>
        <div style={{gridColumn:"1/-1"}}><SC t="Observações"><textarea value={f.observacoes} onChange={e=>upd("observacoes",e.target.value)} rows={2} style={{...iSty,width:"100%",resize:"vertical"}}/></SC></div>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!f.titulo||saving}>{saving?"Salvando…":"Cadastrar na Agenda"}</BG></div>
    </div>
  );
}

function Usuarios({sessao}){
  const[users,setUsers]=useState([]);const[load,setLoad]=useState(true);const[mostra,setMostra]=useState(false);
  const[novo,setNovo]=useState({nome:"",email:"",senha:"",perfil:"operador"});const[saving,setSaving]=useState(false);
  useEffect(()=>{db.get("usuarios",{empresa_id:sessao.empresaId}).then(u=>{setUsers(u||[]);setLoad(false);}).catch(()=>setLoad(false));},[]);
  async function adicionar(){if(!novo.nome||!novo.email||!novo.senha)return;setSaving(true);try{const ex=await db.getOne("usuarios",{email:novo.email});if(ex){alert("Email já cadastrado.");setSaving(false);return;}const u=await db.insert("usuarios",{...novo,empresa_id:sessao.empresaId,ativo:true});setUsers(p=>[...p,u]);setNovo({nome:"",email:"",senha:"",perfil:"operador"});setMostra(false);}catch{alert("Erro.");}setSaving(false);}
  async function toggle(u){try{await db.update("usuarios",u.id,{ativo:!u.ativo});setUsers(p=>p.map(x=>x.id===u.id?{...x,ativo:!x.ativo}:x));}catch{alert("Erro.");}}
  return(
    <div className="card">
      <PH titulo="Usuários" sub={`${users.length} usuário(s)`}><BG onClick={()=>setMostra(v=>!v)}>+ Novo Usuário</BG></PH>
      {mostra&&<div style={{marginBottom:12}}><SC t="Novo Usuário"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9,marginBottom:9}}>
        <div><SL c="Nome"/><SI v={novo.nome} s={v=>setNovo(p=>({...p,nome:v}))} ph="Nome"/></div>
        <div><SL c="Email"/><SI v={novo.email} s={v=>setNovo(p=>({...p,email:v}))} ph="email@empresa.com"/></div>
        <div><SL c="Senha"/><SI v={novo.senha} s={v=>setNovo(p=>({...p,senha:v}))} ph="Senha" tp="password"/></div>
        <div><SL c="Perfil"/><select value={novo.perfil} onChange={e=>setNovo(p=>({...p,perfil:e.target.value}))} style={iSty}>{["admin","operador"].map(p=><option key={p} value={p}>{p}</option>)}</select></div>
      </div><BG onClick={adicionar} disabled={saving}>{saving?"Criando…":"Criar Usuário"}</BG></SC></div>}
      {load?<Spin/>:users.map(u=>(
        <div key={u.id} style={{padding:"9px 12px",borderRadius:9,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
          <div style={{width:32,height:32,borderRadius:8,background:VP.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>{u.nome.charAt(0)}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:VP.dark}}>{u.nome}{u.id===sessao.userId&&<span style={{fontSize:8,color:VP.azul,marginLeft:4}}>(você)</span>}</div><div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>{u.email} · {u.perfil}</div></div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:9,padding:"2px 8px",borderRadius:20,fontWeight:600,background:u.ativo?"#F0FDF4":"#FEF2F2",color:u.ativo?"#16A34A":"#DC2626",border:`1px solid ${u.ativo?"#86EFAC":"#FCA5A5"}`}}>{u.ativo?"Ativo":"Inativo"}</span>
            {u.id!==sessao.userId&&<button onClick={()=>toggle(u)} style={bsSty}>{u.ativo?"Desativar":"Ativar"}</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════
// CADASTRO NCM
// ══════════════════════════════════════════════════
function CadNCM({sessao}){
  const[items,setItems]=useState([]);const[load,setLoad]=useState(true);
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);const[busca,setBusca]=useState("");
  const vazio={codigo_ncm:"",descricao:"",aliquota_ii:0,aliquota_ipi:0,aliquota_pis:2.10,aliquota_cofins:9.65,possui_ex_tarifario:false,ex_tarifario_codigo:"",ex_tarifario_aliq:"",unidade_medida:"UN",observacoes:"",ativo:true};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const[orgaos,setOrgaos]=useState([]);
  useEffect(()=>{
    Promise.all([
      db.get("ncm",{empresa_id:sessao.empresaId}),
    ]).then(([n])=>{setItems(n||[]);}).catch(()=>{}).finally(()=>setLoad(false));
  },[]);
  const filtrado=items.filter(x=>!busca||x.codigo_ncm?.includes(busca)||x.descricao?.toLowerCase().includes(busca.toLowerCase()));
  function abrir(x){setEdit(x||null);setForm(x?{...vazio,...x}:vazio);if(x?.id)db.get("tratamento_administrativo",{ncm_id:x.id}).then(r=>setOrgaos(r||[])).catch(()=>setOrgaos([]));else setOrgaos([]);setView("form");}
  async function salvar(){if(!form.codigo_ncm||!form.descricao)return;setSaving(true);
    try{const dados={...form,empresa_id:sessao.empresaId,aliquota_ii:parseFloat(form.aliquota_ii||0),aliquota_ipi:parseFloat(form.aliquota_ipi||0),aliquota_pis:parseFloat(form.aliquota_pis||2.1),aliquota_cofins:parseFloat(form.aliquota_cofins||9.65),ex_tarifario_aliq:parseFloat(form.ex_tarifario_aliq||0)||null};
    if(edit){const a=await db.update("ncm",edit.id,dados);setItems(p=>p.map(x=>x.id===edit.id?a:x));}
    else{const n=await db.insert("ncm",dados);setItems(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  async function excluir(id){if(!window.confirm("Excluir NCM?"))return;try{await db.delete("ncm",id);setItems(p=>p.filter(x=>x.id!==id));}catch{alert("Erro.");}}
  async function addOrgao(ncmId){
    const org=window.prompt("Órgão anuente (ANVISA, MAPA, INMETRO, ANATEL, EXÉRCITO, SDA, DPF...):");
    if(!org)return;
    const tipo=window.prompt("Tipo de documento exigido (ex: Registro, Licença, Certificado):")
    try{const n=await db.insert("tratamento_administrativo",{empresa_id:sessao.empresaId,ncm_id:ncmId,orgao_anuente:org.trim().toUpperCase(),tipo_documento:tipo||"",obrigatorio:true});setOrgaos(p=>[...p,n]);}catch(e){alert("Erro: "+e.message);}
  }
  async function remOrgao(id){try{await db.delete("tratamento_administrativo",id);setOrgaos(p=>p.filter(x=>x.id!==id));}catch{alert("Erro.");}}

  const COR_ORGAO={"ANVISA":"#EF4444","MAPA":"#22C55E","INMETRO":"#3B82F6","ANATEL":"#8B5CF6","EXÉRCITO":"#F59E0B","SDA":"#10B981","DPF":"#64748b"};

  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar NCM":"Novo NCM"} sub="Nomenclatura Comum do Mercosul — alíquotas e órgãos anuentes"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Código NCM *"><SI v={form.codigo_ncm||""} s={v=>upd("codigo_ncm",v)} ph="8525.80.19"/></SF>
          <SF l="Descrição TEC *"><SI v={form.descricao||""} s={v=>upd("descricao",v)} ph="Câmeras de televisão, câmeras digitais..."/></SF>
          <SF l="Unidade de medida"><select value={form.unidade_medida||"UN"} onChange={e=>upd("unidade_medida",e.target.value)} style={iSty}>{["UN","KG","M2","M3","M","L","PAR","CX"].map(u=><option key={u} value={u}>{u}</option>)}</select></SF>
          <SF l="Observações"><SI v={form.observacoes||""} s={v=>upd("observacoes",v)} ph="Observações gerais"/></SF>
        </SC>
        <SC t="Alíquotas de Importação (%)">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <SF l="II — Imposto de Importação"><SI v={String(form.aliquota_ii||0)} s={v=>upd("aliquota_ii",v)} ph="0.00"/></SF>
            <SF l="IPI"><SI v={String(form.aliquota_ipi||0)} s={v=>upd("aliquota_ipi",v)} ph="0.00"/></SF>
            <SF l="PIS (padrão 2,10%)"><SI v={String(form.aliquota_pis||2.10)} s={v=>upd("aliquota_pis",v)} ph="2.10"/></SF>
            <SF l="COFINS (padrão 9,65%)"><SI v={String(form.aliquota_cofins||9.65)} s={v=>upd("aliquota_cofins",v)} ph="9.65"/></SF>
          </div>
          <div style={{padding:"7px 10px",borderRadius:7,background:"#F2F7FF",border:`1px solid ${VP.azul}18`,fontSize:10,color:"#64748b",marginTop:4}}>
            PIS e COFINS padrão Lei 10.865/2004. Altere apenas para NCMs com alíquotas diferenciadas (monofásicos, ex-tarifário, etc.)
          </div>
        </SC>
        <SC t="Ex-Tarifário">
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,fontWeight:600,color:form.possui_ex_tarifario?VP.azul:"#64748b",marginBottom:8}}>
            <input type="checkbox" checked={!!form.possui_ex_tarifario} onChange={e=>upd("possui_ex_tarifario",e.target.checked)} style={{accentColor:VP.azul,width:14,height:14}}/>
            Possui Ex-Tarifário (redução do II)
          </label>
          {form.possui_ex_tarifario&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <SF l="Código do Ex-tarifário"><SI v={form.ex_tarifario_codigo||""} s={v=>upd("ex_tarifario_codigo",v)} ph="Ex: EX-001"/></SF>
            <SF l="Alíquota com Ex (%)"><SI v={String(form.ex_tarifario_aliq||"")} s={v=>upd("ex_tarifario_aliq",v)} ph="0.00"/></SF>
          </div>}
        </SC>
        {edit&&<SC t="Órgãos Anuentes (Tratamento Administrativo)">
          <div style={{fontSize:10,color:"#64748b",marginBottom:8}}>Órgãos que exigem licenciamento/registro para importação deste NCM.</div>
          {orgaos.map(o=>(
            <div key={o.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:7,background:"#F9FAFB",border:"1px solid #E5E7EB",marginBottom:5}}>
              <span style={{padding:"2px 8px",borderRadius:20,fontSize:9,fontWeight:700,background:`${COR_ORGAO[o.orgao_anuente]||"#64748b"}18`,color:COR_ORGAO[o.orgao_anuente]||"#64748b"}}>{o.orgao_anuente}</span>
              <span style={{flex:1,fontSize:10,color:"#6B7280"}}>{o.tipo_documento||"—"}</span>
              <button onClick={()=>remOrgao(o.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5",fontSize:9}}>✕</button>
            </div>
          ))}
          <button onClick={()=>addOrgao(edit.id)} style={{...bsSty,marginTop:4,border:`1px dashed ${VP.azul}40`,color:VP.azul,fontSize:10}}>+ Adicionar Órgão Anuente</button>
        </SC>}
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.codigo_ncm||!form.descricao||saving}>{saving?"Salvando…":"Salvar NCM"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="📑 Tabela NCM" sub={`${items.length} NCM(s) cadastrado(s)`}><BG onClick={()=>abrir(null)}>+ Novo NCM</BG></PH>
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por código ou descrição..." style={{...iSty,maxWidth:400,marginBottom:13}}/>
      {load?<Spin/>:filtrado.length===0?<Vazio txt="Nenhum NCM cadastrado. Adicione os NCMs dos seus produtos."/>:filtrado.map(x=>(
        <div key={x.id} style={{padding:"10px 13px",borderRadius:9,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
          <div style={{padding:"5px 10px",borderRadius:7,background:`${VP.azul}12`,color:VP.azul,fontWeight:800,fontSize:11,flexShrink:0,minWidth:85,textAlign:"center"}}>{x.codigo_ncm}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:11,color:VP.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.descricao}</div>
            <div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>
              II: {x.aliquota_ii}% · IPI: {x.aliquota_ipi}% · PIS: {x.aliquota_pis}% · COFINS: {x.aliquota_cofins}%
              {x.possui_ex_tarifario&&<span style={{marginLeft:5,color:"#10B981",fontWeight:600}}>✓ Ex-Tarifário {x.ex_tarifario_aliq}%</span>}
            </div>
          </div>
          <button onClick={()=>abrir(x)} style={bsSty}>Editar</button>
          <button onClick={()=>excluir(x.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════
// CADASTRO MOEDAS
// ══════════════════════════════════════════════════
function CadMoedas(){
  const MOEDAS_PADRAO=[
    {codigo:"USD",nome:"Dólar Americano",simbolo:"$",ativo:true},
    {codigo:"EUR",nome:"Euro",simbolo:"€",ativo:true},
    {codigo:"CNY",nome:"Yuan Chinês / Renminbi",simbolo:"¥",ativo:true},
    {codigo:"GBP",nome:"Libra Esterlina",simbolo:"£",ativo:true},
    {codigo:"JPY",nome:"Iene Japonês",simbolo:"¥",ativo:true},
    {codigo:"AUD",nome:"Dólar Australiano",simbolo:"A$",ativo:true},
    {codigo:"CAD",nome:"Dólar Canadense",simbolo:"C$",ativo:true},
    {codigo:"CHF",nome:"Franco Suíço",simbolo:"Fr",ativo:true},
    {codigo:"BRL",nome:"Real Brasileiro",simbolo:"R$",ativo:true},
  ];
  const[cotacoes,setCotacoes]=useState({});const[loadC,setLoadC]=useState(false);
  async function buscarTodas(){
    setLoadC(true);
    const pares=["USD-BRL","EUR-BRL","CNY-BRL","GBP-BRL","JPY-BRL","AUD-BRL","CAD-BRL","CHF-BRL"];
    try{
      const r=await fetch("https://economia.awesomeapi.com.br/json/last/"+pares.join(","),{signal:AbortSignal.timeout(7000)});
      const j=await r.json();
      const novo={};Object.entries(j).forEach(([k,v])=>{novo[k.slice(0,3)]=parseFloat(v.bid);});
      novo["BRL"]=1;setCotacoes(novo);
    }catch(e){alert("Erro ao buscar cotações: "+e.message);}
    setLoadC(false);
  }
  return(
    <div className="card">
      <PH titulo="💵 Moedas e Cotações" sub="Moedas disponíveis para simulação e processos">
        <button onClick={buscarTodas} disabled={loadC} style={{...bsSty,background:VP.grad,color:"#fff",border:"none",padding:"8px 16px",fontWeight:600,fontSize:12}}>{loadC?"Buscando…":"🔄 Atualizar Cotações"}</button>
      </PH>
      <div style={{padding:"8px 12px",borderRadius:8,background:"#EFF6FF",border:`1px solid ${VP.azul}25`,fontSize:10,color:"#3730a3",marginBottom:13}}>
        ℹ️ As cotações são buscadas em tempo real via AwesomeAPI (Banco Central). Use no Simulador selecionando a moeda antes de clicar em "Buscar Cotação".
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {MOEDAS_PADRAO.map(m=>(
          <div key={m.codigo} style={{padding:"14px 16px",borderRadius:11,background:"#fff",border:"1px solid #E5E7EB",boxShadow:"0 2px 7px rgba(0,74,247,.04)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontWeight:800,fontSize:18,color:VP.azul}}>{m.simbolo}</div>
              <div style={{padding:"2px 8px",borderRadius:20,background:`${VP.azul}12`,color:VP.azul,fontSize:10,fontWeight:700}}>{m.codigo}</div>
            </div>
            <div style={{fontSize:11,fontWeight:600,color:VP.dark,marginBottom:2}}>{m.nome}</div>
            {cotacoes[m.codigo]?(
              <div style={{fontSize:13,fontWeight:800,color:"#10B981",marginTop:4}}>
                R$ {cotacoes[m.codigo].toFixed(4)}
                <span style={{fontSize:8,color:"#9CA3AF",fontWeight:400,marginLeft:4}}>por {m.codigo}</span>
              </div>
            ):<div style={{fontSize:10,color:"#9CA3AF",marginTop:4}}>Clique em Atualizar Cotações</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// CADASTRO BANCOS
// ══════════════════════════════════════════════════
function CadBancos({sessao}){
  const[items,setItems]=useState([]);const[load,setLoad]=useState(true);
  const[view,setView]=useState("lista");const[edit,setEdit]=useState(null);const[saving,setSaving]=useState(false);const[filtro,setFiltro]=useState("todos");
  const vazio={nome:"",agencia:"",conta:"",swift:"",iban:"",pais:"Brasil",moeda:"BRL",tipo:"proprio",observacoes:"",ativo:true};
  const[form,setForm]=useState(vazio);const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  useEffect(()=>{db.get("bancos",{empresa_id:sessao.empresaId}).then(r=>setItems(r||[])).catch(()=>{}).finally(()=>setLoad(false));},[]);
  const filtrado=items.filter(x=>filtro==="todos"||x.tipo===filtro);
  function abrir(x){setEdit(x||null);setForm(x?{...vazio,...x}:vazio);setView("form");}
  async function excluir(id){if(!window.confirm("Excluir banco?"))return;try{await db.delete("bancos",id);setItems(p=>p.filter(x=>x.id!==id));}catch{alert("Erro.");}}
  async function salvar(){if(!form.nome)return;setSaving(true);
    try{const dados={...form,empresa_id:sessao.empresaId};
    if(edit){const a=await db.update("bancos",edit.id,dados);setItems(p=>p.map(x=>x.id===edit.id?a:x));}
    else{const n=await db.insert("bancos",dados);setItems(p=>[n,...p]);}setView("lista");}catch(e){alert("Erro: "+e.message);}setSaving(false);}
  const TIPO_COR={proprio:VP.azul,correspondente:"#8B5CF6",beneficiario:"#10B981"};
  const TIPO_LABEL={proprio:"Banco Próprio",correspondente:"Banco Correspondente",beneficiario:"Banco do Beneficiário"};
  if(view==="form")return(
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><BS onClick={()=>setView("lista")}>← Voltar</BS><PH titulo={edit?"Editar Banco":"Novo Banco"} sub="Bancos próprios, correspondentes e beneficiários estrangeiros"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <SC t="Identificação">
          <SF l="Nome do Banco *"><SI v={form.nome||""} s={v=>upd("nome",v)} ph="Ex: Banco do Brasil, Citibank, Bank of China"/></SF>
          <SF l="Tipo"><select value={form.tipo||"proprio"} onChange={e=>upd("tipo",e.target.value)} style={iSty}><option value="proprio">Banco Próprio (da empresa)</option><option value="correspondente">Banco Correspondente (no exterior)</option><option value="beneficiario">Banco do Beneficiário (fornecedor)</option></select></SF>
          <SF l="País"><SI v={form.pais||""} s={v=>upd("pais",v)} ph="Brasil, China, EUA..."/></SF>
          <SF l="Moeda principal"><select value={form.moeda||"BRL"} onChange={e=>upd("moeda",e.target.value)} style={iSty}>{["BRL","USD","EUR","CNY","GBP","JPY","AUD","CHF"].map(m=><option key={m} value={m}>{m}</option>)}</select></SF>
        </SC>
        <SC t="Dados Bancários">
          <SF l="Agência"><SI v={form.agencia||""} s={v=>upd("agencia",v)} ph="0001-5"/></SF>
          <SF l="Conta"><SI v={form.conta||""} s={v=>upd("conta",v)} ph="00012345-6"/></SF>
          <SF l="SWIFT / BIC (obrigatório para transferências internacionais)"><SI v={form.swift||""} s={v=>upd("swift",v)} ph="BRASBRRJXXX"/></SF>
          <SF l="IBAN (Europa e alguns países)"><SI v={form.iban||""} s={v=>upd("iban",v)} ph="DE89 3704 0044 0532 0130 00"/></SF>
        </SC>
        <div style={{gridColumn:"1/-1"}}><SC t="Observações"><textarea value={form.observacoes||""} onChange={e=>upd("observacoes",e.target.value)} rows={2} placeholder="Contato gerente, instruções especiais para wire transfer..." style={{...iSty,width:"100%",resize:"vertical"}}/></SC></div>
      </div>
      <div style={{marginTop:12}}><BG onClick={salvar} disabled={!form.nome||saving}>{saving?"Salvando…":"Salvar Banco"}</BG></div>
    </div>
  );
  return(
    <div className="card">
      <PH titulo="🏦 Bancos" sub={`${items.length} banco(s) cadastrado(s)`}><BG onClick={()=>abrir(null)}>+ Novo Banco</BG></PH>
      <div style={{display:"flex",gap:5,marginBottom:13}}>
        {[["todos","Todos"],["proprio","Próprios"],["correspondente","Correspondentes"],["beneficiario","Beneficiários"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFiltro(v)} style={{...bsSty,background:filtro===v?VP.grad:"#fff",color:filtro===v?"#fff":"#64748b",border:filtro===v?"none":"1px solid #D1D5DB",fontSize:10}}>{l}</button>
        ))}
      </div>
      {load?<Spin/>:filtrado.length===0?<Vazio txt="Nenhum banco cadastrado"/>:filtrado.map(x=>(
        <div key={x.id} style={{padding:"11px 14px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:38,height:38,borderRadius:9,background:`${TIPO_COR[x.tipo]||VP.azul}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏦</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{fontWeight:700,fontSize:12,color:VP.dark}}>{x.nome}</div>
              <span style={{padding:"1px 7px",borderRadius:20,fontSize:9,fontWeight:700,background:`${TIPO_COR[x.tipo]||VP.azul}15`,color:TIPO_COR[x.tipo]||VP.azul}}>{TIPO_LABEL[x.tipo]||x.tipo}</span>
            </div>
            <div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>
              🌍 {x.pais} · {x.moeda}
              {x.agencia&&` · Ag: ${x.agencia}`}
              {x.conta&&` · Cc: ${x.conta}`}
              {x.swift&&<span style={{marginLeft:5,fontWeight:600,color:"#6B7280"}}>SWIFT: {x.swift}</span>}
              {x.iban&&<span style={{marginLeft:5,fontWeight:600,color:"#6B7280"}}>IBAN: {x.iban.slice(0,12)}...</span>}
            </div>
          </div>
          <button onClick={()=>abrir(x)} style={bsSty}>Editar</button>
          <button onClick={()=>excluir(x.id)} style={{...bsSty,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FCA5A5"}}>✕</button>
        </div>
      ))}
    </div>
  );
}
