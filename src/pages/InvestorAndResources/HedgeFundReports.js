import React, { useEffect, useState } from 'react';
import Image from '../Component/ImagesComponets/ImagesComponets';
import HedgeFundReportsnBanner from "../../Assetes/images/banner_investor_resources.jpg"
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import pdfIcon from "../../Assetes/images/pdf_icon1.png"
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';

const HedgeFundReports = () => {
  const [visibleYear, setVisibleYear] = useState(null);
  const [visibleType, setVisibleType] = useState(null);
  const documentType = "hedgeFundReports";
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([])
  const reportTypes = [
    "quarterlyPerformanceAnalysis",
    "quarterlyShareholderLetter",
    "fundDocumentation",
    "auditedFinancialStatements"
  ]
  useEffect(() => {
    fetchedgeFundReports()
  }, []);
  // Toggle visibility of the year
  const toggleYearVisibility = (year) => {
    setVisibleYear(visibleYear === year ? null : year); // Toggle between showing and hiding
  };
  const toggleTypeVisibility = (type) => {
    setVisibleType(visibleType === type ? null : type);
  };

  if (reportTypes.length === 0) {
    return null;
  }
  const fetchedgeFundReports = async () => {
    setIsLoading(true);
    try {
      const resp = await pagesServices.getPageList({ documentType });
      if (resp?.status_code === 200) {
        console.log(resp);
        if (resp?.list?.data) {
          const segregatedData = resp?.list?.data.reduce((result, item) => {
            const type = item.hedge_fund_report_type || "monthlyPortfolioSummary";

            if (!result[type]) {
              result[type] = {};
            }

            if (!result[type][item.year]) {
              result[type][item.year] = [];
            }

            result[type][item.year].push(item);

            return result;
          }, {});


          console.log("segregatedData", segregatedData)
          const latestYear = Math.max(...Object.keys(segregatedData?.monthlyPortfolioSummary).map((year) => parseInt(year)));
          setVisibleYear(latestYear)
          // const publications = resp.list.data.reduce((acc, item) => {
          //   if (!acc[item.year]) {
          //     acc[item.year] = [];
          //   }
          //   acc[item.year].push(item);
          //   return acc;
          // }, {});
          // console.log(publications);
          setData(segregatedData || []);
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
      <MetaTitle pageTitle={'Hedge Fund Reports – Redwood Peak Limited'} />
      <div>
        <Image
          src={HedgeFundReportsnBanner}
          className="w-100 bannerHeight"
          alt="OverView Banner"
        />
      </div>
      <div className="container mb-5">
        <div className="container-custom mt-1 mb-5 p-4">
          <h1 className="header-post-title-class" >
            Hedge Fund Reports
          </h1>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
              <div className="spinner-border text-primary-color" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '30px' }}>
              {/* Left Column: Monthly Portfolio Summary */}
              <div style={{ flex: 1 }}>
                <div className="type-header pt-2 pb-1 text-primary-color">
                  Monthly Portfolio Summary
                </div>
                {Object.keys(data?.monthlyPortfolioSummary || {})
                  .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years in descending order
                  .map((year) => (
                    <div key={year}>
                      {/* Year Header */}
                      <div
                        className="year-header pt-1 pb-2"
                        onClick={() => toggleYearVisibility(parseInt(year, 10))}
                        style={{ cursor: 'pointer' }}
                      >
                        {year}
                      </div>

                      {/* Render PDFs if the year is visible */}
                      {visibleYear === parseInt(year, 10) && (
                        <div className="ml-5">
                          <div
                            className="pdf-container"
                            style={{
                              display: 'block',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '15px',
                            }}
                          >
                            {data.monthlyPortfolioSummary[year]
                              .sort((a, b) => {
                                const dateA = new Date(a.created_at || a.file_name);
                                const dateB = new Date(b.created_at || b.file_name);
                                return dateB - dateA; // Sort by date in descending order
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
                                        ? item.file_name.split('.').slice(0, -1).join('.').substring(0, 60) + '...'
                                        : item.file_name.split('.').slice(0, -1).join('.')}
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

              {/* Right Column: Report Types */}
              <div style={{ flex: 1 }}>
                {reportTypes.map((type) => (
                  <div key={type}>
                    <div
                      className="type-header pt-2 pb-2 text-primary-color"
                      onClick={() => toggleTypeVisibility(type)}
                      style={{ cursor: 'pointer' }}
                    >
                      {type === "quarterlyPerformanceAnalysis" && "Quarterly Performance Analysis"}
                      {type === "quarterlyShareholderLetter" && "Quarterly Shareholder Letter"}
                      {type === "fundDocumentation" && "Fund Documentation"}
                      {type === "auditedFinancialStatements" && "Audited Financial Statements"}
                    </div>

                    {visibleType === type && (
                      <div className="ml-5">
                        <div
                          className="pdf-container"
                          style={{
                            display: 'block',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                          }}
                        >
                          {data[type] &&
                            Object.keys(data[type]).map((year) =>
                              data[type][year]
                                .sort((a, b) => {
                                  const dateA = new Date(a.created_at || a.file_name);
                                  const dateB = new Date(b.created_at || b.file_name);
                                  return dateB - dateA;
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
                                          ? item.file_name.split('.').slice(0, -1).join('.').substring(0, 60) + '...'
                                          : item.file_name.split('.').slice(0, -1).join('.')}
                                      </a>
                                    </div>
                                  </div>
                                ))
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>


          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HedgeFundReports;
