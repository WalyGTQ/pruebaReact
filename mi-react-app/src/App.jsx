import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, TrendingUp, Globe, Activity, MapPin, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// --- DATOS SIMULADOS (MOCK DATA) ---

// Historia y Proyección de la Población (en miles de millones)
const populationHistoryData = [
  { year: '1950', pop: 2.5, rate: 1.8 },
  { year: '1960', pop: 3.0, rate: 1.9 },
  { year: '1970', pop: 3.7, rate: 2.1 },
  { year: '1980', pop: 4.4, rate: 1.8 },
  { year: '1990', pop: 5.3, rate: 1.7 },
  { year: '2000', pop: 6.1, rate: 1.3 },
  { year: '2010', pop: 6.9, rate: 1.2 },
  { year: '2020', pop: 7.8, rate: 1.0 },
  { year: '2023', pop: 8.0, rate: 0.9 },
  { year: '2030', pop: 8.5, rate: 0.8 }, // Proyección
  { year: '2040', pop: 9.2, rate: 0.7 }, // Proyección
  { year: '2050', pop: 9.7, rate: 0.5 }, // Proyección
];

// Datos por Continente (2023)
const continentData = [
  { name: 'Asia', value: 4750, color: '#6366f1' }, // Indigo-500
  { name: 'África', value: 1460, color: '#ec4899' }, // Pink-500
  { name: 'Europa', value: 742, color: '#3b82f6' }, // Blue-500
  { name: 'Latam', value: 665, color: '#10b981' }, // Emerald-500
  { name: 'Norteamérica', value: 375, color: '#f59e0b' }, // Amber-500
  { name: 'Oceanía', value: 45, color: '#8b5cf6' }, // Violet-500
];

// Top Países (Millones)
const topCountriesData = [
  { name: 'India', pop: 1428, region: 'Asia' },
  { name: 'China', pop: 1425, region: 'Asia' },
  { name: 'EE.UU.', pop: 340, region: 'Norteamérica' },
  { name: 'Indonesia', pop: 278, region: 'Asia' },
  { name: 'Pakistán', pop: 240, region: 'Asia' },
  { name: 'Nigeria', pop: 224, region: 'África' },
  { name: 'Brasil', pop: 216, region: 'Latam' },
  { name: 'Bangladesh', pop: 173, region: 'Asia' },
  { name: 'Rusia', pop: 144, region: 'Europa' },
  { name: 'México', pop: 128, region: 'Latam' },
];

// --- COMPONENTES UI ---

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      {trend === 'up' ? (
        <ArrowUpRight size={16} className="text-emerald-500 mr-1" />
      ) : (
        <ArrowDownRight size={16} className="text-rose-500 mr-1" />
      )}
      <span className="text-slate-400">{subtext}</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-sm border border-slate-700">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} 
            {entry.name === 'pop' ? ' B' : entry.name === 'value' ? ' M' : '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [selectedMetric, setSelectedMetric] = useState('pop'); // 'pop' | 'rate'
  const [regionFilter, setRegionFilter] = useState('Todos');

  // Filtrado de países basado en región
  const filteredCountries = useMemo(() => {
    if (regionFilter === 'Todos') return topCountriesData;
    return topCountriesData.filter(c => c.region === regionFilter);
  }, [regionFilter]);

  // Cálculo de totales dinámicos
  const totalPop = "8.045 M";
  const yearlyGrowth = "+0.9%";
  const medianAge = "30.5 Años";
  const urbanization = "57%";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Globe className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                WorldPop <span className="font-light text-slate-400">Analytics</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full animate-pulse">
                Datos en vivo: ON
              </span>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Activity size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Visión General Global</h2>
          <p className="text-slate-500 mt-1">Estadísticas demográficas, proyecciones y distribución actual.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Población Mundial" 
            value={totalPop} 
            subtext="vs año anterior" 
            icon={Users} 
            trend="up" 
          />
          <StatCard 
            title="Tasa de Crecimiento" 
            value={yearlyGrowth} 
            subtext="Desaceleración prevista" 
            icon={TrendingUp} 
            trend="down" 
          />
          <StatCard 
            title="Edad Mediana" 
            value={medianAge} 
            subtext="Promedio global" 
            icon={Calendar} 
            trend="up" 
          />
          <StatCard 
            title="Urbanización" 
            value={urbanization} 
            subtext="Población en ciudades" 
            icon={MapPin} 
            trend="up" 
          />
        </div>

        {/* Charts Section 1: Evolution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart (Area) - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Evolución Demográfica (1950 - 2050)</h3>
                <p className="text-sm text-slate-400">Proyección histórica y futura</p>
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setSelectedMetric('pop')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${selectedMetric === 'pop' ? 'bg-white shadow text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Población
                </button>
                <button 
                  onClick={() => setSelectedMetric('rate')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${selectedMetric === 'rate' ? 'bg-white shadow text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Tasa Crec.
                </button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={populationHistoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedMetric === 'pop' ? "#6366f1" : "#10b981"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedMetric === 'pop' ? "#6366f1" : "#10b981"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={selectedMetric === 'pop' ? "#6366f1" : "#10b981"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPop)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart - Takes up 1 column */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Distribución por Continente</h3>
            <p className="text-sm text-slate-400 mb-6">Porcentaje de población total</p>
            
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={continentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {continentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-slate-500 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Section 2: Top Countries with Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Top Países por Población</h3>
              <p className="text-sm text-slate-400">Comparativa directa (Millones de habitantes)</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Asia', 'Latam', 'Europa', 'África', 'Norteamérica'].map((region) => (
                <button
                  key={region}
                  onClick={() => setRegionFilter(region)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                    regionFilter === region 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
             {filteredCountries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredCountries} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      width={100}
                      tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar 
                      dataKey="pop" 
                      fill="#6366f1" 
                      radius={[0, 4, 4, 0]} 
                      barSize={20}
                      animationDuration={1000}
                    >
                      {filteredCountries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#6366f1' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             ) : (
               <div className="flex h-full items-center justify-center text-slate-400">
                 No hay datos para esta región en el Top 10 global.
               </div>
             )}
          </div>
        </div>

      </main>
    </div>
  );
}