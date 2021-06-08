import React, { useState, useEffect, ReactNode } from 'react';
import Carousel from 'react-multi-carousel';
import styles from 'src/components/slider/scss/slider.module.scss';
import Button from 'src/components/button/button';
import Arrow from 'src/resources/img/arrow-r.svg';

type SliderProps = {
  items: ReactNode[],
  background?: 'brand' | 'light';
}

export default function Slider({ items, background = 'light' }: SliderProps) {
  const [windowSize, setWindowSize] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ButtonGroup = ({ next, previous, ...rest } : any) => {
    const { carouselState: { currentSlide, totalItems, slidesToShow } } = rest;
    return (<>
      {slidesToShow < items.length && <div className={styles.slider__buttons}>
        <Button
          size={'sm'}
          style={'empty'}
          icon={<Arrow/>}
          direction={'prev'}
          transform={'left'}
          disabled={currentSlide === 0} onClick={() => previous()}/>
        <Button
          size={'sm'}
          style={'empty'}
          icon={<Arrow/>}
          direction={'next'}
          disabled={currentSlide === totalItems - slidesToShow}
          transform={'right'}
          onClick={() => next()}/>
      </div>}
    </>);
  };

  const responsive = {
    xxl: {
      breakpoint: { max: 6000, min: 1680 },
      items: 4
    },
    xl: {
      breakpoint: { max: 1679, min: 1400 },
      items: 3
    },
    lg: {
      breakpoint: { max: 1399, min: 1200 },
      items: 3
    },
    md: {
      breakpoint: { max: 1199, min: 768 },
      items: 2,
      partialVisibilityGutter: 0,
    },
    sm: {
      breakpoint: { max: 767, min: 576 },
      items: 1,
      partialVisibilityGutter: 200,
    },
    xs: {
      breakpoint: { max: 575, min: 0 },
      items: 1,
      partialVisibilityGutter: 30,
    }
  };

  return <div className={`${styles.slider} ${styles[`slider--${background}`]}`}>
    <Carousel
      arrows={false}
      renderButtonGroupOutside={true}
      customButtonGroup={<ButtonGroup />}
      infinite={true}
      responsive={responsive}
      swipeable={true}
      partialVisible={true}
      additionalTransfrom={windowSize < 576 ? 15 : windowSize < 768 ? 100 : 0}
    >
      {items.map((item, key) =>
        <div key={key} className={styles.slider__item}>{item}</div>
      )}
    </Carousel>
  </div>;
}
