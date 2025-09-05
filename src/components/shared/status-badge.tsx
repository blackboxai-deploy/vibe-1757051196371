import { Badge } from '@/components/ui/badge';
import { InvoiceStatus } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/invoice-utils';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={getStatusColor(status)}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}