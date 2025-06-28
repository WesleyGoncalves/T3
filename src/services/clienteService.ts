import { Cliente } from "../types/Cliente"

const STORAGE_KEY = 'clientes_app_data'

export function getClientes(): Cliente[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveClientes(clientes: Cliente[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))
}
