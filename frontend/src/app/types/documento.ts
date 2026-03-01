export interface Documento {
  id: number;
  usuario_id: number;
  tipo_documento: string; // 'rc05', 'foto_perfil', etc.
  nombre_archivo: string;
  url: string;
  mime_type?: string;
  tamano?: number;
  fecha_subida: string;
  metadatos?: any; // o un tipo específico
}