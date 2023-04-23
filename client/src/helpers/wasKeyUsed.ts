/** provjerava je li pritisnuta tipka CTRL / SHIFT */
export const wasToggleInSelectionGroupKeyUsed = (event: React.MouseEvent | React.KeyboardEvent) => {
  const isUsingWindows = navigator.userAgent.toLowerCase().includes("win");
  return isUsingWindows ? event.ctrlKey : event.metaKey;
};

export const wasMultiSelectKeyUsed = (event: React.MouseEvent | React.KeyboardEvent) => event.shiftKey;
