const FieldDisplay = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: any;
  children?: any;
}) => (
  <div className="">
    <div className="text-gray-500 font-bold text-sm">{label}</div>
    {value ? <div className="text-gray-900">{value}</div> : children}
  </div>
);

export default FieldDisplay;
