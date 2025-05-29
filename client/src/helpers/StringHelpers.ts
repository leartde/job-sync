export const separateCamelCase = (str: string | undefined): string => {
    if (!str) return '';
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2')
        .trim();
};