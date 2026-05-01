// numerosExtraidos: los sacados por el servidor
// numerosMarcados: los que el jugador ha tachado manualmente
function verificarLinea(carton, numerosExtraidos, numerosMarcados) {
    return carton.some((fila) => {
        const numerosEnFila = fila.filter((celda) => celda !== null);
        return numerosEnFila.every(
            (numero) =>
                numerosExtraidos.includes(numero) &&
                numerosMarcados.includes(numero)
        );
    });
}

function verificarBingo(carton, numerosExtraidos, numerosMarcados) {
    const todosLosNumeros = carton.flat().filter((celda) => celda !== null);
    return todosLosNumeros.every(
        (numero) =>
            numerosExtraidos.includes(numero) &&
            numerosMarcados.includes(numero)
    );
}

module.exports = { verificarLinea, verificarBingo };
