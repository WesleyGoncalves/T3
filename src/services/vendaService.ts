import { Venda } from "../types/Venda"

const STORAGE_KEY = "vendas_app_data"

export function getVendas(): Venda[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveVendas(vendas: Venda[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendas))
}
