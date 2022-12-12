export const distance = (
  { x: x1, y: y1 }: { x: number; y: number },
  { x: x2, y: y2 }: { x: number; y: number }
) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
