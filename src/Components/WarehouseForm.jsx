import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";
import { ButtonIcon } from "./ButtonIcon";
import { RefreshCw, Save, Plus, Trash2 } from "lucide-react"; // Importar íconos de Lucide

const schema = z.object({
  locations: z.array(
    z.object({
      location: z.string().min(1, "La ubicación es requerida"),
      capacity: z.number().positive("Debe ser un número positivo"),
      shippingCost: z.number().positive("Debe ser un número positivo"),
      generalCost: z.number().positive("Debe ser un número positivo"),
    })
  ),
});

export default function WarehouseForm({ onUpdateLocations }) {
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      locations: [
        {
          location: "",
          capacity: 0,
          shippingCost: 0,
          generalCost: 0,
        },
      ],
    },
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const fillTableWithDefaults = () => {

    // Limpiar la tabla
    remove(
      fields.map((_, index) => index)
    );
    

    const defaultLocations = [
      { location: "Cleveland", capacity: 80, shippingCost: 0.25, generalCost: 40000 },
      { location: "Harrisburg", capacity: 60, shippingCost: 0.5, generalCost: 20000 },
      { location: "Chicago", capacity: 60, shippingCost: 0.75, generalCost: 30000 },
      { location: "Trenton", capacity: 60, shippingCost: 0.75, generalCost: 25000 },
      { location: "Louisville", capacity: 60, shippingCost: 0.75, generalCost: 20000 },
    ];

    defaultLocations.forEach((loc) => append(loc));
  };

  const onSubmit = (data) => {
    onUpdateLocations(data.locations);
  };

  return (
    <div>
      <div className="flex mb-4">
        {/* Botón para llenar con valores predeterminados */}
        <ButtonIcon
          icon={RefreshCw}
          text="Ejemplo"
          onClick={fillTableWithDefaults}
          color="purple"
          tooltip="Llena automáticamente la tabla con valores predeterminados"
        />
      </div>
      <h2 className="text-center border-t-2 border-b-2 border-black bg-green-600 text-white py-2 text-lg font-bold">
        COSTOS ASOCIADOS A LA APERTURA DE CADA ALMACÉN
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className="table-auto w-full border-none border-gray-400">
          <thead>
            <tr>
              <th className="p-2">Ubicación</th>
              <th className="p-2">Capacidad (000/mes)</th>
              <th className="p-2">Costo de Embarque ($/Producto)</th>
              <th className="p-2">Costos Generales ($/mes)</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr
                key={field.id}
                className={`${
                  index === 0 ? "border-t" : ""
                } ${
                  index === fields.length - 1 ? "border-b" : ""
                } border-gray-400`}
              >
                <td className="border-gray-400 p-2 text-center">
                  <input
                    {...register(`locations.${index}.location`)}
                    className="w-full p-1 text-center border border-gray-300 rounded"
                    placeholder="Ubicación"
                  />
                  {errors.locations?.[index]?.location && (
                    <span className="text-red-500 text-sm">{errors.locations[index].location.message}</span>
                  )}
                </td>
                <td className="border-gray-400 p-2 text-center">
                  <input
                    {...register(`locations.${index}.capacity`, { valueAsNumber: true })}
                    type="number"
                    className="w-full p-1 text-center border border-gray-300 rounded"
                    placeholder="Capacidad"
                  />
                  {errors.locations?.[index]?.capacity && (
                    <span className="text-red-500 text-sm">{errors.locations[index].capacity.message}</span>
                  )}
                </td>
                <td className="border-gray-400 p-2 text-center">
                  <input
                    {...register(`locations.${index}.shippingCost`, { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full p-1 text-center border border-gray-300 rounded"
                    placeholder="Costo Embarque"
                  />
                  {errors.locations?.[index]?.shippingCost && (
                    <span className="text-red-500 text-sm">{errors.locations[index].shippingCost.message}</span>
                  )}
                </td>
                <td className="border-gray-400 p-2 text-center">
                  <input
                    {...register(`locations.${index}.generalCost`, { valueAsNumber: true })}
                    type="number"
                    className="w-full p-1 text-center border border-gray-300 rounded"
                    placeholder="Costos Generales"
                  />
                  {errors.locations?.[index]?.generalCost && (
                    <span className="text-red-500 text-sm">{errors.locations[index].generalCost.message}</span>
                  )}
                </td>
                <td className="border-gray-400 p-2 text-center">
                  {/* Botón para eliminar fila */}
                  <ButtonIcon
                    icon={Trash2}
                    text=""
                    onClick={() => remove(index)}
                    color="red"
                    tooltip="Elimina esta ubicación de la tabla."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          {/* Botón para agregar una nueva ubicación */}
          <ButtonIcon
            icon={Plus}
            text="Agregar Ubicación"
            onClick={() =>
              append({
                location: "",
                capacity: 0,
                shippingCost: 0,
                generalCost: 0,
              })
            }
            color="blue"
            tooltip="Agrega una nueva ubicación"
          />

          {/* Botón para guardar */}
          <ButtonIcon
            icon={Save}
            text="Guardar"
            type="submit"
            color="green"
            tooltip="Guarda las ubicaciones actuales"
          />
        </div>
      </form>
    </div>
  );
}

WarehouseForm.propTypes = {
  onUpdateLocations: PropTypes.func.isRequired,
};
