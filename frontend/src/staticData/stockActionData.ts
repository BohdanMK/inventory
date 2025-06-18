import type { StoсksActionsType } from '@/constants/constants';

export const stockActionData: { code: StoсksActionsType; name: string }[] = [
  { code: 'SHIPMENT', name: 'Shipment' },
  { code: 'WRITEOFF', name: 'Write off' },
  { code: 'RETURN', name: 'Return' },
  { code: 'CANCEL', name: 'Cancel' },
];
