import ResourceDetailContent from '@/components/ResourceDetailContent';
import { LoadingState } from '@/components/resource/LoadingState';
import { NotFoundState } from '@/components/resource/NotFoundState';
import { useResourceDetail } from '@/hooks/useResourceDetail';

interface ResourceDetailViewProps {
  resourceId: string;
  language: 'fr' | 'en';
  t: any;
  onBack: () => void;
}

export const ResourceDetailView = ({ resourceId, language, t, onBack }: ResourceDetailViewProps) => {
  const { resource, loading } = useResourceDetail(resourceId);

  if (loading) {
    return <LoadingState language={language} t={t} />;
  }

  if (!resource) {
    return <NotFoundState language={language} t={t} onBack={onBack} />;
  }

  return (
    <ResourceDetailContent
      resource={resource}
      language={language}
      t={t}
      onBack={onBack}
    />
  );
};