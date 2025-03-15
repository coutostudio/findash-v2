import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Transaction } from '../types';
import { BarChart3, PieChart, LineChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartSectionProps {
  incomeData: Transaction[];
  expenseData: Transaction[];
}

type ChartType = 'bar' | 'doughnut' | 'line';

const ChartSection: React.FC<ChartSectionProps> = ({ incomeData = [], expenseData = [] }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const groupByCategory = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Sem Categoria';
      acc[category] = (acc[category] || 0) + (transaction.amount || 0);
      return acc;
    }, {} as Record<string, number>);
  };

  const groupByMonth = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      if (!transaction.dueDate) return acc;
      const date = new Date(transaction.dueDate);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      acc[month] = (acc[month] || 0) + (transaction.amount || 0);
      return acc;
    }, {} as Record<string, number>);
  };

  const incomeByCategory = groupByCategory(incomeData);
  const expenseByCategory = groupByCategory(expenseData);
  const incomeByMonth = groupByMonth(incomeData);
  const expenseByMonth = groupByMonth(expenseData);

  const allCategories = [...new Set([
    ...Object.keys(incomeByCategory),
    ...Object.keys(expenseByCategory)
  ])];

  const allMonths = [...new Set([
    ...Object.keys(incomeByMonth),
    ...Object.keys(expenseByMonth)
  ])];

  const barChartData = {
    labels: allCategories,
    datasets: [
      {
        label: 'Receitas',
        data: allCategories.map(category => incomeByCategory[category] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: allCategories.map(category => expenseByCategory[category] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Receitas',
        data: allMonths.map(month => incomeByMonth[month] || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Despesas',
        data: allMonths.map(month => expenseByMonth[month] || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={barChartData} options={{ responsive: true }} />;
      case 'doughnut':
        return <Doughnut data={doughnutChartData} options={{ responsive: true }} />;
      case 'line':
        return <Line data={lineChartData} options={{ responsive: true }} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-cardBorder p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-textPrimary">Visualização de Dados</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-md ${
              chartType === 'bar' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-card text-textSecondary hover:bg-card/80'
            }`}
            title="Gráfico de Barras"
          >
            <BarChart3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartType('doughnut')}
            className={`p-2 rounded-md ${
              chartType === 'doughnut' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-card text-textSecondary hover:bg-card/80'
            }`}
            title="Gráfico de Rosca"
          >
            <PieChart className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-md ${
              chartType === 'line' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-card text-textSecondary hover:bg-card/80'
            }`}
            title="Gráfico de Linha"
          >
            <LineChart className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartSection;
