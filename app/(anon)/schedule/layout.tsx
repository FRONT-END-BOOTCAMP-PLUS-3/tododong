export const metadata = {
  title: `경기 일정 - 토도동`,
  description: `날짜별 NBA 경기 일정을 확인하세요.`,
};

const ScheduleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children} </>;
};

export default ScheduleLayout;
