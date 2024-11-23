import PropTypes from "prop-types";
import TitleHeaderTable from "./TitleHeaderTable";

const CombinationsTable = ({  validCombinations, product }) => {

  return (
    <div className="p-4">
      <TitleHeaderTable title="COMBINACIONES, CAPACIDADES Y COSTOS DE LAS UBICACIONES VIABLES" />
      <table className="table-auto w-full">
        <thead>
          <tr className="">
            <th className="border-t border-b border-gray-400 p-2">Combinación</th>
            <th className="border-t border-b border-gray-400 p-2">Descripción</th>
            <th className="border-t border-b border-gray-400 p-2">Capacidad</th>
            <th className="border-t border-b border-gray-400 p-2">Costo Mensual</th>
          </tr>
        </thead>
        <tbody>
{validCombinations.map((combo, index) => (
  <tr
    key={index}
    className={`border-gray-400 ${
      index === 0 ? "border-t " : ""
    } ${index === validCombinations.length - 1 ? "border-b " : ""} `}
  >
    <td className="p-2">{combo.combination}</td>
    <td className="p-2">{combo.description}</td>
    <td className="p-2">
      {combo.capacity.toLocaleString()}.000 {product}
    </td>
    <td className="p-2">
      ${combo.cost.toLocaleString()}
    </td>
  </tr>
))}

        </tbody>
      </table>
    </div>
  );
};

CombinationsTable.propTypes = {
  validCombinations: PropTypes.arrayOf(
    PropTypes.shape({
      combination: PropTypes.string,
      description: PropTypes.string,
      capacity: PropTypes.number,
      cost: PropTypes.number,
    })
  ),
  product: PropTypes.string,
};


export default CombinationsTable;
