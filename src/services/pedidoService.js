import AppError from '../errors/AppError.js';
import { transacao } from '../database/connection.js';
import * as pedidoRepository from '../repositories/pedidoRepository.js';
import * as discoRepository from '../repositories/discoRepository.js';

const STATUS_VALIDOS = ['pendente', 'pago', 'enviado', 'entregue'];
const STATUS_COM_ESTOQUE_RESERVADO = ['pendente', 'pago', 'enviado'];

function validarQuantidade(quantidade) {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new AppError(400, 'Quantidade deve ser um número inteiro maior que zero');
  }
}

function calcularTotal(preco, quantidade) {
  return Math.round(preco * quantidade * 100) / 100;
}

// 404 se não existe, 403 se não é do usuário logado
function buscarDoDono(id, usuarioId) {
  const pedido = pedidoRepository.findById(id);
  if (!pedido) {
    throw new AppError(404, 'Pedido não encontrado');
  }
  if (pedido.usuarioId !== usuarioId) {
    throw new AppError(403, 'Sem permissão');
  }
  return pedido;
}

export function listar(usuarioId) {
  return pedidoRepository.findAllByUsuario(usuarioId);
}

export function detalhar(id, usuarioId) {
  return buscarDoDono(id, usuarioId);
}

export function cadastrar(dados, usuarioId) {
  if (!Number.isInteger(dados?.discoId)) {
    throw new AppError(400, 'Campo obrigatório ausente: discoId');
  }
  validarQuantidade(dados.quantidade);

  const disco = discoRepository.findById(dados.discoId);
  if (!disco) {
    throw new AppError(400, 'Disco não encontrado');
  }
  if (disco.estoque < dados.quantidade) {
    throw new AppError(400, 'Estoque insuficiente');
  }

  return transacao(() => {
    discoRepository.ajustarEstoque(disco.id, -dados.quantidade);
    return pedidoRepository.create({
      discoId: disco.id,
      quantidade: dados.quantidade,
      valorTotal: calcularTotal(disco.preco, dados.quantidade),
      usuarioId,
    });
  });
}

export function editar(id, dados, usuarioId) {
  const pedido = buscarDoDono(id, usuarioId);
  if (pedido.status !== 'pendente') {
    throw new AppError(400, 'Só é possível editar pedidos pendentes');
  }
  validarQuantidade(dados?.quantidade);

  const disco = discoRepository.findById(pedido.discoId);
  const diferenca = dados.quantidade - pedido.quantidade;
  if (diferenca > disco.estoque) {
    throw new AppError(400, 'Estoque insuficiente');
  }

  return transacao(() => {
    discoRepository.ajustarEstoque(disco.id, -diferenca);
    return pedidoRepository.updateQuantidade(
      id,
      dados.quantidade,
      calcularTotal(disco.preco, dados.quantidade)
    );
  });
}

export function remover(id, usuarioId) {
  const pedido = buscarDoDono(id, usuarioId);
  transacao(() => {
    if (STATUS_COM_ESTOQUE_RESERVADO.includes(pedido.status)) {
      discoRepository.ajustarEstoque(pedido.discoId, pedido.quantidade);
    }
    pedidoRepository.remove(id);
  });
}

export function mudarStatus(id, dados, usuarioId) {
  const pedido = buscarDoDono(id, usuarioId);
  if (!STATUS_VALIDOS.includes(dados?.status)) {
    throw new AppError(400, `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`);
  }
  if (pedido.status === 'cancelado' || pedido.status === 'devolvido') {
    throw new AppError(400, `Pedido ${pedido.status} não pode mudar de status`);
  }
  return pedidoRepository.updateStatus(id, dados.status);
}

export function cancelar(id, usuarioId) {
  const pedido = buscarDoDono(id, usuarioId);
  if (!['pendente', 'pago'].includes(pedido.status)) {
    throw new AppError(400, 'Só é possível cancelar pedidos pendentes ou pagos');
  }
  return transacao(() => {
    discoRepository.ajustarEstoque(pedido.discoId, pedido.quantidade);
    return pedidoRepository.updateStatus(id, 'cancelado');
  });
}

export function devolver(id, usuarioId) {
  const pedido = buscarDoDono(id, usuarioId);
  if (pedido.status !== 'entregue') {
    throw new AppError(400, 'Só é possível devolver pedidos entregues');
  }
  return transacao(() => {
    discoRepository.ajustarEstoque(pedido.discoId, pedido.quantidade);
    return pedidoRepository.updateStatus(id, 'devolvido');
  });
}
