import PropTypes from "prop-types";

const CostAnalysisTable = ({ combinations }) => {
  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4">
        TABLA 9.27 Costos mensuales totales para cada combinación del problema de ubicación de almacenes de Good Tire, Inc.
      </h2>
      <table className="table-auto w-full border-collapse border border-gray-400 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-400 px-4 py-2">Combinación</th>
            <th className="border border-gray-400 px-4 py-2">Costo de Embarque</th>
            <th className="border border-gray-400 px-4 py-2">Gastos Generales Mensuales</th>
            <th className="border border-gray-400 px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {combinations.map((combo, index) => (
            <tr
              key={index}
              className={`${
                index === 0 ? "border-t font-bold" : ""
              } ${
                index === combinations.length - 1 ? "border-b font-bold" : ""
              } ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
            >
              <td className="border border-gray-400 px-4 py-2">{combo.name}</td>
              <td className="border border-gray-400 px-4 py-2">${combo.shippingCost.toLocaleString()}</td>
              <td className="border border-gray-400 px-4 py-2">${combo.generalCost.toLocaleString()}</td>
              <td className="border border-gray-400 px-4 py-2 font-semibold">${combo.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CostAnalysisTable.propTypes = {
  combinations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      shippingCost: PropTypes.number.isRequired,
      generalCost: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
    })
  ),
};

export default CostAnalysisTable;
