import { Servico } from "../types/Servico"

const STORAGE_KEY = "servicos_app_data"

export function getServicos(): Servico[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveServicos(servicos: Servico[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos))
}
