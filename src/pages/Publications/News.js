import React, { useEffect, useState } from 'react';
import NewsBanner from "../../Assetes/images/banner_news.png"
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import News1 from "../../Assetes/images/news1.png";
import News2 from "../../Assetes/images/news2.png";
import News3 from "../../Assetes/images/news3.jpeg";
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';

const News = () => {


  // State to track which content is currently displayed
  const [newsData, setNewsData] = useState([])
  const type = "news";
  const perPageRecords = 500;


  const [selectedContent, setSelectedContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newsData && Object.keys(newsData).length > 0) {
      const latestYear = Math.max(...Object.keys(newsData).map((year) => parseInt(year, 10))); // Get the latest year
      const firstPost = newsData[latestYear]?.[0]; // Get the first post of the latest year
      if (firstPost) {
        updateContent(firstPost.id); // Set the first post's content by default
      }
    }
  }, [newsData]);
  const updateContent = (postId) => {
    setLoading(true);

    const selectedPost = Object.values(newsData)
      .flat()
      .find((post) => post.id === postId);

    if (selectedPost) {
      var decodedString = decodeURIComponent(selectedPost.content);
      setSelectedContent(decodedString);
      setSelectedPost(selectedPost);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log('component mounted');
    fetchNewsData()
  }, []);
  const fetchNewsData = async () => {
    // setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", type);

      const resp = await pagesServices.getPostList({
        page: 1,
        perPageRecords,
        body: formData,
      });
      if (resp?.status_code === 200) {
        console.log(resp);
        if (resp?.list?.data) {
          // setNewsData(resp?.list?.data)
          const groupByYear = (data) => {
            return data.reduce((acc, post) => {
              if (!acc[post.year]) {
                acc[post.year] = [];
              }
              acc[post.year].push(post);
              return acc;
            }, {});
          };
          const groupedData = groupByYear(resp?.list?.data);
          console.log(groupedData)
          setNewsData(groupedData)


        } else {
          console.error("No data found in response.");
          notifyError("No data found. Please try again.");
        }
      } else {
        // Handle non-200 status codes or unexpected responses
        console.error("Failed to fetch data: ", resp?.message);
        notifyError("Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("An error occurred during fetching data. Please try again.");
    } finally {
      // setIsLoading(false); // Set loading to false once the request is done
    }

  };



  return (
    <div>
      <HeaderComponents />
      <MetaTitle pageTitle={'News – Redwood Peak Limited'} />
      <div>
        <Image
          src={NewsBanner}
          className="w-100 bannerHeight"
          alt="News Banner"
        />
      </div>

      <div className="container">
        <div className="container-custom mt-1 mb-5 p-4">
          <h1 className="header-post-title-class" >
            News
          </h1>
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
                        onClick={() => updateContent(newsData[year][0].id)} // Load the first post of the year on header click
                        style={{ cursor: 'pointer' }}
                      >
                        {year}
                      </div>
                      <div className="mt-4">
                        {newsData[year].slice(0, 5).map((post) => (
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
                                  className="img-thumbnail"
                                />
                              </div>
                              {/* Post Title */}
                              <div className="col-md-9">{post.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>


            <div className="col-md-9">
              <div className="mt-2">
                {loading ? (
                  <div>Loading content...</div> // Display loading text or spinner
                ) : (
                  <div>
                    <div className='pb-2'>
                        <h2 className='text-primary-color'>{selectedPost?.title}</h2>
                    </div>
                    <div
                      id="contentDisplay"
                      dangerouslySetInnerHTML={{ __html: selectedContent }}
                    />
                    {/* Displaying media with captions */}
                    {selectedPost?.media?.map((mediaItem) => (
                      <div key={mediaItem.id} className="media-item mb-4">
                        {/* Image or Video */}
                        <div className="media-content">
                          <img
                            src={mediaItem.path}
                            alt={mediaItem.caption || 'Media'}
                            className="img-fluid w-100" // Making it responsive and full width
                            loading="lazy"
                          />
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
