import * as pedidoService from '../services/pedidoService.js';

export function listar(req, res) {
  res.json(pedidoService.listar(req.usuario.id));
}

export function detalhar(req, res) {
  res.json(pedidoService.detalhar(Number(req.params.id), req.usuario.id));
}

export function cadastrar(req, res) {
  const pedido = pedidoService.cadastrar(req.body, req.usuario.id);
  res.status(201).json(pedido);
}

export function editar(req, res) {
  res.json(pedidoService.editar(Number(req.params.id), req.body, req.usuario.id));
}

export function remover(req, res) {
  pedidoService.remover(Number(req.params.id), req.usuario.id);
  res.status(204).end();
}

export function mudarStatus(req, res) {
  res.json(pedidoService.mudarStatus(Number(req.params.id), req.body, req.usuario.id));
}

export function cancelar(req, res) {
  res.json(pedidoService.cancelar(Number(req.params.id), req.usuario.id));
}

export function devolver(req, res) {
  res.json(pedidoService.devolver(Number(req.params.id), req.usuario.id));
}
