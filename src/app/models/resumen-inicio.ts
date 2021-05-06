export class ResumenInicio {
  count_mesaPorDigitalizar: number;
  count_recibidosPendientes: number;
  count_plazoPorVencer: number;
  count_plazoVencidos: number;
  count_pendientesObservados: number;
  count_visadosPorVisar: number;
  count_firmadosPorFirmar: number;

  constructor() {
    this.count_mesaPorDigitalizar = 0;
    this.count_recibidosPendientes = 0;
    this.count_plazoPorVencer = 0;
    this.count_plazoVencidos = 0;
    this.count_pendientesObservados = 0;
    this.count_visadosPorVisar = 0;
    this.count_firmadosPorFirmar = 0;
  }
}
