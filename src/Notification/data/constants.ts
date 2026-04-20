export const RequestStatus = {
  IDLE: 'idle',
  IN_PROGRESS: 'in-progress',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  DENIED: 'denied',
} as const;

export type RequestStatusValue = typeof RequestStatus[keyof typeof RequestStatus];
