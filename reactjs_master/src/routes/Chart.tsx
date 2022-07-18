import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

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

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () => 
  fetchCoinHistory(coinId),
  {
    refetchInterval: 10000,
  }
  );
  return <div>{isLoading ? (
      "Loading chart..."
    ) : ( 
    <ApexChart 
    type="candlestick"
    series={[
      {
        data: data?.map((price) => {
        return{
          x: price.time_close,
          y: [price.open.toFixed(2), price.high.toFixed(2), price.low.toFixed(3), price.close.toFixed(3)]
            }
          })
        },
      ] as unknown as number[]}
    options={{
      theme: {
        mode: "dark",
      },
      chart: {
        type: "candlestick",
        height: 350,
        width: 500,
        toolbar: {
          show:false,
        },
        background: "transparent",
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        type: "datetime",
        categories: data?.map((price) => price.time_close),
        labels: {
          style: {
            colors: "#f5f6fa"
          }
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#0be881",
            downward: "#0fbcf9"
          }
        }
      }
    }}
  />
      )}
    </div>;
}
  
  export default Chart;