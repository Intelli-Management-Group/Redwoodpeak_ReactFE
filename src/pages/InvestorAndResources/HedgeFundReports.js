import React, { useEffect, useState, useRef } from 'react';
import Image from '../Component/ImagesComponets/ImagesComponets';
import HedgeFundReportsnBanner from "../../assets/banner_images/redwood_hedge_fund.jpg"
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import pdfIcon from "../../assets/images/pdf_icon1.png"
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
import { Tab, Nav } from "react-bootstrap";

const HedgeFundReports = () => {
  const [visibleTypeYears, setVisibleTypeYears] = useState({});
  const documentType = "hedgeFundReports";
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState("monthlyPortfolioSummary");

  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  const reportTypes = [
    { key: "monthlyPortfolioSummary", label: "Monthly Portfolio Summary" },
    { key: "quarterlyPerformanceAnalysis", label: "Quarterly Performance Analysis" },
    { key: "quarterlyShareholderLetter", label: "Quarterly Shareholder Letter" },
    { key: "fundDocumentation", label: "Fund Documentation" },
    { key: "auditedFinancialStatements", label: "Audited Financial Statements" }
  ];

  useEffect(() => {
    fetchedgeFundReports();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (leftColRef.current && rightColRef.current) {
        const leftHeight = leftColRef.current.clientHeight;
        const rightHeight = rightColRef.current.clientHeight;
        setMaxHeight(Math.max(leftHeight, rightHeight));
      }
    }, 200);
  }, [data, visibleTypeYears, activeTab]);

  useEffect(() => {
    // Auto-expand the first year of the active tab when data is loaded or active tab changes
    if (data[activeTab]) {
      const firstYear = Object.keys(data[activeTab]).sort((a, b) => parseInt(b) - parseInt(a))[0];
      setVisibleTypeYears({ [firstYear]: true });
    }
  }, [data, activeTab]);

  const toggleTypeYearVisibility = (year) => {
    setVisibleTypeYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const fetchedgeFundReports = async () => {
    setIsLoading(true);
    try {
      const resp = await pagesServices.getPageList({ documentType });
      if (resp?.status_code === 200 && resp?.list?.data) {
        const segregatedData = resp?.list?.data.reduce((result, item) => {
          const type = item.hedge_fund_report_type || "monthlyPortfolioSummary";
          if (!result[type]) result[type] = {};
          if (!result[type][item.year]) result[type][item.year] = [];
          result[type][item.year].push(item);
          return result;
        }, {});
        setData(segregatedData || {});
      } else {
        notifyError("No data found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError("An error occurred during fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPDFLinks = (items) => (
    items.map((item, index) => (
      <div key={index} className="pdf-row p-2">
        <div className="pdf-title d-flex">
          <span>
            <Image src={pdfIcon} alt="PDF icon" />
          </span>
          <a
            href={item.file_path}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
            className="file-item-name"
          >
            {item.file_name.length > 60 ? item.file_name.substring(0, 60) + "..." : item.file_name}
          </a>
        </div>
      </div>
    ))
  );
  const splitDataInColumns = (type) => {
    console.log(type)
    const leftColumn = [];
    const rightColumn = [];

    Object.keys(data[type] || {})
      .sort((a, b) => parseInt(b) - parseInt(a))
      .forEach((year) => {

        const yearData = data[type][year] || [];
        const midpoint = Math.ceil(yearData.length / 2);

        const content = (
          <div key={year} className="year-row">

            <div className="year-header pt-1 pb-1">
              <div>
                <span onClick={() => toggleTypeYearVisibility(year)}
                  style={{ cursor: "pointer", fontWeight: "bold" }}>
                  {year}
                </span>

              </div>
            </div>

            {visibleTypeYears[year] && (
              <div className="row">
                <div className="pdf-column left-column col-md-6">
                  {yearData.slice(0, midpoint).map((item, index) => (
                    <div key={index} className="pdf-row p-2">
                      <div className="pdf-title d-flex">
                        <span>
                          <Image src={pdfIcon} alt="PDF icon" />
                        </span>
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "inherit" }}
                          className="file-item-name"
                        >
                          {item.file_name.length > 60
                            ? item.file_name.substring(0, 60) + "..."
                            : item.file_name}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pdf-column right-column col-md-6">
                  {yearData.slice(midpoint).map((item, index) => (
                    <div key={index} className="pdf-row p-2">
                      <div className="pdf-title d-flex">
                        <span>
                          <Image src={pdfIcon} alt="PDF icon" />
                        </span>
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "inherit" }}
                          className="file-item-name"
                        >
                          {item.file_name.length > 60
                            ? item.file_name.substring(0, 60) + "..."
                            : item.file_name}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

        leftColumn.push(content);
      });

    return { leftColumn, rightColumn: [] };
  };
  return (
    <div className="page-wrapper">
      <HeaderComponents />
      <MetaTitle pageTitle={"Hedge Fund Reports – Redwood Peak Limited"} />
      <div className="content-area">
        <Image
          src={HedgeFundReportsnBanner}
          className="w-100 bannerHeight"
          alt="Overview Banner"
        />
        <div className="container mb-5">
          <div className="container-custom mt-1 mb-5 p-4">
            {isLoading ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary-color" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="" className="mb-4 custom-tabs">
                  {reportTypes.map(({ key, label }) => (
                    <Nav.Item key={key}>
                      <Nav.Link eventKey={key} className="custom-tab-link">
                        {label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                <Tab.Content>
                  {reportTypes.map(({ key }) => {
                    const { leftColumn } = splitDataInColumns(key);
                    return (
                      <Tab.Pane eventKey={key} key={key}>
                        <div className="row">
                          {/* Left column containing year header and the first half of data */}
                          <div
                            ref={leftColRef}
                            style={{ minHeight: `${maxHeight}px` }}
                            className="col-md-12"
                          >
                            {leftColumn}
                          </div>
                        </div>
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Tab.Container>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default HedgeFundReports;
