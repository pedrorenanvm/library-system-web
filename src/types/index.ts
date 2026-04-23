export type TipoUsuario = 'reader' | 'teacher' | 'admin'
export type TipoTitulo = 'book' | 'periodical' | 'loaned' | 'reserved'| 'lost' | 'damaged'
export type StatusCopia = 'available'|'loaned'|'reserved'|'lost'|'damaged'
export type StatusEmprestimo = 'active'| 'returned'|'overdue'|'lost'
export type StatusMulta = 'pending'|'paid'|'waived'
export type StatusPerda = 'pending'|'resolved'
export type StatusAssinatura = 'active'|'expired'|'canceled'


export interface Usuario {
  id: number
  nome: string
  email: string
  tipoUsuario: TipoUsuario
}

export interface Titulo {
  id: number
  nome: string
  tipo: TipoTitulo
  exemplar: number
  maxPeriodoEmp: number
  descricao: string
}

export interface Copia {
  id: number
  idTitulo: number
  barcode: string
  status: StatusCopia
}

export interface Emprestado {
  id: number
  idCopia: number
  idUsuario: number
  emprestadoAte: string
  dataLimite: string
  retornadoAte: string | null
  status: StatusEmprestimo
}

export interface Multa {
  id: number
  idEmprestimo: number
  diasDeAtraso: number
  quantidade: number
  status: StatusMulta
}

export interface Perda {
  id: number
  idCopia: number
  idUsuario: number
  taxaCobrada: number
  resolvido: boolean
  statusPerda: StatusPerda
}

export interface Assinatura {
  id: number
  idTitulo: number
  editora: string
  dataInicio: string
  dataFinal: string
  valor: number
  frequenciaRenovacao: string
  statusAssinatura: StatusAssinatura
}

export interface TituloReservado {
  id: number
  idTitulo: number
  idUsuario: number
  disciplina: string
  dataInicio: string
  dataFinal: string
}