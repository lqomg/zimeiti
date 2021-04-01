export default function formatBytes(bytes, decimals) {
    console.log("bytes", bytes);
    if (bytes === 0) return '0 Bytes';
    if (bytes === NaN || bytes === undefined) return '0 Bytes';
    if (bytes === "N/A") return '* Bytes';
    const k = 1000,
        dm = decimals + 1 || 3,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
