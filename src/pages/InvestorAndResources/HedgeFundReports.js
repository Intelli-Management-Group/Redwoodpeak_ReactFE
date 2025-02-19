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
    const leftColumn = [];
    const rightColumn = [];
  
    if (type === "fundDocumentation") {
      // Render all items directly for "fundDocumentation" without year grouping
      const allItems = Object.values(data[type] || {}).flat();
      
      allItems.forEach((item, index) => {
        const content = (
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
        );
  
        if (index % 2 === 0) {
          leftColumn.push(content);
        } else {
          rightColumn.push(content);
        }
      });
  
    } else {
      Object.keys(data[type] || {})
        .sort((a, b) => parseInt(b) - parseInt(a))
        .forEach((year, index) => {
          const content = (
            <div key={year}>
              <div
                className="year-header pt-1 pb-1"
                onClick={() => toggleTypeYearVisibility(year)}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {year}
              </div>
              {visibleTypeYears[year] && (
                <div className="ms-3">
                  {renderPDFLinks(data[type][year])}
                </div>
              )}
            </div>
          );
  
          if (index % 2 === 0) {
            leftColumn.push(content);
          } else {
            rightColumn.push(content);
          }
        });
    }
  
    return { leftColumn, rightColumn };
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
                  {reportTypes.map(({ key, label,  }) => (
                    <Nav.Item key={key}>
                      <Nav.Link eventKey={key} className="custom-tab-link">
                        {/* <span className="tab-icon me-2">{icon}</span>  */}
                        {label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                <Tab.Content>
                  {reportTypes.map(({ key }) => {
                    const { leftColumn, rightColumn } = splitDataInColumns(key);
                    return (
                      <Tab.Pane eventKey={key} key={key}>
                        <div className="row">
                          <div ref={leftColRef} style={{ minHeight: `${maxHeight}px` }} className="col-md-6">
                            {leftColumn}
                          </div>
                          <div ref={rightColRef} style={{ minHeight: `${maxHeight}px` }} className="col-md-6">
                            {rightColumn}
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
