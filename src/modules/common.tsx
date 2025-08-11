
export function Card({ title, subtitle, children }:{ title?: string; subtitle?: string; children: React.ReactNode }){
  return (<div className="card p-5">{(title||subtitle)&&(<div className="mb-3">{title&&<h2 className="text-xl font-semibold">{title}</h2>}{subtitle&&<p className="text-sm text-gray-500">{subtitle}</p>}</div>)}{children}</div>) }
