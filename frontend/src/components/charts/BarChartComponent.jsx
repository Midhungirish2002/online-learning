import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import PropTypes from "prop-types";

const BarChartComponent = ({
    data,
    dataKey,
    xAxisKey,
    color = "#8b5cf6",
    title,
    height = 300,
    horizontal = false
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-300">
            {title && (
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    {title}
                </h3>
            )}
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-slate-200 dark:stroke-slate-700"
                    />
                    {horizontal ? (
                        <>
                            <XAxis
                                type="number"
                                className="text-slate-600 dark:text-slate-400"
                                tick={{ fill: "currentColor" }}
                            />
                            <YAxis
                                type="category"
                                dataKey={xAxisKey}
                                className="text-slate-600 dark:text-slate-400"
                                tick={{ fill: "currentColor" }}
                                width={120}
                            />
                        </>
                    ) : (
                        <>
                            <XAxis
                                dataKey={xAxisKey}
                                className="text-slate-600 dark:text-slate-400"
                                tick={{ fill: "currentColor" }}
                            />
                            <YAxis
                                className="text-slate-600 dark:text-slate-400"
                                tick={{ fill: "currentColor" }}
                            />
                        </>
                    )}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                            borderRadius: "8px",
                            color: "#fff"
                        }}
                    />
                    <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

BarChartComponent.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataKey: PropTypes.string.isRequired,
    xAxisKey: PropTypes.string.isRequired,
    color: PropTypes.string,
    title: PropTypes.string,
    height: PropTypes.number,
    horizontal: PropTypes.bool
};

export default BarChartComponent;
