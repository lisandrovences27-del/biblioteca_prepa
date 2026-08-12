const xlsx = require('xlsx');
const pool = require('./config/db');

async function importLibros() {
    try {
        const filePath = 'C:\\Users\\lisan\\Downloads\\INVENTARIO 2026-estadia.xlsx';
        const workbook = xlsx.readFile(filePath);
        
        const sheetName = 'INV 2026';
        if (!workbook.SheetNames.includes(sheetName)) {
            console.error(`Sheet ${sheetName} not found`);
            return;
        }

        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Vaciamos la tabla de libros
        await pool.execute('DELETE FROM libros');
        await pool.execute('ALTER TABLE libros AUTO_INCREMENT = 1');

        let currentSubcategory = 'General';
        let insertedCount = 0;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            
            if (!row || row.length === 0) continue;
            
            if (row[1] === 'TITULO') {
                continue;
            }
            
            if (row[1] && !row[2] && !row[3] && !row[4] && typeof row[1] === 'string' && row[1] === row[1].toUpperCase()) {
                currentSubcategory = row[1];
                continue;
            }

            if (row[1] && row[2]) {
                const titulo = row[1]?.toString().trim();
                const autor = row[2]?.toString().trim() || null;
                const editorial = row[3]?.toString().trim() || null;
                const edicion = row[4]?.toString().trim() || null;
                const paginas = parseInt(row[5]) || null;
                const anio = row[7]?.toString().trim() || null;
                const impreso = row[8]?.toString().trim() || null;
                
                // La cantidad de libros es siempre la última columna de la fila
                const lastVal = row[row.length - 1];
                const stock = parseInt(lastVal) || 1;
                
                // El ISBN asumiendo que está antes de la última columna si la fila es larga, o en su posición normal 9
                let isbn = row[9]?.toString().trim() || null;
                if (isbn === lastVal?.toString().trim()) {
                    // Si el ISBN resultó ser la última columna porque no había cantidad, lo dejamos como ISBN pero stock será 1 (ya resuelto)
                    // O puede que no haya ISBN, entonces la última fue stock.
                    if (row.length === 10) { 
                        isbn = null; 
                    } else if (row.length >= 11 && row[row.length - 2]) {
                        isbn = row[row.length - 2].toString().trim();
                    }
                }
                
                // Extra check: If isbn was read as something like '968...' but it was in the stock column previously... 
                // We just rely on index 9 normally, unless the last one is the actual stock.
                // Let's just do: if the last element is parsed as stock, the isbn might be the element before it if length > 10.
                if (row.length > 11) {
                    isbn = row[row.length - 2]?.toString().trim() || null;
                } else if (row.length === 11) {
                     isbn = row[9]?.toString().trim() || null;
                }

                const query = `
                    INSERT INTO libros 
                    (nombre, autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria, stock_total, stock_disponible)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                
                await pool.execute(query, [
                    titulo, autor, editorial, edicion, paginas, anio, impreso, isbn, currentSubcategory, stock, stock
                ]);
                insertedCount++;
            }
        }

        console.log(`Successfully inserted ${insertedCount} libros from ${sheetName}.`);
        process.exit(0);

    } catch (error) {
        console.error('Error importing libros:', error);
        process.exit(1);
    }
}

importLibros();
