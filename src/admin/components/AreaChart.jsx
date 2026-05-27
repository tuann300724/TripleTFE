// {/* <AreaChart width={800} height={300} data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
//     <defs>
//         <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
//             <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
//         </linearGradient>
//     </defs>
//     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
    
//     {/* ĐÃ SỬA: Thêm type="category" để định dạng rõ trục X là danh mục chữ */}
//     <XAxis 
//         dataKey="name" 
//         type="category"
//         stroke="#94A3B8" 
//         fontSize={11} 
//         tickLine={false} 
//         axisLine={false} 
//         dy={10} 
//     />
    
//     {/* ĐÃ SỬA: Thêm type="number" và domain={[0, 'auto']} để ép mốc bắt đầu thấp nhất luôn luôn là số 0 dưới đáy */}
//     <YAxis 
//         type="number"
//         domain={[0, 'auto']}
//         stroke="#94A3B8" 
//         fontSize={11} 
//         tickLine={false} 
//         axisLine={false} 
//         dx={-5} 
//         tickFormatter={(v) => v === 0 ? "0" : `${v / 1000000}M`} 
//     />
    
//     <Tooltip content={<CustomTooltip />} />
    
//     <Area 
//         type="monotone" 
//         dataKey="Doanh thu" 
//         stroke="#10B981" 
//         strokeWidth={3} 
//         fillOpacity={1} 
//         fill="url(#colorRevenue)" 
//         dot={{ r: 4, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
//         activeDot={{ r: 6, style: { filter: 'drop-shadow(0px 0px 5px rgba(16,185,129,0.5))' } }}
//     />
// </AreaChart> */}