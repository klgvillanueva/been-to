import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Datamap from 'react-datamaps';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const MapContainer = styled.div`
  & .datamap path {
    cursor: pointer;
  }
`;

// TODO: check class against defined list of country codes
const isCountryCode = (className: string) => className.length === 3;

/**
 * Attemps to get country code from elements list of classNames.
 * Returns empty string if not found
 */
const getCountry = (target: EventTarget) => {
  if (!(target as Element)?.classList) return '';

  let country = '';
  (target as Element).classList.forEach((className) => {
    if (isCountryCode(className)) country = className;
  });
  return country;
};

interface countryData {
  fillKey: 'visited' | 'defaultFill';
}

/**
 * adds or remove country to object with fillKey 'visited'.
 * Doesn't mutate object passed as first param.
 * @param mapData Map mapData state object
 * @param country Country code string
 */
const toggleCountryVisited = (mapData: Record<string, countryData>, country: string) => {
  const dataCopy = { ...mapData };
  if (dataCopy[country]) {
    delete dataCopy[country];
    return dataCopy;
  }

  dataCopy[country] = { fillKey: 'visited' };
  return dataCopy;
};

// const calculateWidth = (winWidth: number, winHeight: number, mapRatio: number) => {
//   if (winHeight > winWidth) return winWidth * mapRatio;
//   return winHeight * mapRatio;
// };

const Map = () => {
  const [mapData, setMapData] = useState({});
  // const [winHeight, setHeight] = useState(window.innerHeight);
  // const [winWidth, setWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWidth(window.innerWidth);
  //     setHeight(window.innerHeight);
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // });

  const projection = 'mercator';
  // const mapRatios = {
  //   mercator: 568 / 360.94,
  // };

  const handleClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    const country = getCountry(evt.target);
    if (!country) return;
    setMapData(toggleCountryVisited(mapData, country));
  };

  return (
    <TransformWrapper wheel={{ step: 100 }} >
      <TransformComponent>
        <MapContainer
          onClick={handleClick}
          style={{
            width: "100vw",
            height: "100vh"
          }}
        >
          <Datamap
            projection={projection}
            fills={{
              defaultFill: '#ABDDA4',
              visited: '#ff0000',
            }}
            data={mapData}
            updateChoroplethOptions={{ reset: true }}
            geographyConfig={{popupOnHover: false}}
          />
        </MapContainer>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default Map;
