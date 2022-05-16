import { json } from "stream/consumers";

export async function fetchCoins() {
  return fetch("https://api.coinpaprika.com/v1/coins")
  .then((response) => response.json());
  
}