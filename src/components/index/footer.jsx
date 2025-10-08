import React, { useEffect, useMemo, useState } from 'react';
import metaLogo from '../../assets/img/metalogo.svg';
import { detectLanguageFromLocation } from '../../utils/country_to_language.js';
import { translateMultiple } from '../../utils/translate.js';
const Footer = () => {
    const defaultTexts = useMemo(
        () => ({
            about: 'About',
            adChoices: 'Ad Choices',
            createAd: 'Create Ad',
            Cookies: ' Cookies Policy',
            terms: 'Terms',
            privacy: 'Privacy',
            careers: 'Careers',
            createPage: 'Create Page',
            from: 'from'
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
            <div className='container__footer'>
                <div className='container__footer--child'>
                    <div>
                        <ul className='container__footer--title'>
                            <li>{texts.about}</li>
                            <li>{texts.adChoices}</li>
                            <li>{texts.createAd}</li>
                        </ul>
                    </div>
                    <div>
                        <ul className='container__footer--title'>
                            <li>{texts.privacy}</li>
                            <li>{texts.careers}</li>
                            <li>{texts.createPage}</li>
                        </ul>
                    </div>
                    <div>
                        <ul className='container__footer--title'>
                            <li>{texts.Cookies}</li>
                            <li>{texts.terms}</li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className='footer--logo-meta'>
                    <div>
                        {texts.from} <img src={metaLogo} className='meta-logo' />
                    </div>
                    <div>© 2025 Meta</div>
                </div>
            </div>
        </>
    );
};

export default Footer;
