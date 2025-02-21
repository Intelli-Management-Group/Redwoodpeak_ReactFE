import React, { useEffect, useState } from 'react';
import NewsBanner from "../../assets/banner_images/redwood_publication.jpg";
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
import { useLocation } from 'react-router-dom';

const Visits = () => {
  const location = useLocation();
  const [newsData, setNewsData] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null);
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
      const latestYear = Math.max(...Object.keys(newsData).map(year => parseInt(year, 10)));
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
        const selectedPost = Object.values(newsData).flat().find(post => post.id === postId);
        if (selectedPost && selectedPost.year) {
          setExpandedYear(selectedPost.year.toString());
        }
      } else if (expandedYear && newsData[expandedYear] && yearsSwitch) {
        updateContent(newsData[expandedYear][0].id);
      }
    }
  }, [newsData, postId]);

  useEffect(() => {
    if (expandedYear && newsData[expandedYear] && yearsSwitch) {
      updateContent(newsData[expandedYear][0].id);
    }
  }, [expandedYear]);

  const updateContent = (postId) => {
    setLoading(true);
    window.scrollTo({ top: 370, behavior: 'smooth' });
    const selectedPost = Object.values(newsData).flat().find(post => post.id === postId);
    if (selectedPost) {
      setSelectedContent(decodeURIComponent(selectedPost.content));
      setSelectedPost(selectedPost);
    }
    setLoading(false);
  };

  const fetchVisitData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("category", type);

      const resp = await pagesServices.getPostList({ page: 1, perPageRecords, body: formData });
      if (resp?.status_code === 200 && resp?.list?.data) {
        const groupByYear = data => data.reduce((acc, post) => {
          if (!acc[post.year]) acc[post.year] = [];
          acc[post.year].push(post);
          return acc;
        }, {});
        setNewsData(groupByYear(resp.list.data));
      } else {
        notifyError("No data found. Please try again.");
      }
    } catch (error) {
      notifyError("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="page-wrapper">
        <HeaderComponents />
        <MetaTitle pageTitle="Visits – Redwood Peak Limited" />
        <div className="content-area">
          <Image src={NewsBanner} className="w-100 bannerHeight" alt="News Banner" />
          <div className="container mb-5">
            <div className="container-custom mt-1 mb-5 p-4">
              {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
                    <div className="spinner-border text-primary-color" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
              ) : (
                  <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                      {Object.keys(newsData).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
                          <div key={year}>
                            <div className="year-header mt-3 mb-4" onClick={() => { setExpandedYear(expandedYear === year ? null : year); setYearsSwitch(true); }}>
                              {year}
                            </div>
                            {expandedYear === year && (
                                <div className="mt-4">
                                  {newsData[year].map(post => (
                                      <div key={post.id} className="pdf-row mb-3 pointer" onClick={() => updateContent(post.id)}>
                                        <div className="pdf-title row">
                                          <div className="col-3">
                                            <Image src={post.thumbnail.path} alt={post.title} className="img-thumbnail pointer w-100" />
                                          </div>
                                          <div className="col-9">{post.title}</div>
                                        </div>
                                      </div>
                                  ))}
                                </div>
                            )}
                          </div>
                      ))}
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="mt-2">
                        {loading ? (
                            <div>Loading content...</div>
                        ) : (
                            <div>
                              <div className="pb-2">
                                <h2 className="text-primary-color">{selectedPost?.title}</h2>
                              </div>
                              <div id="contentDisplay" dangerouslySetInnerHTML={{ __html: selectedContent }} />
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
