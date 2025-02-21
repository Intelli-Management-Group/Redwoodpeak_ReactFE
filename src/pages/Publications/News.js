import React, { useEffect, useState } from 'react';
import NewsBanner from "../../assets/banner_images/redwood_publication.jpg";
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
import { useLocation } from 'react-router-dom';

const News = () => {
  const location = useLocation();
  const [newsData, setNewsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yearsSwitch, setYearsSwitch] = useState(false);
  const type = "news";
  const perPageRecords = 500;
  const postId = location.state?.id;

  useEffect(() => {
    fetchNewsData();
  }, []);

  useEffect(() => {
    if (newsData && Object.keys(newsData).length > 0) {
      const latestYear = Math.max(...Object.keys(newsData).map((year) => parseInt(year, 10)));
      setExpandedYear(latestYear.toString());
      if (!postId) {
        setYearsSwitch(true);
      }
    }
  }, [newsData]);

  useEffect(() => {
    if (newsData) {
      if (postId && !yearsSwitch) {
        updateContent(postId);
        const selectedPost = Object.values(newsData).flat().find((post) => post.id === postId);
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
  }, [expandedYear]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("category", type);
      const resp = await pagesServices.getPostList({ page: 1, perPageRecords, body: formData });

      if (resp?.status_code === 200 && resp?.list?.data) {
        const groupByYear = (data) => {
          return data.reduce((acc, post) => {
            if (!acc[post.year]) acc[post.year] = [];
            acc[post.year].push(post);
            return acc;
          }, {});
        };
        setNewsData(groupByYear(resp.list.data));
      } else {
        notifyError("No data found. Please try again.");
      }
    } catch (error) {
      notifyError("An error occurred during fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (postId) => {
    setLoading(true);
    window.scrollTo({ top: 370, behavior: 'smooth' });

    const selectedPost = Object.values(newsData).flat().find((post) => post.id === postId);
    if (selectedPost) {
      setSelectedContent(decodeURIComponent(selectedPost.content));
      setSelectedPost(selectedPost);
    }
    setLoading(false);
  };

  return (
      <div className="page-wrapper">
        <HeaderComponents />
        <MetaTitle pageTitle={"News – Redwood Peak Limited"} />
        <div className="content-area">
          {/* Banner Image */}
          <Image src={NewsBanner} className="w-100 bannerHeight img-fluid" alt="News Banner" />

          <div className="container my-5">
            <div className="row">
              {/* Left Column: Year-wise News List */}
              <div className="col-lg-3 col-md-4 col-sm-12">
                {Object.keys(newsData)
                    .sort((a, b) => parseInt(b) - parseInt(a))
                    .map((year) => (
                        <div key={year}>
                          {/* Year Header */}
                          <div className="mt-3 mb-4">
                            <div
                                className="year-header fw-bold"
                                onClick={() => {
                                  setExpandedYear(expandedYear === year ? null : year);
                                  setYearsSwitch(true);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                              {year}
                            </div>

                            {/* Show posts only if the year is expanded */}
                            {expandedYear === year && (
                                <div className="mt-3">
                                  {newsData[year].map((post) => (
                                      <div
                                          key={post.id}
                                          className="news-item mb-3 d-flex align-items-center"
                                          onClick={() => updateContent(post.id)}
                                          style={{ cursor: "pointer" }}
                                      >
                                        {/* Thumbnail */}
                                        <Image
                                            src={post.thumbnail.path}
                                            alt={post.title}
                                            className="img-thumbnail pointer me-3"
                                            style={{ width: 50, height: 50, objectFit: "cover" }}
                                        />
                                        {/* Title */}
                                        <span>{post.title}</span>
                                      </div>
                                  ))}
                                </div>
                            )}
                          </div>
                        </div>
                    ))}
              </div>

              {/* Right Column: News Content */}
              <div className="col-lg-9 col-md-8 col-sm-12">
                {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                ) : (
                    <div className="news-content">
                      {selectedPost && (
                          <>
                            <h2 className="text-primary-color">{selectedPost.title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: selectedContent }} />

                            {/* Display media items */}
                            {selectedPost?.media?.map((mediaItem) => (
                                <div key={mediaItem.id} className="text-center my-4">
                                  <a href={mediaItem.path} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={mediaItem.path}
                                        alt={mediaItem.caption || "Media"}
                                        className="img-fluid rounded"
                                        style={{ maxWidth: "100%", height: "auto" }}
                                    />
                                  </a>
                                  {mediaItem.caption && <p className="mt-2">{mediaItem.caption}</p>}
                                </div>
                            ))}
                          </>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default News;
