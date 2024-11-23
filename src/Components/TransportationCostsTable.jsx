import { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import TitleHeaderTable from "./TitleHeaderTable";

const TransportationCostsTable = ({ customers, locations, onUpdateCustomersWithFictitious }) => {
  const totalDemand = customers.reduce((sum, customer) => sum + (customer.demand || 0), 0);
  const totalCapacity = locations.reduce((sum, location) => sum + location.capacity, 0);
  const excessSupply = Math.max(0, totalCapacity - totalDemand);

  const customersWithFictitious = useMemo(() => {
    const updatedCustomers = customers.map((customer) => {
      const updatedCustomer = { ...customer };
      locations.forEach((location) => {
        updatedCustomer[location.location] =
          (customer[location.location] || 0) + location.shippingCost;
      });
      return updatedCustomer;
    });

    if (excessSupply > 0) {
      const fictitiousCustomer = {
        client: "Cliente ficticio",
        demand: excessSupply,
        ...Object.fromEntries(locations.map((location) => [location.location, 0])),
      };
      updatedCustomers.push(fictitiousCustomer);
    }

    return updatedCustomers;
  }, [customers, locations, excessSupply]);

  // Invocar el callback cuando customersWithFictitious cambie
  useEffect(() => {
    if (onUpdateCustomersWithFictitious) {
      onUpdateCustomersWithFictitious(customersWithFictitious);
    }
  }, [customersWithFictitious, onUpdateCustomersWithFictitious]);

  // Generar los datos de la tabla para renderizar
  const tableData = customersWithFictitious.map((customer) => ({
    client: customer.client,
    costs: locations.map((location) => ({
      location: location.location,
      cost: customer[location.location],
    })),
    demand: customer.demand,
  }));

  const capacities = locations.map((location) => location.capacity);

  return (
    <div className="p-4">
      <TitleHeaderTable title="COSTOS DE TRANSPORTACIÓN Y DEMANDA DE CLIENTES MAYORISTAS" />
      <table className="table-auto w-full  border-gray-400">
        <thead className="">
          <tr className="border-t border-b border-gray-400">
            <th className="p-2 text-center">Clientes</th>
            {locations.map((location) => (
              <th key={location.location} className=" p-2 text-center">
                {location.location}
              </th>
            ))}
            <th className=" p-2 text-center">Demanda</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className={`${
                index === 0 ? "border-t" : ""
              } ${index === tableData.length - 1 ? "border-b" : ""} border-gray-400`}
            >
              <td className="p-2 text-center">{row.client}</td>
              {row.costs.map((cost, i) => (
                <td key={i} className="p-2 text-center">
                  ${cost.cost.toFixed(2)}
                </td>
              ))}
              <td className="p-2 text-center">{row.demand}</td>
            </tr>
          ))}
          <tr className="border-b border-gray-400 font-bold">
            <td className="p-2 text-center">CAPACIDAD</td>
            {capacities.map((capacity, i) => (
              <td key={i} className="p-2 text-center">
                {capacity}
              </td>
            ))}
            <td className="p-2 text-center">
              {capacities.reduce((sum, cap) => sum + cap, 0)} /{" "}
              {tableData.reduce((sum, row) => sum + row.demand, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

TransportationCostsTable.propTypes = {
  customers: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  onUpdateCustomersWithFictitious: PropTypes.func,
};

export default TransportationCostsTable;
