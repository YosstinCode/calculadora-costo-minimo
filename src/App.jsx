import { useState, useEffect } from "react";
import DataContextForm from "./Components/DataContextForm";
import TransportationForm from "./Components/TransportationForm";
import WarehouseForm from "./Components/WarehouseForm";
import CombinationsTable from "./Components/CombinationsTable";
import TransportationCostsTable from "./Components/TransportationCostsTable";
import TransportationTable from "./Components/TransportationTable";
import CostAnalysisTable from "./Components/CostAnalysisTable";

const generateValidCombinations = (locations, demand) => {
  const calculateTotals = (locs) => {
    const capacity = locs.reduce((sum, loc) => sum + loc.capacity, 0);
    const cost = locs.reduce((sum, loc) => sum + loc.generalCost, 0);
    return { capacity, cost };
  };

  const generateAllSubsets = (array) => {
    const subsets = [];
    const totalSubsets = Math.pow(2, array.length);

    for (let i = 1; i < totalSubsets; i++) {
      const subset = [];
      for (let j = 0; j < array.length; j++) {
        if (i & (1 << j)) {
          subset.push(array[j]);
        }
      }
      subsets.push(subset);
    }

    return subsets;
  };

  const validCombinations = [];
  const subsets = generateAllSubsets(locations);

  subsets.forEach((subset) => {
    const { capacity, cost } = calculateTotals(subset);

    if (capacity >= demand) {
      validCombinations.push({
        combination: subset.map((loc) => loc.location).join(", "),
        description:
          subset.length === locations.length
            ? "Todos los almacenes"
            : `Los ${locations.length} excepto el/los ${locations
                .filter((loc) => !subset.includes(loc))
                .map((loc) => loc.location)
                .join(", ")}`,
        capacity,
        cost,
      });
    }
  });

  return validCombinations;
};

const generateCustomersWithFictitious = (customers, locations) => {
  const totalDemand = customers.reduce((sum, customer) => sum + (customer.demand || 0), 0);
  const totalCapacity = locations.reduce((sum, location) => sum + location.capacity, 0);

  const excessSupply = Math.max(totalCapacity - totalDemand, 0);

  const updatedCustomers = customers.map((customer) => ({
    ...customer,
    ...locations.reduce((acc, location) => {
      acc[location.location] = (customer[location.location] || 0) + location.shippingCost;
      return acc;
    }, {}),
  }));

  if (excessSupply > 0) {
    const fictitiousCustomer = {
      client: "Cliente ficticio",
      demand: excessSupply,
      ...locations.reduce((acc, location) => {
        acc[location.location] = 0;
        return acc;
      }, {}),
    };
    updatedCustomers.push(fictitiousCustomer);
  }

  return updatedCustomers;
};



const App = () => {
  const [dataContext, setDataContext] = useState({
    companyName: "Good Tire, Inc.",
    mainWarehouseLocation: "Akron, Ohio",
    product: "llantas",
  });
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [demand, setDemand] = useState(0);
  const [validCombinations, setValidCombinations] = useState([]);
  const [customersWithFictitious, setCustomersWithFictitious] = useState([]);

  // Verifica si hay almacenes válidos
  const hasValidLocations = locations.some(
    (loc) => loc.location && loc.capacity > 0 && loc.shippingCost > 0 && loc.generalCost > 0
  );

  // Verifica si hay clientes válidos
  const hasValidCustomers = customers.some(
    (cust) => cust.client && cust.demand > 0
  );

  const handleLocationsUpdate = (updatedLocations) => {
    setLocations(updatedLocations);
  };

  const handleCustomersUpdate = (updatedCustomers) => {
    setCustomers(updatedCustomers);
    const totalDemand = updatedCustomers.reduce((sum, customer) => sum + (customer.demand || 0), 0);
    setDemand(totalDemand);
  };

  const handleDataContextUpdate = (data) => {
    setDataContext(data);
  };

  useEffect(() => {
    if (hasValidLocations && hasValidCustomers) {
      const updatedCombinations = generateValidCombinations(locations, demand);
      const updatedCustomersWithFictitious = generateCustomersWithFictitious(customers, locations);

      setValidCombinations(updatedCombinations);
      setCustomersWithFictitious(updatedCustomersWithFictitious);
    }
  }, [locations, customers, demand, hasValidLocations, hasValidCustomers]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Calculadora de Problemas de Ubicación de Almacenes mediante Modelo de Transporte
      </h1>

      {/* Formulario de Contexto */}
      <div className="mb-8">
        <DataContextForm onSubmit={handleDataContextUpdate} />
      </div>

      {/* Formulario de Ubicaciones */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Gestión de Ubicaciones de Almacenes</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Configure las ubicaciones para los almacenes de <strong>{dataContext.companyName}</strong>. 
          Este formulario le permitirá definir la capacidad de cada almacén, los costos de envío desde 
          la planta principal ubicada en <strong>{dataContext.mainWarehouseLocation}</strong>, y los costos generales 
          de operación mensual. Esto ayudará a optimizar la distribución de <strong>{dataContext.product}</strong> hacia 
          los clientes mayoristas, reduciendo tiempos de entrega y costos.
        </p>
        <WarehouseForm onUpdateLocations={handleLocationsUpdate} />
      </div>

      {/* Formulario de Costos de Transporte */}
      {hasValidLocations && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Gestión de Costos de Transporte y Demanda de Clientes</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {dataContext.companyName} tiene relaciones estables y a largo plazo con sus clientes mayoristas. 
            En esta tabla, puede gestionar los costos de transporte proyectados desde los almacenes y las demandas mensuales 
            para tomar decisiones que minimicen los costos totales.
          </p>
          <TransportationForm locations={locations} onUpdateCustomers={handleCustomersUpdate} />
        </div>
      )}

      {/* Combinaciones de Almacenes */}
      {hasValidLocations && hasValidCustomers && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Combinaciones de Almacenes</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              El modelo de transporte considera combinaciones de almacenes de <strong>{dataContext.companyName}</strong> para satisfacer 
              la demanda de los clientes mayoristas. Aunque construir los cinco almacenes sería una opción válida, analizar todas 
              las posibles combinaciones sería poco eficiente. Dado que la demanda total es de <strong>{demand.toLocaleString()}.000 {dataContext.product}</strong>, 
              se han identificado las siguientes combinaciones válidas:
            </p>
            <CombinationsTable validCombinations={validCombinations} product={dataContext.product} />
          </div>

          {/* Tabla de Costos de Transporte */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Tabla de Costos de Transporte</h2>
            <p className="text-gray-600 mb-4">
              Esta tabla muestra los costos de transporte detallados para cada cliente y almacén. También se incluyen clientes ficticios si 
              existe un exceso de capacidad en los almacenes.
            </p>
            <TransportationCostsTable customers={customers} locations={locations} />
          </div>

          {/* Optimización del Transporte */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Optimización del Transporte</h2>
            <p className="text-gray-600 mb-4">
            En este apartado se evalúan los costos mensuales totales asociados a diferentes combinaciones de ubicaciones de almacenes. El análisis considera tanto los costos de embarque como los gastos generales mensuales, lo que permite identificar la combinación óptima que minimice los costos totales mientras satisface la demanda. Este enfoque garantiza una distribución eficiente, maximizando los beneficios logísticos y económicos para {dataContext.companyName}.
            </p>
            <TransportationTable combinations={validCombinations} customers={customers} locations={locations} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
