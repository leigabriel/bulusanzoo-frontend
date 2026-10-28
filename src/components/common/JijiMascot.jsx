import { Mascot } from 'page-mascot';

const JijiMascot = ({ size = 40, className = '' }) => (
    <Mascot
        directions="/images/mascot/deer-directions.webp"
        reactions="/images/mascot/deer-reactions.webp"
        size={size}
        label="Jiji AI assistant"
        className={className}
    />
);

export default JijiMascot;
