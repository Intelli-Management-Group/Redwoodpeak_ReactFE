import React, { useEffect, useState } from 'react';
import Image from '../Component/ImagesComponets/ImagesComponets';
import PublicationsnBanner from "../../assets/images/banner_publications.jpg"
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import pdfIcon from "../../assets/images/pdf_icon1.png"
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';

const Publications = () => {
  const [visibleYears, setVisibleYears] = useState([]);
  const documentType = "publications";
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([])
  useEffect(() => {
    // console.log('component mounted');
    fetchPublication()
  }, []);
  useEffect(() => {
    const firstYear = Object.keys(data)
      .sort((a, b) => parseInt(b) - parseInt(a))[0];
    setVisibleYears([parseInt(firstYear)]);
  }, [data]);

  const toggleVisibility = (year) => {
    setVisibleYears((prevYears) => {
      if (prevYears.includes(year)) {
        return prevYears.filter((item) => item !== year);
      } else {
        return [...prevYears, year];
      }
    });
  };
  const fetchPublication = async () => {
    setIsLoading(true);
    try {
      const resp = await pagesServices.getPageList({ documentType });
      if (resp?.status_code === 200) {
        console.log(resp);
        if (resp?.list?.data) {
          const publications = resp.list.data.reduce((acc, item) => {
            if (!acc[item.year]) {
              acc[item.year] = [];
            }
            acc[item.year].push(item);
            return acc;
          }, {});
          setData(publications || []);
          // const latestYear = Math.max(...Object.keys(publications).map((year) => parseInt(year)));
          // setVisibleYears(latestYear)
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
      setIsLoading(false); // Set loading to false once the request is done
    }

  };

  return (
    <div>
      <HeaderComponents />
      <MetaTitle pageTitle={'Publications – Redwood Peak Limited'} />
      <div>
        <Image
          src={PublicationsnBanner}
          className="w-100 bannerHeight"
          alt="OverView Banner"
        />
      </div>
      <div className="container mb-5">
        <div className="container-custom mt-1 mb-5 p-4">
          <h1 className="header-post-title-class" >
            Publications
          </h1>
          {/* <h1 className="header-post-title-class" style={{ top: 0 }}>
            Publications
          </h1> */}
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
              <div className="spinner-border text-primary-color" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              {/* Render each year */}
              {/* {Object.keys(data).map((year) => (
                <div key={year} id={`year-${year}`}>
                  <div
                    className="year-header pt-1 pb-1"
                    onClick={() => toggleVisibility(year)}
                    style={{ cursor: 'pointer' }}
                  >
                    {year}
                  </div>

                  {visibleYear === year && (
                    <div className="ml-5">
                      {data[year]
                        .sort((a, b) => {
                          const dateA = new Date(a.created_at || a.file_name);
                          const dateB = new Date(b.created_at || b.file_name);
                          return dateB - dateA;
                        })
                        .map((item, index) => {
                          console.log(item)
                          return (
                            <div key={index} className="pdf-row p-3">
                              <div className="pdf-title">
                                <span>
                                  <Image
                                    src={pdfIcon}
                                    alt="PDF icon"
                                  />
                                </span>

                                <a
                                  href={item.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                  {item.file_name.split('.').slice(0, -1).join('.').length > 60
                                    ? item.file_name.split('.').slice(0, -1).join('.').substring(0, 60) + "..."
                                    : item.file_name.split('.').slice(0, -1).join('.')}
                                </a>
                              </div>

                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              ))} */}
              {Object.keys(data)
                .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
                .map((year) => (
                  <div key={year} id={`year-${year}`}>
                    <div
                      className="year-header pt-1 pb-1"
                      onClick={() => toggleVisibility(parseInt(year, 10))}
                      style={{ cursor: 'pointer' }}
                    >
                      {year}
                    </div>

                    {/* Conditionally render the PDFs for the year with transition effect */}
                    {visibleYears.includes(parseInt(year, 10)) && (
                      <div className="pdf-content ml-5">
                        {data[year]
                          .sort((a, b) => {
                            const dateA = new Date(a.created_at || a.file_name);
                            const dateB = new Date(b.created_at || b.file_name);
                            return dateB - dateA; // Descending order of dates
                          })
                          .map((item, index) => (
                            <div key={index} className="pdf-row p-3">
                              <div className="pdf-title">
                                <span>
                                  <Image src={pdfIcon} alt="PDF icon" />
                                </span>

                                <a
                                  href={item.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                  {item.file_name.split('.').slice(0, -1).join('.').length > 60
                                    ? item.file_name.split('.').slice(0, -1).join('.').substring(0, 60) + "..."
                                    : item.file_name.split('.').slice(0, -1).join('.')}
                                </a>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Publications;
