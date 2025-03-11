type IconProps = {
  id: string;
  width?: number;
  height?: number;
  color?: string;
  xPos?: number;
  yPos?: number;
} & React.SVGAttributes<SVGElement>;

const Icon = ({
  id,
  width = 24,
  height,
  color = '#ffffff',
  xPos = 0,
  yPos = 0,
  ...restProps
}: IconProps) => {
  if (!height) height = width;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${xPos} ${yPos} ${width} ${height}`}
      style={{ minWidth: width, minHeight: height, color }}
      {...restProps}
    >
      <use href={`/sprites.svg#${id}`} />
    </svg>
  );
};

export default Icon;

/*
사용 예시 1
<Icon
  id='calendar'
/>

사용 예시 2
<Icon
  id='info'
  width='20'
  color='red'

  // 세부 위치 조정
  xPos = 10,
  yPos = 10,
/>
*/
