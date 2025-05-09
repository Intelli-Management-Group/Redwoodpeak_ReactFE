import React, { useEffect, useState } from 'react';
import Image from '../Component/ImagesComponets/ImagesComponets';
import HedgeFundReportsnBanner from "../../assets/banner_images/redwood_investor_resources.jpg"
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';
import pdfIcon from "../../assets/images/pdf_icon1.png"
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
// PDF data for each year


const ManagedAccountReports = () => {
    const [visibleYear, setVisibleYear] = useState(null);
    const documentType = "managedAccountReports";
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        fetcManagedAccountReports()
    }, []);
    const toggleVisibility = (year) => {
        setVisibleYear(visibleYear === year ? null : year);
    };
    const fetcManagedAccountReports = async () => {
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
                    // console.log(publications);
                    setData(publications || []);
                    const latestYear = Math.max(...Object.keys(publications).map((year) => parseInt(year)));
                    setVisibleYear(latestYear)
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
        <div className="page-wrapper">
            <HeaderComponents />
            <MetaTitle pageTitle={'Managed Account Reports – Redwood Peak Limited'} />

            <div className="content-area">
                <Image
                    src={HedgeFundReportsnBanner}
                    className="w-100 bannerHeight"
                    alt="OverView Banner"
                />
                <div className="container mb-5">
                    <div className="container-custom mt-1 mb-5 p-4">
                        {isLoading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                                <div className="spinner-border text-primary-color" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div>
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

                                            {/* Conditionally render the PDFs for the year */}
                                            {visibleYear === parseInt(year, 10) && (
                                                <div className="ml-5">
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
            </div>
            <Footer />
        </div>

    );
};

export default ManagedAccountReports;
