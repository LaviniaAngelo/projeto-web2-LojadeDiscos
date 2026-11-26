import AppError from '../errors/AppError.js';
import * as discoRepository from '../repositories/discoRepository.js';
import * as pedidoRepository from '../repositories/pedidoRepository.js';

const CAMPOS = ['titulo', 'artista', 'genero', 'preco', 'estoque'];

function validate(dados) {
  for (const campo of ['titulo', 'artista', 'genero']) {
    if (typeof dados?.[campo] !== 'string' || dados[campo].trim() === '') {
      throw new AppError(400, `Campo obrigatório ausente: ${campo}`);
    }
  }
  if (typeof dados.preco !== 'number' || !Number.isFinite(dados.preco) || dados.preco <= 0) {
    throw new AppError(400, 'Preço deve ser um número maior que zero');
  }
  if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
    throw new AppError(400, 'Estoque deve ser um número inteiro maior ou igual a zero');
  }
  return {
    titulo: dados.titulo.trim(),
    artista: dados.artista.trim(),
    genero: dados.genero.trim(),
    preco: dados.preco,
    estoque: dados.estoque,
  };
}

// 404 se não existe, 403 se não é do usuário logado
function buscarDoDono(id, usuarioId) {
  const disco = discoRepository.findById(id);
  if (!disco) {
    throw new AppError(404, 'Disco não encontrado');
  }
  if (disco.usuarioId !== usuarioId) {
    throw new AppError(403, 'Sem permissão');
  }
  return disco;
}

export function listar() {
  return discoRepository.findAll();
}

export function detalhar(id) {
  const disco = discoRepository.findById(id);
  if (!disco) {
    throw new AppError(404, 'Disco não encontrado');
  }
  return disco;
}

export function cadastrar(dados, usuarioId) {
  return discoRepository.create({ ...validate(dados), usuarioId });
}

export function editar(id, dados, usuarioId) {
  const atual = buscarDoDono(id, usuarioId);
  const parcial = {};
  for (const campo of CAMPOS) {
    if (dados?.[campo] !== undefined) parcial[campo] = dados[campo];
  }
  return discoRepository.update(id, validate({ ...atual, ...parcial }));
}

export function remover(id, usuarioId) {
  buscarDoDono(id, usuarioId);
  if (pedidoRepository.existePorDisco(id)) {
    throw new AppError(400, 'Disco possui pedidos e não pode ser removido');
  }
  discoRepository.remove(id);
}
