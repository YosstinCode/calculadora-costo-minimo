import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import TitleHeaderTable from "./TitleHeaderTable";

const TransportationTable = ({ combinations, customers, locations }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = [];
      for (const combination of combinations) {
        // Realiza una solicitud por cada combinación
        const response = await axios.post(
          "https://backend-cost-2599se7dv-yosstincodes-projects.vercel.app/solve-transportation/",
          {
            validCombinations: [combination],
            customers: customers,
            locations: locations.map((location) => ({
              location: location.location,
              capacity: combination.combination.includes(location.location) ? location.capacity : 0,
              shippingCost: location.shippingCost,
              generalCost: location.generalCost,
            })),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Allow-Control-Allow-Origin": "*",
            
            },
          }
        );
        
        results.push({ combination: combination.description, data: response.data });
      }
      setData(results);
    } catch (error) {
      console.error(error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Botón para iniciar la solicitud */}
      <div className="text-center my-6">
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Cargando..." : "Calcular Optimización"}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {data.length > 0 && (
        data.map((result, index) => (
          <div key={index} className="mb-8">
            <TitleHeaderTable title={`EMBARQUES ÓPTIMOS DE ALMACENES A CLIENTES MAYORISTAS ${result.combination.toUpperCase()}`} />
            <table className="table-auto border-collapse border border-gray-400 w-full text-sm text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-2 py-1">CLIENTES</th>
                  {Object.keys(result.data.matrix[0])
                    .filter((key) => key !== "CLIENTE" && key !== "DEMANDA")
                    .map((header, i) => (
                      <th key={i} className="border border-gray-400 px-2 py-1">
                        {header.toUpperCase()}
                      </th>
                    ))}
                  <th className="border border-gray-400 px-2 py-1">DEMANDA</th>
                </tr>
              </thead>
              <tbody>
              {result.data.matrix.map((row, i) => (
  <tr
    key={i}
    className={`${
      i % 2 === 0 ? "bg-white" : "bg-gray-100"
    } ${i === 0 ? "border-t font-bold" : ""} ${
      i === result.data.matrix.length - 1 ? "border-b font-bold" : ""
    }`}
  >
    <td className="border border-gray-400 px-2 py-1">{row.CLIENTE}</td>
    {Object.keys(row)
      .filter((key) => key !== "CLIENTE" && key !== "DEMANDA")
      .map((key, j) => (
        <td key={j} className="border border-gray-400 px-2 py-1">
          {row[key]}
        </td>
      ))}
    <td className="border border-gray-400 px-2 py-1">{row.DEMANDA}</td>
  </tr>
))}

              </tbody>
            </table>
            <div className="mt-4 text-center">
              <p className="font-bold">
                Costo Total de Embarque: ${result.data.total_cost.toFixed(2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

TransportationTable.propTypes = {
  combinations: PropTypes.arrayOf(
    PropTypes.shape({
      combination: PropTypes.string,
      description: PropTypes.string,
      capacity: PropTypes.number,
      cost: PropTypes.number,
    })
  ),
  customers: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
};

export default TransportationTable;
