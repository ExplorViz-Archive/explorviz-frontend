export type Color = number[];

export function isColor(color: any): color is Color {
    return Array.isArray(color) 
        && color.length === 3
        && color.every((c) => typeof c === 'number' && 0 <= c && c <= 1);
}