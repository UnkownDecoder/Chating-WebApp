export function formatMessageTime(dateString) {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

