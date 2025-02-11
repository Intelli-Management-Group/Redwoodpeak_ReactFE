import React, { useEffect, useState } from 'react';
import Image from '../Component/ImagesComponets/ImagesComponets';
import HedgeFundReportsnBanner from "../../assets/images/banner_investor_resources.jpg"
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import pdfIcon from "../../assets/images/pdf_icon1.png"
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';

const HedgeFundReports = () => {
  const [visibleYears, setVisibleYears] = useState([]); // Track multiple years
  const [visibleTypes, setVisibleTypes] = useState([]); // Track multiple report types
  const documentType = "hedgeFundReports";
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const reportTypes = [
    "quarterlyPerformanceAnalysis",
    "quarterlyShareholderLetter",
    "fundDocumentation",
    "auditedFinancialStatements"
  ];

  useEffect(() => {
    fetchedgeFundReports();
  }, []);

  // Toggle Year visibility
  const toggleYearVisibility = (year) => {
    setVisibleYears((prevYears) => {
      if (prevYears.includes(year)) {
        return prevYears.filter((item) => item !== year); // Remove year from visibleYears
      } else {
        return [...prevYears, year]; // Add year to visibleYears
      }
    });
  };

  // Toggle Report Type visibility
  const toggleTypeVisibility = (type) => {
    setVisibleTypes((prevTypes) => {
      if (prevTypes.includes(type)) {
        return prevTypes.filter((item) => item !== type); // Remove type from visibleTypes
      } else {
        return [...prevTypes, type]; // Add type to visibleTypes
      }
    });
  };

  const fetchedgeFundReports = async () => {
    setIsLoading(true);
    try {
      const resp = await pagesServices.getPageList({ documentType });
      if (resp?.status_code === 200) {
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

          // Set the latest year as the default expanded year
          const latestYear = Math.max(
            ...Object.keys(segregatedData?.monthlyPortfolioSummary || {}).map((year) => parseInt(year))
          );
          setVisibleYears([latestYear]); // Set the first year as expanded by default
          setData(segregatedData || []);
        } else {
          console.error("No data found in response.");
          notifyError("No data found. Please try again.");
        }
      } else {
        console.error("Failed to fetch data: ", resp?.message);
        notifyError("Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("An error occurred during fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <HeaderComponents />
      <MetaTitle pageTitle={"Hedge Fund Reports – Redwood Peak Limited"} />
      <div>
        <Image
          src={HedgeFundReportsnBanner}
          className="w-100 bannerHeight"
          alt="OverView Banner"
        />
      </div>
      <div className="container mb-5">
        <div className="container-custom mt-1 mb-5 p-4">
          {/*<h1 className="header-post-title-class">Hedge Fund Reports</h1>*/}
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
              <div className="spinner-border text-primary-color" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row" >
              {/* Left Column: Monthly Portfolio Summary */}
              <div className="col-md-6 col-sm-12" >
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
                        style={{ cursor: "pointer" }}
                      >
                        {year}
                      </div>

                      {/* Render PDFs if the year is visible */}
                      {visibleYears.includes(parseInt(year, 10)) && (
                        <div className="ml-5">
                          <div
                            className="pdf-container"
                            style={{
                              display: "block",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "15px",
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
                                      style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                      {item.file_name.split(".").slice(0, -1).join(".").length > 60
                                        ? item.file_name.split(".").slice(0, -1).join(".").substring(0, 60) + "..."
                                        : item.file_name.split(".").slice(0, -1).join(".")}
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
              <div className="col-md-6 col-sm-12">
                {reportTypes.map((type) => (
                  <div key={type}>
                    <div
                      className="type-header pt-2 pb-2 text-primary-color"
                      onClick={() => toggleTypeVisibility(type)}
                      style={{ cursor: "pointer" }}
                    >
                      {type === "quarterlyPerformanceAnalysis" && "Quarterly Performance Analysis"}
                      {type === "quarterlyShareholderLetter" && "Quarterly Shareholder Letter"}
                      {type === "fundDocumentation" && "Fund Documentation"}
                      {type === "auditedFinancialStatements" && "Audited Financial Statements"}
                    </div>

                    {/* Check if the report type is in the visibleTypes array */}
                    {visibleTypes.includes(type) && (
                      <div className="ml-5">
                        <div
                          className="pdf-container"
                          style={{
                            display: "block",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "15px",
                          }}
                        >
                          {data[type] &&
                            Object.keys(data[type])
                              .sort((a, b) => b - a)
                              .map((year) =>
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
                                          style={{ textDecoration: "none", color: "inherit"}}
                                        >
                                          {item.file_name.split(".").slice(0, -1).join(".").length > 60
                                            ? item.file_name.split(".").slice(0, -1).join(".").substring(0, 60) + "..."
                                            : item.file_name.split(".").slice(0, -1).join(".")}
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
