import { Produto } from "../types/Produto"

const STORAGE_KEY = "produtos_app_data"

export function getProdutos(): Produto[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveProdutos(produtos: Produto[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos))
}
