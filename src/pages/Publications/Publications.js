import React, { useEffect, useState, useRef } from 'react';
import Image from '../Component/ImagesComponets/ImagesComponets';
import PublicationsnBanner from "../../assets/banner_images/redwood_publication.jpg";
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import pdfIcon from "../../assets/images/pdf_icon1.png";
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';

const Publications = () => {
  const [visibleYears, setVisibleYears] = useState([]);
  const documentType = "publications";
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [maxHeight, setMaxHeight] = useState(0);

  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    fetchPublication();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (leftColRef.current && rightColRef.current) {
        const leftHeight = leftColRef.current.clientHeight;
        const rightHeight = rightColRef.current.clientHeight;
        setMaxHeight(Math.max(leftHeight, rightHeight));
      }
    }, 200);
  }, [data, visibleYears]);

  const toggleVisibility = (year) => {
    setVisibleYears((prevYears) =>
      prevYears.includes(year) ? prevYears.filter((item) => item !== year) : [...prevYears, year]
    );
  };

  const fetchPublication = async () => {
    setIsLoading(true);
    try {
      const resp = await pagesServices.getPageList({ documentType });
      if (resp?.status_code === 200 && resp?.list?.data) {
        const publications = resp.list.data.reduce((acc, item) => {
          if (!acc[item.year]) acc[item.year] = [];
          acc[item.year].push(item);
          return acc;
        }, {});
        setData(publications);
        const sortedYears = Object.keys(publications).sort((a, b) => parseInt(b) - parseInt(a));
        if (sortedYears.length > 0) {
          setVisibleYears([parseInt(sortedYears[0], 10)]);
        }
      } else {
        notifyError("No data found. Please try again.");
      }
    } catch (error) {
      notifyError("An error occurred while fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedYears = Object.keys(data).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="page-wrapper">
      <HeaderComponents />
      <MetaTitle pageTitle={'Publications – Redwood Peak Limited'} />
      <div className="content-area">
        <Image src={PublicationsnBanner} className="w-100 bannerHeight" alt="OverView Banner" />

        <div className="container mb-5">
          <div className="container-custom mt-1 mb-5 p-4">
            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                <div className="spinner-border text-primary-color" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {sortedYears.map((year) => (
                  <div key={year} className="col-12 mb-1">
                    <div className="year-header pt-1 pb-1" >
                      <span onClick={() => toggleVisibility(parseInt(year, 10))} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        {year}
                      </span>
                    </div>
                    {visibleYears.includes(parseInt(year, 10)) && (
                      <div className="row">
                        <div
                          ref={leftColRef}
                          // style={{ minHeight: maxHeight ? `${maxHeight}px` : "auto" }}
                          className="col-md-6"
                        >
                          {data[year]
                            .slice(0, Math.ceil(data[year].length / 2))
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((item, index) => (
                              <div key={index} className="pdf-row p-2">
                                {/* ms-4  //left Indent*/}
                                <div className="pdf-title">
                                  <span>
                                    <Image src={pdfIcon} alt="PDF icon" />
                                  </span>
                                  <a href={item.file_path} target="_blank" rel="noopener noreferrer" className="file-item-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {item.file_name.length > 60 ? item.file_name.substring(0, 60) + "..." : item.file_name}
                                  </a>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div
                          ref={rightColRef}
                          // style={{ minHeight: maxHeight ? `${maxHeight}px` : "auto" }}
                          className="col-md-6"
                        >
                          {data[year]
                            .slice(Math.ceil(data[year].length / 2))
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((item, index) => (
                              <div key={index} className="pdf-row p-2">
                                {/* ms-4  //left Indent*/}
                                <div className="pdf-title">
                                  <span>
                                    <Image src={pdfIcon} alt="PDF icon" />
                                  </span>
                                  <a href={item.file_path} target="_blank" rel="noopener noreferrer" className="file-item-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {item.file_name.length > 60 ? item.file_name.substring(0, 60) + "..." : item.file_name}
                                  </a>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Publications;
