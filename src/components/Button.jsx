const Button = ({
  type = 'button',
  label,
  onClick = () => ({}),
}) => {
  return (
    <button type={type} className="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
