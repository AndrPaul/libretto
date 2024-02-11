import { useEffect, useState } from "react";

interface Song {
  _type: string;
  annotation_count: number;
  api_path: string;
  artist_names: string;
  title: string;
  stats: {
    pageviews: number;
  };
  header_image_thumbnail_url: string;
}

interface ChartItem {
  _type: string;
  type: string;
  item: Song;
}

interface ChartResponse {
  chart_items: ChartItem[];
}

function formatNumberAbbreviated(num: number): string {
  const numAbs = Math.abs(num);
  const abbreviations = ["k", "M", "B", "T"];

  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= numAbs) {
      return Math.round((num / size) * 10) / 10 + abbreviations[i];
    }
  }
  return String(num); // return the original number if it's less than 1000
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength - 3) + "...";
  }
}

function Charts() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [visibleSongs, setVisibleSongs] = useState<number>(5);
  const [showMore, setShowMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const url = import.meta.env.VITE_GENIUS_URL_CHARTS;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_GENIUS_API_KEY,
          "X-RapidAPI-Host":import.meta.env.VITE_GENIUS_HOST,
        },
      };

      try {
        const response = await fetch(url, options);
        const data: ChartResponse = await response.json();
        setChartData(data.chart_items);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const handleToggleSongs = () => {
    if (showMore) {
      setVisibleSongs(chartData.length);
    } else {
      setVisibleSongs(5);
    }
    setShowMore(!showMore);
  };

  return (
    <div className="mx-auto mt-[80px] justify-center max-w-[1129px]">
      <div className="bg-white pt-[80px] rounded-[20px] px-[96px] pb-[130px] w-full">
        <h3 className="text-4xl font-black mb-[62px]">Charts</h3>
        {chartData.slice(0, visibleSongs).map((chartItem, index) => (
          <div
            key={chartItem.item.api_path}
            className="flex h-[42px] border-b-2 border-darkGrey text-[16px] mt-[15px] items-center"
          >
            <p className="w-[10px] mr-[19px]">{index + 1}</p>{" "}
            <img
              src={chartItem.item.header_image_thumbnail_url}
              alt={`Thumbnail for ${chartItem.item.title}`}
              className="w-[42px] mr-[20px] object-cover rounded-[5px]"
            />
            <p className="font-bold bg-slate-400 mr-[20px] w-[200px]">
              {chartItem.item.title
                .toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
            <p className="flex-grow text-center">
              {truncateText(chartItem.item.artist_names, 23)}
            </p>
            <p className="w-[100px] text-right bg-slate-200">
              {formatNumberAbbreviated(chartItem.item.stats.pageviews)}
            </p>
          </div>
        ))}
        {chartData.length > 5 && (
          <div className="flex justify-center mt-[56px]">
            <button
              className="text-violet font-extrabold hover:underline"
              onClick={handleToggleSongs}
            >
              {showMore ? "See More" : "See Less"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Charts;
