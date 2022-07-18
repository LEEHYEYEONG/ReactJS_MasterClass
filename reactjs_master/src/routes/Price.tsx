import moment from "moment";
import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";

const Overview = styled.div`
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  span {
    display: block;
    font-size: 12px;
  }
`;

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Price({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () => 
  fetchCoinHistory(coinId),
  {
    refetchInterval: 10000,
  }
  );
  return <div>{isLoading ? (
      "Loading chart..."
    ) : ( 
      <div>
        <div>{data?.map((date) => (
          <h2>{moment(date.time_open).format('YYYY-MM-DD')}
            <Overview>
              <span>High Price: ${(date.high).toFixed(2)}</span> 
              <span>Low Price: ${(date.low).toFixed(2)}</span> 
              <span>Close Price: ${(date.close).toFixed(2)}</span> 
            </Overview>
          </h2>
          
          ))}
        </div>
      </div>
    )}
    </div>;
}

export default Price;