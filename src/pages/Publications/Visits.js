import React, { useEffect, useState } from 'react';
import NewsBanner from "../../assets/banner_images/redwood_publication.jpg"
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import News2 from "../../assets/images/news2.png";
import News3 from "../../assets/images/news3.jpeg";
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
import { useLocation } from 'react-router-dom';

const Visits = () => {
  // State to track news data, currently displayed content, and expanded year
  const location = useLocation();
  const [newsData, setNewsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null); // Track which year's content is expanded
  const [loading, setLoading] = useState(false);
  const [yearsSwitch, setYearsSwitch] = useState(false);
  const postId = location.state?.id;

  const type = "visit";
  const perPageRecords = 500;

  useEffect(() => {
    fetchVisitData();
  }, []);

  useEffect(() => {
    if (newsData && Object.keys(newsData).length > 0) {
      const latestYear = Math.max(...Object.keys(newsData).map((year) => parseInt(year, 10)));
      setExpandedYear(latestYear.toString());
    }
  }, [newsData]);

  useEffect(() => {
    if (newsData) {
      if (postId && !yearsSwitch) {
        updateContent(postId);
        const selectedPost = Object.values(newsData)
          .flat()
          .find((post) => post.id === postId);

        if (selectedPost && selectedPost.year) {
          setExpandedYear(selectedPost.year.toString());
        }
      } else if (expandedYear && newsData[expandedYear] && yearsSwitch) {
        const firstPost = newsData[expandedYear][0];
        if (firstPost) {
          updateContent(firstPost.id);
        }
      }
    }
  }, [newsData, postId]);
  useEffect(() => {
    if (expandedYear && newsData[expandedYear] && yearsSwitch) {
      const firstPost = newsData[expandedYear][0];
      if (firstPost) {
        updateContent(firstPost.id);
      }
    }
  }, [expandedYear])

  const updateContent = (postId) => {
    setLoading(true);
    window.scrollTo({ top: 370, behavior: 'smooth' });
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

  const fetchVisitData = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("category", type);

      const resp = await pagesServices.getPostList({
        page: 1,
        perPageRecords,
        body: formData,
      });

      if (resp?.status_code === 200 && resp?.list?.data) {
        const groupByYear = (data) =>
          data.reduce((acc, post) => {
            if (!acc[post.year]) acc[post.year] = [];
            acc[post.year].push(post);
            return acc;
          }, {});

        const groupedData = groupByYear(resp.list.data);
        setNewsData(groupedData);
        setLoading(false)

      } else {
        console.error("No data found in response.");
        notifyError("No data found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("An error occurred during fetching data. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <HeaderComponents />
      <MetaTitle pageTitle={"Visits – Redwood Peak Limited"} />
      <div className="content-area">

        <div>
          <Image
            src={NewsBanner}
            className="w-100 bannerHeight"
            alt="News Banner"
          />
        </div>

        <div className="container mb-5">
          <div className="container-custom mt-1 mb-5 p-4">
            {/*<h1 className="header-post-title-class">Visits</h1>*/}
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                <div className="spinner-border text-primary-color" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {/* Left Column for Year and Post Thumbnails */}
                <div className="col-md-3">
                  {Object.keys(newsData)
                    .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
                    .map((year) => (
                      <div key={year}>
                        {/* Year Header */}
                        <div
                          className="year-header mt-3 mb-4"
                          onClick={() => {
                            setExpandedYear(expandedYear === year ? null : year);
                            setYearsSwitch(true);
                          }} 
                          style={{ cursor: "pointer" }}
                        >
                          {year}
                        </div>
                        {expandedYear === year && ( // Only display posts for the expanded year
                          <div className="mt-4">
                            {newsData[year].map((post) => (
                              <div
                                key={post.id}
                                className="pdf-row mb-3 pointer"
                                onClick={() => updateContent(post.id)}
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
                                  <div className="col-md-9">{post.title}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Right Column for Content Display */}
                <div className="col-md-9">
                  <div className="mt-2">
                    {loading ? (
                      <div>Loading content...</div> // Loading Spinner or Text
                    ) : (
                      <div>
                        {/* Post Title */}
                        <div className="pb-2">
                          <h2 className="text-primary-color">
                            {selectedPost?.title}
                          </h2>
                        </div>

                        {/* Post Content */}
                        <div
                          id="contentDisplay"
                          dangerouslySetInnerHTML={{ __html: selectedContent }}
                        />

                        {/* Media with Captions */}
                        {selectedPost?.media?.map((mediaItem) => (
                          <div key={mediaItem.id} className="media-item mb-4">
                            <div className="media-content text-center">
                              <a
                                href={mediaItem.path}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={mediaItem.path}
                                  alt={mediaItem.caption || "Media"}
                                  className="img-fluid w-auto pointer"
                                  loading="lazy"
                                />
                              </a>
                            </div>
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Visits;
