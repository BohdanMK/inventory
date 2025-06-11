export const StoсksActions = {
  Shipment: 'SHIPMENT',
  WriteOff: 'WRITEOFF',
  Return: 'RETURN',
  Cancel: 'CANCEL'
} as const;

export type StoсksActionsType = typeof StoсksActions[keyof typeof StoсksActions];