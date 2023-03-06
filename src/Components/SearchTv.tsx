import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IGetSearchMovies, IGetSearchTv, searchMovie, searchTv } from "../api";
import { makeImagePath } from "../utils";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  background: black;
`;

const Slider = styled.div`
  position: relative;
  top: 300px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;


const SmallBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 120px;
  position: relative;
  top: 500px;
`;

const SmallTitle = styled.h3`
  font-size: 35px;
`;

const Btn = styled.button`
  left: 250px;
  position: absolute;
  margin-top: 20px;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const offset = 6;

function SearchTv() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);


  const useMultipleQuery = () => {
    const tv = useQuery<IGetSearchTv>(["tv", keyword], () => searchTv(keyword ?? "none"));
    return [tv]; 
  };

const [
  {isLoading: loadingTv, data:tv},
] = useMultipleQuery(); 

const [tvIndex, setTvIndex] = useState(0);
const [tvLeaving, setTvLeaving] = useState(false);
const toggleTvLeaving = () => setTvLeaving((prev) => !prev);
const increaseTvIndex = () => {
  if (tv) {
    if (tvLeaving) return;
    toggleTvLeaving();
    const totalTv = tv.results.length - 1;
    const maxIndex = Math.floor(totalTv / offset) - 1;
    setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }
};

  return(
    <Wrapper>
    {loadingTv ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <SmallBox style={{top: 400}}>
          <SmallTitle >Tv Results</SmallTitle>
          <Btn  onClick={increaseTvIndex }>Next</Btn>
        </SmallBox>
        <Slider>
          <AnimatePresence initial={false} onExitComplete={toggleTvLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={tvIndex}
            >
              {tv?.results
                
                .slice(offset * tvIndex, offset * tvIndex + offset)
                .map((tv) => (
                  <Box
                    layoutId={tv.id + ""}
                    key={tv.id}
                    whileHover="hover"
                    initial="normal"
                    transition={{ type: "tween" }}
                    variants={boxVariants}
                    bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      </>
    )}
  </Wrapper>
);
  
  
      
}
export default SearchTv;
