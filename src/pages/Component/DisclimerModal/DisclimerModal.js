import React, { useState, useEffect } from 'react';

const DisclaimerModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isborderActive,setIsborderActive] = useState(false)

    useEffect(() => {
        const hasAcceptedDisclaimer = localStorage.getItem('disclaimerAccepted');
        if (hasAcceptedDisclaimer) {
            setIsModalVisible(false);
        }else{
            setIsModalVisible(true);
        }
    }, []);

    // Disable body scroll when the modal is visible
    useEffect(() => {
        if (isModalVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalVisible]);

    const handleCheckboxChange = () => {
        setIsChecked((prevChecked) => {
            const newChecked = !prevChecked;
            setIsButtonDisabled(!newChecked);
            return newChecked;
        });
    };

    const handleAccept = () => {
        if(isChecked){
            localStorage.setItem('disclaimerAccepted', 'true');
            setIsModalVisible(false);
        }else{
            setIsborderActive(true)
            const checkboxElement = document.getElementById('agreeCheckbox');
            checkboxElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
   };

    const handleReject = () => {
        window.close();
    };
    return (
        isModalVisible && (
            <div
                className="modal fade show"
                tabIndex="-1"
                style={{ display: 'block', zIndex: 1050 }}
                id="disclaimerModal"
            >
                <div className="modal-dialog">
                    <div className="modal-content modal-custom-width" style={{ background: '#0f0f0f99', borderRadius: 12, }}>
                        <div
                            className="modal-body popupContent m-3"
                            style={{
                                maxHeight: '400px',
                                overflowY: 'auto', 
                                background: '#fff',
                            }}
                        >
                            <center className="pt-3 pb-3">
                                <span style={{ fontSize: '20px', color: '#700000' }}>
                                    <strong>Website – Disclaimer and Registration</strong>
                                </span>
                            </center>
                            <form id="disclaimerForm">
                                <p style={{ fontSize: '14px', color: '#666666' }}>The information contained in this website is issued by Redwood Peak Limited (“Redwood Peak”). This website is not directed to any person in any jurisdiction where doing so would contravene any laws or regulations.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>Redwood Peak’s services and products have not been authorized by the Securities and Futures Commission of Hong Kong pursuant to the Cap 571 of the Securities &amp; Futures Ordinance (“SFO”) of the laws of Hong Kong. If you are resident in Hong Kong, you are confirming that you are a “Professional Investor” as defined under the SFO by accessing any information in this website.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>The content of this website does not constitute an offer to sell or a solicitation to purchase, nor an advice or a recommendation to acquire or dispose of any investment or to engage in any other transaction, and should not be distributed to, or used by, any person or entity, in any jurisdiction where such activities would be unlawful or where it would require Redwood Peak to be registered, licensed, authorized, approved or otherwise qualified. The information contained in this website is not intended to provide professional advice and should not be relied upon in that regard. Persons accessing this website are advised to obtain appropriate professional advice where necessary.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>Redwood Peak has taken all reasonable care in preparing this website and the information in this website is provided to the best of its knowledge. However, no representation or warranty, expressed or implied, is made as to the accuracy, adequacy, completeness or thoroughness of this website, and Redwood Peak will not accept any liability (including any third party liability) for any errors or omissions nor for any losses or damages losses caused by the information or the use of the information in this website.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>Redwood Peak may post new information from time to time without prior notice, and it does not assume any obligation to update or correct any information and explicitly disclaims any duty to do so. All copyright, patent, intellectual and other property rights contained herein is owned by Redwood Peak, with the exception of material included with the permission of the rights’ owner. Information in this website may not be reproduced, distributed or published without prior consent of Redwood Peak.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>Investment involves risk. Past performance is not indicative of future result of an investment. The value of an investment may fall as well as rise and may become valueless; investors may not be able to recover the amount invested.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>If you proceed to visit this website, it will be considered that you have acknowledged and ensured that you are permitted to access and use the information in this website by local laws and rules of the place where you are residing (“Qualified User”), as well as that you have read and understood the disclaimer, which you have accepted and agreed with.</p>
                                <p style={{ fontSize: '14px', color: '#666666' }}>If you want to visit this website, you have to confirm that you are aware that you are a Qualified User, otherwise, please do not visit this website.</p>

                                <p>&nbsp;</p>
                                <p style={{ color: '#666666' }}>User Declaration:</p>
                                <div className="form-check">
                                    <input
                                        className={`form-check-input ${isborderActive ? 'highlight': ''}`}
                                        type="checkbox"
                                        id="agreeCheckbox"
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className="form-check-label" htmlFor="agreeCheckbox" style={{ fontSize: '14px', color: '#666666' }}>
                                        I declare that I am a Qualified User and have read, understood and agreed to all the terms as set out in the Disclaimer...
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'flex-start', borderTop: 'none' }}>
                            <button
                                type="button"
                                className="btn btn-primary border-0 shadow-none"
                                id="submitDisclaimer"
                                // disabled={isButtonDisabled}
                                onClick={handleAccept}
                                style={{ width: 'auto' }}
                            >
                                Accept Disclaimer
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary border-0 shadow-none ml-2"
                                id="rejectDisclaimer"
                                onClick={handleReject}
                                style={{ width: 'auto' }}
                            >
                                Reject Disclaimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default DisclaimerModal;
