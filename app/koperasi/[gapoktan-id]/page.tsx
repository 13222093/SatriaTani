import { CooperativeDashboard } from '@/components/cooperative/CooperativeDashboard';

export default function KoperasiPage({
  params,
}: {
  params: { 'gapoktan-id': string };
}) {
  return <CooperativeDashboard urlId={params['gapoktan-id']} />;
}
