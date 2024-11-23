
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { ButtonIcon } from "./ButtonIcon";
import { Save } from "lucide-react";

const DataContextForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "",
      mainWarehouseLocation: "",
      product: "",
    },
  });

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-gray-50 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Información del Contexto
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Nombre de la Empresa */}
        <div className="mb-5">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la Empresa
          </label>
          <input
            id="companyName"
            {...register("companyName", { required: "El nombre de la empresa es requerido" })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ejemplo: Good Tire Inc."
          />
          {errors.companyName && (
            <span className="text-red-500 text-xs">{errors.companyName.message}</span>
          )}
        </div>

        {/* Nombre de la Ubicación del Almacén Principal */}
        <div className="mb-5">
          <label
            htmlFor="mainWarehouseLocation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la Ubicación del Almacén Principal
          </label>
          <input
            id="mainWarehouseLocation"
            {...register("mainWarehouseLocation", {
              required: "El nombre del almacén principal es requerido",
            })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ejemplo: Akron, Ohio"
          />
          {errors.mainWarehouseLocation && (
            <span className="text-red-500 text-xs">{errors.mainWarehouseLocation.message}</span>
          )}
        </div>

        {/* Producto que Transporta */}
        <div className="mb-5">
          <label
            htmlFor="product"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Producto que Transporta
          </label>
          <input
            id="product"
            {...register("product", { required: "El producto transportado es requerido" })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ejemplo: Llantas"
          />
          {errors.product && (
            <span className="text-red-500 text-xs">{errors.product.message}</span>
          )}
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <ButtonIcon
            icon={Save}
            text="Guardar"
            type="submit"
            color="green"
            tooltip="Guardar los datos ingresados"
          />
        </div>
      </form>
    </div>
  );
};

DataContextForm.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Función para manejar los datos del formulario
};

export default DataContextForm;
