import { css } from '@emotion/react';

const fontGenerator = (
weight: number,
size: number,
) => css`
font-family: 'Pretendard';
font-weight: ${weight};
font-size: ${size}px;
line-height: auto;
`;

const font = {
D1: fontGenerator(500, 48),
D2: fontGenerator(700, 18),

H1: fontGenerator(700, 32),
H2: fontGenerator(500, 24),

P1: fontGenerator(700, 16),
P2: fontGenerator(500, 16),

caption: fontGenerator(500, 14),

};

export default font;