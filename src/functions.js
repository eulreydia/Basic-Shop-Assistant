import { Stock } from "./models/models.js";

const consultarStock = async (prenda, talla, color) => {
    try {

        const item = await Stock.findOne({
            where: {
                prenda: prenda.toLowerCase(),
                talla: talla.toUpperCase(),
                color: color.toLowerCase()
            }
        });

        return item ? item.cantidad : 0;

    } catch (error) {
        console.error("Error en la consulta", error);
        return 0;
    }
};

export { consultarStock };