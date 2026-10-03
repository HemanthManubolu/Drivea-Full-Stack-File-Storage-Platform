import React, { useEffect, useState } from 'react'
import { useDrive } from '../../hooks/useDrive'
import { Modal } from '../ui/Modal'
import { HardDriveIcon, LucideFolder } from 'lucide-react'
import { Button } from '../ui/Button'
import api from '../../config/api'

const MoveModal = ({item, isOpen, onClose}) => {
    const [availableFolders, setAvailableFolders] = useState([])
    const [selectedFolderId, setSelectedFolderId] = useState(null)
    const [isMoving, setIsMoving] = useState(false)
    const {moveItem} = useDrive()

    useEffect(()=>{
        if (!isOpen) return;
        // Fetch all top-level folders user owns   
        api.get("/api/folders").then(({data})=>{
            // Exclude self if item is a folder
            const filtered = data.folders.filter((f)=>item?.item_type !== "folder" || f.id !== item.id)
            setAvailableFolders(filtered)
        }) 

    },[item, isOpen])

    const handleMove = async () => {
        if (!item) return;

        setIsMoving(true)
        await moveItem(item, selectedFolderId)
        setIsMoving(false)
        onClose()
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Move "${item.name}"`}>
         <div className="space-y-4">
             <p className="text-xs font-medium text-slate-500">Select destination folder:</p>

             <div className='bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto divide-y divide-slate-200 p-1'>
                <button onClick={()=> setSelectedFolderId(null)} type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    selectedFolderId === null
                    ? "bg-orange-50 text-orange-700 border border-orange-200 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}>
                    <HardDriveIcon className="size-4 text-orange-600"/>
                    <span>My Drive (Root)</span>
                </button>

                {/* Subfolders List */}
                {availableFolders.map((folder)=>(
                    <button onClick={()=> setSelectedFolderId(folder.id)} type="button"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                            selectedFolderId === folder.id
                            ? "bg-orange-50 text-orange-700 border border-orange-200 font-semibold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}>
                            <LucideFolder className="size-4 text-orange-600 fill-orange-500/20"/>
                            <span className="truncate">{folder.name}</span>
                        </button>

                ))}
             </div>

             <div className="flex items-center justify-end gap-3 pt-2">
          
                <Button variant='ghost' onClick={onClose} type="button">
                    Cancel
                </Button>
                <Button variant='primary' isLoading={isMoving} onClick={handleMove}>
                    Move Here
                </Button>
             </div>
        </div>
    </Modal>
  )
}

export default MoveModal