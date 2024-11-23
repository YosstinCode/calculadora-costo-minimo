import { useForm, useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw, Trash2, Save } from "lucide-react";
import { ButtonIcon } from "./ButtonIcon";
import TitleHeaderTable from "./TitleHeaderTable";

export default function TransportationForm({ locations, onUpdateCustomers }) {
  const schema = z.object({
    customers: z.array(
      z.object({
        client: z.string().min(1, "El cliente es requerido"),
        ...locations.reduce((acc, loc) => {
          acc[loc.location] = z
            .number()
            .positive(`El costo para ${loc.location} debe ser positivo`);
          return acc;
        }, {}),
        demand: z.number().positive("La demanda debe ser positiva"),
      })
    ),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customers: [
        { client: "", ...locations.reduce((acc, loc) => ({ ...acc, [loc.location]: 0 }), {}), demand: 0 },
      ],
    },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customers",
  });

  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    onUpdateCustomers(data.customers);
  };

  const fillTableWithDefaults = () => {
    remove(fields.map((_, index) => index));

    const tableData = [
      { client: "Cleveland", Cleveland: 0.25, Harrisburg: 0.63, Chicago: 1.75, Trenton: 2.13, Louisville: 1.75, demand: 30 },
      { client: "Cincinnati", Cleveland: 1.25, Harrisburg: 1.5, Chicago: 1.5, Trenton: 2.75, Louisville: 0.5, demand: 20 },
      { client: "Dayton", Cleveland: 0.75, Harrisburg: 1.38, Chicago: 1.38, Trenton: 2.38, Louisville: 1.0, demand: 18 },
      { client: "Indianápolis", Cleveland: 1.63, Harrisburg: 1.75, Chicago: 1.0, Trenton: 3.5, Louisville: 0.5, demand: 16 },
      { client: "Chicago", Cleveland: 1.75, Harrisburg: 2.38, Chicago: 0.25, Trenton: 3.88, Louisville: 1.5, demand: 38 },
      { client: "Búffalo", Cleveland: 1.0, Harrisburg: 1.13, Chicago: 2.75, Trenton: 1.88, Louisville: 2.75, demand: 22 },
      { client: "Pitsburgh", Cleveland: 0.63, Harrisburg: 0.88, Chicago: 2.38, Trenton: 1.75, Louisville: 2.0, demand: 27 },
      { client: "Filadelfia", Cleveland: 2.13, Harrisburg: 0.63, Chicago: 3.88, Trenton: 0.5, Louisville: 3.5, demand: 32 },
      { client: "Nashville", Cleveland: 2.63, Harrisburg: 2.88, Chicago: 2.38, Trenton: 4.25, Louisville: 0.88, demand: 19 },
      { client: "Boston", Cleveland: 3.25, Harrisburg: 2.75, Chicago: 5.0, Trenton: 1.25, Louisville: 4.88, demand: 26 },
    ];

    tableData.forEach((row) => append(row));
  };

  return (
    <div>
      {/* Botón para llenar la tabla con valores predeterminados */}
      <div className="flex gap-4 mb-4">
        <ButtonIcon
          icon={RefreshCw}
          text="Ejemplo"
          color="purple"
          onClick={fillTableWithDefaults}
          tooltip="Llena automáticamente la tabla con valores predeterminados"
        />
      </div>
      {/* Título del formulario */}
      <TitleHeaderTable title="COSTOS DE TRANSPORTE Y DEMANDA DE CLIENTES MAYORISTAS" />


      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className="table-auto w-full border-gray-400">
          <thead>
            <tr>
              <th className="border-t border-b border-gray-400 p-2">Cliente</th>
              {locations.map((loc) => (
                <th key={loc.location} className="border-b border-t border-gray-400 p-2">
                  {loc.location}
                </th>
              ))}
              <th className="border-b border-t border-gray-400 p-2">Demanda</th>
              <th className="border-b border-t border-gray-400 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {fields.map((field, index) => (
  <tr
    key={field.id}
    className={`${index === 0 ? "border-t" : ""} ${
      index === fields.length - 1 ? "border-b" : ""
    } border-gray-400`}
  >
    <td className="p-2">
      <input
        {...register(`customers.${index}.client`)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Cliente"
      />
      {errors.customers?.[index]?.client && (
        <span className="text-red-500 text-sm">
          {errors.customers[index].client.message}
        </span>
      )}
    </td>
    {locations.map((loc) => (
      <td className="p-2" key={loc.location}>
        <input
          {...register(`customers.${index}.${loc.location}`, { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder={`Costo ${loc.location}`}
        />
        {errors.customers?.[index]?.[loc.location] && (
          <span className="text-red-500 text-sm">
            {errors.customers[index][loc.location]?.message}
          </span>
        )}
      </td>
    ))}
    <td className="p-2">
      <input
        {...register(`customers.${index}.demand`, { valueAsNumber: true })}
        type="number"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Demanda"
      />
      {errors.customers?.[index]?.demand && (
        <span className="text-red-500 text-sm">
          {errors.customers[index].demand.message}
        </span>
      )}
    </td>
    <td className="p-2 text-center">
      <ButtonIcon
        icon={Trash2}
        text=""
        color="red"
        onClick={() => remove(index)}
        tooltip="Eliminar esta fila"
      />
    </td>
  </tr>
))}

          </tbody>
        </table>

        {/* Botones para agregar cliente y guardar */}
        <div className="flex justify-between mt-4">
          <ButtonIcon
            icon={Plus}
            text="Agregar Cliente"
            onClick={() =>
              append({
                client: "",
                ...locations.reduce((acc, loc) => {
                  acc[loc.location] = 0;
                  return acc;
                }, {}),
                demand: 0,
              })
            }
            color="blue"
            tooltip="Agregar un nuevo cliente"
          />
          <ButtonIcon
            icon={Save}
            text="Guardar"
            type="submit"
            color="green"
            tooltip="Guarda los costos de transporte y la demanda"
          />
        </div>
      </form>
    </div>
  );
}

TransportationForm.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      shippingCost: PropTypes.number,
    })
  ).isRequired,
  onUpdateCustomers: PropTypes.func.isRequired,
};
