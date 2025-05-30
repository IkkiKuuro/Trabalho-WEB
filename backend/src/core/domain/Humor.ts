export interface Humor{
    id: string;
    id_paciente: string;
    data_registro: Date;
    tipode_humor: string;
    nivel: any;//resolver era para ser int
    notas: string |null;
}