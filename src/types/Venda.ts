import { Cliente } from "./Cliente"
import { Produto } from "./Produto"

export type ProdutoOuServico = Produto | Servico

export interface Servico {
  id: number
  nome: string
  valor: number
}

export interface Item {
  produtoOuServico: ProdutoOuServico
  quantidade: number
  subTotal: number
}

export interface Venda {
  id: number
  cliente: Cliente
  total: number
  itens: Item[]
}
