import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF69B4"];

function ExpenseChart({ expenses = [] }) {
  // Group by category with absolute values so negatives still count
  const data = expenses.reduce((acc, expense) => {
    const category = expense.category || "Uncategorized";
    const existing = acc.find(item => item.name === category);
    const absAmount = Math.abs(expense.amount); // <- always positive for chart

    if (existing) {
      existing.value += absAmount;
    } else {
      acc.push({ name: category, value: absAmount });
    }
    return acc;
  }, []).filter(item => item.value > 0); // remove empty ones

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Spending by Category</h2>

      {data.length > 0 ? (
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500">No expenses to display</p>
      )}
    </div>
  );
}

export default ExpenseChart;
