const DashboardCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 flex flex-col justify-center items-center">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase">{title}</h3>
    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default DashboardCard;

