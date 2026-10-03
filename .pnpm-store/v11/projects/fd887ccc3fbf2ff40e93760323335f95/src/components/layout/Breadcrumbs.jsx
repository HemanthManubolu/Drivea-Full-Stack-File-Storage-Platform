import React from 'react'
import { useApp } from '../../context/AppContext'
import { ChevronRightIcon, HardDriveIcon } from 'lucide-react'
import {Link} from 'react-router-dom'

const Breadcrumbs = () => {
    const {breadcrumbs} = useApp()
  return (
    <div className='flex items-center gap-1 text-sm text-slate-500 py-3 overflow-x-auto no-scrollbar'>
        {breadcrumbs.map((item, index)=>{
            const isLast = index === breadcrumbs.length - 1;
            const path = item.id ? `/drive/${item.id}` : "/"

            return (
                <React.Fragment key={item.id || "root"}>
                    {index > 0 && <ChevronRightIcon className="size-4 text-slate-400 shrink-0"/>}

                    <Link to={path} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition shrink-0 ${
                        isLast
                        ? "text-slate-900 font-medium bg-white border border-slate-300/50"
                        : "hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                        {index === 0 && <HardDriveIcon className="size-4 text-orange-600" />}
                        <span>{item.name}</span>
                    </Link>

                </React.Fragment>
            )
        })}
    </div>
  )
}

export default Breadcrumbs