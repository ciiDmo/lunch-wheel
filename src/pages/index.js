import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import kingJulien from "../imgs/king_julien.png";
import Image from "next/image";
import Confetti from "react-confetti";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [input, setInput] = useState({});
  const [dataInfo, setDataInfo] = useState([]);
  const [spinValue, setSpinValue] = useState(0);
  const [spinTime, setSpinTime] = useState(0);
  const [congrats, setCongrats] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const calculatePath = (value, index) => {
    const startAngle = dataInfo.slice(0, index).reduce((acc, value) => acc + ((value.percentage) / (100)) * 360, 0);
    const endAngle = startAngle + ((value) / (100)) * 360;
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const startX = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
    const startY = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
    const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
    const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

    return `M50,50 L${startX},${startY} A50,50 0 ${largeArcFlag},1 ${endX},${endY} Z`;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  const isLight = (color) => {
    if (color.length === 7) {
      const rgb = [
        parseInt(color.substring(1, 3), 16),
        parseInt(color.substring(3, 5), 16),
        parseInt(color.substring(5), 16),
      ];
      const luminance =
        (0.2126 * rgb[0]) / 255 +
        (0.7152 * rgb[1]) / 255 +
        (0.0722 * rgb[2]) / 255;
      if (luminance > 0.5) return "#000000";
    }
    return "#ffffff";
  }
  
  
  const calculateTextAngle = (value, index) => {
    const startAngle = dataInfo.slice(0, index).reduce((acc, value) => acc + ((value.percentage) / (100)) * 360, 0);
    const endAngle = startAngle + ((value.percentage) / (100)) * 360;
    const textAngle = startAngle + ((endAngle - startAngle) / 2);
    const textPos = polarToCartesian(50, 50, 35, textAngle);

    return {
      x: textPos.x,
      y: textPos.y,
      textAnchor: "middle",
      dominantBaseline: "middle",
      transform: `rotate(${textAngle + 90} ${textPos.x} ${textPos.y})`,
      fill: value.textColor,
      textContent: `${value.name}`,
      style: {
        fontSize: "6px",
      }
    }
  }

  let timeOut = null;

  const handleSpin = () => {
    setSpinning(true);
    const date = new Date();
    const currentHour = date.getHours();
    const currentMinutes = date.getMinutes();
    const spin = (currentHour + currentMinutes) * 30 + Math.floor(Math.random() * 360);
    const newRotation = spinValue + spin + (360 * 30);
    const newTime = ((spinValue / 15) / 360) + 8;
    setSpinValue(newRotation);
    setSpinTime(newTime);

    timeOut = setTimeout(() => {
      const getAngle = newRotation % 360;
      const getItemAtAngle = () => {
        let acc = 0;
        let start = 0;
        let end = 0;
        for (let index = 0; index < dataInfo.length; index++) {
          acc += dataInfo[index].percentage * 3.6;
          if (acc >= getAngle) {
            start = index === 0 ? 0 : acc - dataInfo[index - 1].percentage * 3.6;
            end = acc;
            if (getAngle >= start && getAngle <= end) {
              return dataInfo[index];
            }
          }
        }
        if (acc < getAngle) {
          return {name: "No winner"};
        }
      }

      setSpinning(false);
      setCongrats(getItemAtAngle().name ? getItemAtAngle().name : "the one with color " + ntc.name(getItemAtAngle().color)[1]);
    }, newTime * 1000);
  };

  return (
    <>
      <Head>
        <title>II LUNCH WHEEL</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://chir.ag/projects/ntc/ntc.js"></script>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1 className={`${styles.title}`}>
          <span className={`${styles.yellow}`}>II Lu</span>
          <span className={`${styles.magenta}`}>nch W</span>
          <span className={`${styles.cyan}`}>heel</span>
        </h1>
        <div className={`${styles.content}`}>
          <div>
            <div className={`${styles.wheel}`}>
              <svg
                width="400"
                height="400"
                viewBox="0 0 100 100"
                style={{ transform: `rotate(${-spinValue}deg)`, transition: `transform ${spinTime}s ease-out` }}
              >
                {dataInfo.length > 0 ?
                  dataInfo.map((value, index) => (
                    <g key={index}>
                      <path
                        id={`path-${index}-${ntc.name(value.color)[1]}`}
                        d={calculatePath(value.percentage, index)}
                        fill={value.color}
                      />
                      <text {...calculateTextAngle(value, index)}>{value.name}</text>
                    </g>
                  )) :
                  <path d="M50,50 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0" fill="#82ceff6e" />
                }
              </svg>
              <div className={`${styles.arrow}`}>
                <svg width="26" height="40" viewBox="0 0 26 40">
                  <polygon points="0,0 26,0 13,40" fill="#000000" />
                </svg>
              </div>
              <Image src={kingJulien} alt="king-julien" />
              <button
                onClick={() => {
                  timeOut && clearTimeout(timeOut);
                  handleSpin()
                }}
                className={`${styles.spinButton}`}
                disabled={spinning}
                style={{cursor: spinning ? "not-allowed" : "pointer", opacity: spinning ? 0.5 : 1}}
              >
                Spin the Wheel
              </button>
            </div>
            <div className={`${styles.controls}`}>
              <div className={`${styles.inputs}`}>
                <input
                  type="number"
                  placeholder="Percentage"
                  onChange={(e) => setInput({...input, data: Number(e.target.value)})}
                />
                <input
                  type="color"
                  value={input.color}
                  onChange={(e) => setInput({...input, color: e.target.value})}
                />
                <input
                  type="text"
                  value={input.name}
                  placeholder="Name"
                  onChange={(e) => setInput({...input, name: e.target.value})}
                />
              </div>
              <div className={`${styles.buttons}`}>
                <button
                  onClick={() => {
                    const accumulated = dataInfo.reduce((acc, value) => acc + value.percentage, 0);
                    if (accumulated + input.data > 100) {
                      alert("Total value cannot exceed 100");
                      return;
                    }
                    const color = input.color ? input.color : getRandomColor();
                    const newInfo = {
                      percentage: input.data,
                      color: color,
                      name: input.name,
                      textColor: isLight(color),
                    }
                    if (input.data > 99.999) {
                      newInfo.percentage = 99.999;
                    }
                    setDataInfo([
                      ...dataInfo,
                      newInfo
                    ]);
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setDataInfo([]);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className={`${styles.dataList}`}>
            {dataInfo.map((value, index) => (
              <div key={index} className={`${styles.data}`}>
                <input
                  type="number"
                  value={value.percentage}
                  onChange={(e) => {
                    setDataInfo(dataInfo.map((info, i) => i === index ?
                        {
                          percentage: Number(e.target.value) > 99.999 ? 99.999 : Number(e.target.value),
                          color: info.color,
                          name: info.name,
                          textColor: info.textColor
                        } :
                        info
                    ));
                  }}
                />
                <input
                  type="color"
                  value={value.color}
                  onChange={(e) => {
                    setDataInfo(dataInfo.map((info, i) => i === index ?
                      {
                        percentage: info.percentage,
                        color: e.target.value,
                        name: info.name,
                        textColor: isLight(e.target.value)
                      } :
                      info
                    ));
                  }}
                />
                <input
                  type="text"
                  value={value.name}
                  onChange={(e) => {
                    setDataInfo(dataInfo.map((info, i) => i === index ?
                      {
                        percentage: info.percentage,
                        color: info.color,
                        name: e.target.value,
                        textColor: info.textColor
                      } :
                      info
                    ));
                  }}
                />
                <button
                  onClick={() => {
                    setDataInfo(dataInfo.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        {congrats && (
          <>
            <div className={`${styles.congratsBg}`}></div>
            <div className={`${styles.congrats}`}>
              <div className={`${styles.close}`} onClick={() => setCongrats(false)}></div>
              {congrats !== "No winner" ?
                <>
                  <h2>Congratulations!</h2>
                  <p>We will go to lunch at {congrats}</p>
                </> :
                <>
                  <h2>Sorry!</h2>
                  <p>We will not lunch today... :/</p>
                </>
              }
            </div>
          </>
        )}
      </main>
      {congrats && congrats !== "No winner" && <Confetti style={{zIndex: "4"}} width={window.innerWidth} height={window.innerHeight}/>}
    </>
  );
}