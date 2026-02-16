import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];

const PieChartComponent = ({ data, dataKey, nameKey, colors = COLORS, title, height = 300 }) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-300">
            {title && (
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    {title}
                </h3>
            )}
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey={dataKey}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                            borderRadius: "8px",
                            color: "#fff"
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            color: "inherit"
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

PieChartComponent.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataKey: PropTypes.string.isRequired,
    nameKey: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    height: PropTypes.number
};

export default PieChartComponent;
