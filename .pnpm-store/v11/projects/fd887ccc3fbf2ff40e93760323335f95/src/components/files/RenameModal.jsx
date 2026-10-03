import React, { useEffect, useState } from 'react'
import { useDrive } from '../../hooks/useDrive'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const RenameModal = ({item, isOpen, onClose}) => {

    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {renameItem} = useDrive()

    useEffect(()=>{
        if(item) setName(item.name || "")
    },[item])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!name.trim() || !item) return;

        setIsLoading(true)
        await renameItem(item, name.trim())
        setIsLoading(false)
        onClose()
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rename ${item?.item_type === "folder" ? "Folder" : "File"}`}>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Name" value={name} onChange={(e)=>setName(e.target.value)} autoFocus required/>

            <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant='ghost' onClick={onClose} type="button">
                    Cancel
                </Button>
                <Button variant='primary' isLoading={isLoading} disabled={!name.trim()} type="submit">
                    Rename
                </Button>
            </div>
        </form>

    </Modal>
  )
}

export default RenameModal