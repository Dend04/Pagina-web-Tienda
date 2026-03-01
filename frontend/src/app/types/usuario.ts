export interface Usuario {
  id: number;
  nombre_usuario: string;
  correo: string;
  contrasena: string;
  rol: 'cliente' | 'comercial';
  telefono?: string | null;
  direccion?: string | null;
  imagen?: string | null;
  nit?: string | null;
  nombre_negocio?: string | null;
  provincia?: string | null;
  municipio?: string | null;
}