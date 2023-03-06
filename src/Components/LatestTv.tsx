import { useQuery } from "react-query";
import styled from "styled-components";
import { ILatestTvResult, latestTv } from "../api";

const Box = styled.div`
  position: relative;
`;

const Title = styled.h3`
  font-size: 20px;
  top: 50px;
  right: 30px;
  position: absolute;
`;

const Info = styled.span`
  position: absolute;
  top: 100px;
`;

function Latest() {
  const { data, isLoading } = useQuery<ILatestTvResult>(
    ["tv", "latest"],
    latestTv
  );

  return (
    <Box>
      <Title>{data?.name}</Title>
    </Box>
  );
}
export default Latest;
