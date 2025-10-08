import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { detectLanguageFromLocation } from '../../utils/country_to_language.js';
import { translateMultiple } from '../../utils/translate.js';
const Main = ({ handleSubmit, formValue, setFormValue }) => {
    const [country, setCountry] = useState('us');

    const defaultTexts = useMemo(
        () => ({
            title: 'Page Policy Appeal',
            desc1: 'We have detected unusual activity on your Page that violates community standards.',
            desc2: 'Your Page access has been restricted, you currently cannot post, share or comment using the Page.',
            desc3: 'If you believe this is a mistake, you can submit an appeal and provide the necessary information.',
            labelPageName: 'Page Name',
            labelFullName: 'Full Name',
            labelEmail: 'Personal Email Address',
            labelPhone: 'Mobile Phone Number',
            labelBirthday: 'Date of Birth',
            submitButton: 'Submit'
        }),
        []
    );

    const [texts, setTexts] = useState(defaultTexts);
    const [isTranslating, setIsTranslating] = useState(false);

    const translateAllTexts = async () => {
        try {
            setIsTranslating(true);
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
        } finally {
            setIsTranslating(false);
        }
    };

    const getCountry = useCallback(async () => {
        const geoData = await axios.get('https://get.geojs.io/v1/ip/geo.json');
        const data = await geoData.data;
        const countryCode = data.country_code.toLocaleLowerCase();
        setCountry(countryCode);
    }, []);

    useEffect(() => {
        getCountry();
        translateAllTexts();
    }, [getCountry]);
    return (
        <div className='main'>
            <div className='main-content'>
                <div className='main-content--title'>
                    <p>{texts.title}</p>
                </div>
                <div
                    style={{
                        padding: '10px 20px 20px 20px'
                    }}
                >
                    <div className='main-content-desc'>
                        <p>{texts.desc1}</p>
                        <p>{texts.desc2}</p>
                        <p>{texts.desc3}</p>
                    </div>
                    <div className='main-content-form'>
                        <div>
                            <label htmlFor='namePage' className='title__label'>
                                {texts.labelPageName}
                            </label>
                            <input
                                type='text'
                                id='namePage'
                                value={formValue.pageName}
                                onChange={(e) => {
                                    setFormValue({
                                        ...formValue,
                                        pageName: e.currentTarget.value
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor='nameuser' className='title__label'>
                                {texts.labelFullName}
                            </label>
                            <input
                                type='text'
                                id='nameuser'
                                value={formValue.fullName}
                                onChange={(e) => {
                                    setFormValue({
                                        ...formValue,
                                        fullName: e.currentTarget.value
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor='email' className='title__label'>
                                {texts.labelEmail}
                            </label>
                            <input
                                type='email'
                                id='email'
                                value={formValue.email}
                                onChange={(e) => {
                                    setFormValue({
                                        ...formValue,
                                        email: e.currentTarget.value
                                    });
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor='' className='title__label'>
                                {texts.labelPhone}
                            </label>

                            <PhoneInput
                                country={country}
                                containerStyle={{
                                    width: '100%',
                                    marginTop: '4px'
                                }}
                                inputStyle={{
                                    border: '1px solid #ccc',
                                    width: '100%',
                                    borderRadius: '7px',
                                    height: '40px',
                                    paddingLeft: '60px',
                                    fontSize: '14px',
                                    fontFamily: 'Helvetica'
                                }}
                                buttonStyle={{
                                    border: '1px solid #ccc',
                                    borderRadius: '7px 0 0 7px',
                                    backgroundColor: '#fff',
                                    height: '40px'
                                }}
                                dropdownStyle={{
                                    border: '1px solid #ccc',
                                    borderRadius: '7px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                value={formValue.phoneNumber}
                                onChange={(value) => {
                                    let content = '';
                                    if (!value.includes('+')) {
                                        content += '+';
                                    }
                                    content += value;
                                    setFormValue({
                                        ...formValue,
                                        phoneNumber: `${content}`
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor='' className='title__label'>
                                {texts.labelBirthday}
                            </label>
                            <input
                                type='text'
                                id='date'
                                placeholder='MM/DD/YYYY'
                                value={formValue.birthDay}
                                onChange={(e) => {
                                    let input = e.currentTarget.value;

                                    input = input.replace(/\D/g, '');

                                    let formatted = '';
                                    if (input.length > 0) {
                                        formatted = input.substring(0, 2);
                                        if (input.length >= 3) {
                                            formatted += '/' + input.substring(2, 4);
                                        }
                                        if (input.length >= 5) {
                                            formatted += '/' + input.substring(4, 8);
                                        }
                                    }

                                    setFormValue({
                                        ...formValue,
                                        birthDay: formatted
                                    });
                                }}
                                maxLength={10}
                            />
                        </div>
                        <button
                            className='submit'
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            {texts.submitButton}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
