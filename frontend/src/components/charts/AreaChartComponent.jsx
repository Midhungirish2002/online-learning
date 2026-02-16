import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import PropTypes from "prop-types";

const AreaChartComponent = ({
    data,
    dataKey,
    xAxisKey,
    color = "#3b82f6",
    title,
    height = 300
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-300">
            {title && (
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    {title}
                </h3>
            )}
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-slate-200 dark:stroke-slate-700"
                    />
                    <XAxis
                        dataKey={xAxisKey}
                        className="text-slate-600 dark:text-slate-400"
                        tick={{ fill: "currentColor" }}
                    />
                    <YAxis
                        className="text-slate-600 dark:text-slate-400"
                        tick={{ fill: "currentColor" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                            borderRadius: "8px",
                            color: "#fff"
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        fillOpacity={1}
                        fill={`url(#gradient-${dataKey})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

AreaChartComponent.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataKey: PropTypes.string.isRequired,
    xAxisKey: PropTypes.string.isRequired,
    color: PropTypes.string,
    title: PropTypes.string,
    height: PropTypes.number
};

export default AreaChartComponent;
