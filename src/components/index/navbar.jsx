import { useEffect, useMemo, useState } from 'react';
import { detectLanguageFromLocation } from '../../utils/country_to_language.js';
import { translateMultiple } from '../../utils/translate.js';

const Navbar = ({}) => {
    const defaultTexts = useMemo(
        () => ({
            home: 'Home',
            search: 'Search',
            privacyPolicy: 'Privacy And Policy',
            otherTerms: 'Other Terms and Conditions',
            settings: 'Settings',
            // Privacy policy items
            privacyItem1: 'What is our privacy policy?',
            privacyItem2: 'What data do we collect?',
            privacyItem3: 'How do we use your data?',
            privacyItem4: 'How is data shared across Meta products?',
            privacyItem5: 'Do we share data with third parties?',
            privacyItem6: 'How do Meta companies work together?',
            privacyItem7: 'How can you manage or delete data?',
            privacyItem8: 'How long do we store your data?',
            privacyItem9: 'How do we transfer your data?',
            // Other terms items
            otherTermsItem1: 'Cookies and similar technologies',
            otherTermsItem2: 'Information from non-users',
            otherTermsItem3: 'Use of generative AI',
            otherTermsItem4: 'Data transfer framework',
            otherTermsItem5: 'Other legal terms',
            // Settings items
            settingsItem1: 'Facebook Settings',
            settingsItem2: 'Instagram Settings'
        }),
        []
    );

    const [texts, setTexts] = useState(defaultTexts);
    const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
    const [isOtherTermsExpanded, setIsOtherTermsExpanded] = useState(false);
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

    const translateAllTexts = async () => {
        try {
            const targetLang = await detectLanguageFromLocation();

            if (targetLang === 'en') {
                setTexts(defaultTexts);
                return;
            }

            const translatedTexts = await translateMultiple(
                defaultTexts,
                targetLang
            );
            setTexts(translatedTexts);
        } catch (error) {
            console.error('Error translating texts:', error);
            setTexts(defaultTexts);
        }
    };

    useEffect(() => {
        translateAllTexts();
    }, []);

    const togglePrivacy = () => {
        setIsPrivacyExpanded(!isPrivacyExpanded);
    };

    const toggleOtherTerms = () => {
        setIsOtherTermsExpanded(!isOtherTermsExpanded);
    };

    const toggleSettings = () => {
        setIsSettingsExpanded(!isSettingsExpanded);
    };

    return (
        <>
            <div
                className='container--navbar'
                style={{
                    height: `calc(100dvh - ${-55}px)`
                }}
            >
                <div className='container--navbar--child'>
                    <div className='container--general container--navbar--home'>
                        <span className='icon-fa'>
                            <i className='fa-solid fa-house'></i>
                        </span>
                        <span className='icon-fa-text'>{texts.home}</span>
                    </div>
                    <div className='cc container--general container--navbar--search'>
                        <span className='icon-fa'>
                            <i className='cc fa-solid fa-magnifying-glass'></i>
                        </span>
                        <span className='icon-fa-text'>{texts.search}</span>
                    </div>
                    <div className='cc container--general container--navbar--lock'>
                        <span className='icon-fa'>
                            <i className='fa-solid fa-lock'></i>
                        </span>
                        <div className='privacy-section'>
                            <div
                                className='privacy-header'
                                onClick={togglePrivacy}
                            >
                                <span className='icon-fa-text'>
                                    {texts.privacyPolicy}
                                </span>
                                <i
                                    className={`fa-solid fa-chevron-down privacy-arrow ${isPrivacyExpanded ? 'expanded' : ''}`}
                                ></i>
                            </div>
                            {isPrivacyExpanded && (
                                <ul className='privacy-list'>
                                    <li>{texts.privacyItem1}</li>
                                    <li>{texts.privacyItem2}</li>
                                    <li>{texts.privacyItem3}</li>
                                    <li>{texts.privacyItem4}</li>
                                    <li>{texts.privacyItem5}</li>
                                    <li>{texts.privacyItem6}</li>
                                    <li>{texts.privacyItem7}</li>
                                    <li>{texts.privacyItem8}</li>
                                    <li>{texts.privacyItem9}</li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className='cc container--general container--navbar--alert'>
                        <span className='icon-fa'>
                            <i className='fa-solid fa-circle-exclamation'></i>
                        </span>
                        <div className='other-terms-section'>
                            <div
                                className='other-terms-header'
                                onClick={toggleOtherTerms}
                            >
                                <span className='icon-fa-text'>
                                    {texts.otherTerms}
                                </span>
                                <i
                                    className={`fa-solid fa-chevron-down other-terms-arrow ${isOtherTermsExpanded ? 'expanded' : ''}`}
                                ></i>
                            </div>
                            {isOtherTermsExpanded && (
                                <ul className='other-terms-list'>
                                    <li>{texts.otherTermsItem1}</li>
                                    <li>{texts.otherTermsItem2}</li>
                                    <li>{texts.otherTermsItem3}</li>
                                    <li>{texts.otherTermsItem4}</li>
                                    <li>{texts.otherTermsItem5}</li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className='cc container--general container--navbar--setting'>
                        <span className='icon-fa'>
                            <i className='fa-solid fa-gear'></i>
                        </span>
                        <div className='settings-section'>
                            <div
                                className='settings-header'
                                onClick={toggleSettings}
                            >
                                <span className='icon-fa-text'>
                                    {texts.settings}
                                </span>
                                <i
                                    className={`fa-solid fa-chevron-down settings-arrow ${isSettingsExpanded ? 'expanded' : ''}`}
                                ></i>
                            </div>
                            {isSettingsExpanded && (
                                <ul className='settings-list'>
                                    <li>{texts.settingsItem1}</li>
                                    <li>{texts.settingsItem2}</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
