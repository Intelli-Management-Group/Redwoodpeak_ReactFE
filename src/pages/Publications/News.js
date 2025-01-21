import React, { useEffect, useState } from 'react';
import NewsBanner from "../../assets/images/banner_news.png"
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import News1 from "../../assets/images/news1.png";
import News2 from "../../assets/images/news2.png";
import News3 from "../../assets/images/news3.jpeg";
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';


const News = () => {
  // State to track which content is currently displayed
  const [newsData, setNewsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null); // State to track expanded year
  const [loading, setLoading] = useState(false);
  const type = "news";
  const perPageRecords = 500;

  useEffect(() => {
    console.log("component mounted");
    fetchNewsData();
  }, []);

  useEffect(() => {
    if (newsData && Object.keys(newsData).length > 0) {
      const latestYear = Math.max(...Object.keys(newsData).map((year) => parseInt(year, 10))); // Get the latest year
      setExpandedYear(latestYear.toString()); // Expand the latest year
      const firstPost = newsData[latestYear]?.[0]; // Get the first post of the latest year
      if (firstPost) {
        updateContent(firstPost.id); // Set the first post's content by default
      }
    }
  }, [newsData]);

  const fetchNewsData = async () => {
    try {
      const formData = new FormData();
      formData.append("category", type);

      const resp = await pagesServices.getPostList({
        page: 1,
        perPageRecords,
        body: formData,
      });

      if (resp?.status_code === 200 && resp?.list?.data) {
        const groupByYear = (data) => {
          return data.reduce((acc, post) => {
            if (!acc[post.year]) {
              acc[post.year] = [];
            }
            acc[post.year].push(post);
            return acc;
          }, {});
        };
        const groupedData = groupByYear(resp.list.data);
        setNewsData(groupedData);
      } else {
        console.error("No data found in response.");
        notifyError("No data found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("An error occurred during fetching data. Please try again.");
    }
  };

  const updateContent = (postId) => {
    setLoading(true);
    window.scrollTo(0, 370);

    const selectedPost = Object.values(newsData)
      .flat()
      .find((post) => post.id === postId);

    if (selectedPost) {
      const decodedString = decodeURIComponent(selectedPost.content);
      setSelectedContent(decodedString);
      setSelectedPost(selectedPost);
    }

    setLoading(false);
  };

  return (
    <div>
      <HeaderComponents />
      <MetaTitle pageTitle={"News – Redwood Peak Limited"} />
      <div>
        <Image src={NewsBanner} className="w-100 bannerHeight" alt="News Banner" />
      </div>

      <div className="container mb-5">
        <div className="container-custom mt-1 mb-5 p-4">
          {/*<h1 className="header-post-title-class">News</h1>*/}
          <div className="row">
            {/* Left Column for Thumbnails */}
            <div className="col-md-3">
              {Object.keys(newsData)
                .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
                .map((year) => (
                  <div key={year}>
                    {/* Year Header */}
                    <div id={`year-${year}`} className="mt-3 mb-4">
                      <div
                        className="year-header"
                        onClick={() => setExpandedYear(expandedYear === year ? null : year)} // Toggle year expansion
                        style={{ cursor: "pointer" }}
                      >
                        {year}
                      </div>
                      {/* Show posts only if the year is expanded */}
                      {expandedYear === year && (
                        <div className="mt-4">
                          {newsData[year].map((post) => (
                            <div
                              key={post.id}
                              className="pdf-row mb-3"
                              onClick={() => updateContent(post.id)} // Load content on thumbnail click
                            >
                              <div className="pdf-title row">
                                {/* Post Thumbnail */}
                                <div className="col-md-3">
                                  <Image
                                    src={post.thumbnail.path}
                                    alt={post.title}
                                    width={50}
                                    height={50}
                                    className="img-thumbnail pointer"
                                  />
                                </div>
                                {/* Post Title */}
                                <div className="col-md-9 pointer">{post.title}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Column for Content */}
            <div className="col-md-9">
              <div className="mt-2">
                {loading ? (
                  <div>Loading content...</div> // Display loading text or spinner
                ) : (
                  <div>
                    <div className="pb-2">
                      <h2 className="text-primary-color">{selectedPost?.title}</h2>
                    </div>
                    <div
                      id="contentDisplay"
                      dangerouslySetInnerHTML={{ __html: selectedContent }}
                    />
                    {/* Displaying media with captions */}
                    {selectedPost?.media?.map((mediaItem) => (
                      <div key={mediaItem.id} className="media-item mb-4">
                        {/* Image or Video */}
                        <div className="media-content text-center">
                          <a href={mediaItem.path} target="_blank" rel="noopener noreferrer">
                            <img
                              src={mediaItem.path}
                              alt={mediaItem.caption || "Media"}
                              className="img-fluid w-auto pointer" // Making it responsive and full width
                              loading="lazy"
                            />
                          </a>
                        </div>
                        {/* Media Caption */}
                        {mediaItem.caption && (
                          <div className="media-caption text-center mt-2">
                            <p>{mediaItem.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default News;
