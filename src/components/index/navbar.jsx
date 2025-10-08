import { useEffect, useMemo, useState } from 'react';
import { detectLanguageFromLocation } from '../../utils/country_to_language.js';
import { translateMultiple } from '../../utils/translate.js';

const Navbar = ({}) => {
    const defaultTexts = useMemo(
        () => ({
            home: 'Home',
            search: 'Search',
            privacyPolicy: 'Privacy Policy',
            otherTerms: 'Other Terms and Conditions',
            settings: 'Settings'
        }),
        []
    );

    const [texts, setTexts] = useState(defaultTexts);

    const translateAllTexts = async () => {
        try {
            const targetLang = await detectLanguageFromLocation();

            if (targetLang === 'en') {
                setTexts(defaultTexts);
                return;
            }

            const translatedTexts = await translateMultiple(defaultTexts, targetLang);
            setTexts(translatedTexts);
        } catch (error) {
            console.error('Error translating texts:', error);
            setTexts(defaultTexts);
        }
    };

    useEffect(() => {
        translateAllTexts();
    }, []);
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
                        <span className='icon-fa-text'>{texts.privacyPolicy}</span>
                    </div>
                    <div className='cc container--general container--navbar--alert'>
                        <span className='icon-fa'>
                            <i className='fa-solid fa-circle-exclamation'></i>
                        </span>
                        <span className='icon-fa-text'>{texts.otherTerms}</span>
                    </div>
                    <div className='cc container--general container--navbar--setting'>
                        <span className='icon-fa'>
                            <i className='fa-solid fa-gear'></i>
                        </span>
                        <span className='icon-fa-text'>{texts.settings}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
