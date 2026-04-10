function obtenerNumerosAleatorios(min, max, cantidad) {
    const pool = [];
    for (let i = min; i <= max; i++) {
        pool.push(i);
    }

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, cantidad).sort((a, b) => a - b);
}

function generarCarton() {
    const carton = Array.from({ length: 3 }, () => Array(9).fill(null));

    const rangosColumnas = [
        [1, 9],
        [10, 19],
        [20, 29],
        [30, 39],
        [40, 49],
        [50, 59],
        [60, 69],
        [70, 79],
        [80, 90],
    ];

    const numerosPorColumna = rangosColumnas.map(([min, max]) =>
        obtenerNumerosAleatorios(min, max, 3)
    );

    for (let col = 0; col < 9; col++) {
        for (let fila = 0; fila < 3; fila++) {
            carton[fila][col] = numerosPorColumna[col][fila];
        }
    }

    for (let fila = 0; fila < 3; fila++) {
        const posiciones = Array.from({ length: 9 }, (_, i) => i);

        for (let i = posiciones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [posiciones[i], posiciones[j]] = [posiciones[j], posiciones[i]];
        }

        const aEliminar = posiciones.slice(0, 4);
        for (const col of aEliminar) {
            carton[fila][col] = null;
        }
    }

    return carton;
}

module.exports = { generarCarton };
