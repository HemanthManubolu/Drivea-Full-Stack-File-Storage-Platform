import { MoreVerticalIcon, EyeIcon, Share2Icon, Edit2Icon, FolderInputIcon, Trash2Icon } from "lucide-react";
import { Dropdown, DropdownItem } from "./Dropdown";

export function ItemDropdown({ item, onPreview, onShare, onRename, onMove, onDelete }) {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
                trigger={
                    <button
                        type="button"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVerticalIcon className="size-4" />
                    </button>
                }
            >
                {onPreview && (
                    <DropdownItem icon={EyeIcon} onClick={() => onPreview(item)}>
                        Preview
                    </DropdownItem>
                )}
                <DropdownItem icon={Share2Icon} onClick={() => onShare(item)}>
                    Share Link
                </DropdownItem>
                <DropdownItem icon={Edit2Icon} onClick={() => onRename(item)}>
                    Rename
                </DropdownItem>
                <DropdownItem icon={FolderInputIcon} onClick={() => onMove(item)}>
                    Move to...
                </DropdownItem>
                <DropdownItem icon={Trash2Icon} danger onClick={() => onDelete(item)}>
                    Delete
                </DropdownItem>
            </Dropdown>
        </div>
    );
}
