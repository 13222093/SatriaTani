import { VerifierConsole } from '@/components/verifier/VerifierConsole';

export default function KlaimPage({ params }: { params: { id: string } }) {
  return <VerifierConsole urlId={params.id} />;
}
