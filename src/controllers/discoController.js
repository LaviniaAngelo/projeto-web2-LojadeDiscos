
import * as discoService from '../services/discoService.js';

export function listar(req, res) {
  res.json(discoService.listar());
}

export function detalhar(req, res) {
  res.json(discoService.detalhar(Number(req.params.id)));
}

export function cadastrar(req, res) {
  const disco = discoService.cadastrar(req.body, req.usuario.id);
  res.status(201).json(disco);
}

export function editar(req, res) {
  res.json(discoService.editar(Number(req.params.id), req.body, req.usuario.id));
}

export function remover(req, res) {
  discoService.remover(Number(req.params.id), req.usuario.id);
  res.status(204).end();
}
