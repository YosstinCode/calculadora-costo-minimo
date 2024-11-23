import PropTypes from 'prop-types';

export const ButtonIcon = ({
  icon: Icon,
  text,
  onClick,
  className,
  color = 'blue',
  type = 'button',
  tooltip,
}) => {
  const bgColor = `bg-${color}-500`;
  const hoverColor = `hover:bg-${color}-600`;
  const tooltipStyles =
    'absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 w-56';

  return (
    <div className={`relative group min-w-6 ${bgColor} ${hoverColor} ${className}`}>
      <button
        type={type}
        onClick={onClick}
        className={`${bgColor} w-full justify-center text-white px-4 py-2 rounded flex items-center gap-2 ${hoverColor}`}
      >
        {Icon && <Icon size={16} />}
        {text && <span>{text}</span>}
      </button>
      {tooltip && (
        <div className={tooltipStyles}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

ButtonIcon.propTypes = {
    //icon es un react node
  icon: PropTypes.any,
  text: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  tooltip: PropTypes.string, // Tooltip text
};
