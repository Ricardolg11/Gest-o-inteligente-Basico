// Modelos padronizados (dados fictícios)
var documentos = {
  relatorio: {
    titulo: 'Relatório Clínico',
    protocolo: 'DOC-2026-0001',
    corpo:
      '<h3>Motivo do atendimento</h3>' +
      '<p>Paciente atendida com queixa de dor torácica leve e cansaço aos esforços há 5 dias, sem febre.</p>' +
      '<h3>Histórico</h3>' +
      '<p>Hipertensão arterial controlada com medicação contínua. Sem alergias medicamentosas conhecidas.</p>' +
      '<h3>Exames realizados</h3>' +
      '<ul><li>Eletrocardiograma: ritmo sinusal, sem alterações agudas</li>' +
      '<li>Hemograma e perfil lipídico: dentro dos parâmetros de referência</li></ul>' +
      '<h3>Conduta</h3>' +
      '<p>Mantida a medicação atual, orientação de repouso relativo e retorno em 15 dias para reavaliação.</p>'
  },
  declaracao: {
    titulo: 'Declaração Médica',
    protocolo: 'DOC-2026-0002',
    corpo:
      '<h3>Declaração</h3>' +
      '<p>Declaro, para os devidos fins, que a paciente <strong>Maria Souza Almeida</strong> esteve em atendimento médico nesta instituição na data de emissão deste documento, no período das 08h00 às 10h30.</p>' +
      '<h3>Observação</h3>' +
      '<p>A paciente permanece em acompanhamento ambulatorial. Esta declaração não substitui atestado médico.</p>'
  },
  evolucao: {
    titulo: 'Evolução do Paciente',
    protocolo: 'DOC-2026-0003',
    corpo:
      '<h3>Subjetivo</h3>' +
      '<p>Refere melhora parcial da dor e boa aceitação da dieta. Sem novas queixas.</p>' +
      '<h3>Objetivo</h3>' +
      '<ul><li>Estado geral: bom, corada e hidratada</li>' +
      '<li>PA: 120/80 mmHg · FC: 72 bpm · Sat O₂: 98%</li></ul>' +
      '<h3>Avaliação</h3>' +
      '<p>Evolução clínica favorável, sem sinais de instabilidade.</p>' +
      '<h3>Plano</h3>' +
      '<p>Manter conduta atual e reavaliar em 24 horas.</p>'
  }
};

var docAtual = 'relatorio';
var autorizado = false;

// Elementos
var elTitulo = document.getElementById('docTitulo');
var elCorpo = document.getElementById('docCorpo');
var elProtocolo = document.getElementById('docProtocolo');
var elData = document.getElementById('docData');
var elBadge = document.getElementById('statusBadge');
var elStatusText = document.getElementById('statusText');
var elBtnAutorizar = document.getElementById('btnAutorizar');
var elLog = document.getElementById('logList');
var elToast = document.getElementById('toast');

function agora() {
  return new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function mostrarToast(msg) {
  elToast.textContent = msg;
  elToast.classList.add('show');
  clearTimeout(mostrarToast.t);
  mostrarToast.t = setTimeout(function () {
    elToast.classList.remove('show');
  }, 2200);
}

function registrarLog(acao) {
  var li = document.createElement('li');
  li.innerHTML = '<span>' + acao + '</span><small>' + agora() + ' · ' + documentos[docAtual].titulo + '</small>';
  elLog.insertBefore(li, elLog.firstChild);
}

function atualizarStatus() {
  if (autorizado) {
    elBadge.textContent = 'Acesso autorizado';
    elBadge.className = 'status status-ok';
    elStatusText.textContent = 'O acesso a este documento está liberado para a equipe autorizada.';
    elBtnAutorizar.textContent = 'Revogar acesso';
  } else {
    elBadge.textContent = 'Aguardando autorização';
    elBadge.className = 'status status-pending';
    elStatusText.textContent = 'O acesso ao documento ainda não foi autorizado.';
    elBtnAutorizar.textContent = 'Autorizar acesso';
  }
}

function renderizar() {
  var d = documentos[docAtual];
  elTitulo.textContent = d.titulo;
  elCorpo.innerHTML = d.corpo;
  elProtocolo.textContent = d.protocolo;
  elData.textContent = 'Emitido em ' + agora();
  atualizarStatus();
}

// Abas
document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    docAtual = tab.getAttribute('data-doc');
    autorizado = false;
    renderizar();
    registrarLog('Documento aberto');
  });
});

// Autorizar / revogar
elBtnAutorizar.addEventListener('click', function () {
  autorizado = !autorizado;
  atualizarStatus();
  registrarLog(autorizado ? 'Acesso autorizado' : 'Acesso revogado');
  mostrarToast(autorizado ? 'Acesso autorizado com sucesso' : 'Acesso revogado');
});

// Imprimir
document.getElementById('btnImprimir').addEventListener('click', function () {
  registrarLog('Documento impresso / exportado');
  window.print();
});

// Copiar link (simulado)
document.getElementById('btnCopiar').addEventListener('click', function () {
  var link = 'https://docsaude.exemplo/acesso/' + documentos[docAtual].protocolo;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).catch(function () {});
  }
  registrarLog('Link de acesso copiado');
  mostrarToast('Link de acesso copiado');
});

// Início
renderizar();
registrarLog('Documento criado');
