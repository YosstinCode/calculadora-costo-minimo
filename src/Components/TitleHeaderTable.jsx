import PropTypes from "prop-types";

const TitleHeaderTable = ({ title }) => {
  return (
    <h2 className="text-center border-t-2 border-b-2 border-black bg-green-600 text-white py-2 text-lg font-bold">
      {title}
    </h2>
  );
};

TitleHeaderTable.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TitleHeaderTable;
