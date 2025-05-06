export const FeatureItem = ({ icon, title, description }) => (
  <div className="flex-1 flex items-center space-x-4">
    <div className="flex justify-center items-center w-12 h-12 border-2 border-gray-300 rounded-lg">
      {icon}
    </div>
    <div className="text-left">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  </div>
);
