import { useQuery } from "react-query";
import styled from "styled-components";
import { ILatestMoviesResult, latestMovies } from "../api";

const Box = styled.div`
  position: relative;
`;

const Title = styled.h3`
  font-size: 20px;
  top: 50px;
  right: 50px;
  position: absolute;
`;

const Info = styled.span`
  position: absolute;
  top: 100px;
`;

function Latest() {
  const { data, isLoading } = useQuery<ILatestMoviesResult>(
    ["movies", "latest"],
    latestMovies
  );

  return (
    <Box>
      <Title>{data?.title}</Title>
    </Box>
  );
}
export default Latest;
