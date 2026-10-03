import { LucideFolder } from 'lucide-react'
import React from 'react'
import { ItemDropdown } from '../ui/ItemDropdown'

const FolderCard = ({folder, onClick, onShare, onRename, onMove, onDelete}) => {
  return (
    <div
     className="group relative bg-white border border-slate-200 hover:border-orange-200 rounded-2xl p-4 transition-all duration-200 flex items-center justify-between">
       <button
        type="button"
         onClick={() => onClick(folder)}
        className="flex-1 flex items-center gap-3 min-w-0 pr-2 text-left"
       >
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shrink-0 border border-orange-100">
                <LucideFolder className="size-6 fill-orange-500/20"/>
            </div>
            <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-orange-600 transition-colors" title={folder.name}>{folder.name}</h4>
        </button>

        <ItemDropdown item={folder} onShare={onShare} onRename={onRename} onMove={onMove} onDelete={onDelete}/>
    </div>
  )
}

export default FolderCard