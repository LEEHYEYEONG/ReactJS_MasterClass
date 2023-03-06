import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { airingTv, IGetTvResult, IPopularTvResult, ITopTvResult, popularTv, topTv } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import LatestTv from "../Components/LatestTv";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -60px;
`;

const SmallBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 120px;
  position: relative;
`;

const SmallTitle = styled.h3`
  font-size: 35px;
`;

const Btn = styled.button`
  left: 200px;
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

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useScroll();

  const useMultipleQuery = () => {
    const tv = useQuery<IGetTvResult>(
      ["tv", "airing"],
      airingTv
    );
    const popular = useQuery<IPopularTvResult>(
      ["tv", "popular"],
      popularTv
    );
    const top = useQuery<ITopTvResult>(
      ["movies", "top"],
      topTv
    )

    return [tv, popular, top];
  };
  const [
    { isLoading: loadingTv, data: tv },
    { isLoading: loadingPopular, data: popularData },
    { isLoading: loadingTop, data: topData },
  ] = useMultipleQuery();
  const [index, setIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [popularLeaving, setPopularLeaving] = useState(false);
  const [topLeaving, setTopLeaving] = useState(false);
  const increaseIndex = () => {
    if (tv) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = tv.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increasePopularIndex = () => {
    if (popularData) {
      if (popularLeaving) return;
      togglePopularLeaving();
      const totalTv = popularData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseTopIndex = () => {
    if (topData) {
      if (topLeaving) return;
      toggleTopLeaving();
      const totalTv = topData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const togglePopularLeaving = () => setLeaving((prev) => !prev);
  const toggleTopLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    tv?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
  return (
    <Wrapper>
      {loadingTv ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(tv?.results[0].backdrop_path || "")}
          >
           
            <Title> {tv?.results[0].name}</Title>
            <Overview>{tv?.results[0].overview}</Overview>
          </Banner>
          <SmallBox>
            <SmallTitle>Latest Tv</SmallTitle>
            <LatestTv/>
          </SmallBox>
          <SmallBox>
            <SmallTitle>Airing Today</SmallTitle>
            <Btn onClick={increaseIndex}>Next</Btn>
          </SmallBox>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {tv?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
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
          <SmallBox style={{ top: 100 }}>
            <SmallTitle >Popular</SmallTitle>
            <Btn onClick={increasePopularIndex}>Next</Btn>
          </SmallBox>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={togglePopularLeaving}>
              <Row
                style={{top:100}}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.name + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      style={{cursor: "auto"}}
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
          <SmallBox style={{ top: 200 }}>
            <SmallTitle>Upcoming</SmallTitle>
            <Btn onClick={increaseTopIndex}>Next</Btn>
          </SmallBox>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleTopLeaving}>
              <Row
                style={{top:200}}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topData?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.name + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      style={{cursor: "auto"}}
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
           <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigTvMatch.params.tvId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence> 
        </>
      )}
    </Wrapper>
  );
}
export default Tv;