export function formatMessageTime(timestamp) {
    try {
        const date = new Date(timestamp);
        if (isNaN(date)) {
            return '';
        }
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch (error) {
        console.error('Error formatting message time:', error);
        return '';
    }
}
