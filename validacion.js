function verificarLinea(carton, numerosExtraidos) {
    return carton.some((fila) => {
        const numerosEnFila = fila.filter((celda) => celda !== null);
        return numerosEnFila.every((numero) => numerosExtraidos.includes(numero));
    });
}

function verificarBingo(carton, numerosExtraidos) {
    const todosLosNumeros = carton.flat().filter((celda) => celda !== null);
    return todosLosNumeros.every((numero) => numerosExtraidos.includes(numero));
}

module.exports = { verificarLinea, verificarBingo };
