class GestorSenial {
  constructor(min, max) {
    this.min = min;
    this.max = max;
    this.raw = 0; //guarda el valor crudo actual
    this.filtrada = 0; //es la versión suavizada
    this.sensibilidad = 0.1; //controla cuánto suaviza (más bajo = más lento, más suave)
  }

  actualizar(nuevaValor) {
    this.raw = nuevaValor;
    // normalización
    let normalizada = map(this.raw, this.min, this.max, 0, 1);
    normalizada = constrain(normalizada, 0, 1);
    // filtro simple (promedio exponencial)
    this.filtrada += (normalizada - this.filtrada) * this.sensibilidad;
  }
}
