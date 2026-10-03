import { FileTextIcon, ImageIcon, FilmIcon, MusicIcon, FileArchiveIcon, FileSpreadsheetIcon, FileCodeIcon, FileIcon } from "lucide-react";
import { toast } from "react-hot-toast";

// Sorting options for files
export const SORT_OPTIONS = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Date (Newest first)", value: "date_desc" },
    { label: "Date (Oldest first)", value: "date_asc" },
    { label: "Size (Largest first)", value: "size_desc" },
    { label: "Size (Smallest first)", value: "size_asc" },
];

// Format bytes into human readable string (e.g. 1.25 MB)
export function formatBytes(bytes, decimals = 2) {
    const num = Number(bytes);
    if (!num || num === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Icon mapping configuration
const ICON_RULES = [
    { test: (m) => m.startsWith("image/"), Icon: ImageIcon, color: "text-emerald-500" },
    { test: (m) => m.startsWith("video/"), Icon: FilmIcon, color: "text-purple-500" },
    { test: (m) => m.startsWith("audio/"), Icon: MusicIcon, color: "text-pink-500" },
    { test: (m) => m === "application/pdf", Icon: FileTextIcon, color: "text-red-500" },
    { test: (m) => /(zip|tar|rar|compressed)/i.test(m), Icon: FileArchiveIcon, color: "text-amber-500" },
    { test: (m) => /(excel|spreadsheet|csv)/i.test(m), Icon: FileSpreadsheetIcon, color: "text-emerald-500" },
    { test: (m) => /(json|javascript|html|css|xml)/i.test(m), Icon: FileCodeIcon, color: "text-cyan-500" },
];

// Returns matching Lucide Icon component based on MIME type
export function getFileIcon(mime_type, className = "size-6") {
    if (!mime_type) return <FileIcon className={`${className} text-orange-500`} />;
    const match = ICON_RULES.find((r) => r.test(mime_type));
    const Icon = match ? match.Icon : FileIcon;
    const color = match ? match.color : "text-orange-500";
    return <Icon className={`${className} ${color}`} />;
}

// Helper to copy share link to clipboard
export const copyShareLink = (token) => {
    const url = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
    return url;
};

// ==========================================
// DUMMY INITIAL DATA FOR FRONTEND-ONLY MODE
// ==========================================

export const dummyUser = {
    id: "usr_1001",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    storage_used: 423685120, // ~404 MB
    storage_limit: 1073741824, // 1 GB
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-03-01T12:00:00.000Z",
};

export const dummyFolders = [
    {
        id: "fld_1",
        name: "Design Projects",
        parent_id: null,
        owner_id: "usr_1001",
        path: [],
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-02-10T10:00:00.000Z",
        updated_at: "2026-02-10T10:00:00.000Z",
    },
    {
        id: "fld_2",
        name: "Client Assets",
        parent_id: "fld_1",
        owner_id: "usr_1001",
        path: ["fld_1"],
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-02-12T14:30:00.000Z",
        updated_at: "2026-02-12T14:30:00.000Z",
    },
    {
        id: "fld_3",
        name: "Financial Reports",
        parent_id: null,
        owner_id: "usr_1001",
        path: [],
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-01-20T11:15:00.000Z",
        updated_at: "2026-01-20T11:15:00.000Z",
    },
    {
        id: "fld_4",
        name: "Archive 2025",
        parent_id: null,
        owner_id: "usr_1001",
        path: [],
        is_trashed: true,
        trashed_at: "2026-03-02T16:00:00.000Z",
        created_at: "2026-01-05T08:00:00.000Z",
        updated_at: "2026-03-02T16:00:00.000Z",
    },
];

export const dummyFiles = [
    {
        id: "fil_1",
        name: "Q4_Revenue_Analysis.xlsx",
        original_name: "Q4_Revenue_Analysis.xlsx",
        mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 2450000,
        s3_key: "users/usr_1001/q4_revenue.xlsx",
        folder_id: "fld_3",
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-02-28T14:20:00.000Z",
        updated_at: "2026-02-28T14:20:00.000Z",
    },
    {
        id: "fil_2",
        name: "Brand_Guidelines_v3.pdf",
        original_name: "Brand_Guidelines_v3.pdf",
        mime_type: "application/pdf",
        size: 8920000,
        s3_key: "users/usr_1001/brand_guidelines.pdf",
        folder_id: "fld_1",
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-02-25T11:00:00.000Z",
        updated_at: "2026-02-25T11:00:00.000Z",
    },
    {
        id: "fil_3",
        name: "Hero_Background.png",
        original_name: "Hero_Background.png",
        mime_type: "image/png",
        size: 4194304,
        s3_key: "users/usr_1001/hero_bg.png",
        folder_id: "fld_2",
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-03-01T09:15:00.000Z",
        updated_at: "2026-03-01T09:15:00.000Z",
    },
    {
        id: "fil_4",
        name: "Product_Walkthrough.mp4",
        original_name: "Product_Walkthrough.mp4",
        mime_type: "video/mp4",
        size: 48500000,
        s3_key: "users/usr_1001/walkthrough.mp4",
        folder_id: null,
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-03-03T18:45:00.000Z",
        updated_at: "2026-03-03T18:45:00.000Z",
    },
    {
        id: "fil_5",
        name: "Architecture_Overview.pdf",
        original_name: "Architecture_Overview.pdf",
        mime_type: "application/pdf",
        size: 3200000,
        s3_key: "users/usr_1001/architecture.pdf",
        folder_id: null,
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-03-04T12:00:00.000Z",
        updated_at: "2026-03-04T12:00:00.000Z",
    },
    {
        id: "fil_6",
        name: "Design_Assets.zip",
        original_name: "Design_Assets.zip",
        mime_type: "application/zip",
        size: 15400000,
        s3_key: "users/usr_1001/design_assets.zip",
        folder_id: null,
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-03-02T15:30:00.000Z",
        updated_at: "2026-03-02T15:30:00.000Z",
    },
    {
        id: "fil_7",
        name: "App_Config.json",
        original_name: "App_Config.json",
        mime_type: "application/json",
        size: 45200,
        s3_key: "users/usr_1001/app_config.json",
        folder_id: null,
        owner_id: "usr_1001",
        is_trashed: false,
        trashed_at: null,
        created_at: "2026-03-05T10:10:00.000Z",
        updated_at: "2026-03-05T10:10:00.000Z",
    },
    {
        id: "fil_8",
        name: "Draft_Spec_Deleted.pdf",
        original_name: "Draft_Spec_Deleted.pdf",
        mime_type: "application/pdf",
        size: 1200000,
        s3_key: "users/usr_1001/draft_spec.pdf",
        folder_id: null,
        owner_id: "usr_1001",
        is_trashed: true,
        trashed_at: "2026-03-05T09:00:00.000Z",
        created_at: "2026-01-10T11:00:00.000Z",
        updated_at: "2026-03-05T09:00:00.000Z",
    },
];

export const dummyShareLinks = [
    {
        id: "sh_1",
        token: "share_token_demo_1",
        resource_type: "file",
        resource_id: "fil_2",
        owner_id: "usr_1001",
        permission: "download",
        expires_at: null,
        access_count: 14,
        created_at: "2026-02-26T12:00:00.000Z",
        updated_at: "2026-02-26T12:00:00.000Z",
        resource: {
            id: "fil_2",
            name: "Brand_Guidelines_v3.pdf",
            mime_type: "application/pdf",
            size: 8920000,
        },
    },
    {
        id: "sh_2",
        token: "share_token_demo_2",
        resource_type: "folder",
        resource_id: "fld_1",
        owner_id: "usr_1001",
        permission: "download",
        expires_at: null,
        access_count: 32,
        created_at: "2026-02-27T15:00:00.000Z",
        updated_at: "2026-02-27T15:00:00.000Z",
        resource: {
            id: "fld_1",
            name: "Design Projects",
            mime_type: null,
        },
    },
];
