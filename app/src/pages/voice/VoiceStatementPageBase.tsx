import { useParams } from 'react-router-dom';
import { StatementContext } from '../../contexts/StatementContext';
import { VoiceStatementPage } from './VoiceStatementPage';

export const VoiceStatementPageBase = (): JSX.Element => {
  const { statementId } = useParams();
  return (
    <StatementContext statementId={statementId}>
      <VoiceStatementPage></VoiceStatementPage>
    </StatementContext>
  );
};
